import type {
  BillOrder,
  Fulfilment,
  FulfilmentType,
  OrderStatus,
  PaymentMethod,
  PaymentRecord,
  ShopSettings,
} from '../types/pos';
import { formatCurrency } from './billing';
import { cartItemWeightLabel } from './pricing';

/** Hourly pickup/delivery slots matching the storefront (10:00 – 21:00). */
export const TIME_SLOTS: Array<{ value: string; label: string }> = Array.from(
  { length: 12 },
  (_, i) => {
    const hour = 10 + i;
    const value = `${String(hour).padStart(2, '0')}:00`;
    const suffix = hour < 12 ? 'am' : 'pm';
    const display = hour > 12 ? hour - 12 : hour;
    return { value, label: `${display}:00 ${suffix}` };
  },
);

export function todayIsoDate(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isValidSlot(time: string): boolean {
  return TIME_SLOTS.some((slot) => slot.value === time);
}

export interface FulfilmentDraft {
  type: FulfilmentType;
  date: string;
  time: string;
  address?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface FulfilmentValidation {
  valid: boolean;
  errors: string[];
}

/** The storefront requires a future date, a slot, and full delivery details. */
export function validateFulfilment(
  draft: FulfilmentDraft,
  now = new Date(),
): FulfilmentValidation {
  const errors: string[] = [];
  if (!draft.date) {
    errors.push('Choose the date the cake is needed.');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) {
    errors.push('Date must be a real calendar date.');
  } else if (draft.date < todayIsoDate(now)) {
    errors.push('Order date cannot be in the past.');
  }
  if (!draft.time) {
    errors.push('Choose a pickup/delivery time slot.');
  } else if (!isValidSlot(draft.time)) {
    errors.push('Time must be one of the offered hourly slots.');
  }
  if (draft.type === 'delivery') {
    if (!draft.customerName?.trim()) errors.push('Delivery needs the customer name.');
    if ((draft.customerPhone ?? '').replace(/\D/g, '').length < 10) {
      errors.push('Delivery needs a 10-digit phone number.');
    }
    if (!draft.address?.trim() || draft.address.trim().length < 8) {
      errors.push('Delivery needs a full address.');
    }
  }
  return { valid: errors.length === 0, errors };
}

export function orderStatus(order: BillOrder): OrderStatus {
  return order.status ?? 'completed';
}

export function isScheduled(order: BillOrder): boolean {
  const status = orderStatus(order);
  return status === 'scheduled' || status === 'baking' || status === 'ready';
}

export function orderAdvance(order: BillOrder): number {
  if (typeof order.advancePaid === 'number') return order.advancePaid;
  return orderStatus(order) === 'completed' ? order.total : 0;
}

export function orderBalance(order: BillOrder): number {
  if (typeof order.balanceDue === 'number') return Math.max(0, order.balanceDue);
  return Math.max(0, order.total - orderAdvance(order));
}

/** Legacy bills become completed walk-in sales with a single full payment. */
export function normalizeOrderFinancials(order: BillOrder): BillOrder {
  if (order.status && order.payments && typeof order.balanceDue === 'number') {
    return order;
  }
  const status = orderStatus(order);
  const advance = orderAdvance(order);
  const payments: PaymentRecord[] = order.payments ?? [
    {
      amount: status === 'completed' ? order.total : advance,
      method: order.paymentMethod,
      at: order.createdAt,
      kind: status === 'completed' ? 'full' : 'advance',
    },
  ];
  return {
    ...order,
    status,
    fulfilment: order.fulfilment ?? null,
    payments,
    advancePaid: advance,
    balanceDue: orderBalance(order),
  };
}

export function dueBucket(order: BillOrder, now = new Date()): 'overdue' | 'today' | 'tomorrow' | 'later' {
  const date = order.fulfilment?.date;
  if (!date) return 'later';
  const today = todayIsoDate(now);
  const tomorrow = todayIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  if (date < today) return 'overdue';
  if (date === today) return 'today';
  if (date === tomorrow) return 'tomorrow';
  return 'later';
}

export function formatDueLabel(order: BillOrder, now = new Date()): string {
  const f = order.fulfilment;
  if (!f) return 'Walk-in';
  const bucket = dueBucket(order, now);
  const slot = TIME_SLOTS.find((s) => s.value === f.time)?.label ?? f.time;
  const day =
    bucket === 'today'
      ? 'Today'
      : bucket === 'tomorrow'
        ? 'Tomorrow'
        : new Date(`${f.date}T00:00:00`).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
          });
  return `${day} · ${slot}`;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  scheduled: 'Scheduled',
  baking: 'Baking',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  scheduled: 'baking',
  baking: 'ready',
  ready: 'completed',
};

export function normalizeIndianPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return null;
}

export function buildOrderWhatsAppMessage(order: BillOrder, shop: ShopSettings): string {
  const lines: string[] = [];
  lines.push(`*${shop.shopName.toUpperCase()}*`);
  lines.push(`Order ${order.billNumber}`);
  lines.push('');
  for (const item of order.items) {
    const meta = [cartItemWeightLabel(item)];
    if (item.flavour) meta.push(item.flavour);
    if (item.eggless) meta.push('Eggless');
    lines.push(
      `• ${item.quantity} x ${item.cakeName} (${meta.join(', ')}) — ${formatCurrency(
        item.unitPrice * item.quantity,
        shop.currencySymbol,
      )}`,
    );
    if (item.cakeMessage?.trim()) lines.push(`   Message: "${item.cakeMessage.trim()}"`);
    if (item.notes?.trim()) lines.push(`   Note: ${item.notes.trim()}`);
  }
  lines.push('');
  if (order.fulfilment) {
    lines.push(
      `${order.fulfilment.type === 'delivery' ? 'Delivery' : 'Pickup'}: ${formatDueLabel(order)}`,
    );
    if (order.fulfilment.type === 'delivery' && order.fulfilment.address) {
      lines.push(`Address: ${order.fulfilment.address}`);
    }
  } else {
    lines.push('Pickup: at the counter');
  }
  if (order.customerName?.trim()) lines.push(`Customer: ${order.customerName.trim()}`);
  lines.push('');
  lines.push(`Total: ${formatCurrency(order.total, shop.currencySymbol)}`);
  const advance = orderAdvance(order);
  const balance = orderBalance(order);
  if (advance > 0) lines.push(`Advance paid: ${formatCurrency(advance, shop.currencySymbol)}`);
  if (balance > 0) lines.push(`Balance due: ${formatCurrency(balance, shop.currencySymbol)}`);
  if (order.orderNote?.trim()) lines.push(`Note: ${order.orderNote.trim()}`);
  lines.push('');
  lines.push(shop.phone ? `Shop: ${shop.phone}` : 'Thank you!');
  return lines.join('\n');
}

export function whatsappUrl(phone: string | null | undefined, text: string): string {
  const normalized = phone ? normalizeIndianPhone(phone) : null;
  const encoded = encodeURIComponent(text);
  return normalized
    ? `https://wa.me/${normalized}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
