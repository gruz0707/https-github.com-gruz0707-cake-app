import test from 'node:test';
import assert from 'node:assert/strict';
import type { BillOrder } from '../types/pos';
import { DEFAULT_SHOP_SETTINGS } from '../data/seedData';
import { formatKitchenTicketLines, getColumnsForWidth } from './escpos';
import {
  TIME_SLOTS,
  buildOrderWhatsAppMessage,
  dueBucket,
  formatDueLabel,
  isScheduled,
  normalizeIndianPhone,
  normalizeOrderFinancials,
  orderAdvance,
  orderBalance,
  orderStatus,
  validateFulfilment,
  whatsappUrl,
} from './orders';

const baseOrder = (over: Partial<BillOrder> = {}): BillOrder => ({
  id: 'o1',
  billNumber: 'EC-261118-010',
  createdAt: '2026-11-18T09:00:00.000Z',
  items: [],
  subtotal: 2000,
  discountAmount: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 2000,
  paymentMethod: 'Cash',
  ...over,
});

test('legacy bills normalize to completed walk-in sales with one full payment', () => {
  const normalized = normalizeOrderFinancials(baseOrder());
  assert.equal(orderStatus(normalized), 'completed');
  assert.equal(orderAdvance(normalized), 2000);
  assert.equal(orderBalance(normalized), 0);
  assert.equal(normalized.payments?.length, 1);
  assert.equal(normalized.payments?.[0].kind, 'full');
  assert.equal(isScheduled(normalized), false);
});

test('scheduled orders keep advance and balance separate from revenue status', () => {
  const order = normalizeOrderFinancials(
    baseOrder({
      status: 'scheduled',
      fulfilment: { type: 'pickup', date: '2026-11-20', time: '17:00' },
      advancePaid: 500,
      balanceDue: 1500,
      payments: [{ amount: 500, method: 'UPI', at: '2026-11-18T09:00:00.000Z', kind: 'advance' }],
    }),
  );
  assert.equal(isScheduled(order), true);
  assert.equal(orderAdvance(order), 500);
  assert.equal(orderBalance(order), 1500);
});

test('fulfilment validation enforces future date, slot and delivery details', () => {
  const now = new Date(2026, 10, 18, 9, 0, 0);
  assert.equal(
    validateFulfilment({ type: 'pickup', date: '2026-11-20', time: '17:00' }, now).valid,
    true,
  );
  assert.equal(
    validateFulfilment({ type: 'pickup', date: '2026-11-17', time: '17:00' }, now).valid,
    false,
  );
  assert.equal(
    validateFulfilment({ type: 'pickup', date: '2026-11-20', time: '23:00' }, now).valid,
    false,
  );
  const delivery = validateFulfilment(
    { type: 'delivery', date: '2026-11-20', time: '17:00' },
    now,
  );
  assert.equal(delivery.valid, false);
  assert.ok(delivery.errors.length >= 3);
  assert.equal(
    validateFulfilment(
      {
        type: 'delivery',
        date: '2026-11-20',
        time: '17:00',
        address: '12 High School Street, Palavoor',
        customerName: 'Maya',
        customerPhone: '9845011223',
      },
      now,
    ).valid,
    true,
  );
});

test('time slots match the storefront window and due buckets group correctly', () => {
  assert.equal(TIME_SLOTS.length, 12);
  assert.equal(TIME_SLOTS[0].value, '10:00');
  assert.equal(TIME_SLOTS[11].value, '21:00');
  const now = new Date(2026, 10, 18, 9, 0, 0);
  const at = (date: string) =>
    baseOrder({ status: 'scheduled', fulfilment: { type: 'pickup', date, time: '17:00' } });
  assert.equal(dueBucket(at('2026-11-17'), now), 'overdue');
  assert.equal(dueBucket(at('2026-11-18'), now), 'today');
  assert.equal(dueBucket(at('2026-11-19'), now), 'tomorrow');
  assert.equal(dueBucket(at('2026-11-25'), now), 'later');
  assert.match(formatDueLabel(at('2026-11-18'), now), /Today · 5:00 pm/);
});

test('WhatsApp message carries items, schedule, advance and balance; phone normalizes', () => {
  const order = normalizeOrderFinancials(
    baseOrder({
      status: 'scheduled',
      customerName: 'Maya',
      customerPhone: '98450 11223',
      fulfilment: { type: 'delivery', date: '2026-11-20', time: '17:00', address: '12 High St' },
      advancePaid: 500,
      balanceDue: 1500,
      items: [
        {
          key: 'k',
          cakeId: 'BB01',
          cakeName: 'Cocomelon Theme Cake',
          weightKg: 3,
          weightLabel: '3 kg',
          flavour: 'Blueberry',
          eggless: true,
          basePrice: 3000,
          flavourExtra: 450,
          egglessExtra: 300,
          unitPrice: 3750,
          quantity: 1,
          cakeMessage: 'Happy Birthday Aarav',
        },
      ],
      total: 3750,
      subtotal: 3750,
    }),
  );
  const text = buildOrderWhatsAppMessage(order, DEFAULT_SHOP_SETTINGS);
  assert.match(text, /Cocomelon Theme Cake/);
  assert.match(text, /Blueberry/);
  assert.match(text, /Eggless/);
  assert.match(text, /Happy Birthday Aarav/);
  assert.match(text, /Delivery:/);
  assert.match(text, /Balance due: ₹1,500/);
  assert.equal(normalizeIndianPhone('98450 11223'), '919845011223');
  assert.equal(normalizeIndianPhone('+91 98450 11223'), '919845011223');
  assert.equal(normalizeIndianPhone('12345'), null);
  assert.match(whatsappUrl('9845011223', text), /^https:\/\/wa\.me\/919845011223\?text=/);
});

test('kitchen ticket fits the paper width and omits prices', () => {
  const order = baseOrder({
    status: 'baking',
    fulfilment: { type: 'pickup', date: '2026-11-18', time: '17:00' },
    items: [
      {
        key: 'k',
        cakeId: 'SC02',
        cakeName: 'White Forest Cake With A Very Long Name For Wrapping',
        weightKg: 1.5,
        weightLabel: '1.5 kg',
        flavour: null,
        eggless: true,
        basePrice: 1050,
        flavourExtra: 0,
        egglessExtra: 150,
        unitPrice: 1200,
        quantity: 2,
        cakeMessage: 'Happy Birthday Maya',
      },
    ],
  });
  const lines = formatKitchenTicketLines(order, DEFAULT_SHOP_SETTINGS);
  const cols = getColumnsForWidth(DEFAULT_SHOP_SETTINGS.paperWidth);
  for (const line of lines) {
    assert.ok(line.length <= cols, `line too long: ${line}`);
  }
  assert.ok(lines.some((l) => l.includes('KITCHEN')));
  assert.ok(lines.some((l) => l.includes('Happy Birthday Maya')));
  assert.ok(!lines.some((l) => l.includes('₹')));
});
