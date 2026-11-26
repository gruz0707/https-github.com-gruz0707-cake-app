import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CakeSlice, Check, Info, X } from 'lucide-react';
import { useSheetHistory } from '../hooks/useSheetHistory';
import type { CakeItem, CartItem } from '../types/pos';
import { formatCurrency } from '../utils/billing';
import {
  CUSTOM_FLAVOURS,
  cakeOffersEggless,
  cakeOffersFlavourChoice,
  computeConfiguredPrice,
  getDefaultWeightOption,
  getWeightOptions,
  type PriceBreakdown,
} from '../utils/pricing';
import { btnGhost, btnPrimary, fieldLabel, focus, inputSmall } from '../ui';

interface ConfigureItemSheetProps {
  cake: CakeItem;
  currencySymbol: string;
  initialWeightKg?: number;
  initialItem?: CartItem | null;
  onClose: () => void;
  onSubmit: (
    cake: CakeItem,
    pricing: PriceBreakdown,
    cakeMessage: string,
    notes: string,
  ) => void;
}

export function ConfigureItemSheet({
  cake,
  currencySymbol,
  initialWeightKg,
  initialItem,
  onClose,
  onSubmit,
}: ConfigureItemSheetProps) {
  const options = useMemo(() => getWeightOptions(cake), [cake]);
  const defaultOption = getDefaultWeightOption(cake);
  const flavourChoice = cakeOffersFlavourChoice(cake);
  const canEggless = cakeOffersEggless(cake);

  const [weightKg, setWeightKg] = useState<number>(
    initialItem?.weightKg || initialWeightKg || defaultOption?.kg || 0,
  );
  const [flavour, setFlavour] = useState<string>(initialItem?.flavour ?? '');
  const [eggless, setEggless] = useState<boolean>(initialItem?.eggless ?? false);
  const [cakeMessage, setCakeMessage] = useState(initialItem?.cakeMessage ?? '');
  const [notes, setNotes] = useState(initialItem?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const quantity = initialItem?.quantity ?? 1;
  // Android Back closes the sheet, not the app, and never touches the bill.
  const closeSheet = useSheetHistory(true, onClose);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeSheet]);

  const pricing = useMemo(
    () =>
      computeConfiguredPrice(cake, {
        weightKg,
        flavour: flavourChoice ? flavour : null,
        eggless,
        quantity,
      }),
    [cake, weightKg, flavour, flavourChoice, eggless, quantity],
  );

  const handleSubmit = () => {
    if (!pricing.ok) {
      setError(pricing.error);
      return;
    }
    onSubmit(cake, pricing.pricing, cakeMessage.trim(), notes.trim());
    closeSheet();
  };

  const selectedOption = options.find((o) => Math.round(o.kg * 1000) === Math.round(weightKg * 1000));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={closeSheet}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="configure-title"
        className="animate-sheet-up flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-card shadow-2xl sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-panel">
              {cake.imageUrl ? (
                <img
                  src={cake.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallback === '1') return;
                    e.currentTarget.dataset.fallback = '1';
                    if (cake.fallbackImageUrl) e.currentTarget.src = cake.fallbackImageUrl;
                  }}
                />
              ) : (
                <CakeSlice className="h-5 w-5 text-muted" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <h2 id="configure-title" className="truncate text-[15px] font-extrabold leading-tight text-ink">
                {cake.name}
              </h2>
              <p className="mt-0.5 text-[10.5px] text-muted">
                {initialItem ? 'Edit this bill item' : 'Choose weight and options'}
                {quantity > 1 ? ` · Qty ${quantity}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close item options"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-panel hover:text-ink ${focus}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {options.length === 0 ? (
            <div className="rounded-xl border border-berry/25 bg-berry-tint px-3 py-2.5 text-[11.5px] font-medium text-berry-deep">
              This cake has no valid weight price. Correct it in the Menu before billing.
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <span className={fieldLabel}>Weight</span>
                <span className="text-[10px] font-medium text-muted tabular-nums">
                  Prices to 8 kg
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {options.map((option) => {
                  const active =
                    Math.round(option.kg * 1000) === Math.round(weightKg * 1000);
                  return (
                    <button
                      key={option.kg}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setWeightKg(option.kg);
                        setError(null);
                      }}
                      className={`min-h-11 rounded-lg border px-1 py-1 text-center leading-tight transition-colors ${focus} ${
                        active
                          ? 'border-berry bg-berry text-white'
                          : 'border-line bg-card text-ink hover:border-line-strong hover:bg-panel'
                      }`}
                    >
                      <span className="block text-[10.5px] font-bold">{option.label}</span>
                      <span
                        className={`block text-[10px] font-semibold tabular-nums ${
                          active ? 'text-white/90' : 'text-muted'
                        }`}
                      >
                        {formatCurrency(option.price, currencySymbol)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {flavourChoice && (
                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className={fieldLabel}>
                      Flavour <span className="text-berry">*</span>
                    </span>
                    <span className="text-[10px] font-medium text-muted">
                      Premium flavours +₹150/kg
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CUSTOM_FLAVOURS.map((option) => {
                      const active = flavour === option.name;
                      return (
                        <button
                          key={option.name}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setFlavour(option.name);
                            setError(null);
                          }}
                          className={`flex min-h-10 items-center justify-between gap-1 rounded-lg border px-2 text-left text-[11px] font-semibold transition-colors ${focus} ${
                            active
                              ? 'border-berry bg-berry-tint text-berry-deep'
                              : 'border-line bg-card text-ink hover:border-line-strong hover:bg-panel'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {active && <Check className="h-3 w-3" aria-hidden="true" />}
                            {option.name}
                          </span>
                          {option.extraPerKg > 0 && (
                            <span className="text-[9px] font-bold tabular-nums text-caramel">
                              +{formatCurrency(option.extraPerKg, currencySymbol)}/kg
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!flavour && (
                    <p className="mt-1.5 text-[10.5px] font-medium text-caramel">
                      Select a flavour to continue — no premium flavour is chosen automatically.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 rounded-xl border border-line bg-panel/60 px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-ink">Eggless</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {canEggless
                        ? `+${formatCurrency(100, currencySymbol)}/kg · regular is the default`
                        : 'Not available for this cake'}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={eggless}
                    aria-label="Make this cake eggless"
                    disabled={!canEggless}
                    onClick={() => {
                      setEggless((v) => !v);
                      setError(null);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-40 ${focus} ${
                      eggless ? 'border-pistachio bg-pistachio' : 'border-line-strong bg-line'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
                        eggless ? 'translate-x-[22px]' : 'translate-x-[3px]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <div>
                  <label htmlFor="config-message" className={fieldLabel}>
                    Cake message (optional)
                  </label>
                  <input
                    id="config-message"
                    type="text"
                    value={cakeMessage}
                    maxLength={60}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    placeholder="e.g. Happy Birthday Maya"
                    className={inputSmall}
                  />
                </div>
                <div>
                  <label htmlFor="config-notes" className={fieldLabel}>
                    Notes (optional)
                  </label>
                  <input
                    id="config-notes"
                    type="text"
                    value={notes}
                    maxLength={120}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Box, candles, pickup time…"
                    className={inputSmall}
                  />
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-line bg-card px-3 py-2.5 text-[11.5px]">
                <div className="flex justify-between text-muted">
                  <span>Base · {selectedOption?.label ?? '—'}</span>
                  <span className="font-semibold tabular-nums text-ink">
                    {formatCurrency(pricing.ok ? pricing.pricing.basePrice : 0, currencySymbol)}
                  </span>
                </div>
                {pricing.ok && pricing.pricing.flavourExtra > 0 && (
                  <div className="mt-1 flex justify-between text-muted">
                    <span>Flavour · {pricing.pricing.flavour}</span>
                    <span className="font-semibold tabular-nums text-ink">
                      +{formatCurrency(pricing.pricing.flavourExtra, currencySymbol)}
                    </span>
                  </div>
                )}
                {pricing.ok && pricing.pricing.egglessExtra > 0 && (
                  <div className="mt-1 flex justify-between text-muted">
                    <span>Eggless</span>
                    <span className="font-semibold tabular-nums text-ink">
                      +{formatCurrency(pricing.pricing.egglessExtra, currencySymbol)}
                    </span>
                  </div>
                )}
                <div className="mt-1.5 flex items-baseline justify-between border-t border-line pt-1.5">
                  <span className="font-semibold text-ink">
                    {quantity > 1 ? `${quantity} × item` : 'Item total'}
                  </span>
                  <span className="text-[16px] font-extrabold tabular-nums text-ink">
                    {formatCurrency(pricing.ok ? pricing.pricing.lineTotal : 0, currencySymbol)}
                  </span>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-2 flex items-start gap-1.5 rounded-lg border border-berry/25 bg-berry-tint px-2.5 py-2 text-[11px] font-medium text-berry-deep"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-line bg-card px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
          <div className="flex gap-2">
            <button type="button" onClick={closeSheet} className={`${btnGhost} shrink-0`}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!pricing.ok}
              className={`${btnPrimary} flex-1`}
            >
              {initialItem ? 'Update item' : 'Add to bill'}
              {pricing.ok
                ? ` · ${formatCurrency(pricing.pricing.lineTotal, currencySymbol)}`
                : ''}
            </button>
          </div>
          {!canEggless && (
            <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] font-medium text-muted">
              <Info className="h-3 w-3" aria-hidden="true" />
              Eggless is not offered on this cake.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
