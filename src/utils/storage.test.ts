import test from 'node:test';
import assert from 'node:assert/strict';
import type { ActiveBillState, CakeItem } from '../types/pos';
import {
  STORAGE_KEYS_V1,
  STORAGE_KEYS_V2,
  createMemoryStorage,
  loadOrMigrateState,
  readPaymentPreference,
  saveActiveBill,
  saveCakes,
  saveOrders,
  savePaymentPreference,
} from './storage';

function legacyFixture() {
  return createMemoryStorage({
    [STORAGE_KEYS_V1.CAKES]: JSON.stringify([
      {
        id: 'SC03',
        name: 'Red Velvet Cake',
        category: 'Special Cakes',
        description: 'old description',
        imageUrl: '/src/assets/images/cakes/SC03.jpg',
        egglessAvailable: true,
        inStock: true,
        sku: 'SC03',
        createdAt: '2026-11-17T06:00:00.000Z',
        variants: [
          { id: 'SC03-0_5kg', label: '½ kg', price: 450 },
          { id: 'SC03-1kg', label: '1 kg', price: 850 },
        ],
      },
      {
        id: 'CUSTOM-1',
        name: 'My Local Cake',
        category: 'Birthday Girl',
        description: 'local',
        egglessAvailable: true,
        inStock: true,
        sku: 'CUSTOM-1',
        createdAt: '2026-11-17T06:00:00.000Z',
        variants: [{ id: 'v1', label: '1 kg', price: 999 }],
      },
    ]),
    [STORAGE_KEYS_V1.ORDERS]: JSON.stringify([
      {
        id: 'old-1',
        billNumber: 'EC-261117-007',
        createdAt: '2026-11-17T09:00:00.000Z',
        items: [
          {
            key: 'old-line',
            cakeId: 'SC03',
            cakeName: 'Red Velvet Cake',
            variantId: 'SC03-1kg',
            variantLabel: '1 kg',
            unitPrice: 1234,
            quantity: 1,
            eggless: false,
          },
        ],
        subtotal: 1234,
        discountAmount: 34,
        taxRate: 0,
        taxAmount: 0,
        total: 1200,
        paymentMethod: 'UPI',
        printedAt: '2026-11-17T09:01:00.000Z',
        printMode: 'bluetooth',
      },
    ]),
    [STORAGE_KEYS_V1.SETTINGS]: JSON.stringify({
      shopName: 'Esai Cakes',
      tagline: 'The Unique Taste of Cakes',
      address: 'Old address',
      phone: '+91 78454 54969',
      taxId: '',
      taxRate: 0,
      currencySymbol: '₹',
      receiptFooter: 'Thanks',
      paperWidth: 58,
      autoPrintOnCheckout: true,
    }),
  });
}

test('first v2 run backs up v1 keys and preserves bill totals exactly', () => {
  const storage = legacyFixture();
  const state = loadOrMigrateState(storage);
  assert.equal(state.report.migrated, true);
  assert.equal(state.orders.length, 1);
  assert.equal(state.orders[0].billNumber, 'EC-261117-007');
  assert.equal(state.orders[0].total, 1200);
  assert.equal(state.orders[0].discountAmount, 34);
  assert.equal(state.orders[0].items[0].unitPrice, 1234);
  assert.equal(state.orders[0].items[0].legacy, true);
  assert.equal(state.orders[0].items[0].weightLabel, '1 kg');
  assert.equal(state.orders[0].printState, 'sent');

  assert.ok(state.report.backupKeys.length >= 3);
  for (const key of state.report.backupKeys) {
    assert.ok(storage.getItem(key), `missing backup ${key}`);
  }
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEYS_V2.META)!).version, 2);
});

test('v1 SC03 eggless bug is corrected during migration and local prices are preserved', () => {
  const storage = legacyFixture();
  const state = loadOrMigrateState(storage);
  const sc03 = state.cakes.find((c) => c.id === 'SC03');
  assert.ok(sc03);
  assert.equal(sc03.egglessAvailable, false);
  assert.equal(sc03.imageUrl, '/cakes/SC03.jpg');
  assert.equal(sc03.weights.find((w) => w.weight === '1 kg')?.price, 850);
  const custom = state.cakes.find((c) => c.id === 'CUSTOM-1');
  assert.ok(custom);
  assert.equal(custom.weights[0].price, 999);
});

