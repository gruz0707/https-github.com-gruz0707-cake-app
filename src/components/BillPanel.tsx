import { useState } from 'react';
import {
  Banknote,
  CakeSlice,
  ChevronDown,
  CreditCard,
  Minus,
  Pencil,
  Plus,
  Printer,
  ReceiptText,
  Smartphone,
  Trash2,
} from 'lucide-react';
import type { CartItem, FulfilmentType, PaymentMethod, PrinterMode, ShopSettings } from '../types/pos';
import { ScheduleFields } from './ScheduleFields';
import { calculateBillTotals, formatCurrency } from '../utils/billing';
import { describeCartItem } from '../utils/pricing';
import { Segmented, type SegmentedOption } from './Segmented';
import { btnPrimary, card, fieldLabel, focus, inputSmall } from '../ui';

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
  onEditItem: (item: CartItem) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
  printerConnected: boolean;
  printerMode: PrinterMode;
  autoPrintOnCheckout: boolean;
  scheduleMode: 'now' | 'schedule';
  onScheduleMode: (m: 'now' | 'schedule') => void;
  fulfilmentType: FulfilmentType;
  onFulfilmentType: (t: FulfilmentType) => void;
  fulfilmentDate: string;
  onFulfilmentDate: (d: string) => void;
  fulfilmentTime: string;
  onFulfilmentTime: (t: string) => void;
  deliveryAddress: string;
  onDeliveryAddress: (a: string) => void;
  advanceAmount: number;
  onAdvanceAmount: (n: number) => void;
  embedded?: boolean;
  hideCheckout?: boolean;
}

