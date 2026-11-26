import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDailyRevenueSeries,
  buildMonthlyRevenueSeries,
  buildPaymentBreakdown,
  computeRevenueOverview,
} from './analytics';
import type { BillOrder } from '../types/pos';

function makeOrder(
  id: string,
  isoDate: string,
  total: number,
  paymentMethod: BillOrder['paymentMethod'] = 'UPI',
): BillOrder {
  return {
    id,
    billNumber: `EC-${id}`,
    createdAt: isoDate,
    items: [],
    subtotal: total,
    discountAmount: 0,
    taxRate: 5,
    taxAmount: 0,
    total,
    paymentMethod,
  };
}

test('buildDailyRevenueSeries builds contiguous days and aggregates same-day orders', () => {
  const ref = new Date(2026, 10, 17, 15, 0, 0);
  const orders: BillOrder[] = [
    makeOrder('1', new Date(2026, 10, 17, 9, 0, 0).toISOString(), 1250),
    makeOrder('2', new Date(2026, 10, 17, 14, 0, 0).toISOString(), 750),
    makeOrder('3', new Date(2026, 10, 15, 11, 0, 0).toISOString(), 900),
    makeOrder('4', new Date(2026, 9, 10, 11, 0, 0).toISOString(), 5000), // outside 7d window
  ];

  const series = buildDailyRevenueSeries(orders, 7, ref);
  assert.equal(series.length, 7);
  assert.equal(series[0].dateKey, '2026-11-11');
  assert.equal(series[6].dateKey, '2026-11-17');
  assert.equal(series[6].revenue, 2000);
  assert.equal(series[6].ordersCount, 2);
  assert.equal(series[4].dateKey, '2026-11-15');
  assert.equal(series[4].revenue, 900);
  assert.equal(series[5].revenue, 0);
});

test('buildMonthlyRevenueSeries builds contiguous months and aggregates monthly totals', () => {
  const ref = new Date(2026, 10, 17, 15, 0, 0);
  const orders: BillOrder[] = [
    makeOrder('1', new Date(2026, 10, 2, 10, 0, 0).toISOString(), 1100),
    makeOrder('2', new Date(2026, 10, 17, 10, 0, 0).toISOString(), 900),
    makeOrder('3', new Date(2026, 9, 18, 12, 0, 0).toISOString(), 2400),
    makeOrder('4', new Date(2026, 6, 5, 12, 0, 0).toISOString(), 1600),
  ];

  const series = buildMonthlyRevenueSeries(orders, 6, ref);
  assert.equal(series.length, 6);
  assert.equal(series[0].monthKey, '2026-06');
  assert.equal(series[5].monthKey, '2026-11');
  assert.equal(series[5].revenue, 2000);
  assert.equal(series[5].ordersCount, 2);
  assert.equal(series[4].monthKey, '2026-10');
  assert.equal(series[4].revenue, 2400);
  assert.equal(series[1].monthKey, '2026-07');
  assert.equal(series[1].revenue, 1600);
});

test('computeRevenueOverview and buildPaymentBreakdown calculate accurate KPIs', () => {
  const ref = new Date(2026, 10, 17, 15, 0, 0);
  const orders: BillOrder[] = [
    makeOrder('1', new Date(2026, 10, 17, 9, 0, 0).toISOString(), 1000, 'UPI'),
    makeOrder('2', new Date(2026, 10, 12, 9, 0, 0).toISOString(), 2000, 'Cash'),
    makeOrder('3', new Date(2026, 9, 12, 9, 0, 0).toISOString(), 1000, 'Card'),
  ];

  const overview = computeRevenueOverview(orders, ref);
  assert.equal(overview.totalRevenue, 4000);
  assert.equal(overview.totalOrders, 3);
  assert.equal(overview.todayRevenue, 1000);
  assert.equal(overview.todayOrders, 1);
  assert.equal(overview.monthRevenue, 3000);
  assert.equal(overview.monthOrders, 2);
  assert.equal(overview.averageTicket, 1333.33);

  const breakdown = buildPaymentBreakdown(orders);
  assert.equal(breakdown.find((r) => r.method === 'Cash')?.sharePercent, 50);
  assert.equal(breakdown.find((r) => r.method === 'UPI')?.sharePercent, 25);
  assert.equal(breakdown.find((r) => r.method === 'Card')?.sharePercent, 25);
});

test('demo bills are kept in history but excluded from revenue KPIs', () => {
  const ref = new Date(2026, 10, 17, 15, 0, 0);
  const real = makeOrder('real-1', new Date(2026, 10, 17, 9, 0, 0).toISOString(), 900, 'Cash');
  const demo: BillOrder = {
    ...makeOrder('seed-ord-1', new Date(2026, 10, 17, 10, 0, 0).toISOString(), 5000, 'UPI'),
    isDemo: true,
  };
  const overview = computeRevenueOverview([real, demo], ref);
  assert.equal(overview.totalRevenue, 900);
  assert.equal(overview.totalOrders, 1);
  assert.equal(overview.todayRevenue, 900);
  assert.equal(overview.averageTicket, 900);

  const daily = buildDailyRevenueSeries([real, demo], 1, ref);
  assert.equal(daily[0].revenue, 900);
  assert.equal(daily[0].ordersCount, 1);

  const breakdown = buildPaymentBreakdown([real, demo]);
  assert.equal(breakdown.find((r) => r.method === 'UPI')?.revenue, 0);
  assert.equal(breakdown.find((r) => r.method === 'Cash')?.sharePercent, 100);
});
