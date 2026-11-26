import type {
  ActiveBillState,
  BillOrder,
  CakeCategory,
  CakeItem,
  CartItem,
  PaymentMethod,
  RememberedPrinter,
  ShopSettings,
} from '../types/pos';
import { CAKE_CATEGORIES } from '../types/pos';
import { buildCatalogFromSource } from '../data/catalog';
import { DEFAULT_SHOP_SETTINGS } from '../data/seedData';
import {
  CATALOG_SOURCE_COUNT,
  CATALOG_SOURCE_PATH,
  CATALOG_SOURCE_VERSION,
  SOURCE_CAKES,
} from '../data/catalog.generated';
import { normalizeOrderFinancials } from './orders';
import {
  cakeOffersEggless,
  cakeOffersFlavourChoice,
  isEgglessProhibited,
  normalizeCakeCategory,
  parseWeightKg,
} from './pricing';

/** v1 keys shipped by the earlier POS build. Read once, then backed up. */
export const STORAGE_KEYS_V1 = {
  CAKES: 'crumbpos_cakes_v1',
  ORDERS: 'crumbpos_orders_v1',
  SETTINGS: 'crumbpos_settings_v1',
  SIM_PRINTER: 'crumbpos_sim_printer_v1',
} as const;

/** v2 keys. Every write is versioned and independent of the v1 keys. */
export const STORAGE_KEYS_V2 = {
  META: 'crumbpos_meta_v2',
  CAKES: 'crumbpos_cakes_v2',
  ORDERS: 'crumbpos_orders_v2',
  SETTINGS: 'crumbpos_settings_v2',
  ACTIVE_BILL: 'crumbpos_active_bill_v2',
  REMEMBERED_PRINTER: 'crumbpos_remembered_printer_v2',
  PAYMENT_PREF: 'crumbpos_payment_pref_v2',
} as const;

export const SCHEMA_VERSION = 2;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface StorageMeta {
  version: number;
  migratedAt: string;
  catalogSourceVersion: string;
  catalogSourcePath: string;
  catalogCount: number;
  liveCatalogVerified: boolean;
  backupKeys: string[];
  warnings: string[];
}

export interface MigrationReport {
  migrated: boolean;
  warnings: string[];
  backupKeys: string[];
}

const SOURCE_BY_ID = new Map(SOURCE_CAKES.map((c) => [c.id, c]));

function safeParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function isCakeCategory(value: unknown): value is CakeCategory {
  return typeof value === 'string' && (CAKE_CATEGORIES as string[]).includes(value);
}

/** Legacy v1 line. Only used while importing, never rewritten in new bills. */
interface LegacyCartItem {
  key?: unknown;
  cakeId?: unknown;
  cakeName?: unknown;
  variantId?: unknown;
  variantLabel?: unknown;
  unitPrice?: unknown;
  quantity?: unknown;
  eggless?: unknown;
  cakeMessage?: unknown;
}

function adaptLegacyCartItem(raw: unknown): CartItem | null {
  if (!isRecord(raw)) return null;
  const legacy = raw as LegacyCartItem;
  const unitPrice = asFiniteNumber(legacy.unitPrice);
  const quantity = asFiniteNumber(legacy.quantity);
  if (unitPrice == null || quantity == null || quantity <= 0) return null;
  const cakeId = asString(legacy.cakeId);
  const cakeName = asString(legacy.cakeName);
  if (!cakeId || !cakeName) return null;
  const variantLabel = asString(legacy.variantLabel);
  return {
    key: asString(legacy.key, `legacy-${cakeId}-${Date.now()}-${Math.random()}`),
    cakeId,
    cakeName,
    sku: cakeId,
    weightKg: parseWeightKg(variantLabel) ?? 0,
    weightLabel: variantLabel || '—',
    flavour: null,
    eggless: legacy.eggless === true,
    basePrice: unitPrice,
    flavourExtra: 0,
    egglessExtra: 0,
    unitPrice,
    quantity: Math.max(1, Math.round(quantity)),
    cakeMessage: asString(legacy.cakeMessage) || undefined,
    legacy: true,
    variantId: asString(legacy.variantId) || undefined,
    variantLabel: variantLabel || undefined,
  };
}

