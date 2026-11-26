import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useSheetHistory } from '../hooks/useSheetHistory';
import { PRESET_CAKE_IMAGES } from '../data/catalog';
import { CAKE_CATEGORIES, type CakeCategory, type CakeItem } from '../types/pos';
import { validateCakeForm } from '../utils/billing';
import { cakeOffersFlavourChoice, isEgglessProhibited } from '../utils/pricing';
import { Switch } from './Switch';
import { btnGhost, btnPrimary, fieldLabel, focus, input, inputSmall } from '../ui';

interface CakeFormModalProps {
  initialCake?: CakeItem | null;
  currencySymbol: string;
  onClose: () => void;
  onSave: (cakeData: Omit<CakeItem, 'id' | 'createdAt'>, editId?: string) => void;
}

export function CakeFormModal({
  initialCake,
  currencySymbol,
  onClose,
  onSave,
}: CakeFormModalProps) {
  const [name, setName] = useState(initialCake?.name ?? '');
  const [category, setCategory] = useState<CakeCategory>(
    initialCake?.category ?? 'Special Cakes',
  );
  const [sku, setSku] = useState(initialCake?.sku ?? '');
  const [description, setDescription] = useState(initialCake?.description ?? '');
  const [imageUrl, setImageUrl] = useState(
    initialCake?.imageUrl ?? PRESET_CAKE_IMAGES[0].url,
  );
  const [egglessAvailable, setEgglessAvailable] = useState(
    initialCake?.egglessAvailable ?? true,
  );
  const [inStock, setInStock] = useState(initialCake?.inStock ?? true);
  const [weights, setWeights] = useState<Array<{ weight: string; price: string }>>(
    initialCake?.weights.map((w) => ({
      weight: w.weight,
      price: String(w.price),
    })) ?? [
      { weight: '0.5 kg', price: '' },
      { weight: '1 kg', price: '' },
    ],
  );
  const [defaultWeight, setDefaultWeight] = useState(
    initialCake?.defaultWeight ?? initialCake?.weights[0]?.weight ?? '1 kg',
  );
  const [errors, setErrors] = useState<{
    name?: string;
    sku?: string;
    weights?: string;
  }>({});

  const sourceCake = Boolean(initialCake?.sourceCategory);
  const egglessProhibited = initialCake ? isEgglessProhibited(initialCake) : false;
  const closeForm = useSheetHistory(true, onClose);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeForm();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeForm]);

  const handleAddWeightRow = () => {
    setWeights((prev) => [...prev, { weight: '', price: '' }]);
  };

  const handleRemoveWeightRow = (idx: number) => {
    if (weights.length <= 1) return;
    setWeights((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateCakeForm({
      name,
      category,
      sku,
      description,
      egglessAvailable,
      flavourChoice: false,
      inStock,
      defaultWeight,
      weights,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const defaultEntry =
      validation.normalizedWeights.find((w) => w.weight === validation.defaultWeight) ??
      validation.normalizedWeights[0];

    onSave(
      {
        name: name.trim(),
        category,
        sourceCategory: initialCake?.sourceCategory,
        sku: sku.trim().toUpperCase(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        fallbackImageUrl: '/cakes/fallback.png',
        egglessAvailable: egglessProhibited ? false : egglessAvailable,
        flavourChoice: initialCake
          ? initialCake.flavourChoice
          : cakeOffersFlavourChoice({
              sourceCategory: undefined,
              category,
              flavourChoice: false,
            }),
        inStock,
        numericPrice: defaultEntry?.price ?? 0,
        defaultWeight: defaultEntry?.weight ?? validation.defaultWeight,
        weights: validation.normalizedWeights,
      },
      initialCake?.id,
    );
    closeForm();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cake-form-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={closeForm}
    >
      <div
        className="animate-sheet-up flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-card shadow-2xl sm:max-w-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <h2
              id="cake-form-title"
              className="truncate text-[15px] font-extrabold tracking-[-0.01em] text-ink"
            >
              {initialCake ? `Edit ${initialCake.name}` : 'New cake'}
            </h2>
            <p className="mt-0.5 text-[10.5px] text-muted">
              {sourceCake
                ? 'Source category and flavour rules stay locked; local prices remain yours.'
                : 'Menu details, weights, and photo.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeForm}
            aria-label="Close cake form"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-panel hover:text-ink ${focus}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="cake-name" className={fieldLabel}>
                Cake name *
              </label>
              <input
                id="cake-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pistachio Rose Gateau"
                className={input}
              />
              {errors.name && (
                <p role="alert" className="mt-1 text-[11px] font-semibold text-berry-deep">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cake-sku" className={fieldLabel}>
                SKU *
              </label>
              <input
                id="cake-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. PRG-07"
                className={`${input} uppercase`}
              />
              {errors.sku && (
                <p role="alert" className="mt-1 text-[11px] font-semibold text-berry-deep">
                  {errors.sku}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="cake-category" className={fieldLabel}>
                Category
              </label>
              <select
                id="cake-category"
                value={category}
                disabled={sourceCake}
                onChange={(e) => setCategory(e.target.value as CakeCategory)}
                className={`${input} disabled:bg-panel disabled:text-muted`}
              >
                {CAKE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {sourceCake && (
                <p className="mt-1 text-[10px] text-muted">
                  Locked to the verified source category “{initialCake?.sourceCategory}”.
                </p>
              )}
            </div>

            <div className="flex items-center gap-5 sm:pb-0.5">
              <span className="flex items-center gap-2 text-[11px] font-semibold text-ink">
                <Switch
                  checked={egglessProhibited ? false : egglessAvailable}
                  onChange={(v) => {
                    if (!egglessProhibited) setEgglessAvailable(v);
                  }}
                  label={
                    egglessProhibited
                      ? 'Eggless is prohibited for this cake'
                      : 'Eggless option available'
                  }
                  className={egglessProhibited ? 'opacity-40' : ''}
                />
                Eggless option
              </span>
              <span className="flex items-center gap-2 text-[11px] font-semibold text-ink">
                <Switch
                  checked={inStock}
                  onChange={setInStock}
                  tone="pistachio"
                  label="Item is in stock"
                />
                In stock
              </span>
            </div>
          </div>

          {egglessProhibited && (
            <p className="mt-1 text-[10px] font-medium text-caramel">
              Eggless is not offered on this item by the source rules.
            </p>
          )}

          <div className="mt-3">
            <label htmlFor="cake-description" className={fieldLabel}>
              Short description
            </label>
            <input
              id="cake-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sponge flavour, filling, or garnish notes"
              className={input}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className={fieldLabel}>Weights &amp; prices ({currencySymbol}) *</span>
              <button
                type="button"
                onClick={handleAddWeightRow}
                className={`${btnGhost} h-8 px-2.5 text-[11px]`}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add weight</span>
              </button>
            </div>

            <div className="space-y-2">
              {weights.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor={`weight-label-${idx}`} className="sr-only">
                      Weight #{idx + 1}
                    </label>
                    <input
                      id={`weight-label-${idx}`}
                      type="text"
                      value={row.weight}
                      onChange={(e) =>
                        setWeights((prev) =>
                          prev.map((r, i) =>
                            i === idx ? { ...r, weight: e.target.value } : r,
                          ),
                        )
                      }
                      placeholder="e.g. 0.5 kg, 1 kg"
                      className={inputSmall}
                    />
                  </div>
                  <div className="w-28">
                    <label htmlFor={`weight-price-${idx}`} className="sr-only">
                      Price #{idx + 1}
                    </label>
                    <input
                      id={`weight-price-${idx}`}
                      type="number"
                      min={1}
                      step="any"
                      value={row.price}
                      onChange={(e) =>
                        setWeights((prev) =>
                          prev.map((r, i) =>
                            i === idx ? { ...r, price: e.target.value } : r,
                          ),
                        )
                      }
                      placeholder="Price"
                      className={`${inputSmall} tabular-nums`}
                    />
                  </div>
                  {weights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWeightRow(idx)}
                      aria-label={`Remove weight row ${idx + 1}`}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-berry/30 hover:bg-berry-tint hover:text-berry-deep ${focus}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="default-weight" className={fieldLabel}>
                Minimum / default weight
              </label>
              <select
                id="default-weight"
                value={defaultWeight}
                onChange={(e) => setDefaultWeight(e.target.value)}
                className={inputSmall}
              >
                {weights
                  .filter((w) => w.weight.trim())
                  .map((w) => (
                    <option key={w.weight} value={w.weight}>
                      {w.weight}
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-[10px] text-muted">
                The default is the minimum offered size; larger weights use its per-kg rate.
              </p>
            </div>

            {errors.weights && (
              <p role="alert" className="text-[11px] font-semibold text-berry-deep">
                {errors.weights}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className={fieldLabel}>Cake photo</span>
              <label className={`${btnGhost} h-8 cursor-pointer px-2.5 text-[11px]`}>
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_CAKE_IMAGES.map((preset) => {
                const selected = imageUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    aria-label={`Select ${preset.label} photo`}
                    aria-pressed={selected}
                    className={`aspect-square overflow-hidden rounded-lg border transition-all ${focus} ${
                      selected
                        ? 'border-berry ring-2 ring-berry/25 ring-offset-1 ring-offset-card'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 -mx-5 mt-4 flex items-center justify-end gap-2 border-t border-line bg-card/95 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur">
            <button type="button" onClick={closeForm} className={btnGhost}>
              Cancel
            </button>
            <button type="submit" className={`${btnPrimary} px-5`}>
              {initialCake ? 'Save changes' : 'Save cake'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
