import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogFromSource } from '../data/catalog';
import { SOURCE_CAKES } from '../data/catalog.generated';
import type { CakeItem, CartItem } from '../types/pos';
import { calculateBillTotals } from './billing';
import {
  buildCartKey,
  cakeOffersEggless,
  cakeOffersFlavourChoice,
  computeConfiguredPrice,
  findWeightOption,
  getQuickWeightOptions,
  getWeightOptions,
  normalizeCakeCategory,
  parseWeightKg,
  toCartItem,
} from './pricing';

const CATALOG = buildCatalogFromSource();
const byId = (id: string): CakeItem => {
  const cake = CATALOG.find((c) => c.id === id);
  if (!cake) throw new Error(`Missing fixture ${id}`);
  return cake;
};

test('catalog imports all 215 verified products with normalized categories', () => {
  assert.equal(CATALOG.length, 215);
  assert.equal(SOURCE_CAKES.length, 215);
  const count = (cat: string) => CATALOG.filter((c) => c.category === cat).length;
  assert.equal(count('Special Cakes'), 14);
  assert.equal(count('Trending Cakes'), 5);
  assert.equal(count('Chocolate Cakes'), 12);
  assert.equal(count('Fruit Flavors'), 4);
  assert.equal(count('Premium Cakes'), 4);
  assert.equal(count('Cheesecakes'), 4);
  assert.equal(count('Birthday Girl'), 71);
  assert.equal(count('Birthday Boy'), 55);
  assert.equal(count('Wedding Cakes'), 32);
  assert.equal(count('Special Occasion'), 9);
  assert.equal(count('Brownies & Cupcakes'), 5);
  assert.equal(normalizeCakeCategory('Cheese cakes'), 'Cheesecakes');
  assert.equal(normalizeCakeCategory('Brownies/Cupcakes'), 'Brownies & Cupcakes');
});

test('SC02 White Forest keeps exact listed half/one-kg prices and supports 1.5 kg', () => {
  const sc02 = byId('SC02');
  const options = getWeightOptions(sc02);
  assert.equal(options.find((o) => o.kg === 0.5)?.price, 400);
  assert.equal(options.find((o) => o.kg === 1)?.price, 700);
  assert.equal(options.find((o) => o.kg === 1.5)?.price, 1050);

  const regular = computeConfiguredPrice(sc02, { weightKg: 1.5 });
  assert.equal(regular.ok, true);
  if (regular.ok) {
    assert.equal(regular.pricing.basePrice, 1050);
    assert.equal(regular.pricing.unitPrice, 1050);
  }

  const eggless = computeConfiguredPrice(sc02, { weightKg: 0.5, eggless: true });
  assert.equal(eggless.ok, true);
  if (eggless.ok) {
    assert.equal(eggless.pricing.basePrice, 400);
    assert.equal(eggless.pricing.egglessExtra, 50);
    assert.equal(eggless.pricing.unitPrice, 450);
  }
});

test('SC14 Butterscotch 1.5 kg follows the 1 kg rate rounded to Rs.10', () => {
  const sc14 = byId('SC14');
  const result = computeConfiguredPrice(sc14, { weightKg: 1.5 });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.pricing.basePrice, 1340);
    assert.equal(result.pricing.unitPrice, 1340);
  }
});

test('CH02 has a 1.5 kg minimum and 2.5 kg priced at Rs.2,500', () => {
  const ch02 = byId('CH02');
  const options = getWeightOptions(ch02);
  assert.equal(options[0].kg, 1.5);
  assert.equal(options[0].price, 1500);
  assert.equal(findWeightOption(ch02, 1), null);
  const twoAndHalf = computeConfiguredPrice(ch02, { weightKg: 2.5 });
  assert.equal(twoAndHalf.ok, true);
  if (twoAndHalf.ok) assert.equal(twoAndHalf.pricing.basePrice, 2500);
  assert.ok(!options.some((o) => o.kg === 4.5 || o.kg === 5.5 || o.kg === 6.5 || o.kg === 7.5));
});

