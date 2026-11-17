import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BillOrder, ShopSettings } from '../types/pos';
import {
  buildDailyRevenueSeries,
  buildMonthlyRevenueSeries,
  buildPaymentBreakdown,
  computeRevenueOverview,
} from '../utils/analytics';
import { formatCurrency } from '../utils/billing';

interface RevenueDashboardViewProps {
  orders: BillOrder[];
  settings: ShopSettings;
  onGoToCounter: () => void;
}

type DailyWindow = 7 | 14 | 30;
type MonthlyWindow = 6 | 12;

function formatCompactAxis(value: number, currencySymbol: string): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${currencySymbol}${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `${currencySymbol}${value}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      label: string;
      revenue: number;
      ordersCount: number;
    };
  }>;
  currencySymbol: string;
}

function RevenueTooltip({ active, payload, currencySymbol }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0 || !payload[0].payload) {
    return null;
  }
  const item = payload[0].payload;
  return (
    <div className="bg-slate-950 text-white px-3 py-2 rounded-xl shadow-lg text-xs">
      <p className="font-medium text-slate-300">{item.label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">
        {formatCurrency(item.revenue, currencySymbol)}
      </p>
      <p className="text-[11px] text-slate-300 tabular-nums">
        {item.ordersCount} {item.ordersCount === 1 ? 'bill' : 'bills'}
      </p>
    </div>
  );
}

export function RevenueDashboardView({
  orders,
  settings,
  onGoToCounter,
}: RevenueDashboardViewProps) {
  const [dailyDays, setDailyDays] = useState<DailyWindow>(14);
  const [monthlyCount, setMonthlyCount] = useState<MonthlyWindow>(6);

  const curr = settings.currencySymbol;
  const overview = useMemo(() => computeRevenueOverview(orders), [orders]);
  const dailySeries = useMemo(
    () => buildDailyRevenueSeries(orders, dailyDays),
    [orders, dailyDays],
  );
  const monthlySeries = useMemo(
    () => buildMonthlyRevenueSeries(orders, monthlyCount),
    [orders, monthlyCount],
  );
  const paymentBreakdown = useMemo(() => buildPaymentBreakdown(orders), [orders]);

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-24 md:pb-8 space-y-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Revenue Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daily and monthly sales performance calculated from your bill history.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <p className="text-base font-semibold text-slate-900">No order history yet</p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Create your first customer bill on the Counter tab to see daily and monthly revenue charts here.
          </p>
          <button
            type="button"
            onClick={onGoToCounter}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
          >
            Go to Counter Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-24 md:pb-8 space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Revenue Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Live daily and monthly revenue aggregated from {overview.totalOrders} recorded{' '}
          {overview.totalOrders === 1 ? 'bill' : 'bills'}.
        </p>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">Today&apos;s Revenue</p>
          <p
            data-testid="kpi-today-revenue"
            className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums"
          >
            {formatCurrency(overview.todayRevenue, curr)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
            {overview.todayOrders} {overview.todayOrders === 1 ? 'bill' : 'bills'} today
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">This Month</p>
          <p
            data-testid="kpi-month-revenue"
            className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums"
          >
            {formatCurrency(overview.monthRevenue, curr)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
            {overview.monthOrders} {overview.monthOrders === 1 ? 'bill' : 'bills'} this month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">All-Time Revenue</p>
          <p
            data-testid="kpi-total-revenue"
            className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums"
          >
            {formatCurrency(overview.totalRevenue, curr)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
            {overview.totalOrders} total {overview.totalOrders === 1 ? 'bill' : 'bills'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">Avg. Bill Value</p>
          <p
            data-testid="kpi-avg-ticket"
            className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums"
          >
            {formatCurrency(overview.averageTicket, curr)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Across recorded orders</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daily Revenue Area Chart */}
        <section
          aria-label="Daily Revenue Chart"
          className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 min-w-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Daily Revenue
              </h2>
              <p className="text-xs text-slate-500">
                Day-by-day bakery sales over the last {dailyDays} days
              </p>
            </div>

            <div
              role="group"
              aria-label="Daily chart range"
              className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto"
            >
              {([7, 14, 30] as const).map((days) => {
                const active = dailyDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDailyDays(days)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {days}D
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-[260px] sm:h-[290px] min-w-0" data-testid="daily-revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailySeries}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dailyRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  interval={dailyDays === 30 ? 4 : dailyDays === 14 ? 1 : 0}
                />
                <YAxis
                  tickFormatter={(val: number) => formatCompactAxis(val, curr)}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip content={<RevenueTooltip currencySymbol={curr} />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#18181B"
                  strokeWidth={2.2}
                  fill="url(#dailyRevenueFill)"
                  activeDot={{ r: 5, fill: '#B45309', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Monthly Revenue Bar Chart */}
        <section
          aria-label="Monthly Revenue Chart"
          className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 min-w-0"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Monthly Revenue
              </h2>
              <p className="text-xs text-slate-500">
                Last {monthlyCount} months billing totals
              </p>
            </div>

            <div
              role="group"
              aria-label="Monthly chart range"
              className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto"
            >
              {([6, 12] as const).map((months) => {
                const active = monthlyCount === months;
                return (
                  <button
                    key={months}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMonthlyCount(months)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {months}M
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-[260px] sm:h-[290px] min-w-0" data-testid="monthly-revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySeries}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  interval={monthlyCount === 12 ? 1 : 0}
                />
                <YAxis
                  tickFormatter={(val: number) => formatCompactAxis(val, curr)}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip content={<RevenueTooltip currencySymbol={curr} />} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={42}>
                  {monthlySeries.map((entry) => (
                    <Cell
                      key={entry.monthKey}
                      fill={entry.monthKey === currentMonthKey ? '#B45309' : '#18181B'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Payment Method Breakdown */}
      <section
        aria-label="Revenue by Payment Method"
        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Payment Method Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Share of total revenue across UPI, Cash, and Card bills
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {paymentBreakdown.map((row) => (
            <div key={row.method} className="py-3 first:pt-1 last:pb-1 space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{row.method}</span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {row.ordersCount} {row.ordersCount === 1 ? 'bill' : 'bills'}
                  </span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-xs text-slate-500">{row.sharePercent}%</span>
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(row.revenue, curr)}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-300"
                  style={{ width: `${row.sharePercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