/** Import a v1 bill without touching its frozen totals or bill number. */
function adaptLegacyOrder(raw: unknown): BillOrder | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw.id);
  const billNumber = asString(raw.billNumber);
  const createdAt = asString(raw.createdAt);
  const total = asFiniteNumber(raw.total);
  if (!id || !billNumber || !createdAt || total == null) return null;

  const items = Array.isArray(raw.items)
    ? raw.items.map(adaptLegacyCartItem).filter((item): item is CartItem => item !== null)
    : [];

  const paymentMethod: PaymentMethod =
    raw.paymentMethod === 'Cash' || raw.paymentMethod === 'Card' || raw.paymentMethod === 'UPI'
      ? raw.paymentMethod
      : 'Cash';

  const printedAt = asString(raw.printedAt) || undefined;
  const printMode =
    raw.printMode === 'bluetooth' || raw.printMode === 'simulated' || raw.printMode === 'browser'
      ? raw.printMode
      : undefined;

  return {
    id,
    billNumber,
    createdAt,
    items,
    subtotal: asFiniteNumber(raw.subtotal) ?? total,
    discountAmount: asFiniteNumber(raw.discountAmount) ?? 0,
    taxRate: asFiniteNumber(raw.taxRate) ?? 0,
    taxAmount: asFiniteNumber(raw.taxAmount) ?? 0,
    total,
    paymentMethod,
    customerName: asString(raw.customerName) || undefined,
    customerPhone: asString(raw.customerPhone) || undefined,
    orderNote: asString(raw.orderNote) || undefined,
    printedAt,
    printMode,
    printState: printedAt ? 'sent' : undefined,
    status: 'completed',
    fulfilment: null,
    payments: [{ amount: total, method: paymentMethod, at: createdAt, kind: 'full' }],
    advancePaid: total,
    balanceDue: 0,
    // The v1 app generated demo bills with `seed-` ids. Keep them visible as
    // history but never mix them into real revenue reporting.
    isDemo: id.startsWith('seed-'),
    version: 2,
  };
}

function adaptLegacyVariants(raw: Record<string, unknown>): CakeItem['weights'] {
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const weights: CakeItem['weights'] = [];
  for (const variant of variants) {
    if (!isRecord(variant)) continue;
    const label = asString(variant.label);
    const price = asFiniteNumber(variant.price);
    if (!label || price == null || price <= 0) continue;
    weights.push({ weight: label, label, price });
  }
  return weights;
}

/**
 * Import a v1 cake. Source-derived products are restored to their verified
 * category/eligibility/image; user-created cakes keep their editable fields.
 */
