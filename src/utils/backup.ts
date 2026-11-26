import type {
  ActiveBillState,
  BillOrder,
  CakeItem,
  ShopSettings,
} from '../types/pos';
import { CATALOG_SOURCE_VERSION } from '../data/catalog.generated';
import {
  STORAGE_KEYS_V1,
  STORAGE_KEYS_V2,
  adaptSettings,
  clearActiveBill,
  saveActiveBill,
  saveCakes,
  saveOrders,
  saveSettings,
  type StorageLike,
} from './storage';

export const BACKUP_APP_ID = 'esai-cakes-pos';
export const BACKUP_SCHEMA_VERSION = 2;

export const AUTO_BACKUP_KEY = 'crumbpos_auto_backup_v2';
export const PRE_RESTORE_KEY = 'crumbpos_pre_restore_v2';
export const LAST_EXPORT_KEY = 'crumbpos_last_export_v2';
export const AUTO_BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

export interface BackupData {
  cakes: CakeItem[];
  orders: BillOrder[];
  settings: ShopSettings;
  activeBill: ActiveBillState | null;
}

export interface BackupPayload {
  app: string;
  schemaVersion: number;
  exportedAt: string;
  catalogSourceVersion: string;
  counts: { cakes: number; orders: number; realOrders: number };
  data: BackupData;
}

export interface BackupInput {
  cakes: CakeItem[];
  orders: BillOrder[];
  settings: ShopSettings;
  activeBill: ActiveBillState | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finite(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function createBackupPayload(
  input: BackupInput,
  exportedAt: string = new Date().toISOString(),
): BackupPayload {
  const realOrders = input.orders.filter((o) => !o.isDemo).length;
  return {
    app: BACKUP_APP_ID,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt,
    catalogSourceVersion: CATALOG_SOURCE_VERSION,
    counts: {
      cakes: input.cakes.length,
      orders: input.orders.length,
      realOrders,
    },
    data: {
      cakes: input.cakes,
      orders: input.orders,
      settings: input.settings,
      activeBill: input.activeBill,
    },
  };
}

export function serializeBackup(payload: BackupPayload): string {
  return JSON.stringify(payload, null, 2);
}

export type ParsedBackup =
  | { ok: true; payload: BackupPayload; warnings: string[] }
  | { ok: false; error: string };

function sanitizeCake(raw: unknown): CakeItem | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== 'string' || !raw.id || typeof raw.name !== 'string' || !raw.name) {
    return null;
  }
  if (!Array.isArray(raw.weights)) return null;
  return raw as unknown as CakeItem;
}

function sanitizeOrder(raw: unknown): BillOrder | null {
  if (!isRecord(raw)) return null;
  if (
    typeof raw.id !== 'string' ||
    !raw.id ||
    typeof raw.billNumber !== 'string' ||
    typeof raw.createdAt !== 'string' ||
    finite(raw.total) == null ||
    !Array.isArray(raw.items)
  ) {
    return null;
  }
  return raw as unknown as BillOrder;
}

