export type CakeCategory =
  | 'Special Cakes'
  | 'Trending Cakes'
  | 'Chocolate Cakes'
  | 'Fruit Flavors'
  | 'Premium Cakes'
  | 'Cheesecakes'
  | 'Birthday Girl'
  | 'Birthday Boy'
  | 'Wedding Cakes'
  | 'Special Occasion'
  | 'Brownies & Cupcakes';

export const CAKE_CATEGORIES: CakeCategory[] = [
  'Special Cakes',
  'Trending Cakes',
  'Chocolate Cakes',
  'Fruit Flavors',
  'Premium Cakes',
  'Cheesecakes',
  'Birthday Girl',
  'Birthday Boy',
  'Wedding Cakes',
  'Special Occasion',
  'Brownies & Cupcakes',
];

/**
 * A weight/price pair exactly as listed in the source catalog.
 * `weight` is the source string (e.g. "0.5 kg"); numeric kg values are
 * parsed once by the pricing layer instead of being re-parsed across the UI.
 */
export interface CakeWeight {
  weight: string;
  label: string;
  price: number;
  displayPrice?: string;
}

export interface CakeItem {
  id: string;
  name: string;
  category: CakeCategory;
  /** Source catalogue category, kept verbatim so business rules stay stable. */
  sourceCategory?: string;
  description: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  egglessAvailable: boolean;
  flavourChoice: boolean;
  inStock: boolean;
  sku: string;
  createdAt: string;
  numericPrice: number;
  defaultWeight: string;
  weights: CakeWeight[];
}

/**
 * A finalized cart line. All price components are snapshots taken at the moment
 * the line was configured; a later catalog change must never reprice a bill.
 */
export interface CartItem {
  key: string;
  cakeId: string;
  cakeName: string;
  sku?: string;
  imageUrl?: string;

  weightKg: number;
  weightLabel: string;
  flavour: string | null;
  eggless: boolean;

  basePrice: number;
  flavourExtra: number;
  egglessExtra: number;
  unitPrice: number;
  quantity: number;

  cakeMessage?: string;
  notes?: string;

  /** v1 line imported from old storage; fields kept so old bills still render. */
  legacy?: boolean;
  variantId?: string;
  variantLabel?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card';

export type PrintMode = 'bluetooth' | 'simulated' | 'browser';

/** Outcome of submitting bytes to a printer (not proof of paper output). */
export type PrintJobState = 'idle' | 'sending' | 'sent' | 'failed' | 'uncertain';

/** Made-to-order lifecycle. Instant walk-in bills are born `completed`. */
export type OrderStatus = 'scheduled' | 'baking' | 'ready' | 'completed' | 'cancelled';

export type FulfilmentType = 'pickup' | 'delivery';

export interface Fulfilment {
  type: FulfilmentType;
  /** ISO date (yyyy-mm-dd) the cake is needed. */
  date: string;
  /** Hourly slot label, e.g. "17:00". */
  time: string;
  address?: string;
}

export interface PaymentRecord {
  amount: number;
  method: PaymentMethod;
  at: string;
  kind: 'full' | 'advance' | 'balance';
}

export interface BillOrder {
  id: string;
  billNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  orderNote?: string;
  printedAt?: string;
  printMode?: PrintMode;
  /** Persisted print lifecycle for failure recovery and reprint. */
  printState?: Exclude<PrintJobState, 'idle' | 'sending'> | 'pending';
  printError?: string;
  lastPrintAttemptAt?: string;
  /** Known demo transactions from the old app; kept but excluded from revenue. */
  isDemo?: boolean;
  /** Scheduling / production fields. Absent on legacy bills = completed walk-in. */
  status?: OrderStatus;
  fulfilment?: Fulfilment | null;
  payments?: PaymentRecord[];
  advancePaid?: number;
  balanceDue?: number;
  cancelReason?: string;
  version?: 2;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  address: string;
  phone: string;
  taxId: string;
  upiId?: string;
  taxRate: number;
  currencySymbol: string;
  receiptFooter: string;
  paperWidth: 58 | 80;
  autoPrintOnCheckout: boolean;
}

export type PrinterConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

/**
 * How the current/remembered printer is reached.
 * `web-bluetooth` only works in a compatible browser, never inside the APK WebView.
 */
export type PrinterMode =
  | 'none'
  | 'native-ble'
  | 'native-classic'
  | 'web-bluetooth'
  | 'simulated';

export type PrinterTransport = 'ble' | 'classic' | 'web-ble' | 'none';

export interface BluetoothPrinterState {
  status: PrinterConnectionStatus;
  mode: PrinterMode;
  transport: PrinterTransport;
  deviceName: string | null;
  deviceId: string | null;
  serviceUuid: string | null;
  characteristicUuid: string | null;
  lastError: string | null;
  lastPrintedAt: string | null;
  printCount: number;
  lastJobState: PrintJobState;
  lastJobError: string | null;
}

export interface RememberedPrinter {
  mode: PrinterMode;
  transport: PrinterTransport;
  deviceId: string;
  deviceName: string;
}

export interface ActiveBillState {
  cart: CartItem[];
  discountAmount: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  orderNote: string;
  updatedAt: string;
  /** Scheduling draft, persisted with the open bill. */
  scheduleMode?: 'now' | 'schedule';
  fulfilmentType?: FulfilmentType;
  fulfilmentDate?: string;
  fulfilmentTime?: string;
  deliveryAddress?: string;
  advanceAmount?: number;
}

export type ActiveTab = 'pos' | 'catalog' | 'orders' | 'dashboard' | 'printer' | 'data';