function adaptLegacyCake(raw: unknown): CakeItem | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw.id);
  const name = asString(raw.name);
  if (!id || !name) return null;

  const source = SOURCE_BY_ID.get(id);
  const category = source
    ? normalizeCakeCategory(source.sourceCategory)
    : isCakeCategory(raw.category)
      ? raw.category
      : 'Special Cakes';

  // Preserve any local price edits: the v1 variants are authoritative for
  // pricing. Source weights are only a fallback when the old list is unusable.
  const legacyWeights = adaptLegacyVariants(raw);
  const weights =
    legacyWeights.length > 0
      ? legacyWeights
      : (source?.weights ?? []).map((w) => ({
          weight: w.weight,
          label: w.label,
          price: w.price,
          displayPrice: w.displayPrice,
        }));

  const defaultWeight =
    asString(raw.defaultWeight) || source?.defaultWeight || weights[0]?.weight || '1 kg';

  const numericPrice =
    weights.find((w) => Math.round((parseWeightKg(w.weight) ?? 0) * 1000) === 1000)?.price ??
    source?.numericPrice ??
    weights[0]?.price ??
    0;

  const base: CakeItem = {
    id,
    name,
    category,
    sourceCategory: source?.sourceCategory,
    description: asString(raw.description),
    imageUrl: source ? `/cakes/${source.id}.jpg` : asString(raw.imageUrl) || undefined,
    fallbackImageUrl: '/cakes/fallback.png',
    egglessAvailable: raw.egglessAvailable !== false,
    flavourChoice: false,
    inStock: raw.inStock !== false,
    sku: asString(raw.sku, id),
    createdAt: asString(raw.createdAt, new Date().toISOString()),
    numericPrice,
    defaultWeight,
    weights,
  };

  base.egglessAvailable = isEgglessProhibited(base)
    ? false
    : cakeOffersEggless({ ...base, egglessAvailable: base.egglessAvailable });
  base.flavourChoice = cakeOffersFlavourChoice(base);
  return base;
}

export function adaptSettings(raw: unknown): ShopSettings {
  if (!isRecord(raw)) return { ...DEFAULT_SHOP_SETTINGS };
  const taxRate = asFiniteNumber(raw.taxRate);
  return {
    ...DEFAULT_SHOP_SETTINGS,
    shopName: asString(raw.shopName, DEFAULT_SHOP_SETTINGS.shopName) || DEFAULT_SHOP_SETTINGS.shopName,
    tagline: asString(raw.tagline, DEFAULT_SHOP_SETTINGS.tagline),
    address: asString(raw.address, DEFAULT_SHOP_SETTINGS.address),
    phone: asString(raw.phone, DEFAULT_SHOP_SETTINGS.phone),
    taxId: asString(raw.taxId, DEFAULT_SHOP_SETTINGS.taxId),
    upiId: asString(raw.upiId, DEFAULT_SHOP_SETTINGS.upiId ?? ''),
    taxRate: taxRate == null ? DEFAULT_SHOP_SETTINGS.taxRate : Math.min(100, Math.max(0, taxRate)),
    currencySymbol: asString(raw.currencySymbol, DEFAULT_SHOP_SETTINGS.currencySymbol) || '₹',
    receiptFooter: asString(raw.receiptFooter, DEFAULT_SHOP_SETTINGS.receiptFooter),
    paperWidth: raw.paperWidth === 80 ? 80 : 58,
    autoPrintOnCheckout:
      typeof raw.autoPrintOnCheckout === 'boolean'
        ? raw.autoPrintOnCheckout
        : DEFAULT_SHOP_SETTINGS.autoPrintOnCheckout,
  };
}

export function migrateLegacyCakes(raw: unknown): CakeItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(adaptLegacyCake).filter((cake): cake is CakeItem => cake !== null);
}

export function migrateLegacyOrders(raw: unknown): BillOrder[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(adaptLegacyOrder).filter((order): order is BillOrder => order !== null);
}

export interface LoadedState {
  cakes: CakeItem[];
  orders: BillOrder[];
  settings: ShopSettings;
  activeBill: ActiveBillState | null;
  rememberedPrinter: RememberedPrinter | null;
  meta: StorageMeta;
  report: MigrationReport;
}

function readMeta(storage: StorageLike): StorageMeta | null {
  const raw = safeParse(storage.getItem(STORAGE_KEYS_V2.META));
  if (!isRecord(raw) || raw.version !== SCHEMA_VERSION) return null;
  return {
    version: SCHEMA_VERSION,
    migratedAt: asString(raw.migratedAt),
    catalogSourceVersion: asString(raw.catalogSourceVersion, CATALOG_SOURCE_VERSION),
    catalogSourcePath: asString(raw.catalogSourcePath, CATALOG_SOURCE_PATH),
    catalogCount: asFiniteNumber(raw.catalogCount) ?? CATALOG_SOURCE_COUNT,
    liveCatalogVerified: raw.liveCatalogVerified === true,
    backupKeys: Array.isArray(raw.backupKeys)
      ? raw.backupKeys.filter((k): k is string => typeof k === 'string')
      : [],
    warnings: Array.isArray(raw.warnings)
      ? raw.warnings.filter((w): w is string => typeof w === 'string')
      : [],
  };
}

