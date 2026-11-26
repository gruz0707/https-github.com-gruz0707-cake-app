import { useMemo, useState } from 'react';
import { CakeSlice, Info, Leaf, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { CAKE_CATEGORIES, type CakeCategory, type CakeItem } from '../types/pos';
import type { StorageMeta } from '../utils/storage';
import { filterCakes, formatCurrency } from '../utils/billing';
import { cakeOffersEggless, cakeOffersFlavourChoice } from '../utils/pricing';
import { CakeFormModal } from './CakeFormModal';
import { Switch } from './Switch';
import { btnGhost, btnPrimary, chip, focus, iconBtn, input } from '../ui';

interface CakeCatalogViewProps {
  cakes: CakeItem[];
  currencySymbol: string;
  catalogMeta: StorageMeta;
  onSaveCake: (data: Omit<CakeItem, 'id' | 'createdAt'>, editId?: string) => void;
  onToggleStock: (cakeId: string) => void;
  onDeleteCake: (cakeId: string) => void;
}

export function CakeCatalogView({
  cakes,
  currencySymbol,
  catalogMeta,
  onSaveCake,
  onToggleStock,
  onDeleteCake,
}: CakeCatalogViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CakeCategory | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<CakeItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterCakes(cakes, search, category, false),
    [cakes, search, category],
  );

  const openAddModal = () => {
    setEditingCake(null);
    setModalOpen(true);
  };

  const openEditModal = (cake: CakeItem) => {
    setEditingCake(cake);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 pb-24 pt-4 sm:px-6 md:space-y-5 md:pb-10 md:pt-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
            Cake menu
          </h1>
          <p className="mt-0.5 text-[11px] text-muted sm:text-xs tabular-nums">
            {cakes.length} {cakes.length === 1 ? 'cake' : 'cakes'} ·{' '}
            {cakes.filter((c) => c.inStock).length} available
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className={`${btnPrimary} h-9 shrink-0 px-3.5 text-xs`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New cake</span>
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-line bg-panel/60 px-3 py-2 text-[10.5px] leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <p>
          Snapshot <span className="font-semibold text-ink">{catalogMeta.catalogSourceVersion}</span>{' '}
          · {catalogMeta.catalogCount} products imported from the verified local catalog
          {catalogMeta.liveCatalogVerified ? '' : ' (live Supabase was not verified)'}.
          Local prices and availability are preserved; a refresh never reprices active or past
          bills.
        </p>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <label htmlFor="catalog-search" className="sr-only">
          Search cake catalog
        </label>
        <input
          id="catalog-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cake name or SKU…"
          className={`${input} rounded-full pl-9`}
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar chip-fade">
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

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-card/60 px-6 py-14 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-panel text-muted">
            <CakeSlice className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[13px] font-semibold text-ink">No cakes match</p>
          <p className="mt-1 text-[11px] text-muted">Add a cake or reset the filters.</p>
        </div>
      ) : (
        <div className="space-y-2 xl:grid xl:grid-cols-2 xl:gap-2.5 xl:space-y-0">
          {filtered.map((cake) => (
            <div key={cake.id} className="rounded-xl border border-line bg-card p-2.5">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-cream">
                  {cake.imageUrl ? (
                    <img
                      src={cake.imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallback === '1') return;
                        e.currentTarget.dataset.fallback = '1';
                        if (cake.fallbackImageUrl) e.currentTarget.src = cake.fallbackImageUrl;
                      }}
                    />
                  ) : (
                    <CakeSlice className="h-5 w-5 text-muted-soft" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[13px] font-semibold text-ink">{cake.name}</h2>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10px] text-muted">
                    <span className="hidden sm:inline">{cake.category}</span>
                    <span className="hidden sm:inline" aria-hidden="true">·</span>
                    <span className="tabular-nums">{cake.sku}</span>
                    <span aria-hidden="true">·</span>
                    <span className={cake.inStock ? 'text-pistachio' : 'text-caramel'}>
                      {cake.inStock ? 'In stock' : 'Sold out'}
                    </span>
                    {cakeOffersEggless(cake) && (
                      <span className="inline-flex items-center gap-0.5 font-semibold text-pistachio">
                        <Leaf className="h-2.5 w-2.5" aria-hidden="true" /> Eggless
                      </span>
                    )}
                    {cakeOffersFlavourChoice(cake) && (
                      <span className="font-semibold text-caramel">Flavour choice</span>
                    )}
                  </p>
                  <p className="mt-1 truncate text-[11px] font-semibold tabular-nums text-ink">
                    {cake.weights
                      .slice(0, 3)
                      .map(
                        (w) =>
                          `${w.label} ${formatCurrency(w.price, currencySymbol)}`,
                      )
                      .join(' · ')}
                    {cake.weights.length > 3 ? ` +${cake.weights.length - 3} more` : ''}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 self-start pt-1">
                  <Switch
                    tone="pistachio"
                    checked={cake.inStock}
                    onChange={() => onToggleStock(cake.id)}
                    label={`Mark ${cake.name} as ${cake.inStock ? 'sold out' : 'in stock'}`}
                  />
                  <button
                    type="button"
                    onClick={() => openEditModal(cake)}
                    aria-label={`Edit ${cake.name}`}
                    className={iconBtn}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(cake.id)}
                    aria-label={`Delete ${cake.name}`}
                    className={`${iconBtn} hover:border-berry/30 hover:bg-berry-tint hover:text-berry-deep`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {confirmDeleteId === cake.id && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-berry-tint/70 px-2.5 py-2">
                  <p className="text-[10.5px] font-medium text-berry-deep">
                    Delete “{cake.name}” from the menu?
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className={`${btnGhost} h-8 px-2.5 text-[10.5px]`}
                    >
                      Keep
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteCake(cake.id);
                        setConfirmDeleteId(null);
                      }}
                      className={`inline-flex h-8 items-center rounded-lg bg-berry px-2.5 text-[10.5px] font-bold text-white transition hover:bg-berry-deep ${focus}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CakeFormModal
          initialCake={editingCake}
          currencySymbol={currencySymbol}
          onClose={() => setModalOpen(false)}
          onSave={onSaveCake}
        />
      )}
    </div>
  );
}
