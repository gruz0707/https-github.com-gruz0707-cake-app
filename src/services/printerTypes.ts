import type { BluetoothPrinterState, PrintMode } from '../types/pos';

export interface PrinterWriteOutcome {
  ok: boolean;
  bytesWritten: number;
  error?: string;
  /** True when some bytes may have reached the printer before a failure. */
  uncertain: boolean;
}

export interface PrinterHandle {
  mode: Exclude<BluetoothPrinterState['mode'], 'none'>;
  deviceName: string;
  deviceId: string;
  serviceUuid?: string;
  characteristicUuid?: string;
  write(payload: Uint8Array): Promise<PrinterWriteOutcome>;
  disconnect(): void;
}

export interface PrintSubmission {
  mode: PrintMode;
  outcome: PrinterWriteOutcome;
}