function writeJson(storage: StorageLike, key: string, value: unknown): string | null {
  try {
    storage.setItem(key, JSON.stringify(value));
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Storage write failed.';
  }
}

function backupLegacyKeys(storage: StorageLike, warnings: string[]): string[] {
  const backupKeys: string[] = [];
  for (const key of Object.values(STORAGE_KEYS_V1)) {
    const raw = storage.getItem(key);
    if (raw == null) continue;
    const backupKey = `crumbpos_backup_v1__${key}`;
    try {
      storage.setItem(backupKey, raw);
      backupKeys.push(backupKey);
    } catch {
      warnings.push(`Could not back up ${key}; it was left untouched.`);
    }
  }
  return backupKeys;
}

function validateActiveBill(raw: unknown): ActiveBillState | null {
  if (!isRecord(raw) || !Array.isArray(raw.cart)) return null;
  const cart: CartItem[] = [];
  for (const item of raw.cart) {
    if (!isRecord(item)) continue;
    const unitPrice = asFiniteNumber(item.unitPrice);
    const quantity = asFiniteNumber(item.quantity);
    const weightKg = asFiniteNumber(item.weightKg);
    if (
      unitPrice == null ||
      quantity == null ||
      quantity <= 0 ||
      weightKg == null ||
      weightKg <= 0 ||
      typeof item.cakeId !== 'string' ||
      typeof item.cakeName !== 'string'
    ) {
      continue;
    }
    cart.push({
      key: asString(item.key, JSON.stringify([item.cakeId, item.weightKg, item.flavour, item.eggless])),
      cakeId: item.cakeId,
      cakeName: item.cakeName,
      sku: asString(item.sku) || undefined,
      imageUrl: asString(item.imageUrl) || undefined,
      weightKg,
      weightLabel: asString(item.weightLabel, `${weightKg} kg`),
      flavour: asString(item.flavour) || null,
      eggless: item.eggless === true,
      basePrice: asFiniteNumber(item.basePrice) ?? unitPrice,
      flavourExtra: asFiniteNumber(item.flavourExtra) ?? 0,
      egglessExtra: asFiniteNumber(item.egglessExtra) ?? 0,
      unitPrice,
      quantity: Math.max(1, Math.round(quantity)),
      cakeMessage: asString(item.cakeMessage) || undefined,
      notes: asString(item.notes) || undefined,
    });
  }
  const paymentMethod: PaymentMethod =
    raw.paymentMethod === 'Cash' || raw.paymentMethod === 'Card' || raw.paymentMethod === 'UPI'
      ? raw.paymentMethod
      : 'Cash';
  return {
    cart,
    discountAmount: asFiniteNumber(raw.discountAmount) ?? 0,
    paymentMethod,
    customerName: asString(raw.customerName),
    customerPhone: asString(raw.customerPhone),
    orderNote: asString(raw.orderNote),
    updatedAt: asString(raw.updatedAt, new Date().toISOString()),
    scheduleMode: raw.scheduleMode === 'schedule' ? 'schedule' : 'now',
    fulfilmentType: raw.fulfilmentType === 'delivery' ? 'delivery' : 'pickup',
    fulfilmentDate: asString(raw.fulfilmentDate),
    fulfilmentTime: asString(raw.fulfilmentTime),
    deliveryAddress: asString(raw.deliveryAddress),
    advanceAmount: asFiniteNumber(raw.advanceAmount) ?? 0,
  };
}

