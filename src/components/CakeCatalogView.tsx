import { useMemo, useState } from 'react';
import { CakeSlice, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { CAKE_CATEGORIES, type CakeCategory, type CakeItem } from '../types/pos';
import { filterCakes, formatCurrency } from '../utils/billing';
import { CakeFormModal } from './CakeFormModal';

interface CakeCatalogViewProps {
  cakes: CakeItem[];
  currencySymbol: string;
  onSaveCake: (data: Omit<CakeItem, 'id' | 'createdAt'>, editId?: string) => void;
  onToggleStock: (cakeId: string) => void;
  onDeleteCake: (cakeId: string) => void;
}

export function CakeCatalogView({
  cakes,
  currencySymbol,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-24 md:pb-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Cake Menu &amp; Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 tabular-nums">
            {cakes.length} {cakes.length === 1 ? 'cake' : 'cakes'} listed ·{' '}
            {cakes.filter((c) => c.inStock).length} available for billing
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Cake</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
            placeholder="Search cake name or SKU..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter menu by category"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0"
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
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-sm font-semibold text-slate-800">No cakes match your filter</p>
          <p className="text-xs text-slate-500 mt-1">
            Add a new cake or reset the category search filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {filtered.map((cake) => (
            <div
              key={cake.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {cake.imageUrl ? (
                    <img
                      src={cake.imageUrl}
                      alt={cake.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CakeSlice className="w-6 h-6 text-slate-400" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900 truncate">
                    {cake.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cake.category} · {cake.sku} · {cake.egglessAvailable ? 'Eggless opt.' : 'Contains egg'}
                  </p>
                  <p className="text-xs font-medium text-slate-800 mt-1.5 tabular-nums">
                    {cake.variants
                      .map((v) => `${v.label}: ${formatCurrency(v.price, currencySymbol)}`)
                      .join(' · ')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleStock(cake.id)}
                  aria-pressed={cake.inStock}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors ${
                    cake.inStock
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cake.inStock ? 'In Stock' : 'Sold Out'}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(cake)}
                  aria-label={`Edit ${cake.name}`}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </button>

                {confirmDeleteId === cake.id ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteCake(cake.id);
                        setConfirmDeleteId(null);
                      }}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="min-h-[40px] px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(cake.id)}
                    aria-label={`Delete ${cake.name}`}
                    className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 flex items-center justify-center text-slate-500"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
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
