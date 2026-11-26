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
    weightKg: 1,
    weightLabel: '1 kg',
    flavour: null,
    basePrice: 1100,
    flavourExtra: 0,
    egglessExtra: 0,
    unitPrice: 1100,
    quantity: 1,
    eggless: false,
  },
  {
    key: 'c2-v2-eggless',
    cakeId: 'c2',
    cakeName: 'Classic Red Velvet',
    weightKg: 0.5,
    weightLabel: '500g',
    flavour: null,
    basePrice: 600,
    flavourExtra: 0,
    egglessExtra: 50,
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
      billNumber: 'EC-261117-001',
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
      billNumber: 'EC-261117-004',
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
  assert.equal(generateBillNumber(existing, date), 'EC-261117-005');
  assert.equal(generateBillNumber([], date), 'EC-261117-001');
});

test('validateCakeForm rejects empty names, missing SKUs, and invalid weight prices', () => {
  const invalidEmpty = validateCakeForm({
    name: '   ',
    category: 'Special Cakes',
    sku: '',
    description: '',
    egglessAvailable: true,
    flavourChoice: false,
    inStock: true,
    weights: [{ weight: '500g', price: '0' }],
  });
  assert.equal(invalidEmpty.valid, false);
  assert.ok(invalidEmpty.errors.name);
  assert.ok(invalidEmpty.errors.sku);
  assert.ok(invalidEmpty.errors.weights);

  const valid = validateCakeForm({
    name: 'Pistachio Rose Gateau',
    category: 'Special Cakes',
    sku: 'PRG-07',
    description: 'Iranian pistachio sponge with rosewater cream',
    egglessAvailable: true,
    flavourChoice: false,
    inStock: true,
    defaultWeight: '500g',
    weights: [
      { weight: '500g', price: '750' },
      { weight: '1 kg', price: 1400 },
    ],
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.normalizedWeights.length, 2);
  assert.equal(valid.normalizedWeights[0].price, 750);
  assert.equal(valid.defaultWeight, '500g');

  const duplicate = validateCakeForm({
    name: 'Duplicate weights',
    category: 'Special Cakes',
    sku: 'DUP-1',
    description: '',
    egglessAvailable: true,
    flavourChoice: false,
    inStock: true,
    weights: [
      { weight: '1 kg', price: '700' },
      { weight: '1000g', price: '750' },
    ],
  });
  assert.equal(duplicate.valid, false);
  assert.match(duplicate.errors.weights ?? '', /more than once/);
});

test('filterCakes filters by category, search query, and stock availability', () => {
  const cakes: CakeItem[] = [
    {
      id: '1',
      name: 'Belgian Chocolate Truffle',
      category: 'Special Cakes',
      description: 'Dark ganache',
      egglessAvailable: true,
      flavourChoice: false,
      inStock: true,
      weights: [{ weight: '1 kg', label: '1 kg', price: 1100 }],
      numericPrice: 1100,
      defaultWeight: '1 kg',
      sku: 'BCT-01',
      createdAt: '2026-11-17T08:00:00Z',
    },
    {
      id: '2',
      name: 'Blueberry Cheesecake',
      category: 'Cheesecakes',
      description: 'Baked philadelphia cream cheese',
      egglessAvailable: false,
      flavourChoice: false,
      inStock: false,
      weights: [{ weight: '500g', label: '500g', price: 850 }],
      numericPrice: 850,
      defaultWeight: '500g',
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
      billNumber: 'EC-261117-001',
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
      billNumber: 'EC-261117-002',
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
      billNumber: 'EC-261116-001',
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
