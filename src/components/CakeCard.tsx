import { useState } from 'react';
import { CakeSlice, Plus } from 'lucide-react';
import type { CakeItem, CakeVariant } from '../types/pos';
import { formatCurrency } from '../utils/billing';

interface CakeCardProps {
  cake: CakeItem;
  currencySymbol: string;
  egglessMode: boolean;
  onAddVariant: (cake: CakeItem, variant: CakeVariant, eggless: boolean) => void;
}

export function CakeCard({
  cake,
  currencySymbol,
  egglessMode,
  onAddVariant,
}: CakeCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const effectiveEggless = egglessMode && cake.egglessAvailable;

  return (
    <article
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-shadow ${
        cake.inStock ? 'hover:shadow-sm' : 'opacity-65'
      }`}
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {cake.imageUrl && !imgFailed ? (
          <img
            src={cake.imageUrl}
            alt={cake.name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-4 text-center">
            <CakeSlice className="w-8 h-8 text-slate-400" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-600 line-clamp-1">{cake.name}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug">
            {cake.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span>{cake.category}</span>
            <span aria-hidden="true">·</span>
            <span>{cake.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{cake.inStock ? (cake.egglessAvailable ? 'Eggless opt.' : 'Contains egg') : 'Sold out'}</span>
          </p>
          {cake.description && (
            <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {cake.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {cake.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={!cake.inStock}
                onClick={() => onAddVariant(cake, variant, effectiveEggless)}
                aria-label={`Add ${cake.name} ${variant.label} for ${formatCurrency(variant.price, currencySymbol)}`}
                className="min-h-[44px] flex-1 min-w-[66px] px-2 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-colors flex flex-col items-center justify-center text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 group"
              >
                <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-200 inline-flex items-center gap-1 whitespace-nowrap">
                  <Plus className="w-3 h-3" aria-hidden="true" />
                  {variant.label}
                </span>
                <span className="text-xs font-semibold tabular-nums whitespace-nowrap">
                  {formatCurrency(variant.price, currencySymbol)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