test('second load does not re-migrate and keeps local catalog edits', () => {
  const storage = legacyFixture();
  loadOrMigrateState(storage);

  const rawCakes = JSON.parse(storage.getItem(STORAGE_KEYS_V2.CAKES)!) as CakeItem[];
  rawCakes[0].weights = rawCakes[0].weights.map((w) =>
    w.weight === '1 kg' ? { ...w, price: 900 } : w,
  );
  assert.equal(saveCakes(storage, rawCakes).ok, true);

  const second = loadOrMigrateState(storage);
  assert.equal(second.report.migrated, false);
  assert.equal(second.cakes[0].weights.find((w) => w.weight === '1 kg')?.price, 900);
  assert.equal(second.orders.length, 1);
});

test('fresh install imports 215 source cakes and starts with zero bills', () => {
  const storage = createMemoryStorage();
  const state = loadOrMigrateState(storage);
  assert.equal(state.cakes.length, 215);
  assert.equal(state.orders.length, 0);
  assert.equal(state.settings.shopName, 'Esai Cakes');
  assert.equal(state.meta.liveCatalogVerified, false);
  assert.equal(state.meta.catalogCount, 215);
});

test('active bill survives reload with all snapshotted price fields', () => {
  const storage = createMemoryStorage();
  loadOrMigrateState(storage);

  const active: ActiveBillState = {
    cart: [
      {
        key: 'k1',
        cakeId: 'SC02',
        cakeName: 'White Forest Cake',
        sku: 'SC02',
        weightKg: 1.5,
        weightLabel: '1.5 kg',
        flavour: null,
        eggless: true,
        basePrice: 1050,
        flavourExtra: 0,
        egglessExtra: 150,
        unitPrice: 1200,
        quantity: 2,
        cakeMessage: 'Happy Birthday',
        notes: 'Box',
      },
    ],
    discountAmount: 50,
    paymentMethod: 'Card',
    customerName: 'Maya',
    customerPhone: '9876543210',
    orderNote: 'Evening pickup',
    updatedAt: new Date().toISOString(),
  };
  assert.equal(saveActiveBill(storage, active).ok, true);

  const reloaded = loadOrMigrateState(storage);
  assert.ok(reloaded.activeBill);
  assert.equal(reloaded.activeBill.cart[0].unitPrice, 1200);
  assert.equal(reloaded.activeBill.cart[0].egglessExtra, 150);
  assert.equal(reloaded.activeBill.cart[0].quantity, 2);
  assert.equal(reloaded.activeBill.paymentMethod, 'Card');
});

test('payment preference defaults to Cash and remembers the chosen method', () => {
  const storage = createMemoryStorage();
  assert.equal(readPaymentPreference(storage), 'Cash');
  savePaymentPreference(storage, 'UPI');
  assert.equal(readPaymentPreference(storage), 'UPI');
});

test('order storage failure is reported instead of silently losing a bill', () => {
  const storage = createMemoryStorage();
  const failing = {
    ...storage,
    setItem: () => {
      throw new Error('quota exceeded');
    },
  };
  const result = saveOrders(failing, []);
  assert.equal(result.ok, false);
  assert.match(result.error ?? '', /quota/);
});

test('v2 snapshots written before scheduling gain completed financials on load', () => {
  const storage = createMemoryStorage();
  loadOrMigrateState(storage);
  const legacyShape = [
    {
      id: 'pre-schedule-1',
      billNumber: 'EC-261118-050',
      createdAt: '2026-11-18T09:00:00.000Z',
      items: [],
      subtotal: 900,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 900,
      paymentMethod: 'UPI',
    },
  ];
  storage.setItem(STORAGE_KEYS_V2.ORDERS, JSON.stringify(legacyShape));
  const loaded = loadOrMigrateState(storage);
  const order = loaded.orders.find((o) => o.id === 'pre-schedule-1');
  assert.ok(order);
  assert.equal(order.status, 'completed');
  assert.equal(order.advancePaid, 900);
  assert.equal(order.balanceDue, 0);
  assert.equal(order.payments?.[0].kind, 'full');
});
