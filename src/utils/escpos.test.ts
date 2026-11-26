import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chunkBytes,
  encodeEscPosReceipt,
  encodeTestSlip,
  formatReceiptLines,
  getColumnsForWidth,
  getReceiptEncodingWarnings,
  padLeftRight,
} from './escpos';
import type { BillOrder, ShopSettings } from '../types/pos';

const shop58: ShopSettings = {
  shopName: 'Creme & Crumb',
  tagline: 'Artisanal Cakes & Patisserie',
  address: '14 Baker Street, Indiranagar',
  phone: '+91 98450 11223',
  taxId: '29AABCC1234D1Z5',
  taxRate: 5,
  currencySymbol: '₹',
  receiptFooter: 'Keep refrigerated. Enjoy every slice!',
  paperWidth: 58,
  autoPrintOnCheckout: true,
};

const sampleOrder: BillOrder = {
  id: 'ord-1',
  billNumber: 'EC-261117-001',
  createdAt: '2026-11-17T09:15:00.000Z',
  items: [
    {
      key: '1',
      cakeId: 'c1',
      cakeName: 'Belgian Chocolate Truffle',
      weightKg: 1,
      weightLabel: '1 kg',
      flavour: 'Choco Truffle',
      basePrice: 1200,
      flavourExtra: 0,
      egglessExtra: 100,
      unitPrice: 1200,
      quantity: 1,
      eggless: true,
      cakeMessage: 'Happy Birthday Maya',
    },
  ],
  subtotal: 1200,
  discountAmount: 100,
  taxRate: 5,
  taxAmount: 55,
  total: 1155,
  paymentMethod: 'UPI',
  customerName: 'Aarav Sharma',
};

test('padLeftRight fits columns precisely for 58mm (32 cols) and 80mm (48 cols)', () => {
  assert.equal(getColumnsForWidth(58), 32);
  assert.equal(getColumnsForWidth(80), 48);

  const row32 = padLeftRight('GRAND TOTAL', 'Rs.1,155', 32);
  assert.equal(row32.length, 32);
  assert.ok(row32.startsWith('GRAND TOTAL'));
  assert.ok(row32.endsWith('Rs.1,155'));

  const row48 = padLeftRight('Subtotal', 'Rs.1,200', 48);
  assert.equal(row48.length, 48);
});

test('formatReceiptLines produces wrapped 32-col lines including message and totals', () => {
  const lines = formatReceiptLines(sampleOrder, shop58, true);
  assert.ok(lines.some((l) => l.includes('CREME & CRUMB')));
  assert.ok(lines.some((l) => l.includes('EC-261117-001')));
  assert.ok(lines.some((l) => l.includes('Eggless')));
  assert.ok(lines.some((l) => l.includes('Choco Truffle')));
  assert.ok(lines.some((l) => l.includes('Happy Birthday Maya')));
  assert.ok(lines.some((l) => l.includes('TOTAL') && l.includes('Rs.1,155')));
  for (const line of lines) {
    assert.ok(line.length <= 32, `Line exceeded 32 chars: "${line}" (${line.length})`);
  }
});

test('encodeEscPosReceipt starts with ESC @ init, normalizes accents, and ends with partial cut bytes', () => {
  const accentedShop: ShopSettings = { ...shop58, shopName: 'Crème & Crumb' };
  const bytes = encodeEscPosReceipt(sampleOrder, accentedShop);
  assert.equal(bytes[0], 0x1b);
  assert.equal(bytes[1], 0x40);
  const asciiView = Buffer.from(bytes).toString('latin1');
  assert.ok(asciiView.includes('CREME & CRUMB'), `Expected CREME & CRUMB in payload, got ${asciiView.slice(0, 40)}`);
  // Ends with ESC d 4 GS V 66 0
  const tail = Array.from(bytes.slice(-7));
  assert.deepEqual(tail, [0x1b, 0x64, 0x04, 0x1d, 0x56, 0x42, 0x00]);
});

test('encodeTestSlip and chunkBytes split payload safely for BLE MTU', () => {
  const slip = encodeTestSlip(shop58);
  assert.ok(slip.length > 50);
  const chunks = chunkBytes(slip, 64);
  assert.ok(chunks.length >= 2);
  const reassembledLength = chunks.reduce((sum, c) => sum + c.length, 0);
  assert.equal(reassembledLength, slip.length);
});

test('Tamil receipt text is reported instead of silently claimed as printed', () => {
  const tamilShop: ShopSettings = { ...shop58, shopName: 'எசாய் கேக்ஸ்' };
  const warnings = getReceiptEncodingWarnings(sampleOrder, tamilShop);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Tamil|Indic/);
  const asciiWarnings = getReceiptEncodingWarnings(sampleOrder, shop58);
  assert.deepEqual(asciiWarnings, []);
});
