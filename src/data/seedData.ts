import type { BillOrder, CakeItem, ShopSettings } from '../types/pos';

export const PRESET_CAKE_IMAGES: Array<{ label: string; url: string }> = [
  {
    label: 'Chocolate Truffle',
    url: '/src/assets/images/cake_chocolate_truffle_1794912409590.jpg',
  },
  {
    label: 'Red Velvet',
    url: '/src/assets/images/cake_red_velvet_1794912409762.jpg',
  },
  {
    label: 'Strawberry Chantilly',
    url: '/src/assets/images/cake_strawberry_chantilly_1794912410410.jpg',
  },
  {
    label: 'Blueberry Cheesecake',
    url: '/src/assets/images/cake_blueberry_cheesecake_1794912410910.jpg',
  },
  {
    label: 'Butterscotch Praline',
    url: '/src/assets/images/cake_butterscotch_praline_1794912410639.jpg',
  },
  {
    label: 'Biscoff Caramel',
    url: '/src/assets/images/cake_biscoff_caramel_1794912410900.jpg',
  },
];

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shopName: 'Crème & Crumb',
  tagline: 'Artisanal Cakes & Patisserie',
  address: '14 Baker Street, Indiranagar',
  phone: '+91 98450 11223',
  taxId: '29AABCC1234D1Z5',
  taxRate: 5,
  currencySymbol: '₹',
  receiptFooter: 'Keep refrigerated. Best enjoyed within 48 hours!',
  paperWidth: 58,
  autoPrintOnCheckout: true,
};

export const SEED_CAKES: CakeItem[] = [
  {
    id: 'cake-1',
    name: 'Belgian Chocolate Truffle',
    category: 'Layer Cakes',
    description: '54% dark Callebaut ganache layered over moist Dutch-cocoa sponge.',
    imageUrl: '/src/assets/images/cake_chocolate_truffle_1794912409590.jpg',
    egglessAvailable: true,
    inStock: true,
    sku: 'BCT-01',
    createdAt: '2026-11-17T06:00:00.000Z',
    variants: [
      { id: 'v-1a', label: '500g', price: 680 },
      { id: 'v-1b', label: '1 kg', price: 1250 },
      { id: 'v-1c', label: 'Slice', price: 165 },
    ],
  },
  {
    id: 'cake-2',
    name: 'Classic Red Velvet',
    category: 'Layer Cakes',
    description: 'Velvety cocoa-buttermilk crumb finished with whipped mascarpone cream cheese.',
    imageUrl: '/src/assets/images/cake_red_velvet_1794912409762.jpg',
    egglessAvailable: true,
    inStock: true,
    sku: 'CRV-02',
    createdAt: '2026-11-17T06:05:00.000Z',
    variants: [
      { id: 'v-2a', label: '500g', price: 640 },
      { id: 'v-2b', label: '1 kg', price: 1180 },
      { id: 'v-2c', label: 'Slice', price: 155 },
    ],
  },
  {
    id: 'cake-3',
    name: 'Strawberry Chantilly',
    category: 'Fruit & Cream',
    description: 'Light Madagascar vanilla sponge with macerated strawberries and whipped chantilly.',
    imageUrl: '/src/assets/images/cake_strawberry_chantilly_1794912410410.jpg',
    egglessAvailable: true,
    inStock: true,
    sku: 'STC-03',
    createdAt: '2026-11-17T06:10:00.000Z',
    variants: [
      { id: 'v-3a', label: '500g', price: 620 },
      { id: 'v-3b', label: '1 kg', price: 1150 },
    ],
  },
  {
    id: 'cake-4',
    name: 'Baked Blueberry Cheesecake',
    category: 'Cheesecakes',
    description: 'Slow-baked Philadelphia cream cheese on honey-butter biscuit base with wild berries.',
    imageUrl: '/src/assets/images/cake_blueberry_cheesecake_1794912410910.jpg',
    egglessAvailable: false,
    inStock: true,
    sku: 'BBC-04',
    createdAt: '2026-11-17T06:15:00.000Z',
    variants: [
      { id: 'v-4a', label: '500g', price: 820 },
      { id: 'v-4b', label: '1 kg', price: 1550 },
      { id: 'v-4c', label: 'Slice', price: 210 },
    ],
  },
  {
    id: 'cake-5',
    name: 'Butterscotch Almond Praline',
    category: 'Layer Cakes',
    description: 'Brown-sugar sponge layered with salted caramel buttercream and roasted almond brittle.',
    imageUrl: '/src/assets/images/cake_butterscotch_praline_1794912410639.jpg',
    egglessAvailable: true,
    inStock: true,
    sku: 'BAP-05',
    createdAt: '2026-11-17T06:20:00.000Z',
    variants: [
      { id: 'v-5a', label: '500g', price: 560 },
      { id: 'v-5b', label: '1 kg', price: 1050 },
    ],
  },
  {
    id: 'cake-6',
    name: 'Lotus Biscoff Caramel',
    category: 'Pastries',
    description: 'Spiced speculoos cookie butter drip over caramelized brown butter sponge.',
    imageUrl: '/src/assets/images/cake_biscoff_caramel_1794912410900.jpg',
    egglessAvailable: true,
    inStock: true,
    sku: 'LBC-06',
    createdAt: '2026-11-17T06:25:00.000Z',
    variants: [
      { id: 'v-6a', label: '500g', price: 740 },
      { id: 'v-6b', label: '1 kg', price: 1390 },
      { id: 'v-6c', label: 'Slice', price: 185 },
    ],
  },
];

