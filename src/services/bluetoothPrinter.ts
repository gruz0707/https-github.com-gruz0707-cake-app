import { chunkBytes } from '../utils/escpos';

// Standard BLE GATT service & characteristic UUIDs used by common 58mm/80mm Bluetooth thermal printers
// (Xprinter, Sunmi, Rongta, Epson TM-P, Bixolon, Goojprt, Munbyn, Star Micronics, Generic BLE ESC/POS)
export const THERMAL_PRINTER_SERVICE_UUIDS = [
  '000018f0-0000-1000-8000-00805f9b34fb', // Standard BLE ESC/POS Printer Service
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Star / Generic Thermal BLE
  '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC Transparent UART
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service (NUS)
  '0000ff00-0000-1000-8000-00805f9b34fb', // Generic China BLE Thermal Printer
  '0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10 / JDY / BT-05 Serial Bridge
  '0000ae30-0000-1000-8000-00805f9b34fb', // Cat/Pocket Thermal Printer Service
];

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
  };
}

export interface ConnectedBleHandle {
  deviceName: string;
  deviceId: string;
  serviceUuid: string;
  characteristicUuid: string;
  writeBytes: (payload: Uint8Array) => Promise<void>;
  disconnect: () => void;
}

export function isWebBluetoothSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as unknown as NavigatorWithBluetooth;
  return Boolean(nav.bluetooth && typeof nav.bluetooth.requestDevice === 'function');
}

export async function connectWebBluetoothPrinter(
  onUnexpectedDisconnect: () => void,
): Promise<ConnectedBleHandle> {
  if (!isWebBluetoothSupported()) {
    throw new Error(
      'Web Bluetooth is not available in this browser. Use Chrome/Edge on Android, macOS, or Windows over HTTPS, or enable Simulated 58mm Printer below.',
    );
  }

  const nav = navigator as unknown as NavigatorWithBluetooth;
  const device = await nav.bluetooth!.requestDevice({
    acceptAllDevices: true,
    optionalServices: THERMAL_PRINTER_SERVICE_UUIDS,
  });

  if (!device.gatt) {
    throw new Error('Selected Bluetooth device does not expose a GATT thermal print service.');
  }

  device.addEventListener('gattserverdisconnected', () => {
    onUnexpectedDisconnect();
  });

  const server = await device.gatt.connect();
  const services = await server.getPrimaryServices();

  let selectedService: BleServiceLike | null = null;
  let selectedChar: BleCharacteristicLike | null = null;

  for (const service of services) {
    const chars = await service.getCharacteristics();
    const writable = chars.find(
      (c) => c.properties.writeWithoutResponse || c.properties.write,
    );
    if (writable) {
      selectedService = service;
      selectedChar = writable;
      break;
    }
  }

  if (!selectedService || !selectedChar) {
    server.disconnect();
    throw new Error(
      'Connected to Bluetooth device, but no writable ESC/POS print characteristic was found.',
    );
  }

  const charRef = selectedChar;
  const writeBytes = async (payload: Uint8Array) => {
    // Most BLE thermal printers have a 20-128 byte MTU; chunk conservatively at 80 bytes
    const chunks = chunkBytes(payload, 80);
    for (const chunk of chunks) {
      const bufferCopy = new Uint8Array(chunk).buffer;
      if (charRef.properties.writeWithoutResponse && charRef.writeValueWithoutResponse) {
        await charRef.writeValueWithoutResponse(bufferCopy);
      } else if (charRef.writeValueWithResponse) {
        await charRef.writeValueWithResponse(bufferCopy);
      } else if (charRef.writeValue) {
        await charRef.writeValue(bufferCopy);
      } else {
        throw new Error('Printer characteristic does not support writing.');
      }
      // Small pacing delay prevents printer BLE UART buffer overflow on mobile phones
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  };

  return {
    deviceName: device.name?.trim() || 'Bluetooth Thermal Printer',
    deviceId: device.id,
    serviceUuid: selectedService.uuid,
    characteristicUuid: selectedChar.uuid,
    writeBytes,
    disconnect: () => {
      if (device.gatt?.connected) {
        device.gatt.disconnect();
      }
    },
  };
}