test('BB01 Cocomelon starts at 2 kg and 3 kg Blueberry eggless totals Rs.3,750', () => {
  const bb01 = byId('BB01');
  const options = getWeightOptions(bb01);
  assert.equal(options[0].kg, 2);
  assert.equal(options[0].price, 2000);
  assert.ok(!options.some((o) => o.kg === 2.5));
  assert.equal(cakeOffersFlavourChoice(bb01), true);

  const result = computeConfiguredPrice(bb01, {
    weightKg: 3,
    flavour: 'Blueberry',
    eggless: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.pricing.basePrice, 3000);
    assert.equal(result.pricing.flavourExtra, 450);
    assert.equal(result.pricing.egglessExtra, 300);
    assert.equal(result.pricing.unitPrice, 3750);
    assert.equal(result.pricing.lineTotal, 3750);
  }
});

test('WC01 Wedding Cake fixtures for 2, 3 and 8 kg', () => {
  const wc01 = byId('WC01');
  assert.equal(findWeightOption(wc01, 2)?.price, 1800);

  const three = computeConfiguredPrice(wc01, { weightKg: 3, flavour: 'Blueberry', eggless: true });
  assert.equal(three.ok, true);
  if (three.ok) assert.equal(three.pricing.unitPrice, 3450);

  const eight = computeConfiguredPrice(wc01, { weightKg: 8, flavour: 'Blueberry', eggless: true });
  assert.equal(eight.ok, true);
  if (eight.ok) {
    assert.equal(eight.pricing.basePrice, 7200);
    assert.equal(eight.pricing.flavourExtra, 1200);
    assert.equal(eight.pricing.egglessExtra, 800);
    assert.equal(eight.pricing.unitPrice, 9200);
  }
});

test('SC03 Red Velvet rejects eggless and cheesecakes prohibit eggless', () => {
  const sc03 = byId('SC03');
  assert.equal(cakeOffersEggless(sc03), false);
  const prohibited = computeConfiguredPrice(sc03, { weightKg: 0.5, eggless: true });
  assert.equal(prohibited.ok, false);

  for (const cheese of CATALOG.filter((c) => c.category === 'Cheesecakes')) {
    assert.equal(cakeOffersEggless(cheese), false, cheese.id);
  }
  // The IDs listed by the source are also prohibited even if category differs.
  for (const id of ['SC05', 'SC07', 'SC08', 'SC13', 'PR04']) {
    assert.equal(cakeOffersEggless(byId(id)), false, id);
  }
});

test('weights reject below minimum, above 8 kg and forbidden half sizes', () => {
  const bb01 = byId('BB01');
  assert.equal(findWeightOption(bb01, 1.5), null);
  assert.equal(findWeightOption(bb01, 4.5), null);
  assert.equal(findWeightOption(bb01, 8.5), null);
  assert.equal(computeConfiguredPrice(bb01, { weightKg: 9 }).ok, false);
  assert.equal(computeConfiguredPrice(bb01, { weightKg: 1 }).ok, false);

  const sc02 = byId('SC02');
  assert.equal(findWeightOption(sc02, 0.5)?.price, 400);
  assert.equal(findWeightOption(sc02, 4.5), null);
  assert.equal(findWeightOption(sc02, 7.5), null);
});

test('fixed-flavour cakes never inherit a previous custom flavour surcharge', () => {
  const sc02 = byId('SC02');
  assert.equal(cakeOffersFlavourChoice(sc02), false);
  const result = computeConfiguredPrice(sc02, {
    weightKg: 1,
    flavour: 'Blueberry',
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.pricing.flavour, null);
    assert.equal(result.pricing.flavourExtra, 0);
    assert.equal(result.pricing.unitPrice, 700);
  }
});