function buildDayDate(base: Date, daysAgo: number, hour: number, minute: number): Date {
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() - daysAgo,
    hour,
    minute,
    0,
    0,
  );
}

function buildMonthDate(base: Date, monthsAgo: number, day: number, hour: number): Date {
  return new Date(base.getFullYear(), base.getMonth() - monthsAgo, day, hour, 15, 0, 0);
}

function formatBillNum(dt: Date, seq: number): string {
  const yy = String(dt.getFullYear()).slice(-2);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `CB-${yy}${mm}${dd}-${String(seq).padStart(3, '0')}`;
}

export function createSeedOrders(): BillOrder[] {
  const now = new Date();
  const earlier1 = new Date(now.getTime() - 1000 * 60 * 95);
  const earlier2 = new Date(now.getTime() - 1000 * 60 * 38);

  const todayOrders: BillOrder[] = [
    {
      id: 'seed-ord-2',
      billNumber: formatBillNum(now, 2),
      createdAt: earlier2.toISOString(),
      items: [
        {
          key: 'cake-4-v-4c-std',
          cakeId: 'cake-4',
          cakeName: 'Baked Blueberry Cheesecake',
          variantId: 'v-4c',
          variantLabel: 'Slice',
          unitPrice: 210,
          quantity: 2,
          eggless: false,
        },
        {
          key: 'cake-6-v-6c-eggless',
          cakeId: 'cake-6',
          cakeName: 'Lotus Biscoff Caramel',
          variantId: 'v-6c',
          variantLabel: 'Slice',
          unitPrice: 185,
          quantity: 1,
          eggless: true,
        },
      ],
      subtotal: 605,
      discountAmount: 0,
      taxRate: 5,
      taxAmount: 30.25,
      total: 635.25,
      paymentMethod: 'UPI',
      customerName: 'Rohan Mehta',
      printedAt: earlier2.toISOString(),
      printMode: 'bluetooth',
    },
    {
      id: 'seed-ord-1',
      billNumber: formatBillNum(now, 1),
      createdAt: earlier1.toISOString(),
      items: [
        {
          key: 'cake-1-v-1b-eggless',
          cakeId: 'cake-1',
          cakeName: 'Belgian Chocolate Truffle',
          variantId: 'v-1b',
          variantLabel: '1 kg',
          unitPrice: 1250,
          quantity: 1,
          eggless: true,
          cakeMessage: 'Happy Birthday Maya',
        },
      ],
      subtotal: 1250,
      discountAmount: 50,
      taxRate: 5,
      taxAmount: 60,
      total: 1260,
      paymentMethod: 'Card',
      customerName: 'Ananya Rao',
      customerPhone: '9845099881',
      printedAt: earlier1.toISOString(),
      printMode: 'bluetooth',
    },
  ];

  // Deterministic recent daily history (past 13 days)
  const recentDaySpecs: Array<{
    daysAgo: number;
    total: number;
    paymentMethod: BillOrder['paymentMethod'];
    cakeName: string;
    variantLabel: string;
    customerName: string;
  }> = [
    { daysAgo: 1, total: 2490, paymentMethod: 'UPI', cakeName: 'Classic Red Velvet', variantLabel: '1 kg', customerName: 'Karthik V.' },
    { daysAgo: 2, total: 1627.5, paymentMethod: 'Card', cakeName: 'Baked Blueberry Cheesecake', variantLabel: '1 kg', customerName: 'Meera Iyer' },
    { daysAgo: 3, total: 1312.5, paymentMethod: 'Cash', cakeName: 'Belgian Chocolate Truffle', variantLabel: '1 kg', customerName: 'Sanjay K.' },
    { daysAgo: 4, total: 2150, paymentMethod: 'UPI', cakeName: 'Lotus Biscoff Caramel', variantLabel: '1 kg', customerName: 'Neha Verma' },
    { daysAgo: 5, total: 1180, paymentMethod: 'Cash', cakeName: 'Strawberry Chantilly', variantLabel: '1 kg', customerName: 'Arjun S.' },
    { daysAgo: 6, total: 3255, paymentMethod: 'UPI', cakeName: 'Belgian Chocolate Truffle', variantLabel: '1 kg', customerName: 'Divya Menon' },
    { daysAgo: 7, total: 1890, paymentMethod: 'Card', cakeName: 'Butterscotch Almond Praline', variantLabel: '1 kg', customerName: 'Vikram D.' },
    { daysAgo: 9, total: 1459.5, paymentMethod: 'UPI', cakeName: 'Lotus Biscoff Caramel', variantLabel: '1 kg', customerName: 'Pooja R.' },
    { daysAgo: 10, total: 2625, paymentMethod: 'Card', cakeName: 'Classic Red Velvet', variantLabel: '1 kg', customerName: 'Rahul G.' },
    { daysAgo: 12, total: 1732.5, paymentMethod: 'Cash', cakeName: 'Strawberry Chantilly', variantLabel: '1 kg', customerName: 'Sneha P.' },
  ];

  const recentOrders: BillOrder[] = recentDaySpecs.map((spec, idx) => {
    const dt = buildDayDate(now, spec.daysAgo, 11 + (idx % 6), 20);
    const subtotal = Math.round((spec.total / 1.05) * 100) / 100;
    const taxAmount = Math.round((spec.total - subtotal) * 100) / 100;
    return {
      id: `seed-day-${spec.daysAgo}`,
      billNumber: formatBillNum(dt, 1),
      createdAt: dt.toISOString(),
      items: [
        {
          key: `hist-day-${spec.daysAgo}`,
          cakeId: 'cake-1',
          cakeName: spec.cakeName,
          variantId: 'v-1b',
          variantLabel: spec.variantLabel,
          unitPrice: subtotal,
          quantity: 1,
          eggless: idx % 2 === 0,
        },
      ],
      subtotal,
      discountAmount: 0,
      taxRate: 5,
      taxAmount,
      total: spec.total,
      paymentMethod: spec.paymentMethod,
      customerName: spec.customerName,
      printedAt: dt.toISOString(),
      printMode: 'bluetooth',
    };
  });

  // Deterministic prior-months history (1 to 5 months ago)
  const monthlySpecs: Array<{
    monthsAgo: number;
    day: number;
    total: number;
    paymentMethod: BillOrder['paymentMethod'];
  }> = [
    { monthsAgo: 1, day: 8, total: 9450, paymentMethod: 'UPI' },
    { monthsAgo: 1, day: 21, total: 8820, paymentMethod: 'Card' },
    { monthsAgo: 2, day: 11, total: 7980, paymentMethod: 'UPI' },
    { monthsAgo: 2, day: 24, total: 6720, paymentMethod: 'Cash' },
    { monthsAgo: 3, day: 6, total: 11200, paymentMethod: 'Card' },
    { monthsAgo: 3, day: 19, total: 6350, paymentMethod: 'UPI' },
    { monthsAgo: 4, day: 14, total: 13800, paymentMethod: 'UPI' },
    { monthsAgo: 5, day: 16, total: 10950, paymentMethod: 'Card' },
  ];

  const priorMonthOrders: BillOrder[] = monthlySpecs.map((spec, idx) => {
    const dt = buildMonthDate(now, spec.monthsAgo, spec.day, 16);
    const subtotal = Math.round((spec.total / 1.05) * 100) / 100;
    const taxAmount = Math.round((spec.total - subtotal) * 100) / 100;
    return {
      id: `seed-mo-${spec.monthsAgo}-${idx}`,
      billNumber: formatBillNum(dt, idx + 1),
      createdAt: dt.toISOString(),
      items: [
        {
          key: `hist-mo-${idx}`,
          cakeId: 'cake-2',
          cakeName: 'Custom Celebration Cake Bundle',
          variantId: 'v-2b',
          variantLabel: 'Assorted',
          unitPrice: subtotal,
          quantity: 1,
          eggless: true,
        },
      ],
      subtotal,
      discountAmount: 0,
      taxRate: 5,
      taxAmount,
      total: spec.total,
      paymentMethod: spec.paymentMethod,
      printedAt: dt.toISOString(),
      printMode: 'bluetooth',
    };
  });

  return [...todayOrders, ...recentOrders, ...priorMonthOrders];
}
