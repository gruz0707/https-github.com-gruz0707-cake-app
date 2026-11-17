import { useMemo, useState } from 'react';
import { ReceiptText, Search, X } from 'lucide-react';
import {
  CAKE_CATEGORIES,
  type CakeCategory,
  type CakeItem,
  type CakeVariant,
  type CartItem,
  type PaymentMethod,
  type ShopSettings,
} from '../types/pos';
import { calculateBillTotals, filterCakes, formatCurrency } from '../utils/billing';
import { BillPanel } from './BillPanel';
import { CakeCard } from './CakeCard';

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
  onAddToCart: (cake: CakeItem, variant: CakeVariant, eggless: boolean) => void;
  onUpdateQty: (key: string, delta: number) => void;
  onToggleEggless: (key: string) => void;
  onUpdateItemMessage: (key: string, msg: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  printerConnected: boolean;
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
  onAddToCart,
  onUpdateQty,
  onToggleEggless,
  onUpdateItemMessage,
  onClearCart,
  onCheckout,
  printerConnected,
}: PosCounterViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CakeCategory | 'All'>('All');
  const [egglessDefault, setEgglessDefault] = useState(false);
  const [mobileBillOpen, setMobileBillOpen] = useState(false);

  const visibleCakes = useMemo(
    () => filterCakes(cakes, search, category, false),
    [cakes, search, category],
  );

  const canEgglessMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const c of cakes) {
      map[c.id] = c.egglessAvailable;
    }
    return map;
  }, [cakes]);

  const totals = useMemo(
    () => calculateBillTotals(cart, discountAmount, settings.taxRate),
    [cart, discountAmount, settings.taxRate],
  );

  const handleCheckoutAndCloseSheet = () => {
    setMobileBillOpen(false);
    onCheckout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-28 md:pb-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
        {/* Left: Cake Counter Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                Counter Billing
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Tap a cake weight to add it directly to the thermal receipt.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEgglessDefault((v) => !v)}
              aria-pressed={egglessDefault}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap self-start sm:self-auto transition-colors focus-visible:outline-2 focus-visible:outline-slate-900 ${
                egglessDefault
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {egglessDefault ? 'Eggless Default: On' : 'Eggless Default: Off'}
            </button>
          </div>

          {/* Search & Category Tabs */}
          <div className="space-y-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
                placeholder="Search cakes, flavors, or SKU..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div
              role="tablist"
              aria-label="Filter cakes by category"
              className="flex items-center gap-1.5 overflow-x-auto pb-1"
            >
              {(['All', ...CAKE_CATEGORIES] as const).map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-slate-900 ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cakes Grid */}
          {visibleCakes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-sm font-semibold text-slate-800">No matching cakes found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try another search term or switch category filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleCakes.map((cake) => (
                <CakeCard
                  key={cake.id}
                  cake={cake}
                  currencySymbol={settings.currencySymbol}
                  egglessMode={egglessDefault}
                  onAddVariant={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Desktop Current Bill Panel */}
        <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20">
          <BillPanel
            cart={cart}
            settings={settings}
            discountAmount={discountAmount}
            onChangeDiscount={onChangeDiscount}
            paymentMethod={paymentMethod}
            onChangePaymentMethod={onChangePaymentMethod}
            customerName={customerName}
            onChangeCustomerName={onChangeCustomerName}
            customerPhone={customerPhone}
            onChangeCustomerPhone={onChangeCustomerPhone}
            orderNote={orderNote}
            onChangeOrderNote={onChangeOrderNote}
            onUpdateQty={onUpdateQty}
            onToggleEggless={onToggleEggless}
            onUpdateItemMessage={onUpdateItemMessage}
            onClearCart={onClearCart}
            onCheckout={onCheckout}
            canEgglessMap={canEgglessMap}
            printerConnected={printerConnected}
          />
        </aside>
      </div>

      {/* Mobile Compact Sticky Bill Trigger (48px tall + 56px BottomTabBar = 104px < 15% of 844px) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 px-3 pb-1.5 pointer-events-none">
          <button
            type="button"
            onClick={() => setMobileBillOpen(true)}
            className="pointer-events-auto w-full h-12 px-4 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
              <ReceiptText className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span className="tabular-nums">
                {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </span>
            </span>
            <span className="text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap">
              <span>View Bill</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-bold">
                {formatCurrency(totals.total, settings.currencySymbol)}
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Mobile Bottom Sheet Bill Drawer */}
      {mobileBillOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Current Bill Drawer"
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end"
        >
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="pt-2.5 pb-1 flex flex-col items-center border-b border-slate-100">
              <div className="w-10 h-1.5 rounded-full bg-slate-300 mb-2" />
              <div className="w-full px-4 pb-2 flex items-center justify-between">
                <span className="font-display text-base font-semibold text-slate-900">
                  Review &amp; Print Bill
                </span>
                <button
                  type="button"
                  onClick={() => setMobileBillOpen(false)}
                  aria-label="Close bill drawer"
                  className="w-11 h-11 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-3">
              <BillPanel
                cart={cart}
                settings={settings}
                discountAmount={discountAmount}
                onChangeDiscount={onChangeDiscount}
                paymentMethod={paymentMethod}
                onChangePaymentMethod={onChangePaymentMethod}
                customerName={customerName}
                onChangeCustomerName={onChangeCustomerName}
                customerPhone={customerPhone}
                onChangeCustomerPhone={onChangeCustomerPhone}
                orderNote={orderNote}
                onChangeOrderNote={onChangeOrderNote}
                onUpdateQty={onUpdateQty}
                onToggleEggless={onToggleEggless}
                onUpdateItemMessage={onUpdateItemMessage}
                onClearCart={onClearCart}
                onCheckout={handleCheckoutAndCloseSheet}
                canEgglessMap={canEgglessMap}
                printerConnected={printerConnected}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