test('flavour-choice cakes require an explicit valid flavour', () => {
  const bb01 = byId('BB01');
  const missing = computeConfiguredPrice(bb01, { weightKg: 2 });
  assert.equal(missing.ok, false);
  const invalid = computeConfiguredPrice(bb01, { weightKg: 2, flavour: 'Pistachio' });
  assert.equal(invalid.ok, false);
  const free = computeConfiguredPrice(bb01, { weightKg: 2, flavour: 'Black Forest' });
  assert.equal(free.ok, true);
  if (free.ok) assert.equal(free.pricing.flavourExtra, 0);
});

test('missing or zero prices never become free products', () => {
  const broken: CakeItem = {
    ...byId('SC02'),
    id: 'BROKEN',
    sourceCategory: undefined,
    weights: [{ weight: '1 kg', label: '1 kg', price: 0 }],
  };
  assert.deepEqual(getWeightOptions(broken), []);

  const empty: CakeItem = { ...broken, weights: [] };
  assert.deepEqual(getWeightOptions(empty), []);
  assert.equal(computeConfiguredPrice(empty, { weightKg: 1 }).ok, false);
});

test('quantity multiplies the final unit price without re-rounding', () => {
  const bb01 = byId('BB01');
  const result = computeConfiguredPrice(bb01, {
    weightKg: 3,
    flavour: 'Blueberry',
    eggless: true,
    quantity: 2,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.pricing.unitPrice, 3750);
    assert.equal(result.pricing.lineTotal, 7500);
  }
});

test('cart keys merge identical configurations only, including messages and notes', () => {
  const bb01 = byId('BB01');
  const pricing = computeConfiguredPrice(bb01, {
    weightKg: 3,
    flavour: 'Blueberry',
    eggless: true,
  });
  assert.equal(pricing.ok, true);
  if (!pricing.ok) return;

  const a = toCartItem(bb01, pricing.pricing, 'Happy Birthday', 'Box');
  const b = toCartItem(bb01, pricing.pricing, 'Happy Birthday', 'Box');
  const c = toCartItem(bb01, pricing.pricing, 'Happy Anniversary', 'Box');
  const d = toCartItem(bb01, pricing.pricing, 'Happy Birthday', 'No box');
  assert.equal(a.key, b.key);
  assert.notEqual(a.key, c.key);
  assert.notEqual(a.key, d.key);
  assert.equal(buildCartKey(bb01, pricing.pricing, 'Happy Birthday', 'Box'), a.key);
});

test('quick weight actions stay at two and respect each minimum', () => {
  assert.deepEqual(getQuickWeightOptions(byId('SC02')).map((o) => o.kg), [0.5, 1]);
  assert.deepEqual(getQuickWeightOptions(byId('BB01')).map((o) => o.kg), [2, 3]);
  assert.deepEqual(getQuickWeightOptions(byId('CH02')).map((o) => o.kg), [1.5, 2]);
});

test('parseWeightKg handles source labels and legacy 500g labels', () => {
  assert.equal(parseWeightKg('0.5 kg'), 0.5);
  assert.equal(parseWeightKg('½ kg'), 0.5);
  assert.equal(parseWeightKg('500g'), 0.5);
  assert.equal(parseWeightKg('1.5 kg'), 1.5);
  assert.equal(parseWeightKg('2kg'), 2);
  assert.equal(parseWeightKg('piece'), null);
});

test('SC05 single 1 kg minimum uses whole-kg steps only', () => {
  const sc05 = byId('SC05');
  const options = getWeightOptions(sc05);
  assert.deepEqual(
    options.map((o) => o.kg),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
});

test('bill totals apply discount and tax after configured line totals', () => {
  const bb01 = byId('BB01');
  const priced = computeConfiguredPrice(bb01, {
    weightKg: 3,
    flavour: 'Blueberry',
    eggless: true,
  });
  assert.equal(priced.ok, true);
  if (!priced.ok) return;
  const line: CartItem = toCartItem(bb01, priced.pricing);
  const totals = calculateBillTotals([line], 250, 5);
  assert.equal(totals.subtotal, 3750);
  assert.equal(totals.discountAmount, 250);
  assert.equal(totals.taxableAmount, 3500);
  assert.equal(totals.taxAmount, 175);
  assert.equal(totals.total, 3675);
});
