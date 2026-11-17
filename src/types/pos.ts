export type CakeCategory =
  | 'Layer Cakes'
  | 'Cheesecakes'
  | 'Fruit & Cream'
  | 'Pastries'
  | 'Custom Orders';

export const CAKE_CATEGORIES: CakeCategory[] = [
  'Layer Cakes',
  'Cheesecakes',
  'Fruit & Cream',
  'Pastries',
  'Custom Orders',
];

export interface CakeVariant {
  id: string;
  label: string;
  price: number;
}

export interface CakeItem {
  id: string;
  name: string;
  category: CakeCategory;
  description: string;
  imageUrl?: string;
  egglessAvailable: boolean;
  inStock: boolean;
  variants: CakeVariant[];
  sku: string;
  createdAt: string;
}

export interface CartItem {
  key: string;
  cakeId: string;
  cakeName: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  eggless: boolean;
  cakeMessage?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card';

export type PrintMode = 'bluetooth' | 'simulated' | 'browser';

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
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  address: string;
  phone: string;
  taxId: string;
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

export type PrinterMode = 'none' | 'web-bluetooth' | 'simulated';

export interface BluetoothPrinterState {
  status: PrinterConnectionStatus;
  mode: PrinterMode;
  deviceName: string | null;
  deviceId: string | null;
  serviceUuid: string | null;
  characteristicUuid: string | null;
  lastError: string | null;
  lastPrintedAt: string | null;
  printCount: number;
}

export type ActiveTab = 'pos' | 'catalog' | 'orders' | 'dashboard' | 'printer';
