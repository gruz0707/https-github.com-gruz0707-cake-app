import type { ShopSettings } from '../types/pos';

/**
 * Fresh installs start with no bills. Demo transactions are intentionally not
 * seeded into real revenue; existing v1 bills are preserved by the migration.
 */
export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shopName: 'Esai Cakes',
  tagline: 'The Unique Taste of Cakes',
  address: 'GDS Complex, High School Street, Pazhvoor, Palavoor - 627114',
  phone: '+91 78454 54969',
  taxId: '',
  upiId: '',
  taxRate: 0,
  currencySymbol: '₹',
  receiptFooter:
    'Thank you for choosing Esai Cakes! Order 1-2 days in advance. Zero preservatives, freshly baked.',
  paperWidth: 58,
  autoPrintOnCheckout: true,
};
