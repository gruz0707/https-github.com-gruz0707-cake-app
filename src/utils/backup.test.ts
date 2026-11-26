import test from 'node:test';
import assert from 'node:assert/strict';
import type { BillOrder, CakeItem, ShopSettings } from '../types/pos';
import { DEFAULT_SHOP_SETTINGS } from '../data/seedData';
import {
  AUTO_BACKUP_KEY,
  PRE_RESTORE_KEY,
  applyBackupToStorage,
  backupFilename,
  billsToCsv,
  createBackupPayload,
  parseBackup,
  readAutoBackup,
  serializeBackup,
  shouldAutoBackup,
  storageUsageBytes,
  writeAutoBackup,
} from './backup';
import {
  STORAGE_KEYS_V2,
  createMemoryStorage,
  loadOrMigrateState,
  saveCakes,
  saveOrders,
} from './storage';

const cake = (id: string, price: number): CakeItem => ({
  id,
  name: `Cake ${id}`,
  category: 'Special Cakes',
  description: '',
  egglessAvailable: true,
  flavourChoice: false,
  inStock: true,
  sku: id,
  createdAt: '2026-11-18T00:00:00.000Z',
  numericPrice: price,
  defaultWeight: '1 kg',
  weights: [{ weight: '1 kg', label: '1 kg', price }],
});

const order = (id: string, total: number): BillOrder => ({
  id,
  billNumber: `EC-${id}`,
  createdAt: '2026-11-18T09:00:00.000Z',
  items: [],
  subtotal: total,
  discountAmount: 0,
  taxRate: 0,
  taxAmount: 0,
  total,
  paymentMethod: 'Cash',
});

const settings: ShopSettings = { ...DEFAULT_SHOP_SETTINGS };

test('backup payload round-trips through serialize and parse', () => {
  const payload = createBackupPayload({
    cakes: [cake('A', 700)],
    orders: [order('1', 700), { ...order('2', 500), isDemo: true }],
    settings,
    activeBill: null,
  });
  const parsed = parseBackup(serializeBackup(payload));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.payload.counts.cakes, 1);
  assert.equal(parsed.payload.counts.orders, 2);
  assert.equal(parsed.payload.counts.realOrders, 1);
  assert.equal(parsed.payload.data.cakes[0].weights[0].price, 700);
});

test('parse rejects foreign files, newer schemas and unusable content', () => {
  assert.equal(parseBackup('not json').ok, false);
  assert.equal(parseBackup(JSON.stringify({ app: 'other-pos' })).ok, false);
  assert.equal(
    parseBackup(JSON.stringify({ app: 'esai-cakes-pos', schemaVersion: 99, data: {} })).ok,
    false,
  );
  assert.equal(
    parseBackup(JSON.stringify({ app: 'esai-cakes-pos', schemaVersion: 2, data: { cakes: [], orders: [] } })).ok,
    false,
  );
});

test('parse skips invalid records and reports them instead of trusting them', () => {
  const payload = createBackupPayload({
    cakes: [cake('A', 700)],
    orders: [order('1', 700)],
    settings,
    activeBill: null,
  });
  const raw = JSON.parse(serializeBackup(payload));
  raw.data.orders.push({ id: 'bad' });
  raw.data.cakes.push({ id: 'bad-cake' });
  const parsed = parseBackup(JSON.stringify(raw));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.payload.data.orders.length, 1);
  assert.equal(parsed.payload.data.cakes.length, 1);
  assert.equal(parsed.warnings.length, 2);
});

test('replace restore keeps a safety copy and undo returns the original data', () => {
  const storage = createMemoryStorage();
  loadOrMigrateState(storage);
  saveCakes(storage, [cake('LOCAL', 999)]);
  saveOrders(storage, [order('local-1', 999)]);

  const incoming = createBackupPayload({
    cakes: [cake('REMOTE', 700)],
    orders: [order('remote-1', 700)],
    settings: { ...settings, shopName: 'Remote Shop' },
    activeBill: null,
  });

  const restored = applyBackupToStorage(storage, incoming, 'replace');
  assert.equal(restored.ok, true);
  assert.equal(restored.safetySaved, true);
  assert.ok(storage.getItem(PRE_RESTORE_KEY));
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEYS_V2.CAKES)!)[0].id, 'REMOTE');
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEYS_V2.ORDERS)!)[0].id, 'remote-1');

  const safety = parseBackup(storage.getItem(PRE_RESTORE_KEY)!);
  assert.equal(safety.ok, true);
  if (!safety.ok) return;
  const undone = applyBackupToStorage(storage, safety.payload, 'replace', { writeSafety: false });
  assert.equal(undone.ok, true);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEYS_V2.CAKES)!)[0].id, 'LOCAL');
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEYS_V2.ORDERS)!)[0].id, 'local-1');
});

