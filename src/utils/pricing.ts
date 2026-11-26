import type { CakeCategory, CakeItem, CartItem } from '../types/pos';

/**
 * Pure pricing and eligibility rules for Esai Cakes.
 *
 * Mirrors the executable business rules in F:\EsaiCakes\app.js:
 * - getCustomWeightOptions
 * - CUSTOM_FLAVOURS / FLAVOUR_CHOICE_CATEGORIES
 * - NO_EGGLESS_CAKE_IDS / NO_EGGLESS_CATEGORIES
 *
 * The README also mentions "Special" and "Premium" flavour-choice categories,
 * but the executable code does not. This implementation follows app.js.
 */

export const EGGLESS_EXTRA_PER_KG = 100;
export const MAX_WEIGHT_KG = 8;
export const FORBIDDEN_HALF_WEIGHTS_KG = [4.5, 5.5, 6.5, 7.5];

export interface FlavourOption {
  name: string;
  extraPerKg: number;
}

export const CUSTOM_FLAVOURS: FlavourOption[] = [
  { name: 'White Forest', extraPerKg: 0 },
  { name: 'Black Forest', extraPerKg: 0 },
  { name: 'Mango', extraPerKg: 0 },
  { name: 'Pineapple', extraPerKg: 0 },
  { name: 'Strawberry', extraPerKg: 0 },
  { name: 'Black Currant', extraPerKg: 0 },
  { name: 'Classic Vanilla', extraPerKg: 0 },
  { name: 'Rasamalai', extraPerKg: 150 },
  { name: 'Blueberry', extraPerKg: 150 },
  { name: 'Butterscotch', extraPerKg: 150 },
  { name: 'Choco Truffle', extraPerKg: 150 },
  { name: 'Honey Almond', extraPerKg: 150 },
];

export const SOURCE_CATEGORY_TO_APP_CATEGORY: Record<string, CakeCategory> = {
  'Special cakes': 'Special Cakes',
  'Trending Cakes': 'Trending Cakes',
  'Chocolate cakes': 'Chocolate Cakes',
  'Fruit Flavors': 'Fruit Flavors',
  'Premium cakes': 'Premium Cakes',
  'Cheese cakes': 'Cheesecakes',
  'Birthday Girl cakes': 'Birthday Girl',
  'Birthday Boy cakes': 'Birthday Boy',
  'Wedding Cakes': 'Wedding Cakes',
  'Special Occasion Cakes': 'Special Occasion',
  'Brownies/Cupcakes': 'Brownies & Cupcakes',
};

/** Executable source list — do not broaden silently. */
export const FLAVOUR_CHOICE_SOURCE_CATEGORIES = new Set<string>([
  'Birthday Girl cakes',
  'Birthday Boy cakes',
  'Wedding Cakes',
  'Special Occasion Cakes',
]);

/** App-facing equivalents for locally created cakes without a source category. */
export const FLAVOUR_CHOICE_APP_CATEGORIES = new Set<CakeCategory>([
  'Birthday Girl',
  'Birthday Boy',
  'Wedding Cakes',
  'Special Occasion',
]);

export const NO_EGGLESS_CAKE_IDS = new Set<string>([
  'SC03', // Red Velvet
  'SC05', // Vancho
  'SC07', // Red Bee
  'SC08', // Kulfi
  'SC13', // Fresh Fruit
  'PR04', // Rainbow
]);

export const NO_EGGLESS_SOURCE_CATEGORY = 'Cheese cakes';
export const NO_EGGLESS_APP_CATEGORY: CakeCategory = 'Cheesecakes';

export function normalizeCakeCategory(sourceCategory: string | undefined): CakeCategory {
  if (sourceCategory && SOURCE_CATEGORY_TO_APP_CATEGORY[sourceCategory]) {
    return SOURCE_CATEGORY_TO_APP_CATEGORY[sourceCategory];
  }
  return 'Special Cakes';
}

export function isEgglessProhibited(cake: Pick<CakeItem, 'id' | 'sourceCategory' | 'category'>): boolean {
  if (NO_EGGLESS_CAKE_IDS.has(cake.id)) return true;
  if (cake.sourceCategory) return cake.sourceCategory === NO_EGGLESS_SOURCE_CATEGORY;
  return cake.category === NO_EGGLESS_APP_CATEGORY;
}

export function cakeOffersEggless(cake: Pick<CakeItem, 'id' | 'sourceCategory' | 'category' | 'egglessAvailable'>): boolean {
  if (isEgglessProhibited(cake)) return false;
  return Boolean(cake.egglessAvailable);
}

