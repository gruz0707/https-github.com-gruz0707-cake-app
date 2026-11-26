import type { PrinterHandle, PrinterWriteOutcome } from './printerTypes';

/**
 * Web Bluetooth adapter (optional; supported browsers only).
 * This never runs inside the Android WebView — use the native BLE/Classic bridge
 * there. Characteristic selection is preference-based, not "first writable".
 */

const PREFERRED_PAIRS: Array<{ service: string; characteristic: string }> = [
  // Standard BLE ESC/POS printer service
  {
    service: '000018f0-0000-1000-8000-00805f9b34fb',
    characteristic: '00002af1-0000-1000-8000-00805f9b34fb',
  },
  // Star / generic thermal BLE
  {
    service: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
    characteristic: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
  },
  // ISSC transparent UART
  {
    service: '49535343-fe7d-4ae5-8fa9-9fafd205e455',
    characteristic: '49535343-8841-43f4-a8d4-ecbe34729bb3',
  },
  // Nordic UART
  {
    service: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    characteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
  },
  // Generic China BLE thermal printer
  {
    service: '0000ff00-0000-1000-8000-00805f9b34fb',
    characteristic: '0000ff02-0000-1000-8000-00805f9b34fb',
  },
  // HM-10 / JDY / BT-05 serial bridge
  {
    service: '0000ffe0-0000-1000-8000-00805f9b34fb',
    characteristic: '0000ffe1-0000-1000-8000-00805f9b34fb',
  },
  // Cat / pocket thermal printer
  {
    service: '0000ae30-0000-1000-8000-00805f9b34fb',
    characteristic: '0000ae01-0000-1000-8000-00805f9b34fb',
  },
];

export const THERMAL_PRINTER_SERVICE_UUIDS = Array.from(
  new Set(PREFERRED_PAIRS.map((pair) => pair.service)),
);

interface BleCharacteristicLike {
  uuid: string;
  properties: {
    write: boolean;
    writeWithoutResponse: boolean;
  };
  writeValueWithResponse?: (value: BufferSource) => Promise<void>;
  writeValueWithoutResponse?: (value: BufferSource) => Promise<void>;
  writeValue?: (value: BufferSource) => Promise<void>;
}

interface BleServiceLike {
  uuid: string;
  getCharacteristics: () => Promise<BleCharacteristicLike[]>;
}

interface BleRemoteGattServerLike {
  connected: boolean;
  connect: () => Promise<BleRemoteGattServerLike>;
  disconnect: () => void;
  getPrimaryServices: () => Promise<BleServiceLike[]>;
}

interface BleDeviceLike {
  id: string;
  name?: string;
  gatt?: BleRemoteGattServerLike;
  addEventListener: (event: string, listener: () => void) => void;
}

interface NavigatorWithBluetooth {
  bluetooth?: {
    requestDevice: (options: {
      acceptAllDevices?: boolean;
      filters?: Array<{ services?: string[]; namePrefix?: string }>;
      optionalServices?: string[];
    }) => Promise<BleDeviceLike>;
    getDevices?: () => Promise<BleDeviceLike[]>;
  };
}

export function isWebBluetoothSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as unknown as NavigatorWithBluetooth;
  return Boolean(nav.bluetooth && typeof nav.bluetooth.requestDevice === 'function');
}

function scoreCharacteristic(serviceUuid: string, charUuid: string): number {
  const pairIndex = PREFERRED_PAIRS.findIndex(
    (pair) => pair.service === serviceUuid && pair.characteristic === charUuid,
  );
  if (pairIndex >= 0) return 100 - pairIndex;
  if (PREFERRED_PAIRS.some((pair) => pair.service === serviceUuid)) return 60;
  if (THERMAL_PRINTER_SERVICE_UUIDS.includes(serviceUuid)) return 40;
  return 10;
}

function isWritable(char: BleCharacteristicLike): boolean {
  return char.properties.write || char.properties.writeWithoutResponse;
}

export async function connectWebBluetoothPrinter(
  onUnexpectedDisconnect: () => void,
): Promise<PrinterHandle> {
  if (!isWebBluetoothSupported()) {
    throw new Error(
      'Web Bluetooth is not available in this browser. Use the Android app for native printing, or enable the clearly-labelled test simulator.',
    );
  }

  const nav = navigator as unknown as NavigatorWithBluetooth;
  const device = await nav.bluetooth!.requestDevice({
    acceptAllDevices: true,
    optionalServices: THERMAL_PRINTER_SERVICE_UUIDS,
  });

  if (!device.gatt) {
    throw new Error('Selected Bluetooth device does not expose a GATT print service.');
  }

  device.addEventListener('gattserverdisconnected', () => {
    onUnexpectedDisconnect();
  });

  const server = await device.gatt.connect();
  const services = await server.getPrimaryServices();

  let selectedService: BleServiceLike | null = null;
  let selectedChar: BleCharacteristicLike | null = null;
  let bestScore = -1;

  for (const service of services) {
    const chars = await service.getCharacteristics();
    for (const char of chars) {
      if (!isWritable(char)) continue;
      const score =
        scoreCharacteristic(service.uuid, char.uuid) +
        (char.properties.writeWithoutResponse ? 2 : 1);
      if (score > bestScore) {
        bestScore = score;
        selectedService = service;
        selectedChar = char;
      }
    }
  }

  if (!selectedService || !selectedChar) {
    server.disconnect();
    throw new Error(
      'Connected to the Bluetooth device, but no writable ESC/POS characteristic was found.',
    );
  }

  const charRef = selectedChar;
  // Use a conservative payload that fits a default 23-byte BLE MTU unless the
  // characteristic supports acknowledged writes (then 60 bytes is safe).
  const chunkSize = charRef.properties.writeWithoutResponse ? 20 : 60;

  const write = async (payload: Uint8Array): Promise<PrinterWriteOutcome> => {
    let bytesWritten = 0;
    try {
      for (let offset = 0; offset < payload.length; offset += chunkSize) {
        const chunk = payload.slice(offset, offset + chunkSize);
        const bufferCopy = chunk.buffer.slice(
          chunk.byteOffset,
          chunk.byteOffset + chunk.byteLength,
        ) as ArrayBuffer;
        if (charRef.properties.writeWithoutResponse && charRef.writeValueWithoutResponse) {
          await charRef.writeValueWithoutResponse(bufferCopy);
        } else if (charRef.writeValueWithResponse) {
          await charRef.writeValueWithResponse(bufferCopy);
        } else if (charRef.writeValue) {
          await charRef.writeValue(bufferCopy);
        } else {
          return {
            ok: false,
            bytesWritten,
            uncertain: bytesWritten > 0,
            error: 'Printer characteristic does not support writing.',
          };
        }
        bytesWritten += chunk.length;
        // Pace writes so the printer's UART buffer does not overflow.
        await new Promise((resolve) => setTimeout(resolve, 18));
      }
      return { ok: true, bytesWritten, uncertain: false };
    } catch (err) {
      return {
        ok: false,
        bytesWritten,
        uncertain: bytesWritten > 0,
        error: err instanceof Error ? err.message : 'Bluetooth transmission failed.',
      };
    }
  };

  return {
    mode: 'web-bluetooth',
    deviceName: device.name?.trim() || 'Bluetooth Thermal Printer',
    deviceId: device.id,
    serviceUuid: selectedService.uuid,
    characteristicUuid: selectedChar.uuid,
    write,
    disconnect: () => {
      if (device.gatt?.connected) {
        device.gatt.disconnect();
      }
    },
  };
}
