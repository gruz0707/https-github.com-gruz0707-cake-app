import { useMemo, useState } from 'react';
import {
  Award,
  Banknote,
  CalendarClock,
  CreditCard,
  IndianRupee,
  ReceiptText,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
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
import type { BillOrder, PaymentMethod, ShopSettings } from '../types/pos';
import {
  buildDailyRevenueSeries,
  buildMonthlyRevenueSeries,
  buildPaymentBreakdown,
  computePendingOrdersSummary,
  computeRevenueOverview,
  computeTopCakes,
  type AnalyticsScope,
} from '../utils/analytics';
import { formatCurrency } from '../utils/billing';
import { btnPrimary, card, focus } from '../ui';

interface RevenueDashboardViewProps {
  orders: BillOrder[];
  settings: ShopSettings;
  onGoToCounter: () => void;
}

type DailyWindow = 7 | 14 | 30;
type MonthlyWindow = 6 | 12;

const SCOPE_OPTIONS: Array<{ value: AnalyticsScope; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All' },
];

const PAYMENT_ICON: Record<PaymentMethod, typeof Banknote> = {
  UPI: Smartphone,
  Cash: Banknote,
  Card: CreditCard,
};

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
    <div className="rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-medium text-white/75">{item.label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">
        {formatCurrency(item.revenue, currencySymbol)}
      </p>
      <p className="text-[11px] text-white/75 tabular-nums">
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
  const [breakdownScope, setBreakdownScope] = useState<AnalyticsScope>('today');

  const curr = settings.currencySymbol;
  const overview = useMemo(() => computeRevenueOverview(orders), [orders]);
  const pendingSummary = useMemo(() => computePendingOrdersSummary(orders), [orders]);
  const dailySeries = useMemo(
    () => buildDailyRevenueSeries(orders, dailyDays),
    [orders, dailyDays],
  );
  const monthlySeries = useMemo(
    () => buildMonthlyRevenueSeries(orders, monthlyCount),
    [orders, monthlyCount],
  );
  const paymentBreakdown = useMemo(
    () => buildPaymentBreakdown(orders, breakdownScope),
    [orders, breakdownScope],
  );
  const topCakes = useMemo(
    () => computeTopCakes(orders, breakdownScope, 5),
    [orders, breakdownScope],
  );

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const realOrderCount = useMemo(
    () => orders.filter((order) => !order.isDemo && (order.status ?? 'completed') === 'completed').length,
    [orders],
  );
  const hasDemoOrders = orders.some((order) => order.isDemo);

  if (realOrderCount === 0 && pendingSummary.count === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-5 px-4 pb-24 pt-4 sm:px-6 md:pb-10 md:pt-6">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
            Revenue Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">
            Daily sales, cash/UPI tally, and top cakes from your bill history.
          </p>
        </div>

        <div className={`${card} space-y-3 p-10 text-center`}>
          <p className="text-base font-bold text-ink">No bills recorded yet</p>
          <p className="mx-auto max-w-md text-xs text-muted sm:text-sm">
            Create your first customer bill on the Counter tab to see today&apos;s sales, UPI vs Cash split, and top-selling cakes here.
          </p>
          <button type="button" onClick={onGoToCounter} className={btnPrimary}>
            Go to Counter Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 pb-24 pt-4 sm:px-6 md:pb-10 md:pt-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
          Revenue Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-muted sm:text-sm">
          Live sales from {overview.totalOrders} completed{' '}
          {overview.totalOrders === 1 ? 'bill' : 'bills'}.
        </p>
        {hasDemoOrders && (
          <p className="mt-1.5 inline-flex rounded-md bg-caramel-tint px-2 py-1 text-[10px] font-semibold text-caramel">
            Demo bills are kept in history but excluded from these totals.
          </p>
        )}
      </div>

      {/* Pending Scheduled Orders Banner */}
      {pendingSummary.count > 0 && (
        <section
          aria-label="Pending scheduled orders"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-caramel/30 bg-caramel-tint p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-caramel shadow-xs">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink">
                {pendingSummary.count} active cake{' '}
                {pendingSummary.count === 1 ? 'order' : 'orders'} in progress
              </p>
              <p className="mt-0.5 text-xs text-muted tabular-nums">
                Advance received: <strong>{formatCurrency(pendingSummary.advancePaid, curr)}</strong>
                {' · '}Balance to collect:{' '}
                <strong className="text-caramel">
                  {formatCurrency(pendingSummary.balanceDue, curr)}
                </strong>
              </p>
            </div>
          </div>
          <p className="text-[11px] font-medium text-muted">
            Counted in revenue once handed over
          </p>
        </section>
      )}

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-berry/25 bg-berry-tint/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-berry-deep">Today&apos;s Sales</p>
            <IndianRupee className="h-3.5 w-3.5 text-berry" aria-hidden="true" />
          </div>
          <p
            data-testid="kpi-today-revenue"
            className="mt-1 text-xl font-extrabold text-ink tabular-nums sm:text-2xl"
          >
            {formatCurrency(overview.todayRevenue, curr)}
          </p>
          <p className="mt-1 text-[11px] text-muted tabular-nums">
            {overview.todayOrders} {overview.todayOrders === 1 ? 'bill' : 'bills'} today
          </p>
        </div>

        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted">This Month</p>
            <TrendingUp className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          </div>
          <p
            data-testid="kpi-month-revenue"
            className="mt-1 text-xl font-extrabold text-ink tabular-nums sm:text-2xl"
          >
            {formatCurrency(overview.monthRevenue, curr)}
          </p>
          <p className="mt-1 text-[11px] text-muted tabular-nums">
            {overview.monthOrders} {overview.monthOrders === 1 ? 'bill' : 'bills'} this month
          </p>
        </div>

        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted">All-Time Revenue</p>
            <ReceiptText className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          </div>
          <p
            data-testid="kpi-total-revenue"
            className="mt-1 text-xl font-extrabold text-ink tabular-nums sm:text-2xl"
          >
            {formatCurrency(overview.totalRevenue, curr)}
          </p>
          <p className="mt-1 text-[11px] text-muted tabular-nums">
            {overview.totalOrders} total {overview.totalOrders === 1 ? 'bill' : 'bills'}
          </p>
        </div>

        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted">Avg. Bill Value</p>
            <Award className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          </div>
          <p
            data-testid="kpi-avg-ticket"
            className="mt-1 text-xl font-extrabold text-ink tabular-nums sm:text-2xl"
          >
            {formatCurrency(overview.averageTicket, curr)}
          </p>
          <p className="mt-1 text-[11px] text-muted">Across completed bills</p>
        </div>
      </div>

      {/* Payment Tally & Top Cakes (Quick Closing View) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-ink">Closing Summary</h2>
            <p className="text-xs text-muted">
              Cash vs UPI vs Card &amp; best-selling cakes
            </p>
          </div>
          <div
            role="group"
            aria-label="Summary time range"
            className="inline-flex items-center gap-1 rounded-xl border border-line bg-panel p-1"
          >
            {SCOPE_OPTIONS.map((opt) => {
              const active = breakdownScope === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBreakdownScope(opt.value)}
                  className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${focus} ${
                    active
                      ? 'bg-card text-ink shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Payment Method Breakdown */}
          <section
            aria-label="Revenue by Payment Method"
            className={`${card} space-y-3 p-5 lg:col-span-6`}
          >
            <h3 className="text-sm font-bold text-ink">Payment Method Split</h3>
            <div className="divide-y divide-line/60">
              {paymentBreakdown.map((row) => {
                const Icon = PAYMENT_ICON[row.method];
                return (
                  <div key={row.method} className="space-y-1.5 py-3 first:pt-1 last:pb-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted" aria-hidden="true" />
                        <span className="font-semibold text-ink">{row.method}</span>
                        <span aria-hidden="true" className="text-line-strong">
                          ·
                        </span>
                        <span className="text-xs text-muted tabular-nums">
                          {row.ordersCount} {row.ordersCount === 1 ? 'bill' : 'bills'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 tabular-nums">
                        <span className="text-xs text-muted">{row.sharePercent}%</span>
                        <span className="font-bold text-ink">
                          {formatCurrency(row.revenue, curr)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-panel">
                      <div
                        className="h-full rounded-full bg-berry transition-all duration-300"
                        style={{ width: `${row.sharePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top Selling Cakes */}
          <section
            aria-label="Top Selling Cakes"
            className={`${card} space-y-3 p-5 lg:col-span-6`}
          >
            <h3 className="text-sm font-bold text-ink">Top Selling Cakes</h3>
            {topCakes.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">
                No completed bills in this period yet.
              </p>
            ) : (
              <div className="divide-y divide-line/60">
                {topCakes.map((cake, index) => (
                  <div
                    key={cake.cakeName}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-1"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-panel text-[11px] font-bold text-muted tabular-nums">
                        {index + 1}
                      </span>
                      <span className="truncate text-sm font-semibold text-ink">
                        {cake.cakeName}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 tabular-nums">
                      <span className="rounded-md bg-panel px-2 py-0.5 text-[11px] font-semibold text-muted">
                        {cake.quantity} sold
                      </span>
                      <span className="text-sm font-bold text-ink">
                        {formatCurrency(cake.revenue, curr)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Daily Revenue Area Chart */}
        <section
          aria-label="Daily Revenue Chart"
          className={`${card} min-w-0 space-y-4 p-5 lg:col-span-7`}
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-ink">Daily Revenue</h2>
              <p className="text-xs text-muted">
                Day-by-day bakery sales over the last {dailyDays} days
              </p>
            </div>

            <div
              role="group"
              aria-label="Daily chart range"
              className="inline-flex items-center gap-1 self-start rounded-xl border border-line bg-panel p-1 sm:self-auto"
            >
              {([7, 14, 30] as const).map((days) => {
                const active = dailyDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDailyDays(days)}
                    className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${focus} ${
                      active
                        ? 'bg-card text-ink shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {days}D
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[250px] w-full min-w-0 sm:h-[280px]" data-testid="daily-revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailySeries}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dailyRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#126031" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#126031" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4dd" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#746d63' }}
                  tickLine={false}
                  axisLine={false}
                  interval={dailyDays === 30 ? 4 : dailyDays === 14 ? 1 : 0}
                />
                <YAxis
                  tickFormatter={(val: number) => formatCompactAxis(val, curr)}
                  tick={{ fontSize: 11, fill: '#746d63' }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip content={<RevenueTooltip currencySymbol={curr} />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#126031"
                  strokeWidth={2.2}
                  fill="url(#dailyRevenueFill)"
                  activeDot={{ r: 5, fill: '#126031', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Monthly Revenue Bar Chart */}
        <section
          aria-label="Monthly Revenue Chart"
          className={`${card} min-w-0 space-y-4 p-5 lg:col-span-5`}
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-ink">Monthly Revenue</h2>
              <p className="text-xs text-muted">
                Last {monthlyCount} months billing totals
              </p>
            </div>

            <div
              role="group"
              aria-label="Monthly chart range"
              className="inline-flex items-center gap-1 self-start rounded-xl border border-line bg-panel p-1 sm:self-auto"
            >
              {([6, 12] as const).map((months) => {
                const active = monthlyCount === months;
                return (
                  <button
                    key={months}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMonthlyCount(months)}
                    className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${focus} ${
                      active
                        ? 'bg-card text-ink shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {months}M
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[250px] w-full min-w-0 sm:h-[280px]" data-testid="monthly-revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySeries}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4dd" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#746d63' }}
                  tickLine={false}
                  axisLine={false}
                  interval={monthlyCount === 12 ? 1 : 0}
                />
                <YAxis
                  tickFormatter={(val: number) => formatCompactAxis(val, curr)}
                  tick={{ fontSize: 11, fill: '#746d63' }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip content={<RevenueTooltip currencySymbol={curr} />} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={42}>
                  {monthlySeries.map((entry) => (
                    <Cell
                      key={entry.monthKey}
                      fill={entry.monthKey === currentMonthKey ? '#126031' : '#a8681e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
