import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Printer, ReceiptText, Search, X } from 'lucide-react';
import { useSheetHistory } from '../hooks/useSheetHistory';
import {
  CAKE_CATEGORIES,
  type CakeCategory,
  type CakeItem,
  type CartItem,
  type FulfilmentType,
  type PaymentMethod,
  type PrinterMode,
  type ShopSettings,
} from '../types/pos';
import { calculateBillTotals, filterCakes, formatCurrency } from '../utils/billing';
import {
  computeConfiguredPrice,
  type PriceBreakdown,
  type WeightOption,
} from '../utils/pricing';
import { BillPanel } from './BillPanel';
import { CakeRow } from './CakeRow';
import { ConfigureItemSheet } from './ConfigureItemSheet';
import { btnPrimary, chip, focus, input } from '../ui';

interface PosCounterViewProps {
  cakes: CakeItem[];
  cart: CartItem[];
  settings: ShopSettings;
  discountAmount: number;
  onChangeDiscount: (val: number) => void;
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: (m: PaymentMethod) => void;
  customerName: string;
  onChangeCustomerName: (v: string) => void;
  customerPhone: string;
  onChangeCustomerPhone: (v: string) => void;
  orderNote: string;
  onChangeOrderNote: (v: string) => void;
  onAddConfiguredItem: (
    cake: CakeItem,
    pricing: PriceBreakdown,
    message: string,
    notes: string,
  ) => void;
  onUpdateConfiguredItem: (
    oldKey: string,
    cake: CakeItem,
    pricing: PriceBreakdown,
    message: string,
    notes: string,
  ) => void;
  onUpdateQty: (key: string, delta: number) => void;
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
}

interface SheetState {
  cake: CakeItem;
  weightKg?: number;
  item?: CartItem;
}

interface ToastState {
  id: number;
  text: string;
}