const PAYMENT_OPTIONS: Array<SegmentedOption<PaymentMethod>> = [
  {
    value: 'Cash',
    label: 'Cash',
    icon: <Banknote className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  {
    value: 'UPI',
    label: 'UPI',
    icon: <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  {
    value: 'Card',
    label: 'Card',
    icon: <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />,
  },
];

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
  onEditItem,
  onClearCart,
  onCheckout,
  isCheckingOut,
  printerConnected,
  printerMode,
  autoPrintOnCheckout,
  scheduleMode,
  onScheduleMode,
  fulfilmentType,
  onFulfilmentType,
  fulfilmentDate,
  onFulfilmentDate,
  fulfilmentTime,
  onFulfilmentTime,
  deliveryAddress,
  onDeliveryAddress,
  advanceAmount,
  onAdvanceAmount,
  embedded = false,
  hideCheckout = false,
}: BillPanelProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const totals = calculateBillTotals(cart, discountAmount, settings.taxRate);
  const curr = settings.currencySymbol;
  const willPrint = printerConnected && autoPrintOnCheckout;
  const hasDetails =
    discountAmount > 0 || Boolean(customerName.trim()) || Boolean(customerPhone.trim()) || Boolean(orderNote.trim());

  const scheduling = scheduleMode === 'schedule';
  const advance = Math.min(Math.max(0, advanceAmount), totals.total);
  const balance = Math.max(0, totals.total - advance);
  const checkoutLabel = isCheckingOut
    ? 'Saving & sending…'
    : scheduling
      ? `Save order · ${formatCurrency(totals.total, curr)}`
      : willPrint
        ? `Save & print · ${formatCurrency(totals.total, curr)}`
        : `Save bill · ${formatCurrency(totals.total, curr)}`;

  return (
    <section
      aria-label="Current Bill"
      className={`flex flex-col overflow-hidden ${
        embedded
          ? 'rounded-2xl border border-line bg-card'
          : `${card} shadow-[0_1px_2px_rgba(26,23,18,0.04)]`
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-[14px] font-extrabold tracking-[-0.01em] text-ink">Current bill</h2>
          <span className="rounded-full bg-berry-tint px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-berry-deep">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            aria-label="Clear current bill"
            className={`inline-flex h-7 items-center gap-1 rounded-md px-2 text-[10.5px] font-semibold text-muted transition-colors hover:bg-berry-tint hover:text-berry-deep ${focus}`}
          >
            <Trash2 className="h-3 w-3" aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-9 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-panel text-muted">
            <ReceiptText className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-2.5 text-[13px] font-semibold text-ink">Bill is empty</p>
          <p className="mt-0.5 text-[11px] text-muted">
            Tap a weight on a cake to add it. Custom cakes open one options sheet.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`divide-y divide-line/70 px-3.5 ${
              embedded ? '' : 'max-h-[34vh] overflow-y-auto lg:max-h-[320px]'
            }`}
          >
            {cart.map((item) => (
              <div key={item.key} className="flex items-start gap-2 py-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-panel">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <CakeSlice className="h-4 w-4 text-muted" aria-hidden="true" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onEditItem(item)}
                  aria-label={`Edit ${item.cakeName} (${describeCartItem(item)})`}
                  className={`min-w-0 flex-1 rounded-md text-left ${focus}`}
                >
                  <span className="block truncate text-[12px] font-semibold text-ink">
                    {item.cakeName}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted">
                    {describeCartItem(item)}
                  </span>
                  <span className="mt-0.5 block text-[10.5px] font-bold tabular-nums text-ink">
                    {formatCurrency(item.unitPrice * item.quantity, curr)}
                  </span>
                </button>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="inline-flex items-center rounded-lg border border-line bg-card">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.key, -1)}
                      aria-label={`Decrease quantity of ${item.cakeName}`}
                      className={`grid h-10 w-10 place-items-center rounded-l-lg text-muted transition-colors hover:bg-panel hover:text-ink ${focus}`}
                    >
                      <Minus className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <span className="w-5 text-center text-[11px] font-bold tabular-nums text-ink">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.key, 1)}
                      aria-label={`Increase quantity of ${item.cakeName}`}
                      className={`grid h-10 w-10 place-items-center rounded-r-lg text-muted transition-colors hover:bg-panel hover:text-ink ${focus}`}
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditItem(item)}
                    className={`inline-flex h-6 items-center gap-0.5 rounded px-1 text-[9.5px] font-semibold text-muted transition-colors hover:text-ink ${focus}`}
                  >
                    <Pencil className="h-2.5 w-2.5" aria-hidden="true" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line bg-[#fbfaf8] px-3.5 py-2">
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              aria-expanded={detailsOpen}
              className={`flex w-full items-center justify-between gap-2 text-[11px] font-semibold text-muted transition-colors hover:text-ink ${focus}`}
            >
              <span>
                {hasDetails ? 'Customer / discount added' : 'Add customer, discount, or note'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {detailsOpen && (
              <div className="mt-2 space-y-2 pb-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="bill-customer-name" className={fieldLabel}>
                      Customer
                    </label>
                    <input
                      id="bill-customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => onChangeCustomerName(e.target.value)}
                      placeholder="Optional"
                      className={inputSmall}
                    />
                  </div>
                  <div>
                    <label htmlFor="bill-customer-phone" className={fieldLabel}>
                      Phone
                    </label>
                    <input
                      id="bill-customer-phone"
                      type="tel"
                      inputMode="tel"
                      value={customerPhone}
                      onChange={(e) => onChangeCustomerPhone(e.target.value)}
                      placeholder="Optional"
                      className={inputSmall}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="bill-discount" className={fieldLabel}>
                      Discount ({curr})
                    </label>
                    <input
                      id="bill-discount"
                      type="number"
                      min={0}
                      step="1"
                      inputMode="decimal"
                      value={discountAmount === 0 ? '' : discountAmount}
                      onChange={(e) => {
                        const parsed = Number.parseFloat(e.target.value);
                        onChangeDiscount(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
                      }}
                      placeholder="0"
                      className={`${inputSmall} tabular-nums`}
                    />
                  </div>
                  <div>
                    <label htmlFor="bill-order-note" className={fieldLabel}>
                      Order note
                    </label>
                    <input
                      id="bill-order-note"
                      type="text"
                      value={orderNote}
                      onChange={(e) => onChangeOrderNote(e.target.value)}
                      placeholder="Pickup time…"
                      className={inputSmall}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-line bg-[#fbfaf8] px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className={fieldLabel}>Fulfilment</span>
              {scheduling && (
                <span className="text-[9.5px] font-semibold tabular-nums text-caramel">
                  Balance {formatCurrency(balance, curr)}
                </span>
              )}
            </div>
            <Segmented
              className="w-full"
              ariaLabel="Bill now or schedule for later"
              options={[
                { value: 'now' as const, label: 'Now / walk-in' },
                { value: 'schedule' as const, label: 'Schedule' },
              ]}
              value={scheduleMode}
              onChange={onScheduleMode}
            />
            {scheduling && (
              <>
                <ScheduleFields
                  type={fulfilmentType}
                  date={fulfilmentDate}
                  time={fulfilmentTime}
                  address={deliveryAddress}
                  onType={onFulfilmentType}
                  onDate={onFulfilmentDate}
                  onTime={onFulfilmentTime}
                  onAddress={onDeliveryAddress}
                />
                <div>
                  <span className={fieldLabel}>Advance received now ({curr})</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[0, 0.25, 0.5, 1].map((fraction) => (
                      <button
                        key={fraction}
                        type="button"
                        onClick={() => onAdvanceAmount(Math.round(totals.total * fraction))}
                        aria-pressed={advance === Math.round(totals.total * fraction)}
                        className={`h-8 rounded-lg border px-2 text-[10px] font-bold tabular-nums transition-colors ${focus} ${
                          advance === Math.round(totals.total * fraction)
                            ? 'border-berry bg-berry-tint text-berry-deep'
                            : 'border-line bg-card text-muted hover:text-ink'
                        }`}
                      >
                        {fraction === 0 ? 'None' : `${fraction * 100}%`}
                      </button>
                    ))}
                    <input
                      type="number"
                      min={0}
                      max={totals.total}
                      inputMode="decimal"
                      value={advanceAmount === 0 ? '' : advanceAmount}
                      onChange={(e) => {
                        const parsed = Number.parseFloat(e.target.value);
                        onAdvanceAmount(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
                      }}
                      placeholder="0"
                      aria-label="Advance amount"
                      className={`${inputSmall} w-24 tabular-nums`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2 border-t border-line bg-card px-3.5 py-3">
            <div>
              <span className={fieldLabel}>Payment method</span>
              <Segmented
                className="w-full"
                ariaLabel="Payment method"
                options={PAYMENT_OPTIONS}
                value={paymentMethod}
                onChange={onChangePaymentMethod}
              />
            </div>

            <div className="space-y-1 text-[11px] text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-ink">
                  {formatCurrency(totals.subtotal, curr)}
                </span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-pistachio">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">
                    -{formatCurrency(totals.discountAmount, curr)}
                  </span>
                </div>
              )}
              {settings.taxRate > 0 && (
                <div className="flex justify-between">
                  <span>Tax ({settings.taxRate}%)</span>
                  <span className="font-semibold tabular-nums text-ink">
                    {formatCurrency(totals.taxAmount, curr)}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-line pt-1.5">
                <span className="text-[11.5px] font-semibold text-muted">Total · {paymentMethod}</span>
                <span
                  data-testid="bill-total"
                  className="text-[20px] font-extrabold tracking-[-0.01em] tabular-nums text-ink"
                >
                  {formatCurrency(totals.total, curr)}
                </span>
              </div>
            </div>

            {!hideCheckout && (
              <>
                <button
                  type="button"
                  onClick={onCheckout}
                  disabled={isCheckingOut}
                  className={`${btnPrimary} w-full`}
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  <span>{checkoutLabel}</span>
                </button>

                <p className="flex items-center justify-center gap-1.5 text-center text-[10px] font-medium text-muted">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      printerConnected ? 'bg-pistachio' : 'bg-muted-soft'
                    }`}
                    aria-hidden="true"
                  />
                  {scheduling
                    ? `Scheduled order · balance ${formatCurrency(balance, curr)} due at handover`
                    : printerConnected
                      ? printerMode === 'simulated'
                        ? 'Test simulator — no physical receipt'
                        : autoPrintOnCheckout
                          ? `${settings.paperWidth}mm receipt · prints after save`
                          : 'Auto-print is off — bill saved only'
                      : 'Printer offline — bill saves without printing'}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