export function cakeOffersFlavourChoice(
  cake: Pick<CakeItem, 'sourceCategory' | 'category' | 'flavourChoice'>,
): boolean {
  if (cake.sourceCategory) {
    return FLAVOUR_CHOICE_SOURCE_CATEGORIES.has(cake.sourceCategory);
  }
  return cake.flavourChoice || FLAVOUR_CHOICE_APP_CATEGORIES.has(cake.category);
}

/**
 * Parses a source weight label into kilograms.
 * Handles "0.5 kg", "1kg", "1.5 kg", "500g", "½ kg".
 * Returns null rather than guessing when the string is not a weight.
 */
export function parseWeightKg(label: string): number | null {
  if (!label) return null;
  const normalized = label
    .trim()
    .toLowerCase()
    .replace(/½/g, '0.5')
    .replace(/¼/g, '0.25')
    .replace(/¾/g, '0.75');
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(kg|g)\b/);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return null;
  const kg = match[2] === 'g' ? value / 1000 : value;
  if (!Number.isFinite(kg) || kg <= 0) return null;
  return kg;
}

export function formatKgLabel(kg: number): string {
  if (kg === 0.5) return '½ kg';
  return `${kg} kg`;
}

export function roundToNearestTen(amount: number): number {
  return Math.round(amount / 10) * 10;
}

export interface WeightOption {
  kg: number;
  label: string;
  price: number;
}

type PriceableCake = Pick<CakeItem, 'weights' | 'defaultWeight' | 'numericPrice'>;

interface ValidListedWeight {
  kg: number;
  label: string;
  price: number;
}

function listedWeights(cake: PriceableCake): ValidListedWeight[] {
  const list: ValidListedWeight[] = [];
  const seen = new Set<number>();
  for (const w of cake.weights ?? []) {
    const kg = parseWeightKg(w.weight) ?? parseWeightKg(w.label);
    const price = Number(w.price);
    if (kg == null || kg <= 0 || kg > MAX_WEIGHT_KG || !Number.isFinite(price) || price <= 0) {
      continue;
    }
    const key = Math.round(kg * 1000);
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({ kg, label: w.label?.trim() || formatKgLabel(kg), price });
  }
  return list.sort((a, b) => a.kg - b.kg);
}

/**
 * Weight ladder to 8 kg.
 * - If BOTH 0.5 kg and 1 kg are listed, use their exact prices and price larger
 *   sizes from the listed 1 kg price.
 * - Otherwise the default/listed weight is the minimum, at its exact price,
 *   and larger sizes use that listed rate.
 */
export function getWeightOptions(cake: PriceableCake): WeightOption[] {
  const listed = listedWeights(cake);
  if (listed.length === 0) return [];

  const half = listed.find((w) => Math.round(w.kg * 1000) === 500);
  const one = listed.find((w) => Math.round(w.kg * 1000) === 1000);

  if (half && one) {
    const kgs = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8];
    return kgs.map((kg) => {
      if (kg === 0.5) return { kg, label: half.label, price: half.price };
      if (kg === 1) return { kg, label: one.label, price: one.price };
      return { kg, label: formatKgLabel(kg), price: roundToNearestTen(one.price * kg) };
    });
  }

  const defaultKg = parseWeightKg(cake.defaultWeight);
  const base =
    listed.find((w) => defaultKg != null && Math.round(w.kg * 1000) === Math.round(defaultKg * 1000)) ??
    listed[0];
  const baseKg = base.kg;
  const basePrice = base.price;
  if (!Number.isFinite(basePrice) || basePrice <= 0 || baseKg <= 0) return [];

  const ratePerKg = basePrice / baseKg;
  const stepKg = Number.isInteger(baseKg) ? 1 : 0.5;
  const baseGrams = Math.round(baseKg * 1000);
  const stepGrams = Math.round(stepKg * 1000);
  const options: WeightOption[] = [];

  for (let grams = baseGrams; grams <= MAX_WEIGHT_KG * 1000 + 0.1; grams += stepGrams) {
    const kg = grams / 1000;
    if (FORBIDDEN_HALF_WEIGHTS_KG.includes(kg)) continue;
    const isBase = grams === baseGrams;
    const price = isBase ? basePrice : roundToNearestTen(ratePerKg * kg);
    options.push({
      kg,
      label: isBase ? base.label : formatKgLabel(kg),
      price,
    });
  }
  return options;
}

/** At most two quick actions on a compact row. */
export function getQuickWeightOptions(cake: PriceableCake): WeightOption[] {
  return getWeightOptions(cake).slice(0, 2);
}

export function findWeightOption(cake: PriceableCake, kg: number): WeightOption | null {
  const grams = Math.round(kg * 1000);
  return getWeightOptions(cake).find((o) => Math.round(o.kg * 1000) === grams) ?? null;
}