function validateRememberedPrinter(raw: unknown): RememberedPrinter | null {
  if (!isRecord(raw)) return null;
  if (
    raw.mode !== 'native-ble' &&
    raw.mode !== 'native-classic' &&
    raw.mode !== 'web-bluetooth'
  ) {
    return null;
  }
  if (typeof raw.deviceId !== 'string' || !raw.deviceId) return null;
  return {
    mode: raw.mode,
    transport:
      raw.transport === 'ble' ||
      raw.transport === 'classic' ||
      raw.transport === 'web-ble'
        ? raw.transport
        : raw.mode === 'native-classic'
          ? 'classic'
          : raw.mode === 'web-bluetooth'
            ? 'web-ble'
            : 'ble',
    deviceId: raw.deviceId,
    deviceName: asString(raw.deviceName, 'Bluetooth printer'),
  };
}

/**
 * Load v2 state. On first run of v2:
 * 1. back up every v1 key verbatim,
 * 2. import v1 cakes/orders/settings without touching old totals,
 * 3. write the v2 snapshot and a migration report.
 */
export function loadOrMigrateState(storage: StorageLike): LoadedState {
  const existingMeta = readMeta(storage);
  const report: MigrationReport = { migrated: false, warnings: [], backupKeys: [] };

  if (existingMeta) {
    let cakes = safeParse(storage.getItem(STORAGE_KEYS_V2.CAKES));
    let orders = safeParse(storage.getItem(STORAGE_KEYS_V2.ORDERS));
    let settings = safeParse(storage.getItem(STORAGE_KEYS_V2.SETTINGS));

    let cakeList = Array.isArray(cakes) ? (cakes as CakeItem[]) : [];
    if (cakeList.length === 0) {
      cakeList = buildCatalogFromSource();
      writeJson(storage, STORAGE_KEYS_V2.CAKES, cakeList);
    }
    let orderList = Array.isArray(orders) ? (orders as BillOrder[]) : [];
    // Backfill the demo marker and scheduling/financial fields for snapshots
    // written before those existed.
    let demoChanged = false;
    orderList = orderList.map((order) => {
      let next = order;
      if (!next.isDemo && typeof next.id === 'string' && next.id.startsWith('seed-')) {
        demoChanged = true;
        next = { ...next, isDemo: true };
      }
      const normalized = normalizeOrderFinancials(next);
      if (normalized !== next) {
        demoChanged = true;
        next = normalized;
      }
      return next;
    });
    if (demoChanged) {
      writeJson(storage, STORAGE_KEYS_V2.ORDERS, orderList);
    }
    let settingsValue = adaptSettings(settings);
    if (!isRecord(settings)) {
      writeJson(storage, STORAGE_KEYS_V2.SETTINGS, settingsValue);
    }

    return {
      cakes: cakeList,
      orders: orderList,
      settings: settingsValue,
      activeBill: validateActiveBill(safeParse(storage.getItem(STORAGE_KEYS_V2.ACTIVE_BILL))),
      rememberedPrinter: validateRememberedPrinter(
        safeParse(storage.getItem(STORAGE_KEYS_V2.REMEMBERED_PRINTER)),
      ),
      meta: existingMeta,
      report,
    };
  }

  const warnings: string[] = [];
  const backupKeys = backupLegacyKeys(storage, warnings);

  const legacyCakesRaw = safeParse(storage.getItem(STORAGE_KEYS_V1.CAKES));
  const legacyOrdersRaw = safeParse(storage.getItem(STORAGE_KEYS_V1.ORDERS));
  const legacySettingsRaw = safeParse(storage.getItem(STORAGE_KEYS_V1.SETTINGS));

  let cakes = migrateLegacyCakes(legacyCakesRaw);
  if (cakes.length === 0) {
    cakes = buildCatalogFromSource();
    if (legacyCakesRaw != null) {
      warnings.push('Existing cake catalog could not be read; replaced from the verified source snapshot.');
    }
  }

  const orders = migrateLegacyOrders(legacyOrdersRaw);
  if (legacyOrdersRaw != null && orders.length === 0 && Array.isArray(legacyOrdersRaw) && legacyOrdersRaw.length > 0) {
    warnings.push('Existing bills could not be read; they were left untouched in the v1 backup.');
  }

  const settings = adaptSettings(legacySettingsRaw);
  const meta: StorageMeta = {
    version: SCHEMA_VERSION,
    migratedAt: new Date().toISOString(),
    catalogSourceVersion: CATALOG_SOURCE_VERSION,
    catalogSourcePath: CATALOG_SOURCE_PATH,
    catalogCount: cakes.length,
    liveCatalogVerified: false,
    backupKeys,
    warnings,
  };

  const writeErrors: string[] = [];
  for (const [key, value] of [
    [STORAGE_KEYS_V2.CAKES, cakes],
    [STORAGE_KEYS_V2.ORDERS, orders],
    [STORAGE_KEYS_V2.SETTINGS, settings],
    [STORAGE_KEYS_V2.META, meta],
  ] as const) {
    const err = writeJson(storage, key, value);
    if (err) writeErrors.push(`${key}: ${err}`);
  }
  if (writeErrors.length > 0) {
    warnings.push(...writeErrors);
  }

  return {
    cakes,
    orders,
    settings,
    activeBill: null,
    rememberedPrinter: null,
    meta: { ...meta, warnings },
    report: { migrated: true, warnings, backupKeys },
  };
}