function sanitizeActiveBill(raw: unknown): ActiveBillState | null {
  if (!isRecord(raw) || !Array.isArray(raw.cart)) return null;
  const paymentMethod =
    raw.paymentMethod === 'Cash' || raw.paymentMethod === 'UPI' || raw.paymentMethod === 'Card'
      ? raw.paymentMethod
      : 'Cash';
  return {
    cart: raw.cart as ActiveBillState['cart'],
    discountAmount: finite(raw.discountAmount) ?? 0,
    paymentMethod,
    customerName: typeof raw.customerName === 'string' ? raw.customerName : '',
    customerPhone: typeof raw.customerPhone === 'string' ? raw.customerPhone : '',
    orderNote: typeof raw.orderNote === 'string' ? raw.orderNote : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

/** Validate an imported file. Invalid records are skipped and reported, never silently trusted. */
export function parseBackup(text: string): ParsedBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not valid JSON. Choose a backup exported by Esai Cakes POS.' };
  }
  if (!isRecord(raw)) {
    return { ok: false, error: 'Backup file must be a JSON object.' };
  }
  if (raw.app !== BACKUP_APP_ID) {
    return { ok: false, error: 'This file was not exported by Esai Cakes POS.' };
  }
  const schema = finite(raw.schemaVersion);
  if (schema == null || schema > BACKUP_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Backup schema ${String(raw.schemaVersion)} is newer than this app understands (${BACKUP_SCHEMA_VERSION}). Update the app first.`,
    };
  }
  if (schema < 2) {
    return { ok: false, error: 'This backup uses an older format. Export a fresh backup from the current app.' };
  }
  if (!isRecord(raw.data)) {
    return { ok: false, error: 'Backup is missing its data section.' };
  }

  const warnings: string[] = [];
  const rawCakes = Array.isArray(raw.data.cakes) ? raw.data.cakes : [];
  const rawOrders = Array.isArray(raw.data.orders) ? raw.data.orders : [];
  const cakes = rawCakes.map(sanitizeCake).filter((c): c is CakeItem => c !== null);
  const orders = rawOrders.map(sanitizeOrder).filter((o): o is BillOrder => o !== null);
  if (cakes.length !== rawCakes.length) {
    warnings.push(`${rawCakes.length - cakes.length} catalog record(s) were invalid and skipped.`);
  }
  if (orders.length !== rawOrders.length) {
    warnings.push(`${rawOrders.length - orders.length} bill record(s) were invalid and skipped.`);
  }
  if (cakes.length === 0 && orders.length === 0) {
    return { ok: false, error: 'Backup contains no usable cakes or bills.' };
  }

  const payload: BackupPayload = {
    app: BACKUP_APP_ID,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : new Date().toISOString(),
    catalogSourceVersion:
      typeof raw.catalogSourceVersion === 'string' ? raw.catalogSourceVersion : CATALOG_SOURCE_VERSION,
    counts: {
      cakes: cakes.length,
      orders: orders.length,
      realOrders: orders.filter((o) => !o.isDemo).length,
    },
    data: {
      cakes,
      orders,
      settings: adaptSettings(raw.data.settings),
      activeBill: sanitizeActiveBill(raw.data.activeBill),
    },
  };
  return { ok: true, payload, warnings };
}

export interface RestoreSummary {
  mode: 'replace' | 'merge';
  cakes: number;
  orders: number;
  addedCakes: number;
  addedOrders: number;
}

export interface RestoreResult {
  ok: boolean;
  error?: string;
  summary?: RestoreSummary;
  next?: BackupData;
  safetySaved?: boolean;
}

function readCurrentData(storage: StorageLike): BackupData {
  const parse = <T>(key: string, fallback: T): T => {
    try {
      const raw = storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  return {
    cakes: parse<CakeItem[]>(STORAGE_KEYS_V2.CAKES, []),
    orders: parse<BillOrder[]>(STORAGE_KEYS_V2.ORDERS, []),
    settings: adaptSettings(parse<unknown>(STORAGE_KEYS_V2.SETTINGS, null)),
    activeBill: parse<ActiveBillState | null>(STORAGE_KEYS_V2.ACTIVE_BILL, null),
  };
}

function writeData(storage: StorageLike, data: BackupData): string | null {
  const cakesRes = saveCakes(storage, data.cakes);
  if (!cakesRes.ok) return cakesRes.error ?? 'Could not write catalog.';
  const ordersRes = saveOrders(storage, data.orders);
  if (!ordersRes.ok) return ordersRes.error ?? 'Could not write bills.';
  const settingsRes = saveSettings(storage, data.settings);
  if (!settingsRes.ok) return settingsRes.error ?? 'Could not write settings.';
  if (data.activeBill) {
    const activeRes = saveActiveBill(storage, data.activeBill);
    if (!activeRes.ok) return activeRes.error ?? 'Could not write active bill.';
  } else {
    clearActiveBill(storage);
  }
  return null;
}

/**
 * Restore with a safety copy first. If the safety copy cannot be written
 * (storage full), the restore is refused rather than risking data loss.
 */
export function applyBackupToStorage(
  storage: StorageLike,
  payload: BackupPayload,
  mode: 'replace' | 'merge',
  options: { writeSafety?: boolean } = {},
): RestoreResult {
  const writeSafety = options.writeSafety !== false;
  const current = readCurrentData(storage);

  if (writeSafety) {
    const safety = createBackupPayload(current);
    try {
      storage.setItem(PRE_RESTORE_KEY, serializeBackup(safety));
    } catch {
      return {
        ok: false,
        error:
          'Could not save a safety copy of the current data (storage is full). Free space or download a backup first; nothing was changed.',
      };
    }
  }

  let next: BackupData;
  let addedCakes = 0;
  let addedOrders = 0;

  if (mode === 'replace') {
    next = {
      cakes: payload.data.cakes,
      orders: [...payload.data.orders].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      ),
      settings: payload.data.settings,
      activeBill: payload.data.activeBill,
    };
    addedCakes = next.cakes.length;
    addedOrders = next.orders.length;
  } else {
    const cakeIds = new Set(current.cakes.map((c) => c.id));
    const orderIds = new Set(current.orders.map((o) => o.id));
    const newCakes = payload.data.cakes.filter((c) => !cakeIds.has(c.id));
    const newOrders = payload.data.orders.filter((o) => !orderIds.has(o.id));
    addedCakes = newCakes.length;
    addedOrders = newOrders.length;
    next = {
      cakes: [...current.cakes, ...newCakes],
      orders: [...current.orders, ...newOrders].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      ),
      settings: current.settings,
      activeBill: current.activeBill,
    };
  }

  const writeError = writeData(storage, next);
  if (writeError) {
    // Roll back to the pre-restore state so a partial write never corrupts data.
    writeData(storage, current);
    return { ok: false, error: `Restore failed and was rolled back: ${writeError}` };
  }

  return {
    ok: true,
    summary: {
      mode,
      cakes: next.cakes.length,
      orders: next.orders.length,
      addedCakes,
      addedOrders,
    },
    next,
    safetySaved: writeSafety,
  };
}

export function readPayloadKey(storage: StorageLike, key: string): BackupPayload | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = parseBackup(raw);
    return parsed.ok ? parsed.payload : null;
  } catch {
    return null;
  }
}

export function readPreRestore(storage: StorageLike): BackupPayload | null {
  return readPayloadKey(storage, PRE_RESTORE_KEY);
}

export function clearPreRestore(storage: StorageLike): void {
  try {
    storage.removeItem(PRE_RESTORE_KEY);
  } catch {
    // Best effort.
  }
}

export function readAutoBackup(storage: StorageLike): BackupPayload | null {
  return readPayloadKey(storage, AUTO_BACKUP_KEY);
}

export function shouldAutoBackup(storage: StorageLike, now = Date.now()): boolean {
  const last = readAutoBackup(storage);
  if (!last) return true;
  const at = Date.parse(last.exportedAt);
  if (!Number.isFinite(at)) return true;
  return now - at >= AUTO_BACKUP_INTERVAL_MS;
}

export function writeAutoBackup(storage: StorageLike, payload: BackupPayload): boolean {
  try {
    storage.setItem(AUTO_BACKUP_KEY, serializeBackup(payload));
    return true;
  } catch {
    try {
      storage.removeItem(AUTO_BACKUP_KEY);
    } catch {
      // Ignore.
    }
    return false;
  }
}

export function recordExport(storage: StorageLike, at = new Date().toISOString()): void {
  try {
    storage.setItem(LAST_EXPORT_KEY, JSON.stringify(at));
  } catch {
    // Timestamp only.
  }
}

export function readLastExport(storage: StorageLike): string | null {
  try {
    const raw = storage.getItem(LAST_EXPORT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function storageUsageBytes(storage: StorageLike): number {
  let total = 0;
  const keys = [
    ...Object.values(STORAGE_KEYS_V1),
    ...Object.values(STORAGE_KEYS_V2),
    AUTO_BACKUP_KEY,
    PRE_RESTORE_KEY,
    LAST_EXPORT_KEY,
  ];
  for (const key of keys) {
    try {
      const value = storage.getItem(key);
      if (value != null) total += key.length + value.length;
    } catch {
      // Ignore unreadable keys.
    }
  }
  // Legacy backup keys created by the v1 migration.
  for (const key of Object.values(STORAGE_KEYS_V1)) {
    try {
      const value = storage.getItem(`crumbpos_backup_v1__${key}`);
      if (value != null) total += value.length;
    } catch {
      // Ignore.
    }
  }
  return total;
}

export function listLegacyBackups(storage: StorageLike): Array<{ key: string; bytes: number }> {
  const out: Array<{ key: string; bytes: number }> = [];
  for (const key of Object.values(STORAGE_KEYS_V1)) {
    const backupKey = `crumbpos_backup_v1__${key}`;
    try {
      const value = storage.getItem(backupKey);
      if (value != null) out.push({ key: backupKey, bytes: value.length });
    } catch {
      // Ignore.
    }
  }
  return out;
}

function csvField(value: string | number | boolean | undefined): string {
  const text = value == null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function billsToCsv(orders: BillOrder[]): string {
  const header = [
    'Bill number',
    'Date',
    'Time',
    'Customer',
    'Phone',
    'Payment',
    'Items',
    'Order note',
    'Subtotal',
    'Discount',
    'Tax rate %',
    'Tax',
    'Total',
    'Print state',
    'Demo',
  ];
  const rows = orders.map((order) => {
    const dt = new Date(order.createdAt);
    const items = order.items
      .map(
        (item) =>
          `${item.quantity}x ${item.cakeName} ${item.weightLabel || item.variantLabel || ''}${
            item.flavour ? ` / ${item.flavour}` : ''
          }${item.eggless ? ' / eggless' : ''}`,
      )
      .join('; ');
    return [
      order.billNumber,
      dt.toLocaleDateString('en-IN'),
      dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      order.customerName ?? '',
      order.customerPhone ?? '',
      order.paymentMethod,
      items,
      order.orderNote ?? '',
      order.subtotal,
      order.discountAmount,
      order.taxRate,
      order.taxAmount,
      order.total,
      order.printState ?? (order.printedAt ? 'sent' : 'not printed'),
      order.isDemo ? 'yes' : 'no',
    ]
      .map(csvField)
      .join(',');
  });
  return [header.map(csvField).join(','), ...rows].join('\r\n');
}

export function backupFilename(prefix: string, at = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}-${pad(
    at.getHours(),
  )}${pad(at.getMinutes())}`;
  return `${prefix}-${stamp}`;
}

export type DeliveryMethod = 'share' | 'download' | 'clipboard';

export interface DeliveryResult {
  ok: boolean;
  method?: DeliveryMethod;
  error?: string;
}

/**
 * Deliver a file in the best way the environment supports:
 * native share sheet (Android), browser download, then clipboard as fallback.
 */
export async function deliverTextFile(
  filename: string,
  text: string,
  mime: string,
): Promise<DeliveryResult> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;

  if (nav && typeof nav.share === 'function' && typeof File !== 'undefined') {
    try {
      const file = new File([text], filename, { type: mime });
      const shareData = { files: [file] } as ShareData;
      const canShare =
        typeof nav.canShare === 'function' ? nav.canShare(shareData) : true;
      if (canShare) {
        await nav.share(shareData);
        return { ok: true, method: 'share' };
      }
    } catch (err) {
      // User cancelled the share sheet: treat as a completed, intentional action.
      if (err instanceof Error && err.name === 'AbortError') {
        return { ok: true, method: 'share' };
      }
      // Fall through to download.
    }
  }

  if (typeof document !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
    try {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = 'noopener';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      return { ok: true, method: 'download' };
    } catch {
      // Fall through to clipboard.
    }
  }

  if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
    try {
      await nav.clipboard.writeText(text);
      return { ok: true, method: 'clipboard' };
    } catch {
      return { ok: false, error: 'Could not share, download, or copy the backup in this browser.' };
    }
  }

  return { ok: false, error: 'No way to save the file in this environment.' };
}
