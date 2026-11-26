import { SOURCE_CAKES } from './catalog.generated';
import type { CakeItem } from '../types/pos';
import {
  cakeOffersEggless,
  cakeOffersFlavourChoice,
  normalizeCakeCategory,
} from '../utils/pricing';

export const CATALOG_IMPORTED_AT = '2026-11-18T00:00:00.000Z';

/**
 * Convert the verified source snapshot into the POS catalog model.
 * Public paths survive Vite builds and Capacitor bundling; the original
 * `/src/assets/...` strings did not reliably resolve in production.
 */
export function buildCatalogFromSource(): CakeItem[] {
  return SOURCE_CAKES.map((source, index) => {
    const base: CakeItem = {
      id: source.id,
      name: source.name,
      category: normalizeCakeCategory(source.sourceCategory),
      sourceCategory: source.sourceCategory,
      description: source.description,
      imageUrl: `/cakes/${source.id}.jpg`,
      fallbackImageUrl: '/cakes/fallback.png',
      egglessAvailable: true,
      flavourChoice: false,
      inStock: source.available,
      sku: source.id,
      createdAt: new Date(Date.parse(CATALOG_IMPORTED_AT) + index * 1000).toISOString(),
      numericPrice: source.numericPrice,
      defaultWeight: source.defaultWeight,
      weights: source.weights.map((w) => ({
        weight: w.weight,
        label: w.label,
        price: w.price,
        displayPrice: w.displayPrice,
      })),
    };
    base.egglessAvailable = cakeOffersEggless({ ...base, egglessAvailable: true });
    base.flavourChoice = cakeOffersFlavourChoice(base);
    return base;
  });
}

export const PRESET_CAKE_IMAGES: Array<{ label: string; url: string }> = [
  { label: 'Black Forest', url: '/cakes/SC01.jpg' },
  { label: 'White Forest', url: '/cakes/SC02.jpg' },
  { label: 'Red Velvet', url: '/cakes/SC03.jpg' },
  { label: 'Chocolate Truffle', url: '/cakes/CH08.jpg' },
  { label: 'Butterscotch', url: '/cakes/SC14.jpg' },
  { label: 'Blueberry Cheesecake', url: '/cakes/CC01.jpg' },
];
