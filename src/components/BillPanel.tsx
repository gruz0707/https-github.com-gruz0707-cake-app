import { Minus, Plus, Printer, Trash2 } from 'lucide-react';
import type { CartItem, PaymentMethod, ShopSettings } from '../types/pos';
import { calculateBillTotals, formatCurrency } from '../utils/billing';

interface BillPanelProps {
  cart: CartItem[];
  settings: ShopSettings;
  discountAmount: number;
  onChangeDiscount: (val: number) => void;
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: (method: PaymentMethod) => void;
  customerName: string;
  onChangeCustomerName: (name: string) => void;
  customerPhone: string;
  onChangeCustomerPhone: (phone: string) => void;
  orderNote: string;
  onChangeOrderNote: (note: string) => void;
  onUpdateQty: (key: string, delta: number) => void;
  onToggleEggless: (key: string) => void;
  onUpdateItemMessage: (key: string, msg: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  canEgglessMap: Record<string, boolean>;
  printerConnected: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Cash', 'Card'];

export function BillPanel({
  cart,
  settings,
  discountAmount,
  onChangeDiscount,
  paymentMethod,
  onChangePaymentMethod,
  customerName,
  onChangeCustomerName,
  customerPhone,
  onChangeCustomerPhone,
  orderNote,
  onChangeOrderNote,
  onUpdateQty,
  onToggleEggless,
  onUpdateItemMessage,
  onClearCart,
  onCheckout,
  canEgglessMap,
  printerConnected,
}: BillPanelProps) {
  const totals = calculateBillTotals(cart, discountAmount, settings.taxRate);
  const curr = settings.currencySymbol;

  return (
    <section
      aria-label="Current Bill"
      className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden"
    >
      <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Current Bill
          </h2>
          <p className="text-xs text-slate-500 tabular-nums">
            {totals.itemCount === 0
              ? 'Tap any cake size to add'
              : `${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'} · ${settings.paperWidth}mm receipt`}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            aria-label="Clear current bill"
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 inline-flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-slate-900"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-700">Bill is empty</p>
          <p className="mt-1 text-xs text-slate-500">
            Select cake weights from the counter grid to build a customer receipt.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {/* Line items */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 px-4">
            {cart.map((item) => {
              const supportsEggless = Boolean(canEgglessMap[item.cakeId]);
              return (
                <div key={item.key} className="py-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.cakeName}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {item.variantLabel} · {formatCurrency(item.unitPrice, curr)} each
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums shrink-0">
                      {formatCurrency(item.unitPrice * item.quantity, curr)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.key, -1)}
                        aria-label={`Decrease quantity of ${item.cakeName} (${item.variantLabel})`}
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 focus-visible:outline-2 focus-visible:outline-slate-900"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span
                        data-testid={`qty-${item.key}`}
                        className="w-7 text-center text-sm font-semibold tabular-nums text-slate-900"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.key, 1)}
                        aria-label={`Increase quantity of ${item.cakeName} (${item.variantLabel})`}
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 focus-visible:outline-2 focus-visible:outline-slate-900"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    {supportsEggless && (
                      <button
                        type="button"
                        onClick={() => onToggleEggless(item.key)}
                        aria-pressed={item.eggless}
                        className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                          item.eggless
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.eggless ? 'Eggless ✓' : 'Standard'}
                      </button>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`msg-${item.key}`} className="sr-only">
                      Cake inscription message for {item.cakeName}
                    </label>
                    <input
                      id={`msg-${item.key}`}
                      type="text"
                      value={item.cakeMessage || ''}
                      onChange={(e) => onUpdateItemMessage(item.key, e.target.value)}
                      placeholder="Cake message (e.g. Happy Birthday)"
                      maxLength={60}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Customer & Discount */}
          <div className="p-4 space-y-3 bg-slate-50/70">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="bill-customer-name" className="block text-[11px] font-medium text-slate-600 mb-1">
                  Customer Name
                </label>
                <input
                  id="bill-customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => onChangeCustomerName(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="bill-customer-phone" className="block text-[11px] font-medium text-slate-600 mb-1">
                  Phone
                </label>
                <input
                  id="bill-customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => onChangeCustomerPhone(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="bill-discount" className="block text-[11px] font-medium text-slate-600 mb-1">
                  Discount ({curr})
                </label>
                <input
                  id="bill-discount"
                  type="number"
                  min={0}
                  step="1"
                  value={discountAmount === 0 ? '' : discountAmount}
                  onChange={(e) => {
                    const parsed = Number.parseFloat(e.target.value);
                    onChangeDiscount(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 tabular-nums focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="bill-order-note" className="block text-[11px] font-medium text-slate-600 mb-1">
                  Order Note
                </label>
                <input
                  id="bill-order-note"
                  type="text"
                  value={orderNote}
                  onChange={(e) => onChangeOrderNote(e.target.value)}
                  placeholder="Box, candles..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <span className="block text-[11px] font-medium text-slate-600 mb-1.5">
                Payment Method
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                {PAYMENT_METHODS.map((method) => {
                  const active = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => onChangePaymentMethod(method)}
                      aria-pressed={active}
                      className={`min-h-[38px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Totals & Charge CTA */}
          <div className="p-4 space-y-3 bg-white">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-slate-900">
                  {formatCurrency(totals.subtotal, curr)}
                </span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount</span>
                  <span className="tabular-nums font-medium">
                    -{formatCurrency(totals.discountAmount, curr)}
                  </span>
                </div>
              )}
              {settings.taxRate > 0 && (
                <div className="flex justify-between">
                  <span>Tax ({settings.taxRate}%)</span>
                  <span className="tabular-nums font-medium text-slate-900">
                    {formatCurrency(totals.taxAmount, curr)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-base font-bold text-slate-950">
                <span>Total</span>
                <span data-testid="bill-total" className="tabular-nums">
                  {formatCurrency(totals.total, curr)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>
                {printerConnected
                  ? `Charge ${formatCurrency(totals.total, curr)} & Print`
                  : `Create Bill · ${formatCurrency(totals.total, curr)}`}
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