export function PosCounterView({
  cakes,
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
  onAddConfiguredItem,
  onUpdateConfiguredItem,
  onUpdateQty,
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
}: PosCounterViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CakeCategory | 'All'>('All');
  const [mobileBillOpen, setMobileBillOpen] = useState(false);
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const flashTimer = useRef<number | null>(null);
  const closeMobileBill = useSheetHistory(mobileBillOpen, () => setMobileBillOpen(false));

  const visibleCakes = useMemo(
    () => filterCakes(cakes, search, category, false),
    [cakes, search, category],
  );

  const totals = useMemo(
    () => calculateBillTotals(cart, discountAmount, settings.taxRate),
    [cart, discountAmount, settings.taxRate],
  );

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileBillOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileBill();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileBillOpen, closeMobileBill]);

  useEffect(() => {
    if (cart.length === 0) setMobileBillOpen(false);
  }, [cart.length]);

  const showToast = (text: string, cakeId?: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    const id = Date.now();
    setToast({ id, text });
    setJustAddedId(cakeId ?? null);
    toastTimer.current = window.setTimeout(() => setToast(null), 1900);
    flashTimer.current = window.setTimeout(() => setJustAddedId(null), 1200);
  };

  const handleQuickAdd = (cake: CakeItem, option: WeightOption) => {
    const priced = computeConfiguredPrice(cake, {
      weightKg: option.kg,
      flavour: null,
      eggless: false,
      quantity: 1,
    });
    if (!priced.ok) {
      showToast(priced.error);
      return;
    }
    onAddConfiguredItem(cake, priced.pricing, '', '');
    showToast(
      `Added ${cake.name} · ${option.label} regular · ${formatCurrency(
        priced.pricing.lineTotal,
        settings.currencySymbol,
      )}`,
      cake.id,
    );
  };

  const handleConfigure = (cake: CakeItem, weightKg?: number) => {
    setSheet({ cake, weightKg });
  };

  const handleEditItem = (item: CartItem) => {
    const cake = cakes.find((c) => c.id === item.cakeId);
    if (!cake) {
      showToast('This cake is no longer in the menu. Remove the line or keep it as a legacy item.');
      return;
    }
    setSheet({ cake, weightKg: item.weightKg || undefined, item });
  };

  const handleSubmitSheet = (
    cake: CakeItem,
    pricing: PriceBreakdown,
    message: string,
    notes: string,
  ) => {
    if (sheet?.item) {
      onUpdateConfiguredItem(sheet.item.key, cake, pricing, message, notes);
      showToast(`Updated ${cake.name}`);
    } else {
      onAddConfiguredItem(cake, pricing, message, notes);
      showToast(
        `Added ${cake.name} · ${pricing.weightLabel} · ${formatCurrency(
          pricing.lineTotal,
          settings.currencySymbol,
        )}`,
        cake.id,
      );
    }
  };

  const billPanelProps = {
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
    onEditItem: handleEditItem,
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
  };

  return (
    <div className="mx-auto max-w-7xl px-3 pb-32 pt-3 sm:px-6 md:pb-10 md:pt-5">
      <div className="items-start lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
        <div className="min-w-0 lg:col-span-8">
          <div className="px-1">
            <h1 className="text-[23px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
              Cake counter
            </h1>
            <p className="mt-0.5 text-[11px] text-muted sm:text-xs">
              Tap a weight to bill. Custom cakes ask flavour once.
            </p>
          </div>

          <div className="sticky top-14 z-20 -mx-3 mt-2 border-b border-line/70 bg-cream/95 px-3 py-2 backdrop-blur-xl sm:mx-0 sm:mt-3 sm:border-0 sm:bg-transparent sm:px-1 sm:py-2.5">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <label htmlFor="pos-cake-search" className="sr-only">
                Search cakes by name or code
              </label>
              <input
                id="pos-cake-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cake or code…"
                className={`${input} rounded-full pl-9`}
              />
            </div>

            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar chip-fade">
              {(['All', ...CAKE_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                  className={chip(category === cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-medium text-muted">
            <span className="tabular-nums">
              {visibleCakes.length} {visibleCakes.length === 1 ? 'cake' : 'cakes'}
              {category !== 'All' ? ` · ${category}` : ''}
            </span>
          </div>

          {visibleCakes.length === 0 ? (
            <div className="mt-2 rounded-xl border border-dashed border-line-strong bg-card/60 px-6 py-12 text-center">
              <p className="text-[13px] font-semibold text-ink">No cakes match</p>
              <p className="mt-1 text-[11px] text-muted">Try another name, code, or category.</p>
            </div>
          ) : (
            <div className="mt-1.5 rounded-xl border border-line bg-card px-3 sm:px-3.5">
              {visibleCakes.map((cake) => (
                <CakeRow
                  key={cake.id}
                  cake={cake}
                  currencySymbol={settings.currencySymbol}
                  justAdded={justAddedId === cake.id}
                  onQuickAdd={handleQuickAdd}
                  onConfigure={handleConfigure}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-[72px] lg:col-span-4 lg:block">
          <BillPanel {...billPanelProps} />
        </aside>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-[7.5rem] left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl bg-ink px-3.5 py-2.5 text-center text-[11.5px] font-semibold text-white shadow-xl sm:bottom-6"
        >
          {toast.text}
        </div>
      )}

      {cart.length > 0 && (
        <div className="bill-bar-bottom pointer-events-none fixed left-0 right-0 z-30 px-3 pb-1 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileBillOpen(true)}
            aria-label={`View current bill, ${totals.itemCount} items, total ${formatCurrency(
              totals.total,
              settings.currencySymbol,
            )}`}
            className={`pointer-events-auto flex w-full items-center justify-between gap-3 rounded-2xl bg-ink px-3.5 py-2.5 text-white shadow-xl shadow-ink/20 transition active:scale-[0.995] ${focus}`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                <ReceiptText className="h-4 w-4" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-berry px-1 text-[9px] font-bold tabular-nums">
                  {totals.itemCount}
                </span>
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[9.5px] font-medium text-white/55">Current bill</span>
                <span className="block truncate text-[14px] font-bold tabular-nums">
                  {formatCurrency(totals.total, settings.currencySymbol)}
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-white/90">
              View bill
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      )}

      {mobileBillOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-ink/55 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobileBill}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Current bill"
            className="animate-sheet-up flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-cream"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
            <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-2">
              <div className="min-w-0">
                <p className="text-[15px] font-extrabold tracking-[-0.01em] text-ink">Current bill</p>
                <p className="text-[10.5px] tabular-nums text-muted">
                  {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} ·{' '}
                  {settings.paperWidth}mm receipt
                </p>
              </div>
              <button
                type="button"
                onClick={closeMobileBill}
                aria-label="Close bill"
                className={`grid h-9 w-9 place-items-center rounded-lg bg-card text-muted transition-colors hover:text-ink ${focus}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-1">
              <BillPanel {...billPanelProps} embedded hideCheckout />
            </div>

            <div className="shrink-0 border-t border-line bg-card px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[11px] font-semibold text-muted">Total · {paymentMethod}</span>
                <span className="text-[21px] font-extrabold tracking-[-0.01em] tabular-nums text-ink">
                  {formatCurrency(totals.total, settings.currencySymbol)}
                </span>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                disabled={isCheckingOut}
                className={`${btnPrimary} w-full`}
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isCheckingOut
                    ? 'Saving & sending…'
                    : scheduleMode === 'schedule'
                      ? `Save order · ${formatCurrency(totals.total, settings.currencySymbol)}`
                      : printerConnected && autoPrintOnCheckout
                        ? `Save & print · ${formatCurrency(totals.total, settings.currencySymbol)}`
                        : `Save bill · ${formatCurrency(totals.total, settings.currencySymbol)}`}
                </span>
              </button>
              <p className="mt-1.5 text-center text-[9.5px] font-medium text-muted">
                {printerConnected
                  ? printerMode === 'simulated'
                    ? 'Test simulator — no physical receipt'
                    : autoPrintOnCheckout
                      ? 'No preview step · receipt sends after the save'
                      : 'Auto-print is off · bill saved only'
                  : 'Printer offline · bill saves without printing'}
              </p>
            </div>
          </div>
        </div>
      )}

      {sheet && (
        <ConfigureItemSheet
          cake={sheet.cake}
          currencySymbol={settings.currencySymbol}
          initialWeightKg={sheet.weightKg}
          initialItem={sheet.item ?? null}
          onClose={() => setSheet(null)}
          onSubmit={handleSubmitSheet}
        />
      )}
    </div>
  );
}
