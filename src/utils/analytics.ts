import type { BillOrder, PaymentMethod } from '../types/pos';
import { roundMoney } from './billing';

export interface DailyRevenuePoint {
  dateKey: string;
  label: string;
  revenue: number;
  ordersCount: number;
}

export interface MonthlyRevenuePoint {
  monthKey: string;
  label: string;
  revenue: number;
  ordersCount: number;
}

export interface RevenueOverview {
  totalRevenue: number;
  totalOrders: number;
  todayRevenue: number;
  todayOrders: number;
  monthRevenue: number;
  monthOrders: number;
  averageTicket: number;
}

export interface PaymentBreakdownRow {
  method: PaymentMethod;
  revenue: number;
  ordersCount: number;
  sharePercent: number;
}

function toLocalDateKey(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toLocalMonthKey(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function buildDailyRevenueSeries(
  orders: BillOrder[],
  daysCount = 14,
  referenceDate = new Date(),
): DailyRevenuePoint[] {
  const safeDays = Math.max(1, Math.min(90, Math.floor(daysCount)));
  const byDay = new Map<string, { revenue: number; ordersCount: number }>();

  for (const order of orders) {
    const dt = new Date(order.createdAt);
    if (Number.isNaN(dt.getTime())) continue;
    const key = toLocalDateKey(dt);
    const prev = byDay.get(key) ?? { revenue: 0, ordersCount: 0 };
    byDay.set(key, {
      revenue: roundMoney(prev.revenue + order.total),
      ordersCount: prev.ordersCount + 1,
    });
  }

  const series: DailyRevenuePoint[] = [];
  const start = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  start.setDate(start.getDate() - (safeDays - 1));

  for (let i = 0; i < safeDays; i += 1) {
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const key = toLocalDateKey(cursor);
    const bucket = byDay.get(key);
    const label = cursor.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    series.push({
      dateKey: key,
      label,
      revenue: bucket ? bucket.revenue : 0,
      ordersCount: bucket ? bucket.ordersCount : 0,
    });
  }

  return series;
}

export function buildMonthlyRevenueSeries(
  orders: BillOrder[],
  monthsCount = 6,
  referenceDate = new Date(),
): MonthlyRevenuePoint[] {
  const safeMonths = Math.max(1, Math.min(24, Math.floor(monthsCount)));
  const byMonth = new Map<string, { revenue: number; ordersCount: number }>();

  for (const order of orders) {
    const dt = new Date(order.createdAt);
    if (Number.isNaN(dt.getTime())) continue;
    const key = toLocalMonthKey(dt);
    const prev = byMonth.get(key) ?? { revenue: 0, ordersCount: 0 };
    byMonth.set(key, {
      revenue: roundMoney(prev.revenue + order.total),
      ordersCount: prev.ordersCount + 1,
    });
  }

  const series: MonthlyRevenuePoint[] = [];
  for (let i = safeMonths - 1; i >= 0; i -= 1) {
    const cursor = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const key = toLocalMonthKey(cursor);
    const bucket = byMonth.get(key);
    const label = cursor.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });
    series.push({
      monthKey: key,
      label,
      revenue: bucket ? bucket.revenue : 0,
      ordersCount: bucket ? bucket.ordersCount : 0,
    });
  }

  return series;
}

export function computeRevenueOverview(
  orders: BillOrder[],
  referenceDate = new Date(),
): RevenueOverview {
  const todayKey = toLocalDateKey(referenceDate);
  const monthKey = toLocalMonthKey(referenceDate);

  let totalRevenue = 0;
  let todayRevenue = 0;
  let todayOrders = 0;
  let monthRevenue = 0;
  let monthOrders = 0;

  for (const order of orders) {
    const dt = new Date(order.createdAt);
    if (Number.isNaN(dt.getTime())) continue;
    totalRevenue = roundMoney(totalRevenue + order.total);

    if (toLocalDateKey(dt) === todayKey) {
      todayRevenue = roundMoney(todayRevenue + order.total);
      todayOrders += 1;
    }
    if (toLocalMonthKey(dt) === monthKey) {
      monthRevenue = roundMoney(monthRevenue + order.total);
      monthOrders += 1;
    }
  }

  const totalOrders = orders.length;
  const averageTicket = totalOrders > 0 ? roundMoney(totalRevenue / totalOrders) : 0;

  return {
    totalRevenue,
    totalOrders,
    todayRevenue,
    todayOrders,
    monthRevenue,
    monthOrders,
    averageTicket,
  };
}

export function buildPaymentBreakdown(orders: BillOrder[]): PaymentBreakdownRow[] {
  const methods: PaymentMethod[] = ['UPI', 'Cash', 'Card'];
  const totals = new Map<PaymentMethod, { revenue: number; ordersCount: number }>();
  for (const m of methods) {
    totals.set(m, { revenue: 0, ordersCount: 0 });
  }

  let grandTotal = 0;
  for (const order of orders) {
    const bucket = totals.get(order.paymentMethod) ?? { revenue: 0, ordersCount: 0 };
    bucket.revenue = roundMoney(bucket.revenue + order.total);
    bucket.ordersCount += 1;
    totals.set(order.paymentMethod, bucket);
    grandTotal = roundMoney(grandTotal + order.total);
  }

  return methods.map((method) => {
    const bucket = totals.get(method)!;
    const sharePercent =
      grandTotal > 0 ? Math.round((bucket.revenue / grandTotal) * 100) : 0;
    return {
      method,
      revenue: bucket.revenue,
      ordersCount: bucket.ordersCount,
      sharePercent,
    };
  });
}
