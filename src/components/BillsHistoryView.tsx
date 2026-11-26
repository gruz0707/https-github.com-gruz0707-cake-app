import { useMemo, useState, type ReactNode } from 'react';
import {
  Banknote,
  Check,
  ChevronRight,
  CreditCard,
  IndianRupee,
  Printer,
  ReceiptText,
  Search,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import type { BillOrder, PaymentMethod } from '../types/pos';
import type { PosStore } from '../hooks/usePosStore';
import { ProductionBoard } from './ProductionBoard';
import { Segmented } from './Segmented';
import { STATUS_LABEL, formatDueLabel, isScheduled, orderStatus } from '../utils/orders';
import { computeDailySummary, formatCurrency } from '../utils/billing';
import { describeCartItem } from '../utils/pricing';
import { focus, input, tonePill } from '../ui';

interface BillsHistoryViewProps {
  store: PosStore;
  onSelectOrder: (order: BillOrder) => void;
}

const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  UPI: Smartphone,
  Cash: Banknote,
  Card: CreditCard,
};

function dayLabel(dateKey: string): string {
  const date = new Date(dateKey);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  });
}

export function BillsHistoryView({ store, onSelectOrder }: BillsHistoryViewProps) {
  const { orders, settings } = store;
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'history' | 'production'>('history');
  const curr = settings.currencySymbol;

  const summary = useMemo(() => computeDailySummary(orders), [orders]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.billNumber.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        o.paymentMethod.toLowerCase().includes(q),
    );
  }, [orders, query]);

  const groups = useMemo(() => {
    const map = new Map<string, BillOrder[]>();
    for (const order of filteredOrders) {
      const key = new Date(order.createdAt).toDateString();
      const list = map.get(key) ?? [];
      list.push(order);
      map.set(key, list);
    }
    return [...map.entries()].map(([key, list]) => ({
      key,
      label: dayLabel(key),
      orders: list,
      revenue: list.filter((o) => !o.isDemo).reduce((sum, o) => sum + o.total, 0),
    }));
  }, [filteredOrders]);

  const kpis: Array<{
    label: string;
    value: string;
    icon: ReactNode;
    accent?: boolean;
  }> = [
    {
      label: "Today's revenue",
      value: formatCurrency(summary.totalRevenue, curr),
      icon: <IndianRupee className="h-3 w-3" aria-hidden="true" />,
      accent: true,
    },
    {
      label: 'Bills today',
      value: String(summary.ordersCount),
      icon: <ReceiptText className="h-3 w-3" aria-hidden="true" />,
    },
    {
      label: 'Avg. ticket',
      value: formatCurrency(summary.averageTicket, curr),
      icon: <TrendingUp className="h-3 w-3" aria-hidden="true" />,
    },
    {
      label: 'Printed',
      value: String(summary.printedCount),
      icon: <Printer className="h-3 w-3" aria-hidden="true" />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 pb-24 pt-4 sm:px-6 md:space-y-5 md:pb-10 md:pt-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
          Bills &amp; orders
        </h1>
        <p className="mt-0.5 text-[11.5px] text-muted sm:text-xs">
          Receipts, reprints and the made-to-order production board.
        </p>
      </div>

      <Segmented
        className="w-full sm:w-auto"
        ariaLabel="Bills history or production board"
        options={[
          { value: 'history' as const, label: 'History' },
          { value: 'production' as const, label: 'Upcoming' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'production' && (
        <ProductionBoard store={store} onSelectOrder={onSelectOrder} />
      )}

      {view === 'history' && (
      <>

      {/* Today's summary */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="grid grid-cols-2 gap-px bg-line">
          {kpis.slice(0, 2).map((k) => (
            <div key={k.label} className="bg-card p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
                {k.icon}
                <span>{k.label}</span>
              </div>
              <p
                className={`mt-1 text-[17px] font-extrabold tracking-[-0.01em] tabular-nums ${
                  k.accent ? 'text-berry' : 'text-ink'
                }`}
              >
                {k.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <label htmlFor="bills-search" className="sr-only">
          Search bills by number, customer, or payment method
        </label>
        <input
          id="bills-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bill #, customer, phone, or UPI/Cash…"
          className={`${input} rounded-full pl-9`}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-card/60 px-6 py-14 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-panel text-muted">
            <ReceiptText className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[13px] font-semibold text-ink">
            {orders.length === 0 ? 'No bills yet' : 'No matching bills'}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {orders.length === 0
              ? 'Completed bills from the counter will appear here.'
              : 'Try a bill number, customer name, or payment method.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.key} aria-label={`Bills from ${group.label}`}>
              <div className="mb-2 flex items-baseline justify-between px-0.5">
                <h2 className="text-[12px] font-bold text-ink">{group.label}</h2>
                <p className="text-[10px] font-medium tabular-nums text-muted">
                  {group.orders.length} {group.orders.length === 1 ? 'bill' : 'bills'} ·{' '}
                  {formatCurrency(group.revenue, curr)}
                </p>
              </div>

              <div className="space-y-2">
                {group.orders.map((order) => {
                  const dt = new Date(order.createdAt);
                  const timeLabel = dt.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const itemSummary = order.items
                    .map((i) => `${i.quantity}× ${i.cakeName} (${describeCartItem(i)})`)
                    .join(', ');
                  const PaymentIcon = PAYMENT_ICONS[order.paymentMethod];
                  const printFailed =
                    order.printState === 'failed' || order.printState === 'uncertain';
                  const printLabel = printFailed
                    ? order.printState === 'uncertain'
                      ? 'Check paper'
                      : 'Print failed'
                    : order.printState === 'pending'
                      ? 'Print pending'
                      : order.printedAt
                        ? 'Sent'
                        : 'Not printed';

                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => onSelectOrder(order)}
                      className={`group flex w-full items-center gap-3 rounded-xl border border-line bg-card p-3 text-left transition-colors hover:border-line-strong hover:bg-panel/60 ${focus}`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-muted">
                        <PaymentIcon className="h-4 w-4" aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium tabular-nums text-muted">
                          <span className="font-semibold text-muted">{order.billNumber}</span>
                          {order.isDemo && (
                            <span className="rounded bg-caramel-tint px-1 py-0.5 text-[8px] font-bold uppercase text-caramel">
                              Demo
                            </span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{timeLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{order.paymentMethod}</span>
                          {isScheduled(order) && (
                            <span className={tonePill(orderStatus(order) === 'ready' ? 'pistachio' : 'caramel')}>
                              {STATUS_LABEL[orderStatus(order)]} · {formatDueLabel(order)}
                            </span>
                          )}
                          {orderStatus(order) === 'cancelled' && (
                            <span className={tonePill('berry')}>Cancelled</span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] font-semibold text-ink">
                          {order.customerName || 'Walk-in customer'}
                        </span>
                        <span className="mt-0.5 block truncate text-[10.5px] text-muted">
                          {itemSummary}
                        </span>
                      </span>

                      <span className="flex shrink-0 flex-col items-end gap-0.5">
                        <span className="text-[13.5px] font-bold tabular-nums text-ink">
                          {formatCurrency(order.total, curr)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[9.5px] font-semibold ${
                            printFailed
                              ? 'text-berry-deep'
                              : order.printedAt
                                ? 'text-pistachio'
                                : 'text-caramel'
                          }`}
                        >
                          {order.printedAt && !printFailed ? (
                            <Check className="h-2.5 w-2.5" aria-hidden="true" />
                          ) : (
                            <Printer className="h-2.5 w-2.5" aria-hidden="true" />
                          )}
                          {printLabel}
                        </span>
                      </span>

                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-muted-soft transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
