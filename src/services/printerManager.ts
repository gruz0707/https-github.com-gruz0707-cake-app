import type { PrinterHandle, PrinterWriteOutcome } from './printerTypes';
import {
  connectNativePrinter,
  disconnectNativePrinter,
  type NativePrinterDevice,
  writeNativePrinter,
} from './nativePrinter';

/**
 * One connection + one serialized write queue for every receipt/test slip.
 * This prevents interleaved budgets when two prints are triggered quickly.
 */
let activeHandle: PrinterHandle | null = null;
let writeQueue: Promise<unknown> = Promise.resolve();

export function setActivePrinterHandle(handle: PrinterHandle | null): void {
  activeHandle = handle;
}

export function getActivePrinterHandle(): PrinterHandle | null {
  return activeHandle;
}

export async function connectNativeHandle(device: NativePrinterDevice): Promise<PrinterHandle> {
  const connected = await connectNativePrinter(device);
  const handle: PrinterHandle = {
    mode: connected.transport === 'classic' ? 'native-classic' : 'native-ble',
    deviceName: connected.name || device.name,
    deviceId: connected.address || device.address,
    serviceUuid: connected.serviceUuid,
    characteristicUuid: connected.characteristicUuid,
    write: async (payload) => {
      const result = await writeNativePrinter(payload);
      return {
        ok: result.ok,
        bytesWritten: result.bytesWritten,
        uncertain: !result.ok && result.bytesWritten > 0,
        error: result.error,
      };
    },
    disconnect: () => {
      void disconnectNativePrinter().catch(() => undefined);
    },
  };
  setActivePrinterHandle(handle);
  return handle;
}

export function createSimulatedHandle(paperWidth: 58 | 80): PrinterHandle {
  const handle: PrinterHandle = {
    mode: 'simulated',
    deviceName:
      paperWidth === 80 ? 'Test simulator (80mm)' : 'Test simulator (58mm)',
    deviceId: `sim-${paperWidth}mm`,
    serviceUuid: undefined,
    characteristicUuid: undefined,
    write: async (payload) => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return { ok: true, bytesWritten: payload.length, uncertain: false };
    },
    disconnect: () => {
      setActivePrinterHandle(null);
    },
  };
  setActivePrinterHandle(handle);
  return handle;
}

export function disconnectActivePrinter(): void {
  if (activeHandle) {
    activeHandle.disconnect();
    activeHandle = null;
  }
}

/** Serialize every job; a failed job never blocks the next one. */
export function enqueuePrintJob<T>(job: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(job, job);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

const PRINT_TIMEOUT_MS = 30000;

export async function submitPrintJob(payload: Uint8Array): Promise<{
  mode: PrinterHandle['mode'] | null;
  outcome: PrinterWriteOutcome;
}> {
  return enqueuePrintJob(async () => {
    const handle = activeHandle;
    if (!handle) {
      return {
        mode: null,
        outcome: {
          ok: false,
          bytesWritten: 0,
          uncertain: false,
          error: 'No printer is connected.',
        },
      };
    }
    try {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const timeout = new Promise<PrinterWriteOutcome>((resolve) => {
        timeoutId = setTimeout(() => {
          resolve({
            ok: false,
            bytesWritten: 0,
            uncertain: true,
            error:
              'The printer did not confirm the job in time. It may already be printing; check the paper before retrying.',
          });
        }, PRINT_TIMEOUT_MS);
      });
      const outcome = await Promise.race([handle.write(payload), timeout]);
      if (timeoutId) clearTimeout(timeoutId);
      return { mode: handle.mode, outcome };
    } catch (err) {
      return {
        mode: handle.mode,
        outcome: {
          ok: false,
          bytesWritten: 0,
          uncertain: true,
          error: err instanceof Error ? err.message : 'Printer transmission failed.',
        },
      };
    }
  });
}
