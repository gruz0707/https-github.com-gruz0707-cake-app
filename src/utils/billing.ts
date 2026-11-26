import type {
  BillOrder,
  CakeCategory,
  CakeItem,
  CakeWeight,
  CartItem,
} from '../types/pos';
import { parseWeightKg } from './pricing';
import { orderStatus } from './orders';

export interface BillCalculation {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
  itemCount: number;
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount: number, symbol = '₹'): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: safe % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safe);
  return `${symbol}${formatted}`;
}

export function calculateBillTotals(
  items: CartItem[],
  discountAmountInput: number,
  taxRatePercent: number,
): BillCalculation {
  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const clampedDiscount = roundMoney(
    Math.min(Math.max(0, Number.isFinite(discountAmountInput) ? discountAmountInput : 0), subtotal),
  );
  const taxableAmount = roundMoney(Math.max(0, subtotal - clampedDiscount));
  const safeTaxRate = Math.min(Math.max(0, Number.isFinite(taxRatePercent) ? taxRatePercent : 0), 100);
  const taxAmount = roundMoney((taxableAmount * safeTaxRate) / 100);
  const total = roundMoney(taxableAmount + taxAmount);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    subtotal,
    discountAmount: clampedDiscount,
    taxableAmount,
    taxAmount,
    total,
    itemCount,
  };
}

export function generateBillNumber(existingOrders: BillOrder[], now = new Date()): string {
  const yyyy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const prefix = `EC-${yyyy}${mm}${dd}`;

  let maxSeq = 0;
  for (const order of existingOrders) {
    if (order.billNumber.startsWith(prefix + '-')) {
      const seqPart = Number.parseInt(order.billNumber.slice(prefix.length + 1), 10);
      if (Number.isFinite(seqPart) && seqPart > maxSeq) {
        maxSeq = seqPart;
      }
    }
  }

  return `${prefix}-${String(maxSeq + 1).padStart(3, '0')}`;
}

export interface CakeFormInput {
  name: string;
  category: CakeCategory;
  sku: string;
  description: string;
  egglessAvailable: boolean;
  flavourChoice: boolean;
  inStock: boolean;
  defaultWeight?: string;
  weights: Array<{ weight: string; label?: string; price: string | number }>;
}

export interface CakeValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    sku?: string;
    weights?: string;
  };
  normalizedWeights: CakeWeight[];
  defaultWeight: string;
}

export function validateCakeForm(input: CakeFormInput): CakeValidationResult {
  const errors: CakeValidationResult['errors'] = {};

  if (!input.name.trim()) {
    errors.name = 'Cake name is required.';
  } else if (input.name.trim().length < 2) {
    errors.name = 'Cake name must be at least 2 characters.';
  }

  if (!input.sku.trim()) {
    errors.sku = 'Item code (SKU) is required.';
  }

  const normalizedWeights: CakeWeight[] = [];
  if (!input.weights || input.weights.length === 0) {
    errors.weights = 'Add at least one weight and price.';
  } else {
    const seen = new Set<number>();
    for (let i = 0; i < input.weights.length; i += 1) {
      const w = input.weights[i];
      const weight = w.weight.trim();
      const kg = parseWeightKg(weight);
      const numericPrice = typeof w.price === 'number' ? w.price : Number.parseFloat(w.price);

      if (kg == null) {
        errors.weights = `Weight #${i + 1} must be a real weight such as "1 kg" or "500g".`;
        break;
      }
      if (kg > 8) {
        errors.weights = 'Weights above 8 kg are not offered.';
        break;
      }
      const grams = Math.round(kg * 1000);
      if (seen.has(grams)) {
        errors.weights = `Weight "${weight}" is listed more than once.`;
        break;
      }
      seen.add(grams);

      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        errors.weights = `Weight "${weight}" must have a price greater than 0.`;
        break;
      }

      normalizedWeights.push({
        weight,
        label: w.label?.trim() || weight,
        price: roundMoney(numericPrice),
      });
    }
  }

  const requestedDefault = input.defaultWeight?.trim();
  const defaultWeight =
    (requestedDefault &&
      normalizedWeights.find((w) => w.weight === requestedDefault)?.weight) ||
    normalizedWeights[0]?.weight ||
    '';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedWeights,
    defaultWeight,
  };
}

export function filterCakes(
  cakes: CakeItem[],
  searchQuery: string,
  category: CakeCategory | 'All',
  onlyInStock = false,
): CakeItem[] {
  const q = searchQuery.trim().toLowerCase();
  return cakes.filter((cake) => {
    if (onlyInStock && !cake.inStock) {
      return false;
    }
    if (category !== 'All' && cake.category !== category) {
      return false;
    }
    if (!q) {
      return true;
    }
    return (
      cake.name.toLowerCase().includes(q) ||
      cake.sku.toLowerCase().includes(q) ||
      cake.description.toLowerCase().includes(q) ||
      cake.category.toLowerCase().includes(q)
    );
  });
}

export interface DailySummary {
  ordersCount: number;
  totalRevenue: number;
  averageTicket: number;
  printedCount: number;
}

export function computeDailySummary(orders: BillOrder[], referenceDate = new Date()): DailySummary {
  const y = referenceDate.getFullYear();
  const m = referenceDate.getMonth();
  const d = referenceDate.getDate();

  const todaysOrders = orders.filter((order) => {
    if (order.isDemo || orderStatus(order) !== 'completed') return false;
    const dt = new Date(order.createdAt);
    return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
  });

  const totalRevenue = roundMoney(todaysOrders.reduce((sum, o) => sum + o.total, 0));
  const ordersCount = todaysOrders.length;
  const averageTicket = ordersCount > 0 ? roundMoney(totalRevenue / ordersCount) : 0;
  const printedCount = todaysOrders.filter((o) => Boolean(o.printedAt)).length;

  return {
    ordersCount,
    totalRevenue,
    averageTicket,
    printedCount,
  };
}
