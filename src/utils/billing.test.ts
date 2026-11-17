import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBillTotals,
  computeDailySummary,
  filterCakes,
  generateBillNumber,
  validateCakeForm,
} from './billing';
import type { BillOrder, CakeItem, CartItem } from '../types/pos';

const sampleCart: CartItem[] = [
  {
    key: 'c1-v1-egg',
    cakeId: 'c1',
    cakeName: 'Belgian Chocolate Truffle',
    variantId: 'v1',
    variantLabel: '1 kg',
    unitPrice: 1100,
    quantity: 1,
    eggless: false,
  },
  {
    key: 'c2-v2-eggless',
    cakeId: 'c2',
    cakeName: 'Classic Red Velvet',
    variantId: 'v2',
    variantLabel: '500g',
    unitPrice: 650,
    quantity: 2,
    eggless: true,
  },
];

test('calculateBillTotals computes subtotal, clamped discount, tax, and total accurately', () => {
  const result = calculateBillTotals(sampleCart, 200, 5);
  assert.equal(result.subtotal, 2400);
  assert.equal(result.discountAmount, 200);
  assert.equal(result.taxableAmount, 2200);
  assert.equal(result.taxAmount, 110);
  assert.equal(result.total, 2310);
  assert.equal(result.itemCount, 3);
});

test('calculateBillTotals clamps discount above subtotal and negative values', () => {
  const overDiscount = calculateBillTotals(sampleCart, 5000, 10);
  assert.equal(overDiscount.discountAmount, 2400);
  assert.equal(overDiscount.taxableAmount, 0);
  assert.equal(overDiscount.taxAmount, 0);
  assert.equal(overDiscount.total, 0);

  const negativeDiscount = calculateBillTotals(sampleCart, -100, 0);
  assert.equal(negativeDiscount.discountAmount, 0);
  assert.equal(negativeDiscount.total, 2400);
});

test('generateBillNumber increments sequential numbers for the same date', () => {
  const date = new Date(2026, 10, 17, 10, 30, 0);
  const existing: BillOrder[] = [
    {
      id: 'o1',
      billNumber: 'CB-261117-001',
      createdAt: date.toISOString(),
      items: [],
      subtotal: 500,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 25,
      total: 525,
      paymentMethod: 'Cash',
    },
    {
      id: 'o2',
      billNumber: 'CB-261117-004',
      createdAt: date.toISOString(),
      items: [],
      subtotal: 800,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 40,
      total: 840,
      paymentMethod: 'UPI',
    },
  ];
  assert.equal(generateBillNumber(existing, date), 'CB-261117-005');
  assert.equal(generateBillNumber([], date), 'CB-261117-001');
});

test('validateCakeForm rejects empty names, missing SKUs, and invalid variant prices', () => {
  const invalidEmpty = validateCakeForm({
    name: '   ',
    category: 'Layer Cakes',
    sku: '',
    description: '',
    egglessAvailable: true,
    inStock: true,
    variants: [{ label: '500g', price: '0' }],
  });
  assert.equal(invalidEmpty.valid, false);
  assert.ok(invalidEmpty.errors.name);
  assert.ok(invalidEmpty.errors.sku);
  assert.ok(invalidEmpty.errors.variants);

  const valid = validateCakeForm({
    name: 'Pistachio Rose Gateau',
    category: 'Layer Cakes',
    sku: 'PRG-07',
    description: 'Iranian pistachio sponge with rosewater cream',
    egglessAvailable: true,
    inStock: true,
    variants: [
      { label: '500g', price: '750' },
      { label: '1 kg', price: 1400 },
    ],
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.normalizedVariants.length, 2);
  assert.equal(valid.normalizedVariants[0].price, 750);
});

test('filterCakes filters by category, search query, and stock availability', () => {
  const cakes: CakeItem[] = [
    {
      id: '1',
      name: 'Belgian Chocolate Truffle',
      category: 'Layer Cakes',
      description: 'Dark ganache',
      egglessAvailable: true,
      inStock: true,
      variants: [{ id: 'v1', label: '1 kg', price: 1100 }],
      sku: 'BCT-01',
      createdAt: '2026-11-17T08:00:00Z',
    },
    {
      id: '2',
      name: 'Blueberry Cheesecake',
      category: 'Cheesecakes',
      description: 'Baked philadelphia cream cheese',
      egglessAvailable: false,
      inStock: false,
      variants: [{ id: 'v2', label: '500g', price: 850 }],
      sku: 'BBC-02',
      createdAt: '2026-11-17T08:00:00Z',
    },
  ];

  assert.equal(filterCakes(cakes, 'truffle', 'All').length, 1);
  assert.equal(filterCakes(cakes, '', 'Cheesecakes').length, 1);
  assert.equal(filterCakes(cakes, '', 'All', true).length, 1);
});

test('computeDailySummary summarizes only orders from the target day', () => {
  const today = new Date(2026, 10, 17, 12, 0, 0);
  const yesterday = new Date(2026, 10, 16, 12, 0, 0);
  const orders: BillOrder[] = [
    {
      id: '1',
      billNumber: 'CB-261117-001',
      createdAt: today.toISOString(),
      items: [],
      subtotal: 1000,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 50,
      total: 1050,
      paymentMethod: 'Cash',
      printedAt: today.toISOString(),
    },
    {
      id: '2',
      billNumber: 'CB-261117-002',
      createdAt: today.toISOString(),
      items: [],
      subtotal: 500,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 25,
      total: 525,
      paymentMethod: 'UPI',
    },
    {
      id: '3',
      billNumber: 'CB-261116-001',
      createdAt: yesterday.toISOString(),
      items: [],
      subtotal: 2000,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 100,
      total: 2100,
      paymentMethod: 'Card',
    },
  ];

  const summary = computeDailySummary(orders, today);
  assert.equal(summary.ordersCount, 2);
  assert.equal(summary.totalRevenue, 1575);
  assert.equal(summary.averageTicket, 787.5);
  assert.equal(summary.printedCount, 1);
});
