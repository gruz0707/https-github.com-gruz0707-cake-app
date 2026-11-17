import { useMemo, useState } from 'react';
import { ChevronRight, Printer, Search } from 'lucide-react';
import type { BillOrder, ShopSettings } from '../types/pos';
import { computeDailySummary, formatCurrency } from '../utils/billing';

interface BillsHistoryViewProps {
  orders: BillOrder[];
  settings: ShopSettings;
  onSelectOrder: (order: BillOrder) => void;
}

export function BillsHistoryView({
  orders,
  settings,
  onSelectOrder,
}: BillsHistoryViewProps) {
  const [query, setQuery] = useState('');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-24 md:pb-8 space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Bills &amp; Daily Sales
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Tap any completed bill to view or reprint the thermal receipt.
        </p>
      </div>

      {/* Today's Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">Today&apos;s Revenue</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums">
            {formatCurrency(summary.totalRevenue, curr)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">Bills Today</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums">
            {summary.ordersCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">Avg. Ticket</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums">
            {formatCurrency(summary.averageTicket, curr)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium">Receipts Printed</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-950 tabular-nums">
            {summary.printedCount}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
          placeholder="Search bill #, customer name, phone, or UPI/Cash..."
          className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
        />
      </div>

      {/* Bills List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-sm font-semibold text-slate-800">No bills recorded yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Completed bills from Counter Billing will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {filteredOrders.map((order) => {
            const dt = new Date(order.createdAt);
            const timeLabel = dt.toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });
            const itemSummary = order.items
              .map((i) => `${i.quantity}x ${i.cakeName} (${i.variantLabel})`)
              .join(', ');

            return (
              <button
                key={order.id}
                type="button"
                onClick={() => onSelectOrder(order)}
                className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-slate-900"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-mono text-sm font-semibold text-slate-950">
                      {order.billNumber}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-xs text-slate-500">{timeLabel}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      {order.paymentMethod}
                    </span>
                    {order.customerName && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="text-xs text-slate-600">{order.customerName}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 truncate">{itemSummary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm sm:text-base font-bold text-slate-950 tabular-nums">
                      {formatCurrency(order.total, curr)}
                    </p>
                    <p className="text-[11px] text-slate-500 inline-flex items-center gap-1 justify-end">
                      <Printer className="w-3 h-3" aria-hidden="true" />
                      <span>{order.printedAt ? 'Printed' : 'Not printed'}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
