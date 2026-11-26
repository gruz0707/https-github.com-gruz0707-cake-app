import { useState } from 'react';
import { CakeSlice, Check, Leaf, SlidersHorizontal } from 'lucide-react';
import type { CakeItem } from '../types/pos';
import { formatCurrency } from '../utils/billing';
import {
  cakeOffersEggless,
  cakeOffersFlavourChoice,
  getDefaultWeightOption,
  getQuickWeightOptions,
  type WeightOption,
} from '../utils/pricing';
import { focus } from '../ui';

interface CakeRowProps {
  cake: CakeItem;
  currencySymbol: string;
  justAdded: boolean;
  onQuickAdd: (cake: CakeItem, weight: WeightOption) => void;
  onConfigure: (cake: CakeItem, weightKg?: number) => void;
}

export function CakeRow({
  cake,
  currencySymbol,
  justAdded,
  onQuickAdd,
  onConfigure,
}: CakeRowProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const quick = getQuickWeightOptions(cake);
  const defaultWeight = getDefaultWeightOption(cake);
  const flavourChoice = cakeOffersFlavourChoice(cake);
  const eggless = cakeOffersEggless(cake);
  const hasImage = Boolean(cake.imageUrl) && !imgFailed;

  return (
    <article
      className={`flex flex-col gap-2 border-b border-line py-2.5 transition-colors last:border-b-0 sm:flex-row sm:items-center ${
        justAdded ? 'bg-pistachio-tint/40' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-panel">
          {hasImage ? (
            <img
              src={cake.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              onError={(e) => {
                if (e.currentTarget.dataset.fallback === '1') {
                  setImgFailed(true);
                  return;
                }
                e.currentTarget.dataset.fallback = '1';
                if (cake.fallbackImageUrl) {
                  e.currentTarget.src = cake.fallbackImageUrl;
                } else {
                  setImgFailed(true);
                }
              }}
            />
          ) : (
            <CakeSlice className="h-5 w-5 text-muted" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[13px] font-bold leading-tight text-ink">{cake.name}</h3>
            {justAdded && (
              <Check className="h-3.5 w-3.5 shrink-0 text-pistachio" aria-hidden="true" />
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10.5px] text-muted">
            <span className="tabular-nums">{cake.sku}</span>
            {!cake.inStock && <span className="font-semibold text-caramel">Sold out</span>}
            {eggless && cake.inStock && (
              <span className="inline-flex items-center gap-0.5 font-semibold text-pistachio">
                <Leaf className="h-2.5 w-2.5" aria-hidden="true" />
                Eggless option
              </span>
            )}
            {flavourChoice && (
              <span className="font-semibold text-caramel">Flavour choice</span>
            )}
          </p>
          {defaultWeight && (
            <p className="mt-0.5 text-[11.5px] font-bold tabular-nums text-ink">
              {formatCurrency(defaultWeight.price, currencySymbol)}
              <span className="ml-1 text-[9.5px] font-medium text-muted">
                / {defaultWeight.label}
              </span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onConfigure(cake, defaultWeight?.kg)}
          disabled={!cake.inStock}
          aria-label={`More options for ${cake.name}`}
          className={`hidden h-10 shrink-0 items-center gap-1 rounded-lg border border-line bg-card px-2.5 text-[10.5px] font-semibold text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40 sm:inline-flex ${focus}`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          More
        </button>
      </div>

      <div className="flex items-stretch gap-1.5 sm:ml-auto sm:shrink-0 sm:justify-end">
        {quick.map((weight) => (
          <button
            key={`${cake.id}-${weight.kg}`}
            type="button"
            disabled={!cake.inStock}
            onClick={() =>
              flavourChoice ? onConfigure(cake, weight.kg) : onQuickAdd(cake, weight)
            }
            aria-label={
              flavourChoice
                ? `Configure ${cake.name} at ${weight.label} for ${formatCurrency(weight.price, currencySymbol)}`
                : `Add ${cake.name} ${weight.label} regular for ${formatCurrency(weight.price, currencySymbol)}`
            }
            className={`flex min-h-11 min-w-[78px] flex-1 flex-col items-center justify-center rounded-lg border border-pistachio/40 bg-pistachio-tint/50 px-2 py-1 text-center leading-tight transition-colors active:scale-[0.99] disabled:opacity-40 sm:flex-none ${focus}`}
          >
            <span className="text-[10.5px] font-bold text-pistachio">{weight.label}</span>
            <span className="text-[11px] font-extrabold tabular-nums text-ink">
              {formatCurrency(weight.price, currencySymbol)}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => onConfigure(cake, defaultWeight?.kg)}
          disabled={!cake.inStock}
          aria-label={`More options for ${cake.name}`}
          className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40 sm:hidden ${focus}`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