test('merge restore adds only missing records and preserves local edits', () => {
  const storage = createMemoryStorage();
  loadOrMigrateState(storage);
  saveCakes(storage, [cake('SHARED', 1234)]);
  saveOrders(storage, [order('shared-1', 1234)]);

  const incoming = createBackupPayload({
    cakes: [cake('SHARED', 700), cake('NEW', 800)],
    orders: [order('shared-1', 700), order('new-1', 800)],
    settings,
    activeBill: null,
  });

  const merged = applyBackupToStorage(storage, incoming, 'merge');
  assert.equal(merged.ok, true);
  assert.equal(merged.summary?.addedCakes, 1);
  assert.equal(merged.summary?.addedOrders, 1);
  const cakes = JSON.parse(storage.getItem(STORAGE_KEYS_V2.CAKES)!) as CakeItem[];
  const orders = JSON.parse(storage.getItem(STORAGE_KEYS_V2.ORDERS)!) as BillOrder[];
  assert.equal(cakes.find((c) => c.id === 'SHARED')?.weights[0].price, 1234);
  assert.equal(orders.find((o) => o.id === 'shared-1')?.total, 1234);
  assert.ok(cakes.some((c) => c.id === 'NEW'));
  assert.ok(orders.some((o) => o.id === 'new-1'));
});

test('restore is refused when the safety copy cannot be written', () => {
  const base = createMemoryStorage();
  loadOrMigrateState(base);
  const guarded = {
    ...base,
    setItem: (key: string, value: string) => {
      if (key === PRE_RESTORE_KEY) throw new Error('quota exceeded');
      base.setItem(key, value);
    },
  };
  const incoming = createBackupPayload({
    cakes: [cake('REMOTE', 700)],
    orders: [order('remote-1', 700)],
    settings,
    activeBill: null,
  });
  const result = applyBackupToStorage(guarded, incoming, 'replace');
  assert.equal(result.ok, false);
  assert.match(result.error ?? '', /safety copy/i);
});

test('CSV export escapes quotes, commas and newlines', () => {
  const csv = billsToCsv([
    {
      ...order('1', 700),
      customerName: 'Maya, "The Cake Queen"',
      orderNote: 'line one\nline two',
    },
  ]);
  const lines = csv.split('\r\n');
  assert.equal(lines.length, 2);
  assert.ok(lines[1].includes('"Maya, ""The Cake Queen"""'));
  assert.ok(lines[1].includes('"line one\nline two"'));
});

test('automatic snapshot is throttled to once per day', () => {
  const storage = createMemoryStorage();
  assert.equal(shouldAutoBackup(storage), true);
  const payload = createBackupPayload({
    cakes: [cake('A', 700)],
    orders: [order('1', 700)],
    settings,
    activeBill: null,
  });
  assert.equal(writeAutoBackup(storage, payload), true);
  assert.equal(shouldAutoBackup(storage), false);
  assert.ok(readAutoBackup(storage));

  const old = { ...payload, exportedAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString() };
  storage.setItem(AUTO_BACKUP_KEY, serializeBackup(old));
  assert.equal(shouldAutoBackup(storage), true);
});

test('storage usage and filenames are reported for the backup screen', () => {
  const storage = createMemoryStorage();
  loadOrMigrateState(storage);
  assert.ok(storageUsageBytes(storage) > 0);
  const name = backupFilename('esai-cakes-backup', new Date(2026, 10, 18, 9, 5));
  assert.equal(name, 'esai-cakes-backup-2026-11-18-0905');
});