export function saveOrders(storage: StorageLike, orders: BillOrder[]): { ok: boolean; error?: string } {
  const err = writeJson(storage, STORAGE_KEYS_V2.ORDERS, orders);
  return err ? { ok: false, error: err } : { ok: true };
}

export function saveCakes(storage: StorageLike, cakes: CakeItem[]): { ok: boolean; error?: string } {
  const err = writeJson(storage, STORAGE_KEYS_V2.CAKES, cakes);
  return err ? { ok: false, error: err } : { ok: true };
}

export function saveSettings(storage: StorageLike, settings: ShopSettings): { ok: boolean; error?: string } {
  const err = writeJson(storage, STORAGE_KEYS_V2.SETTINGS, settings);
  return err ? { ok: false, error: err } : { ok: true };
}

export function saveActiveBill(storage: StorageLike, active: ActiveBillState): { ok: boolean; error?: string } {
  const err = writeJson(storage, STORAGE_KEYS_V2.ACTIVE_BILL, active);
  return err ? { ok: false, error: err } : { ok: true };
}

export function clearActiveBill(storage: StorageLike): void {
  try {
    storage.removeItem(STORAGE_KEYS_V2.ACTIVE_BILL);
  } catch {
    // Best-effort cleanup only.
  }
}

export function saveRememberedPrinter(
  storage: StorageLike,
  remembered: RememberedPrinter | null,
): void {
  try {
    if (remembered) {
      storage.setItem(STORAGE_KEYS_V2.REMEMBERED_PRINTER, JSON.stringify(remembered));
    } else {
      storage.removeItem(STORAGE_KEYS_V2.REMEMBERED_PRINTER);
    }
  } catch {
    // Printer preference can be re-entered; do not block printing.
  }
}

export function savePaymentPreference(storage: StorageLike, method: PaymentMethod): void {
  try {
    storage.setItem(STORAGE_KEYS_V2.PAYMENT_PREF, JSON.stringify(method));
  } catch {
    // Preference only.
  }
}

export function readPaymentPreference(storage: StorageLike): PaymentMethod {
  const raw = safeParse(storage.getItem(STORAGE_KEYS_V2.PAYMENT_PREF));
  return raw === 'Cash' || raw === 'Card' || raw === 'UPI' ? raw : 'Cash';
}

export function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** In-memory fallback so the counter still works if localStorage is blocked. */
export function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}