export function getDefaultWeightOption(cake: PriceableCake): WeightOption | null {
  const options = getWeightOptions(cake);
  if (options.length === 0) return null;
  const defaultKg = parseWeightKg(cake.defaultWeight);
  if (defaultKg != null) {
    const match = options.find((o) => Math.round(o.kg * 1000) === Math.round(defaultKg * 1000));
    if (match) return match;
  }
  return options[0];
}

export interface ConfigureSelection {
  weightKg: number;
  flavour?: string | null;
  eggless?: boolean;
  quantity?: number;
  cakeMessage?: string;
  notes?: string;
}

export interface PriceBreakdown {
  weightKg: number;
  weightLabel: string;
  basePrice: number;
  flavour: string | null;
  flavourExtra: number;
  eggless: boolean;
  egglessExtra: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type PricingResult =
  | { ok: true; pricing: PriceBreakdown }
  | { ok: false; error: string };

export function computeConfiguredPrice(cake: CakeItem, selection: ConfigureSelection): PricingResult {
  const option = findWeightOption(cake, selection.weightKg);
  if (!option) {
    return { ok: false, error: `That weight is not available for ${cake.name}.` };
  }

  const quantity = selection.quantity ?? 1;
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: 'Quantity must be a whole number of at least 1.' };
  }

  const offersFlavour = cakeOffersFlavourChoice(cake);
  let flavour: string | null = null;
  let flavourExtra = 0;

  if (offersFlavour) {
    const requested = selection.flavour?.trim() ?? '';
    if (!requested) {
      return { ok: false, error: 'Choose a flavour to continue.' };
    }
    const match = CUSTOM_FLAVOURS.find((f) => f.name === requested);
    if (!match) {
      return { ok: false, error: `"${requested}" is not an available flavour.` };
    }
    flavour = match.name;
    flavourExtra = Math.round(match.extraPerKg * option.kg);
  }
  // Fixed-flavour cakes ignore any stale flavour input, so a previous custom
  // cake's surcharge can never leak into this line.

  const eggless = Boolean(selection.eggless);
  if (eggless && !cakeOffersEggless(cake)) {
    return { ok: false, error: `Eggless is not available for ${cake.name}.` };
  }
  const egglessExtra = eggless ? Math.round(EGGLESS_EXTRA_PER_KG * option.kg) : 0;

  const unitPrice = option.price + flavourExtra + egglessExtra;
  return {
    ok: true,
    pricing: {
      weightKg: option.kg,
      weightLabel: option.label,
      basePrice: option.price,
      flavour,
      flavourExtra,
      eggless,
      egglessExtra,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    },
  };
}

/** Stable identity for merging only truly identical configurations. */
export function buildCartKey(
  cake: Pick<CakeItem, 'id'>,
  pricing: PriceBreakdown,
  cakeMessage?: string,
  notes?: string,
): string {
  return JSON.stringify([
    cake.id,
    Math.round(pricing.weightKg * 1000),
    pricing.flavour,
    pricing.eggless,
    pricing.basePrice,
    pricing.flavourExtra,
    pricing.egglessExtra,
    pricing.unitPrice,
    (cakeMessage ?? '').trim(),
    (notes ?? '').trim(),
  ]);
}

export function toCartItem(
  cake: CakeItem,
  pricing: PriceBreakdown,
  cakeMessage?: string,
  notes?: string,
): CartItem {
  const message = cakeMessage?.trim() || undefined;
  const cleanNotes = notes?.trim() || undefined;
  return {
    key: buildCartKey(cake, pricing, message, cleanNotes),
    cakeId: cake.id,
    cakeName: cake.name,
    sku: cake.sku,
    imageUrl: cake.imageUrl,
    weightKg: pricing.weightKg,
    weightLabel: pricing.weightLabel,
    flavour: pricing.flavour,
    eggless: pricing.eggless,
    basePrice: pricing.basePrice,
    flavourExtra: pricing.flavourExtra,
    egglessExtra: pricing.egglessExtra,
    unitPrice: pricing.unitPrice,
    quantity: pricing.quantity,
    cakeMessage: message,
    notes: cleanNotes,
  };
}

/** Legacy (v1) items keep their frozen totals and display from old fields. */
export function cartItemWeightLabel(item: CartItem): string {
  if (item.weightLabel) return item.weightLabel;
  if (item.variantLabel) return item.variantLabel;
  if (item.weightKg > 0) return formatKgLabel(item.weightKg);
  return '—';
}

export function describeCartItem(item: CartItem): string {
  const parts = [cartItemWeightLabel(item)];
  if (item.flavour) parts.push(item.flavour);
  if (item.eggless) parts.push('Eggless');
  if (item.legacy) parts.push('Legacy');
  return parts.join(' · ');
}
