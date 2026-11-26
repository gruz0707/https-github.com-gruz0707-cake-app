import { Capacitor, registerPlugin } from '@capacitor/core';

export interface NativePrinterDevice {
  address: string;
  name: string;
  bonded: boolean;
  transport: 'classic' | 'ble';
}

export interface NativeConnectResult {
  address: string;
  name: string;
  transport: 'classic' | 'ble';
  serviceUuid?: string;
  characteristicUuid?: string;
}

export interface NativeWriteResult {
  ok: boolean;
  bytesWritten: number;
  error?: string;
}

export interface NativePrinterPlugin {
  checkPermissions(): Promise<Record<string, string>>;
  requestPermissions(): Promise<Record<string, string>>;
  isSupported(): Promise<{ supported: boolean; enabled: boolean; adapterName?: string }>;
  scan(options: { durationMs?: number }): Promise<{ devices: NativePrinterDevice[] }>;
  connect(options: {
    address: string;
    transport: 'classic' | 'ble';
  }): Promise<NativeConnectResult>;
  write(options: { base64: string }): Promise<NativeWriteResult>;
  disconnect(): Promise<void>;
  openBluetoothSettings(): Promise<void>;
}

const ThermalPrinter = registerPlugin<NativePrinterPlugin>('ThermalPrinter');

export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export function isNativePrinterAvailable(): boolean {
  return isNativeAndroid() && Capacitor.isPluginAvailable('ThermalPrinter');
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const slab = 0x8000;
  for (let i = 0; i < bytes.length; i += slab) {
    const chunk = bytes.subarray(i, i + slab);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function permissionGranted(states: Record<string, string>): boolean {
  return Object.values(states).some((state) => state === 'granted');
}

/**
 * Ensures Android 12+ Bluetooth runtime permissions (or pre-12 location for
 * scanning) before a scan/connect attempt. Returns a truthful error instead of
 * silently opening a picker that cannot find printers.
 */
export async function ensureNativeBluetoothReady(): Promise<{
  ok: boolean;
  error?: string;
  code?: 'PERMISSION_DENIED' | 'BLUETOOTH_DISABLED' | 'UNSUPPORTED';
}> {
  if (!isNativePrinterAvailable()) {
    return {
      ok: false,
      code: 'UNSUPPORTED',
      error: 'Native Bluetooth printing is only available in the Android app build.',
    };
  }

  try {
    let states = await ThermalPrinter.checkPermissions();
    if (!permissionGranted(states)) {
      states = await ThermalPrinter.requestPermissions();
    }
    if (!permissionGranted(states)) {
      return {
        ok: false,
        code: 'PERMISSION_DENIED',
        error:
          'Bluetooth permission was not granted. Allow “Nearby devices” for Esai Cakes POS in Android settings, then try again.',
      };
    }

    const support = await ThermalPrinter.isSupported();
    if (!support.supported) {
      return { ok: false, code: 'UNSUPPORTED', error: 'This device has no Bluetooth adapter.' };
    }
    if (!support.enabled) {
      return {
        ok: false,
        code: 'BLUETOOTH_DISABLED',
        error: 'Bluetooth is turned off. Turn it on, then scan again.',
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Could not check Bluetooth permissions.',
    };
  }
}

export async function scanNativePrinters(durationMs = 8000): Promise<NativePrinterDevice[]> {
  const result = await ThermalPrinter.scan({ durationMs });
  return result.devices ?? [];
}

export async function connectNativePrinter(
  device: NativePrinterDevice,
): Promise<NativeConnectResult> {
  return ThermalPrinter.connect({ address: device.address, transport: device.transport });
}

export async function writeNativePrinter(payload: Uint8Array): Promise<NativeWriteResult> {
  return ThermalPrinter.write({ base64: bytesToBase64(payload) });
}

export async function disconnectNativePrinter(): Promise<void> {
  await ThermalPrinter.disconnect();
}

export async function openNativeBluetoothSettings(): Promise<void> {
  await ThermalPrinter.openBluetoothSettings();
}
