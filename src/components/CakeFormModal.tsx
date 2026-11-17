import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { PRESET_CAKE_IMAGES } from '../data/seedData';
import { CAKE_CATEGORIES, type CakeCategory, type CakeItem } from '../types/pos';
import { validateCakeForm } from '../utils/billing';

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
  const [variants, setVariants] = useState<Array<{ id?: string; label: string; price: string }>>(
    initialCake?.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: String(v.price),
    })) ?? [
      { label: '500g', price: '' },
      { label: '1 kg', price: '' },
    ],
  );
  const [errors, setErrors] = useState<{
    name?: string;
    sku?: string;
    variants?: string;
  }>({});

  const handleAddVariantRow = () => {
    setVariants((prev) => [...prev, { label: '', price: '' }]);
  };

  const handleRemoveVariantRow = (idx: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== idx));
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
      inStock,
      variants,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSave(
      {
        name: name.trim(),
        category,
        sku: sku.trim().toUpperCase(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        egglessAvailable,
        inStock,
        variants: validation.normalizedVariants,
      },
      initialCake?.id,
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cake-form-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 id="cake-form-title" className="font-display text-lg font-semibold text-slate-900">
            {initialCake ? `Edit ${initialCake.name}` : 'Add New Cake'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cake form"
            className="w-11 h-11 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="cake-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Cake Name *
              </label>
              <input
                id="cake-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pistachio Rose Gateau"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
              />
              {errors.name && (
                <p role="alert" className="mt-1 text-xs font-medium text-red-700">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cake-sku" className="block text-xs font-semibold text-slate-700 mb-1">
                Item Code (SKU) *
              </label>
              <input
                id="cake-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. PRG-07"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 uppercase focus:border-slate-900 focus:outline-none"
              />
              {errors.sku && (
                <p role="alert" className="mt-1 text-xs font-medium text-red-700">
                  {errors.sku}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="cake-category" className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                id="cake-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CakeCategory)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                {CAKE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-4 pb-1">
              <label className="inline-flex items-center gap-2 min-h-[44px] cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={egglessAvailable}
                  onChange={(e) => setEgglessAvailable(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 rounded"
                />
                <span>Eggless option</span>
              </label>
              <label className="inline-flex items-center gap-2 min-h-[44px] cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 rounded"
                />
                <span>In stock</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="cake-description" className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description
            </label>
            <input
              id="cake-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sponge flavor, filling, or garnish notes"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Weights &amp; Prices ({currencySymbol}) *
              </span>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="min-h-[36px] px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Size</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((variant, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor={`var-label-${idx}`} className="sr-only">
                      Size or weight label #{idx + 1}
                    </label>
                    <input
                      id={`var-label-${idx}`}
                      type="text"
                      value={variant.label}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((row, i) =>
                            i === idx ? { ...row, label: e.target.value } : row,
                          ),
                        )
                      }
                      placeholder="e.g. 500g, 1 kg, Slice"
                      className="w-full min-h-[44px] px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="w-32">
                    <label htmlFor={`var-price-${idx}`} className="sr-only">
                      Price #{idx + 1}
                    </label>
                    <input
                      id={`var-price-${idx}`}
                      type="number"
                      min={1}
                      step="any"
                      value={variant.price}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((row, i) =>
                            i === idx ? { ...row, price: e.target.value } : row,
                          ),
                        )
                      }
                      placeholder="Price"
                      className="w-full min-h-[44px] px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 tabular-nums focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantRow(idx)}
                      aria-label={`Remove size row ${idx + 1}`}
                      className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-700 flex items-center justify-center text-slate-500"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.variants && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {errors.variants}
              </p>
            )}
          </div>

          {/* Photo picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">Cake Photo</span>
              <label className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Upload from Phone</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_CAKE_IMAGES.map((preset) => {
                const selected = imageUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    aria-label={`Select ${preset.label} photo`}
                    aria-pressed={selected}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selected ? 'border-slate-900 scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
            >
              {initialCake ? 'Save Changes' : 'Save Cake to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
