import type { BillOrder, CakeItem, ShopSettings } from '../types/pos';

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shopName: 'Esai Cakes',
  tagline: 'The Unique Taste of Cakes',
  address: 'GDS Complex, High School Street, Pazhvoor, Palavoor - 627114',
  phone: '+91 78454 54969',
  taxId: '',
  taxRate: 0,
  currencySymbol: '₹',
  receiptFooter: 'Thank you for choosing Esai Cakes! Order 1-2 days in advance. Zero preservatives, freshly baked.',
  paperWidth: 58,
  autoPrintOnCheckout: true,
};

export const PRESET_CAKE_IMAGES: Array<{ label: string; url: string }> = [
  { label: 'Black Forest', url: '/src/assets/images/cakes/SC01.jpg' },
  { label: 'Red Velvet', url: '/src/assets/images/cakes/SC03.jpg' },
  { label: 'Chocolate Truffle', url: '/src/assets/images/cakes/CH08.jpg' },
  { label: 'Blueberry Cheesecake', url: '/src/assets/images/cakes/CC01.jpg' },
  { label: 'Butterscotch', url: '/src/assets/images/cakes/SC14.jpg' },
  { label: 'Kulfi Cake', url: '/src/assets/images/cakes/SC08.jpg' },
];

export const SEED_CAKES: CakeItem[] = [
  {
    "id": "SC01",
    "name": "Black Forest Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹800 • ½ kg ₹400. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC01",
    "createdAt": "2026-11-17T06:00:00.000Z",
    "variants": [
      {
        "id": "SC01-0_5kg",
        "label": "½ kg",
        "price": 400
      },
      {
        "id": "SC01-1kg",
        "label": "1 kg",
        "price": 800
      }
    ]
  },
  {
    "id": "SC02",
    "name": "White Forest Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹700 • ½ kg ₹400. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC02",
    "createdAt": "2026-11-17T06:01:00.000Z",
    "variants": [
      {
        "id": "SC02-0_5kg",
        "label": "½ kg",
        "price": 400
      },
      {
        "id": "SC02-1kg",
        "label": "1 kg",
        "price": 700
      }
    ]
  },
  {
    "id": "SC03",
    "name": "Red Velvet Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC03",
    "createdAt": "2026-11-17T06:02:00.000Z",
    "variants": [
      {
        "id": "SC03-0_5kg",
        "label": "½ kg",
        "price": 450
      },
      {
        "id": "SC03-1kg",
        "label": "1 kg",
        "price": 850
      }
    ]
  },
  {
    "id": "SC04",
    "name": "Gulab Jamun Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹980 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC04",
    "createdAt": "2026-11-17T06:03:00.000Z",
    "variants": [
      {
        "id": "SC04-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "SC04-1kg",
        "label": "1 kg",
        "price": 980
      }
    ]
  },
  {
    "id": "SC05",
    "name": "Vancho Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹1,000. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC05",
    "createdAt": "2026-11-17T06:04:00.000Z",
    "variants": [
      {
        "id": "SC05-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "SC06",
    "name": "White Truffle Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹980 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC06.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC06",
    "createdAt": "2026-11-17T06:05:00.000Z",
    "variants": [
      {
        "id": "SC06-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "SC06-1kg",
        "label": "1 kg",
        "price": 980
      }
    ]
  },
  {
    "id": "SC07",
    "name": "Red Bee Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹980. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC07.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC07",
    "createdAt": "2026-11-17T06:06:00.000Z",
    "variants": [
      {
        "id": "SC07-1kg",
        "label": "1 kg",
        "price": 980
      }
    ]
  },
  {
    "id": "SC08",
    "name": "Kulfi Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC08.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC08",
    "createdAt": "2026-11-17T06:07:00.000Z",
    "variants": [
      {
        "id": "SC08-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "SC08-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "SC09",
    "name": "Irish Coffee Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC09.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC09",
    "createdAt": "2026-11-17T06:08:00.000Z",
    "variants": [
      {
        "id": "SC09-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "SC09-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "SC10",
    "name": "Classic Vanilla Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹600 • ½ kg ₹350. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC10.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC10",
    "createdAt": "2026-11-17T06:09:00.000Z",
    "variants": [
      {
        "id": "SC10-0_5kg",
        "label": "½ kg",
        "price": 350
      },
      {
        "id": "SC10-1kg",
        "label": "1 kg",
        "price": 600
      }
    ]
  },
  {
    "id": "SC11",
    "name": "Pista Truffle Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC11.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC11",
    "createdAt": "2026-11-17T06:10:00.000Z",
    "variants": [
      {
        "id": "SC11-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "SC11-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "SC12",
    "name": "Honey Almond Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹900 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC12.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC12",
    "createdAt": "2026-11-17T06:11:00.000Z",
    "variants": [
      {
        "id": "SC12-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "SC12-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "SC13",
    "name": "Fresh Fruit Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹1,100. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC13.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC13",
    "createdAt": "2026-11-17T06:12:00.000Z",
    "variants": [
      {
        "id": "SC13-1kg",
        "label": "1 kg",
        "price": 1100
      }
    ]
  },
  {
    "id": "SC14",
    "name": "Butterscotch Cake",
    "category": "Special Cakes",
    "description": "1 kg ₹890 • ½ kg ₹480. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/SC14.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SC14",
    "createdAt": "2026-11-17T06:13:00.000Z",
    "variants": [
      {
        "id": "SC14-0_5kg",
        "label": "½ kg",
        "price": 480
      },
      {
        "id": "SC14-1kg",
        "label": "1 kg",
        "price": 890
      }
    ]
  },
  {
    "id": "TR01",
    "name": "Gulab Jamoon Cake",
    "category": "Trending Cakes",
    "description": "1 kg ₹980 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/TR01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "TR01",
    "createdAt": "2026-11-17T06:14:00.000Z",
    "variants": [
      {
        "id": "TR01-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "TR01-1kg",
        "label": "1 kg",
        "price": 980
      }
    ]
  },
  {
    "id": "TR02",
    "name": "Kulfi Cake",
    "category": "Trending Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/TR02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "TR02",
    "createdAt": "2026-11-17T06:15:00.000Z",
    "variants": [
      {
        "id": "TR02-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "TR02-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "TR03",
    "name": "Irish Coffee Cake",
    "category": "Trending Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/TR03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "TR03",
    "createdAt": "2026-11-17T06:16:00.000Z",
    "variants": [
      {
        "id": "TR03-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "TR03-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "TR04",
    "name": "Butterscotch Cake",
    "category": "Trending Cakes",
    "description": "1 kg ₹890 • ½ kg ₹480. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/TR04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "TR04",
    "createdAt": "2026-11-17T06:17:00.000Z",
    "variants": [
      {
        "id": "TR04-0_5kg",
        "label": "½ kg",
        "price": 480
      },
      {
        "id": "TR04-1kg",
        "label": "1 kg",
        "price": 890
      }
    ]
  },
  {
    "id": "TR05",
    "name": "Rasamalai Cake",
    "category": "Trending Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/TR05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "TR05",
    "createdAt": "2026-11-17T06:18:00.000Z",
    "variants": [
      {
        "id": "TR05-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "TR05-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CH01",
    "name": "Choco Forest Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH01",
    "createdAt": "2026-11-17T06:19:00.000Z",
    "variants": [
      {
        "id": "CH01-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH01-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CH02",
    "name": "Kitkat & Gems Cake",
    "category": "Chocolate Cakes",
    "description": "Custom chocolate cake. Base price ₹1,500 for 1.5 kg — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH02",
    "createdAt": "2026-11-17T06:20:00.000Z",
    "variants": [
      {
        "id": "CH02-1_5kg",
        "label": "1.5 kg",
        "price": 1500
      }
    ]
  },
  {
    "id": "CH03",
    "name": "Kitkat & Oreo Cake",
    "category": "Chocolate Cakes",
    "description": "Custom chocolate cake. Base price ₹1,500 for 1.5 kg — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH03",
    "createdAt": "2026-11-17T06:21:00.000Z",
    "variants": [
      {
        "id": "CH03-1_5kg",
        "label": "1.5 kg",
        "price": 1500
      }
    ]
  },
  {
    "id": "CH04",
    "name": "Chocolate Web Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹1,000 • ½ kg ₹550. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH04",
    "createdAt": "2026-11-17T06:22:00.000Z",
    "variants": [
      {
        "id": "CH04-0_5kg",
        "label": "½ kg",
        "price": 550
      },
      {
        "id": "CH04-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "CH05",
    "name": "Choco Oreo Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH05",
    "createdAt": "2026-11-17T06:23:00.000Z",
    "variants": [
      {
        "id": "CH05-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH05-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CH06",
    "name": "Chocolate Almonds Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹980 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH06.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH06",
    "createdAt": "2026-11-17T06:24:00.000Z",
    "variants": [
      {
        "id": "CH06-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH06-1kg",
        "label": "1 kg",
        "price": 980
      }
    ]
  },
  {
    "id": "CH07",
    "name": "German Black Forest Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹890 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH07.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH07",
    "createdAt": "2026-11-17T06:25:00.000Z",
    "variants": [
      {
        "id": "CH07-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH07-1kg",
        "label": "1 kg",
        "price": 890
      }
    ]
  },
  {
    "id": "CH08",
    "name": "Chocolate Truffle Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH08.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH08",
    "createdAt": "2026-11-17T06:26:00.000Z",
    "variants": [
      {
        "id": "CH08-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH08-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CH09",
    "name": "Double Chocolate Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH09.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH09",
    "createdAt": "2026-11-17T06:27:00.000Z",
    "variants": [
      {
        "id": "CH09-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH09-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CH10",
    "name": "Choco Fantasy Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH10.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH10",
    "createdAt": "2026-11-17T06:28:00.000Z",
    "variants": [
      {
        "id": "CH10-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CH10-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CH11",
    "name": "Chocolate Model Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹1,100 • ½ kg ₹600. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH11.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH11",
    "createdAt": "2026-11-17T06:29:00.000Z",
    "variants": [
      {
        "id": "CH11-0_5kg",
        "label": "½ kg",
        "price": 600
      },
      {
        "id": "CH11-1kg",
        "label": "1 kg",
        "price": 1100
      }
    ]
  },
  {
    "id": "CH12",
    "name": "Chocolate Fruits Cake",
    "category": "Chocolate Cakes",
    "description": "1 kg ₹1,200 • ½ kg ₹700. Custom order — final price varies with weight and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/CH12.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "CH12",
    "createdAt": "2026-11-17T06:30:00.000Z",
    "variants": [
      {
        "id": "CH12-0_5kg",
        "label": "½ kg",
        "price": 700
      },
      {
        "id": "CH12-1kg",
        "label": "1 kg",
        "price": 1200
      }
    ]
  },
  {
    "id": "FF01",
    "name": "Black Currant Cake",
    "category": "Fruit Flavors",
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/FF01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "FF01",
    "createdAt": "2026-11-17T06:31:00.000Z",
    "variants": [
      {
        "id": "FF01-0_5kg",
        "label": "½ kg",
        "price": 450
      },
      {
        "id": "FF01-1kg",
        "label": "1 kg",
        "price": 850
      }
    ]
  },
  {
    "id": "FF02",
    "name": "Blueberry Cake",
    "category": "Fruit Flavors",
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/FF02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "FF02",
    "createdAt": "2026-11-17T06:32:00.000Z",
    "variants": [
      {
        "id": "FF02-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "FF02-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "FF03",
    "name": "Mango Cake",
    "category": "Fruit Flavors",
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/FF03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "FF03",
    "createdAt": "2026-11-17T06:33:00.000Z",
    "variants": [
      {
        "id": "FF03-0_5kg",
        "label": "½ kg",
        "price": 450
      },
      {
        "id": "FF03-1kg",
        "label": "1 kg",
        "price": 850
      }
    ]
  },
  {
    "id": "FF04",
    "name": "Pineapple Cake",
    "category": "Fruit Flavors",
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/FF04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "FF04",
    "createdAt": "2026-11-17T06:34:00.000Z",
    "variants": [
      {
        "id": "FF04-0_5kg",
        "label": "½ kg",
        "price": 450
      },
      {
        "id": "FF04-1kg",
        "label": "1 kg",
        "price": 850
      }
    ]
  },
  {
    "id": "PR01",
    "name": "Caramelized Pineapple Cake",
    "category": "Premium Cakes",
    "description": "Custom premium cake. Base price ₹1,400 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/PR01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "PR01",
    "createdAt": "2026-11-17T06:35:00.000Z",
    "variants": [
      {
        "id": "PR01-1kg",
        "label": "1 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "PR02",
    "name": "Rafaello Cake",
    "category": "Premium Cakes",
    "description": "Custom premium cake. Base price ₹1,300 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/PR02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "PR02",
    "createdAt": "2026-11-17T06:36:00.000Z",
    "variants": [
      {
        "id": "PR02-1kg",
        "label": "1 kg",
        "price": 1300
      }
    ]
  },
  {
    "id": "PR03",
    "name": "Ferrero Cake",
    "category": "Premium Cakes",
    "description": "Custom premium cake. Base price ₹1,400 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/PR03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "PR03",
    "createdAt": "2026-11-17T06:37:00.000Z",
    "variants": [
      {
        "id": "PR03-1kg",
        "label": "1 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "PR04",
    "name": "Rainbow Cake (3 Colours)",
    "category": "Premium Cakes",
    "description": "1 kg ₹900. Custom premium cake — freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/PR04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "PR04",
    "createdAt": "2026-11-17T06:38:00.000Z",
    "variants": [
      {
        "id": "PR04-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "CC01",
    "name": "Blueberry Cheesecake",
    "category": "Cheesecakes",
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/CC01.jpg",
    "egglessAvailable": false,
    "inStock": true,
    "sku": "CC01",
    "createdAt": "2026-11-17T06:39:00.000Z",
    "variants": [
      {
        "id": "CC01-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CC01-1kg",
        "label": "1 kg",
        "price": 950
      }
    ]
  },
  {
    "id": "CC02",
    "name": "Strawberry Cheesecake",
    "category": "Cheesecakes",
    "description": "1 kg ₹800 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/CC02.jpg",
    "egglessAvailable": false,
    "inStock": true,
    "sku": "CC02",
    "createdAt": "2026-11-17T06:40:00.000Z",
    "variants": [
      {
        "id": "CC02-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CC02-1kg",
        "label": "1 kg",
        "price": 800
      }
    ]
  },
  {
    "id": "CC03",
    "name": "Choco Oreo Cheesecake",
    "category": "Cheesecakes",
    "description": "1 kg ₹900 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/CC03.jpg",
    "egglessAvailable": false,
    "inStock": true,
    "sku": "CC03",
    "createdAt": "2026-11-17T06:41:00.000Z",
    "variants": [
      {
        "id": "CC03-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CC03-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "CC04",
    "name": "Mango Cheesecake",
    "category": "Cheesecakes",
    "description": "1 kg ₹800 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/CC04.jpg",
    "egglessAvailable": false,
    "inStock": true,
    "sku": "CC04",
    "createdAt": "2026-11-17T06:42:00.000Z",
    "variants": [
      {
        "id": "CC04-0_5kg",
        "label": "½ kg",
        "price": 500
      },
      {
        "id": "CC04-1kg",
        "label": "1 kg",
        "price": 800
      }
    ]
  },
  {
    "id": "BG03",
    "name": "Doll Theme 2-Tier Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG03",
    "createdAt": "2026-11-17T06:43:00.000Z",
    "variants": [
      {
        "id": "BG03-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG04",
    "name": "Butterfly Wings Theme 2-Tier Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG04",
    "createdAt": "2026-11-17T06:44:00.000Z",
    "variants": [
      {
        "id": "BG04-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "BG05",
    "name": "Doll Theme 2-Tier Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG05",
    "createdAt": "2026-11-17T06:45:00.000Z",
    "variants": [
      {
        "id": "BG05-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "BG06",
    "name": "Doll & Wings Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG06.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG06",
    "createdAt": "2026-11-17T06:46:00.000Z",
    "variants": [
      {
        "id": "BG06-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG07",
    "name": "Doll With Wings Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG07.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG07",
    "createdAt": "2026-11-17T06:47:00.000Z",
    "variants": [
      {
        "id": "BG07-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG08",
    "name": "Butterfly Girl Baby Theme 2-Tier Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG08.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG08",
    "createdAt": "2026-11-17T06:48:00.000Z",
    "variants": [
      {
        "id": "BG08-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG09",
    "name": "Girl Theme Butterfly Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG09.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG09",
    "createdAt": "2026-11-17T06:49:00.000Z",
    "variants": [
      {
        "id": "BG09-1_5kg",
        "label": "1.5 kg",
        "price": 1300
      }
    ]
  },
  {
    "id": "BG10",
    "name": "Girl Theme Butterfly Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG10.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG10",
    "createdAt": "2026-11-17T06:50:00.000Z",
    "variants": [
      {
        "id": "BG10-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG11",
    "name": "1st Birthday Girl Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG11.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG11",
    "createdAt": "2026-11-17T06:51:00.000Z",
    "variants": [
      {
        "id": "BG11-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG12",
    "name": "Girl Baby Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG12.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG12",
    "createdAt": "2026-11-17T06:52:00.000Z",
    "variants": [
      {
        "id": "BG12-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG13",
    "name": "Girl Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG13.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG13",
    "createdAt": "2026-11-17T06:53:00.000Z",
    "variants": [
      {
        "id": "BG13-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG14",
    "name": "Girl Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG14.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG14",
    "createdAt": "2026-11-17T06:54:00.000Z",
    "variants": [
      {
        "id": "BG14-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG15",
    "name": "Butterfly Girl Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG15.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG15",
    "createdAt": "2026-11-17T06:55:00.000Z",
    "variants": [
      {
        "id": "BG15-1_5kg",
        "label": "1.5 kg",
        "price": 1300
      }
    ]
  },
  {
    "id": "BG16",
    "name": "Butterfly Wings With Doll 3-Tier Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹5,000 for 5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG16.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG16",
    "createdAt": "2026-11-17T06:56:00.000Z",
    "variants": [
      {
        "id": "BG16-5kg",
        "label": "5 kg",
        "price": 5000
      }
    ]
  },
  {
    "id": "BG17",
    "name": "Doll Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,900 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG17.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG17",
    "createdAt": "2026-11-17T06:57:00.000Z",
    "variants": [
      {
        "id": "BG17-2kg",
        "label": "2 kg",
        "price": 1900
      }
    ]
  },
  {
    "id": "BG18",
    "name": "Butterfly Step Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹3,400 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG18.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG18",
    "createdAt": "2026-11-17T06:58:00.000Z",
    "variants": [
      {
        "id": "BG18-4kg",
        "label": "4 kg",
        "price": 3400
      }
    ]
  },
  {
    "id": "BG19",
    "name": "Butterfly Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG19.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG19",
    "createdAt": "2026-11-17T06:59:00.000Z",
    "variants": [
      {
        "id": "BG19-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG20",
    "name": "Girl Baby Butterfly Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG20.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG20",
    "createdAt": "2026-11-17T07:00:00.000Z",
    "variants": [
      {
        "id": "BG20-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "BG21",
    "name": "Cintrella With Butterfly Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG21.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG21",
    "createdAt": "2026-11-17T07:01:00.000Z",
    "variants": [
      {
        "id": "BG21-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "BG22",
    "name": "Blue Queen Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,450 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG22.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG22",
    "createdAt": "2026-11-17T07:02:00.000Z",
    "variants": [
      {
        "id": "BG22-1_5kg",
        "label": "1.5 kg",
        "price": 1450
      }
    ]
  },
  {
    "id": "BG23",
    "name": "Barbie Girl Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,600 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG23.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG23",
    "createdAt": "2026-11-17T07:03:00.000Z",
    "variants": [
      {
        "id": "BG23-1_5kg",
        "label": "1.5 kg",
        "price": 1600
      }
    ]
  },
  {
    "id": "BG24",
    "name": "Barbie Girl Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,600 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG24.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG24",
    "createdAt": "2026-11-17T07:04:00.000Z",
    "variants": [
      {
        "id": "BG24-1_5kg",
        "label": "1.5 kg",
        "price": 1600
      }
    ]
  },
  {
    "id": "BG25",
    "name": "Step Cake With Barbie Girl",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹4,000 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG25.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG25",
    "createdAt": "2026-11-17T07:05:00.000Z",
    "variants": [
      {
        "id": "BG25-4kg",
        "label": "4 kg",
        "price": 4000
      }
    ]
  },
  {
    "id": "BG26",
    "name": "Minnie Mouse Theme 2-Tier Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG26.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG26",
    "createdAt": "2026-11-17T07:06:00.000Z",
    "variants": [
      {
        "id": "BG26-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG27",
    "name": "Minnie Mouse Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG27.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG27",
    "createdAt": "2026-11-17T07:07:00.000Z",
    "variants": [
      {
        "id": "BG27-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG28",
    "name": "Kitty Doll Theme Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG28.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG28",
    "createdAt": "2026-11-17T07:08:00.000Z",
    "variants": [
      {
        "id": "BG28-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG29",
    "name": "Kitty Doll Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG29.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG29",
    "createdAt": "2026-11-17T07:09:00.000Z",
    "variants": [
      {
        "id": "BG29-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG30",
    "name": "Unicorn Theme Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG30.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG30",
    "createdAt": "2026-11-17T07:10:00.000Z",
    "variants": [
      {
        "id": "BG30-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG31",
    "name": "Unicorn Theme Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG31.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG31",
    "createdAt": "2026-11-17T07:11:00.000Z",
    "variants": [
      {
        "id": "BG31-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG32",
    "name": "Unicorn Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG32.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG32",
    "createdAt": "2026-11-17T07:12:00.000Z",
    "variants": [
      {
        "id": "BG32-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG33",
    "name": "Cat Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹850 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG33.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG33",
    "createdAt": "2026-11-17T07:13:00.000Z",
    "variants": [
      {
        "id": "BG33-1kg",
        "label": "1 kg",
        "price": 850
      }
    ]
  },
  {
    "id": "BG34",
    "name": "Unicorn Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG34.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG34",
    "createdAt": "2026-11-17T07:14:00.000Z",
    "variants": [
      {
        "id": "BG34-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG35",
    "name": "Unicorn Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG35.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG35",
    "createdAt": "2026-11-17T07:15:00.000Z",
    "variants": [
      {
        "id": "BG35-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG36",
    "name": "Unicorn Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG36.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG36",
    "createdAt": "2026-11-17T07:16:00.000Z",
    "variants": [
      {
        "id": "BG36-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "BG37",
    "name": "Unicorn Theme Birthday Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹3,600 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG37.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG37",
    "createdAt": "2026-11-17T07:17:00.000Z",
    "variants": [
      {
        "id": "BG37-4kg",
        "label": "4 kg",
        "price": 3600
      }
    ]
  },
  {
    "id": "BG38",
    "name": "Unicorn Theme Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG38.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG38",
    "createdAt": "2026-11-17T07:18:00.000Z",
    "variants": [
      {
        "id": "BG38-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG39",
    "name": "Mushroom Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG39.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG39",
    "createdAt": "2026-11-17T07:19:00.000Z",
    "variants": [
      {
        "id": "BG39-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG40",
    "name": "Mermaid Theme 2-Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG40.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG40",
    "createdAt": "2026-11-17T07:20:00.000Z",
    "variants": [
      {
        "id": "BG40-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG41",
    "name": "Mermaid Theme 2-Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG41.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG41",
    "createdAt": "2026-11-17T07:21:00.000Z",
    "variants": [
      {
        "id": "BG41-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG42",
    "name": "Mermaid Theme 2-Step Cake",
    "category": "Birthday Girl",
    "description": "Step designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG42.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG42",
    "createdAt": "2026-11-17T07:22:00.000Z",
    "variants": [
      {
        "id": "BG42-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG43",
    "name": "Mermaid Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,000 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG43.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG43",
    "createdAt": "2026-11-17T07:23:00.000Z",
    "variants": [
      {
        "id": "BG43-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "BG44",
    "name": "Sea Theme 3-Step Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹5,000 for 5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG44.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG44",
    "createdAt": "2026-11-17T07:24:00.000Z",
    "variants": [
      {
        "id": "BG44-5kg",
        "label": "5 kg",
        "price": 5000
      }
    ]
  },
  {
    "id": "BG45",
    "name": "Mermaid Theme 3-Step Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹4,000 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG45.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG45",
    "createdAt": "2026-11-17T07:25:00.000Z",
    "variants": [
      {
        "id": "BG45-4kg",
        "label": "4 kg",
        "price": 4000
      }
    ]
  },
  {
    "id": "BG46",
    "name": "Mermaid Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG46.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG46",
    "createdAt": "2026-11-17T07:26:00.000Z",
    "variants": [
      {
        "id": "BG46-1_5kg",
        "label": "1.5 kg",
        "price": 1500
      }
    ]
  },
  {
    "id": "BG47",
    "name": "Makeup With Cintrella Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹3,200 for 3.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG47.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG47",
    "createdAt": "2026-11-17T07:27:00.000Z",
    "variants": [
      {
        "id": "BG47-3_5kg",
        "label": "3.5 kg",
        "price": 3200
      }
    ]
  },
  {
    "id": "BG48",
    "name": "Make-up Theme Edible Fondant Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,200 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG48.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG48",
    "createdAt": "2026-11-17T07:28:00.000Z",
    "variants": [
      {
        "id": "BG48-1kg",
        "label": "1 kg",
        "price": 1200
      }
    ]
  },
  {
    "id": "BG49",
    "name": "Makeup Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG49.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG49",
    "createdAt": "2026-11-17T07:29:00.000Z",
    "variants": [
      {
        "id": "BG49-1_5kg",
        "label": "1.5 kg",
        "price": 1350
      }
    ]
  },
  {
    "id": "BG50",
    "name": "Butterfly Shape Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG50.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG50",
    "createdAt": "2026-11-17T07:30:00.000Z",
    "variants": [
      {
        "id": "BG50-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG51",
    "name": "Butterfly Barbie Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG51.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG51",
    "createdAt": "2026-11-17T07:31:00.000Z",
    "variants": [
      {
        "id": "BG51-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG52",
    "name": "Butterfly Barbie Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG52.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG52",
    "createdAt": "2026-11-17T07:32:00.000Z",
    "variants": [
      {
        "id": "BG52-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG53",
    "name": "Dora Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG53.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG53",
    "createdAt": "2026-11-17T07:33:00.000Z",
    "variants": [
      {
        "id": "BG53-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG54",
    "name": "Dora Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG54.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG54",
    "createdAt": "2026-11-17T07:34:00.000Z",
    "variants": [
      {
        "id": "BG54-1_5kg",
        "label": "1.5 kg",
        "price": 1350
      }
    ]
  },
  {
    "id": "BG55",
    "name": "Dora Theme Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG55.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG55",
    "createdAt": "2026-11-17T07:35:00.000Z",
    "variants": [
      {
        "id": "BG55-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG56",
    "name": "Dora Theme Step Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹3,500 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG56.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG56",
    "createdAt": "2026-11-17T07:36:00.000Z",
    "variants": [
      {
        "id": "BG56-4kg",
        "label": "4 kg",
        "price": 3500
      }
    ]
  },
  {
    "id": "BG57",
    "name": "Frozen Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG57.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG57",
    "createdAt": "2026-11-17T07:37:00.000Z",
    "variants": [
      {
        "id": "BG57-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG58",
    "name": "Frozen Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG58.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG58",
    "createdAt": "2026-11-17T07:38:00.000Z",
    "variants": [
      {
        "id": "BG58-1_5kg",
        "label": "1.5 kg",
        "price": 1500
      }
    ]
  },
  {
    "id": "BG59",
    "name": "Frozen Theme Fondant Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹3,800 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG59.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG59",
    "createdAt": "2026-11-17T07:39:00.000Z",
    "variants": [
      {
        "id": "BG59-4kg",
        "label": "4 kg",
        "price": 3800
      }
    ]
  },
  {
    "id": "BG60",
    "name": "Frozen Theme Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG60.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG60",
    "createdAt": "2026-11-17T07:40:00.000Z",
    "variants": [
      {
        "id": "BG60-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG61",
    "name": "Girl Theme With Wings Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG61.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG61",
    "createdAt": "2026-11-17T07:41:00.000Z",
    "variants": [
      {
        "id": "BG61-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG62",
    "name": "Baby Girl Theme Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG62.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG62",
    "createdAt": "2026-11-17T07:42:00.000Z",
    "variants": [
      {
        "id": "BG62-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BG63",
    "name": "Butterfly Birthday Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG63.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG63",
    "createdAt": "2026-11-17T07:43:00.000Z",
    "variants": [
      {
        "id": "BG63-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BG64",
    "name": "Butterfly Theme Cake With Cupcake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG64.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG64",
    "createdAt": "2026-11-17T07:44:00.000Z",
    "variants": [
      {
        "id": "BG64-1_5kg",
        "label": "1.5 kg",
        "price": 1350
      }
    ]
  },
  {
    "id": "BG65",
    "name": "Masha & Bear Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG65.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG65",
    "createdAt": "2026-11-17T07:45:00.000Z",
    "variants": [
      {
        "id": "BG65-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG66",
    "name": "Masha & Bear Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG66.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG66",
    "createdAt": "2026-11-17T07:46:00.000Z",
    "variants": [
      {
        "id": "BG66-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG67",
    "name": "Masha & Bear Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG67.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG67",
    "createdAt": "2026-11-17T07:47:00.000Z",
    "variants": [
      {
        "id": "BG67-1_5kg",
        "label": "1.5 kg",
        "price": 1300
      }
    ]
  },
  {
    "id": "BG68",
    "name": "Masha & Bear Theme Cake",
    "category": "Birthday Girl",
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG68.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG68",
    "createdAt": "2026-11-17T07:48:00.000Z",
    "variants": [
      {
        "id": "BG68-1_5kg",
        "label": "1.5 kg",
        "price": 1300
      }
    ]
  },
  {
    "id": "BG69",
    "name": "Masha & Bear Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG69.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG69",
    "createdAt": "2026-11-17T07:49:00.000Z",
    "variants": [
      {
        "id": "BG69-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG70",
    "name": "Chutti Kannama Step Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG70.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG70",
    "createdAt": "2026-11-17T07:50:00.000Z",
    "variants": [
      {
        "id": "BG70-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BG71",
    "name": "Butterfly & Girl Theme Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG71.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG71",
    "createdAt": "2026-11-17T07:51:00.000Z",
    "variants": [
      {
        "id": "BG71-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BG72",
    "name": "1st Birthday Butterfly Step Cake",
    "category": "Birthday Girl",
    "description": "3-tier designer cake. Base price ₹3,600 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG72.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG72",
    "createdAt": "2026-11-17T07:52:00.000Z",
    "variants": [
      {
        "id": "BG72-4kg",
        "label": "4 kg",
        "price": 3600
      }
    ]
  },
  {
    "id": "BG73",
    "name": "1st Birthday Teddy Bear Cake",
    "category": "Birthday Girl",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BG73.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BG73",
    "createdAt": "2026-11-17T07:53:00.000Z",
    "variants": [
      {
        "id": "BG73-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "BB01",
    "name": "Cocomelon Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB01",
    "createdAt": "2026-11-17T07:54:00.000Z",
    "variants": [
      {
        "id": "BB01-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BB02",
    "name": "Tom & Jerry Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB02",
    "createdAt": "2026-11-17T07:55:00.000Z",
    "variants": [
      {
        "id": "BB02-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB03",
    "name": "Panda cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB03",
    "createdAt": "2026-11-17T07:56:00.000Z",
    "variants": [
      {
        "id": "BB03-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB04",
    "name": "Doremon Shape Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB04",
    "createdAt": "2026-11-17T07:57:00.000Z",
    "variants": [
      {
        "id": "BB04-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BB05",
    "name": "Football Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB05",
    "createdAt": "2026-11-17T07:58:00.000Z",
    "variants": [
      {
        "id": "BB05-1_5kg",
        "label": "1.5 kg",
        "price": 1350
      }
    ]
  },
  {
    "id": "BB06",
    "name": "Space Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB06.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB06",
    "createdAt": "2026-11-17T07:59:00.000Z",
    "variants": [
      {
        "id": "BB06-1_5kg",
        "label": "1.5 kg",
        "price": 1350
      }
    ]
  },
  {
    "id": "BB07",
    "name": "Baby Shark Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB07.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB07",
    "createdAt": "2026-11-17T08:00:00.000Z",
    "variants": [
      {
        "id": "BB07-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB08",
    "name": "Panda Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB08.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB08",
    "createdAt": "2026-11-17T08:01:00.000Z",
    "variants": [
      {
        "id": "BB08-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB09",
    "name": "Mickey Mouse Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB09.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB09",
    "createdAt": "2026-11-17T08:02:00.000Z",
    "variants": [
      {
        "id": "BB09-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB10",
    "name": "Teddy Bear Step Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB10.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB10",
    "createdAt": "2026-11-17T08:03:00.000Z",
    "variants": [
      {
        "id": "BB10-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB11",
    "name": "Teddy Bear Step Cake",
    "category": "Birthday Boy",
    "description": "3-tier designer cake. Base price ₹4,500 for 5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB11.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB11",
    "createdAt": "2026-11-17T08:04:00.000Z",
    "variants": [
      {
        "id": "BB11-5kg",
        "label": "5 kg",
        "price": 4500
      }
    ]
  },
  {
    "id": "BB12",
    "name": "Panda Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB12.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB12",
    "createdAt": "2026-11-17T08:05:00.000Z",
    "variants": [
      {
        "id": "BB12-1_5kg",
        "label": "1.5 kg",
        "price": 1350
      }
    ]
  },
  {
    "id": "BB13",
    "name": "Zimba Theme Step Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB13.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB13",
    "createdAt": "2026-11-17T08:06:00.000Z",
    "variants": [
      {
        "id": "BB13-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB14",
    "name": "Zimba Theme Cake",
    "category": "Birthday Boy",
    "description": "3-tier designer cake. Base price ₹4,500 for 5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB14.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB14",
    "createdAt": "2026-11-17T08:07:00.000Z",
    "variants": [
      {
        "id": "BB14-5kg",
        "label": "5 kg",
        "price": 4500
      }
    ]
  },
  {
    "id": "BB15",
    "name": "Zimba Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB15.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB15",
    "createdAt": "2026-11-17T08:08:00.000Z",
    "variants": [
      {
        "id": "BB15-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB16",
    "name": "Zimba Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB16.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB16",
    "createdAt": "2026-11-17T08:09:00.000Z",
    "variants": [
      {
        "id": "BB16-1_5kg",
        "label": "1.5 kg",
        "price": 1500
      }
    ]
  },
  {
    "id": "BB17",
    "name": "Lion Photo Print Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB17.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB17",
    "createdAt": "2026-11-17T08:10:00.000Z",
    "variants": [
      {
        "id": "BB17-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BB18",
    "name": "Animal Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB18.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB18",
    "createdAt": "2026-11-17T08:11:00.000Z",
    "variants": [
      {
        "id": "BB18-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB19",
    "name": "Elephant Fondant Toys Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹3,300 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB19.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB19",
    "createdAt": "2026-11-17T08:12:00.000Z",
    "variants": [
      {
        "id": "BB19-3kg",
        "label": "3 kg",
        "price": 3300
      }
    ]
  },
  {
    "id": "BB20",
    "name": "Teddy Bear Fondant Toys Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹3,300 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB20.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB20",
    "createdAt": "2026-11-17T08:13:00.000Z",
    "variants": [
      {
        "id": "BB20-3kg",
        "label": "3 kg",
        "price": 3300
      }
    ]
  },
  {
    "id": "BB21",
    "name": "Jungle Theme Step Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB21.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB21",
    "createdAt": "2026-11-17T08:14:00.000Z",
    "variants": [
      {
        "id": "BB21-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB22",
    "name": "Jungle Theme Step Cake",
    "category": "Birthday Boy",
    "description": "3-tier designer cake. Base price ₹5,000 for 5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB22.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB22",
    "createdAt": "2026-11-17T08:15:00.000Z",
    "variants": [
      {
        "id": "BB22-5kg",
        "label": "5 kg",
        "price": 5000
      }
    ]
  },
  {
    "id": "BB23",
    "name": "Animal Fondant Toys Cake",
    "category": "Birthday Boy",
    "description": "3-tier designer cake. Base price ₹4,500 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB23.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB23",
    "createdAt": "2026-11-17T08:16:00.000Z",
    "variants": [
      {
        "id": "BB23-4kg",
        "label": "4 kg",
        "price": 4500
      }
    ]
  },
  {
    "id": "BB24",
    "name": "Animal Theme Step Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB24.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB24",
    "createdAt": "2026-11-17T08:17:00.000Z",
    "variants": [
      {
        "id": "BB24-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB25",
    "name": "Animal Theme Step Cake",
    "category": "Birthday Boy",
    "description": "3-tier designer cake. Base price ₹4,000 for 4 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB25.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB25",
    "createdAt": "2026-11-17T08:18:00.000Z",
    "variants": [
      {
        "id": "BB25-4kg",
        "label": "4 kg",
        "price": 4000
      }
    ]
  },
  {
    "id": "BB26",
    "name": "Spiderman Theme Step Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB26.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB26",
    "createdAt": "2026-11-17T08:19:00.000Z",
    "variants": [
      {
        "id": "BB26-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB27",
    "name": "Football Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB27.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB27",
    "createdAt": "2026-11-17T08:20:00.000Z",
    "variants": [
      {
        "id": "BB27-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BB28",
    "name": "Spiderman Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB28.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB28",
    "createdAt": "2026-11-17T08:21:00.000Z",
    "variants": [
      {
        "id": "BB28-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BB29",
    "name": "Spiderman Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB29.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB29",
    "createdAt": "2026-11-17T08:22:00.000Z",
    "variants": [
      {
        "id": "BB29-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BB30",
    "name": "JCB Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB30.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB30",
    "createdAt": "2026-11-17T08:23:00.000Z",
    "variants": [
      {
        "id": "BB30-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "BB31",
    "name": "Hulk & Spiderman Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB31.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB31",
    "createdAt": "2026-11-17T08:24:00.000Z",
    "variants": [
      {
        "id": "BB31-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB32",
    "name": "Avengers Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB32.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB32",
    "createdAt": "2026-11-17T08:25:00.000Z",
    "variants": [
      {
        "id": "BB32-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BB33",
    "name": "Avengers Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB33.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB33",
    "createdAt": "2026-11-17T08:26:00.000Z",
    "variants": [
      {
        "id": "BB33-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB34",
    "name": "Tom & Jerry Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB34.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB34",
    "createdAt": "2026-11-17T08:27:00.000Z",
    "variants": [
      {
        "id": "BB34-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB35",
    "name": "Tom & Jerry Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB35.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB35",
    "createdAt": "2026-11-17T08:28:00.000Z",
    "variants": [
      {
        "id": "BB35-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB36",
    "name": "Tom And Jerry Step Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB36.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB36",
    "createdAt": "2026-11-17T08:29:00.000Z",
    "variants": [
      {
        "id": "BB36-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "BB37",
    "name": "Spiderman Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB37.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB37",
    "createdAt": "2026-11-17T08:30:00.000Z",
    "variants": [
      {
        "id": "BB37-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB38",
    "name": "Mickey Mouse Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB38.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB38",
    "createdAt": "2026-11-17T08:31:00.000Z",
    "variants": [
      {
        "id": "BB38-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB39",
    "name": "Boss Baby Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB39.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB39",
    "createdAt": "2026-11-17T08:32:00.000Z",
    "variants": [
      {
        "id": "BB39-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB40",
    "name": "Boss Baby Theme Cake",
    "category": "Birthday Boy",
    "description": "Step designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB40.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB40",
    "createdAt": "2026-11-17T08:33:00.000Z",
    "variants": [
      {
        "id": "BB40-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "BB41",
    "name": "Boss Baby Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB41.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB41",
    "createdAt": "2026-11-17T08:34:00.000Z",
    "variants": [
      {
        "id": "BB41-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB42",
    "name": "Baby Duck Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB42.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB42",
    "createdAt": "2026-11-17T08:35:00.000Z",
    "variants": [
      {
        "id": "BB42-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "BB43",
    "name": "Baby Lion King Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹3,000 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB43.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB43",
    "createdAt": "2026-11-17T08:36:00.000Z",
    "variants": [
      {
        "id": "BB43-3kg",
        "label": "3 kg",
        "price": 3000
      }
    ]
  },
  {
    "id": "BB44",
    "name": "Cocomelon Theme Cake With Spacer",
    "category": "Birthday Boy",
    "description": "3-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB44.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB44",
    "createdAt": "2026-11-17T08:37:00.000Z",
    "variants": [
      {
        "id": "BB44-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BB45",
    "name": "Jungle Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB45.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB45",
    "createdAt": "2026-11-17T08:38:00.000Z",
    "variants": [
      {
        "id": "BB45-1_5kg",
        "label": "1.5 kg",
        "price": 1500
      }
    ]
  },
  {
    "id": "BB46",
    "name": "Animal Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB46.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB46",
    "createdAt": "2026-11-17T08:39:00.000Z",
    "variants": [
      {
        "id": "BB46-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB47",
    "name": "Boss Baby Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB47.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB47",
    "createdAt": "2026-11-17T08:40:00.000Z",
    "variants": [
      {
        "id": "BB47-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB48",
    "name": "Naruto Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB48.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB48",
    "createdAt": "2026-11-17T08:41:00.000Z",
    "variants": [
      {
        "id": "BB48-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB49",
    "name": "Fisherman Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB49.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB49",
    "createdAt": "2026-11-17T08:42:00.000Z",
    "variants": [
      {
        "id": "BB49-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "BB50",
    "name": "Spiderman Marble Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹2,200 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB50.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB50",
    "createdAt": "2026-11-17T08:43:00.000Z",
    "variants": [
      {
        "id": "BB50-2kg",
        "label": "2 kg",
        "price": 2200
      }
    ]
  },
  {
    "id": "BB51",
    "name": "Tooth Shape Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹1,000 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB51.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB51",
    "createdAt": "2026-11-17T08:44:00.000Z",
    "variants": [
      {
        "id": "BB51-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "BB52",
    "name": "Muruga Theme Cake",
    "category": "Birthday Boy",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB52.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB52",
    "createdAt": "2026-11-17T08:45:00.000Z",
    "variants": [
      {
        "id": "BB52-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "BB53",
    "name": "Murugan Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB53.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB53",
    "createdAt": "2026-11-17T08:46:00.000Z",
    "variants": [
      {
        "id": "BB53-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "BB54",
    "name": "Murugan Theme Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB54.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB54",
    "createdAt": "2026-11-17T08:47:00.000Z",
    "variants": [
      {
        "id": "BB54-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "BB55",
    "name": "One Piece Characters Cake",
    "category": "Birthday Boy",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/BB55.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BB55",
    "createdAt": "2026-11-17T08:48:00.000Z",
    "variants": [
      {
        "id": "BB55-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "WC01",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC01",
    "createdAt": "2026-11-17T08:49:00.000Z",
    "variants": [
      {
        "id": "WC01-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "WC02",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC02",
    "createdAt": "2026-11-17T08:50:00.000Z",
    "variants": [
      {
        "id": "WC02-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "WC03",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC03",
    "createdAt": "2026-11-17T08:51:00.000Z",
    "variants": [
      {
        "id": "WC03-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC04",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC04",
    "createdAt": "2026-11-17T08:52:00.000Z",
    "variants": [
      {
        "id": "WC04-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "WC05",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "3-tier designer cake. Base price ₹3,300 for 3.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC05",
    "createdAt": "2026-11-17T08:53:00.000Z",
    "variants": [
      {
        "id": "WC05-3_5kg",
        "label": "3.5 kg",
        "price": 3300
      }
    ]
  },
  {
    "id": "WC06",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC06.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC06",
    "createdAt": "2026-11-17T08:54:00.000Z",
    "variants": [
      {
        "id": "WC06-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "WC07",
    "name": "Wedding Cake With Dummy Model",
    "category": "Wedding Cakes",
    "description": "3-tier designer cake. Base price ₹3,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC07.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC07",
    "createdAt": "2026-11-17T08:55:00.000Z",
    "variants": [
      {
        "id": "WC07-2kg",
        "label": "2 kg",
        "price": 3000
      }
    ]
  },
  {
    "id": "WC08",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC08.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC08",
    "createdAt": "2026-11-17T08:56:00.000Z",
    "variants": [
      {
        "id": "WC08-3kg",
        "label": "3 kg",
        "price": 2700
      }
    ]
  },
  {
    "id": "WC09",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC09.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC09",
    "createdAt": "2026-11-17T08:57:00.000Z",
    "variants": [
      {
        "id": "WC09-2kg",
        "label": "2 kg",
        "price": 1700
      }
    ]
  },
  {
    "id": "WC10",
    "name": "Wedding Cake With Dummy Model",
    "category": "Wedding Cakes",
    "description": "3-tier designer cake. Base price ₹3,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC10.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC10",
    "createdAt": "2026-11-17T08:58:00.000Z",
    "variants": [
      {
        "id": "WC10-2kg",
        "label": "2 kg",
        "price": 3000
      }
    ]
  },
  {
    "id": "WC11",
    "name": "Wedding Cake With Dummy",
    "category": "Wedding Cakes",
    "description": "3-tier designer cake. Base price ₹3,500 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC11.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC11",
    "createdAt": "2026-11-17T08:59:00.000Z",
    "variants": [
      {
        "id": "WC11-2kg",
        "label": "2 kg",
        "price": 3500
      }
    ]
  },
  {
    "id": "WC12",
    "name": "Wedding Cake",
    "category": "Wedding Cakes",
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC12.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC12",
    "createdAt": "2026-11-17T09:00:00.000Z",
    "variants": [
      {
        "id": "WC12-2kg",
        "label": "2 kg",
        "price": 2000
      }
    ]
  },
  {
    "id": "WC13",
    "name": "Wedding Cake With Dummy Model",
    "category": "Wedding Cakes",
    "description": "3-tier designer cake. Base price ₹3,000 for 2 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC13.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC13",
    "createdAt": "2026-11-17T09:01:00.000Z",
    "variants": [
      {
        "id": "WC13-2kg",
        "label": "2 kg",
        "price": 3000
      }
    ]
  },
  {
    "id": "WC14",
    "name": "Wedding Cake Model",
    "category": "Wedding Cakes",
    "description": "3-tier designer cake. Base price ₹3,200 for 3.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC14.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC14",
    "createdAt": "2026-11-17T09:02:00.000Z",
    "variants": [
      {
        "id": "WC14-3_5kg",
        "label": "3.5 kg",
        "price": 3200
      }
    ]
  },
  {
    "id": "WC15",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC15.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC15",
    "createdAt": "2026-11-17T09:03:00.000Z",
    "variants": [
      {
        "id": "WC15-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC16",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC16.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC16",
    "createdAt": "2026-11-17T09:04:00.000Z",
    "variants": [
      {
        "id": "WC16-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC17",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC17.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC17",
    "createdAt": "2026-11-17T09:05:00.000Z",
    "variants": [
      {
        "id": "WC17-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "WC18",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC18.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC18",
    "createdAt": "2026-11-17T09:06:00.000Z",
    "variants": [
      {
        "id": "WC18-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "WC19",
    "name": "Love Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC19.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC19",
    "createdAt": "2026-11-17T09:07:00.000Z",
    "variants": [
      {
        "id": "WC19-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC20",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC20.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC20",
    "createdAt": "2026-11-17T09:08:00.000Z",
    "variants": [
      {
        "id": "WC20-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "WC21",
    "name": "Engagement Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC21.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC21",
    "createdAt": "2026-11-17T09:09:00.000Z",
    "variants": [
      {
        "id": "WC21-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC22",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC22.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC22",
    "createdAt": "2026-11-17T09:10:00.000Z",
    "variants": [
      {
        "id": "WC22-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC23",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC23.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC23",
    "createdAt": "2026-11-17T09:11:00.000Z",
    "variants": [
      {
        "id": "WC23-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC24",
    "name": "Love Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC24.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC24",
    "createdAt": "2026-11-17T09:12:00.000Z",
    "variants": [
      {
        "id": "WC24-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC25",
    "name": "Love Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC25.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC25",
    "createdAt": "2026-11-17T09:13:00.000Z",
    "variants": [
      {
        "id": "WC25-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC26",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹850 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC26.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC26",
    "createdAt": "2026-11-17T09:14:00.000Z",
    "variants": [
      {
        "id": "WC26-1kg",
        "label": "1 kg",
        "price": 850
      }
    ]
  },
  {
    "id": "WC27",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC27.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC27",
    "createdAt": "2026-11-17T09:15:00.000Z",
    "variants": [
      {
        "id": "WC27-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC28",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC28.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC28",
    "createdAt": "2026-11-17T09:16:00.000Z",
    "variants": [
      {
        "id": "WC28-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC29",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC29.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC29",
    "createdAt": "2026-11-17T09:17:00.000Z",
    "variants": [
      {
        "id": "WC29-1_5kg",
        "label": "1.5 kg",
        "price": 1400
      }
    ]
  },
  {
    "id": "WC30",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC30.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC30",
    "createdAt": "2026-11-17T09:18:00.000Z",
    "variants": [
      {
        "id": "WC30-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC31",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC31.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC31",
    "createdAt": "2026-11-17T09:19:00.000Z",
    "variants": [
      {
        "id": "WC31-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "WC32",
    "name": "Anniversary Cake",
    "category": "Wedding Cakes",
    "description": "Base price ₹1,000 for 1 kg — final price varies with flavour selection and design details.",
    "imageUrl": "/src/assets/images/cakes/WC32.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "WC32",
    "createdAt": "2026-11-17T09:20:00.000Z",
    "variants": [
      {
        "id": "WC32-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "SO01",
    "name": "Baby Shower Theme Cake",
    "category": "Special Occasion",
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO01",
    "createdAt": "2026-11-17T09:21:00.000Z",
    "variants": [
      {
        "id": "SO01-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "SO02",
    "name": "Baby Shower Step Cake (2-Tier)",
    "category": "Special Occasion",
    "description": "2-tier step designer cake. Base price ₹1,800 for 2 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO02",
    "createdAt": "2026-11-17T09:22:00.000Z",
    "variants": [
      {
        "id": "SO02-2kg",
        "label": "2 kg",
        "price": 1800
      }
    ]
  },
  {
    "id": "SO03",
    "name": "Half Birthday Cake",
    "category": "Special Occasion",
    "description": "Base price ₹1,000 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO03",
    "createdAt": "2026-11-17T09:23:00.000Z",
    "variants": [
      {
        "id": "SO03-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "SO04",
    "name": "Half Birthday Cake",
    "category": "Special Occasion",
    "description": "Base price ₹1,000 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO04",
    "createdAt": "2026-11-17T09:24:00.000Z",
    "variants": [
      {
        "id": "SO04-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "SO05",
    "name": "Bride To Be Cake",
    "category": "Special Occasion",
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO05",
    "createdAt": "2026-11-17T09:25:00.000Z",
    "variants": [
      {
        "id": "SO05-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "SO06",
    "name": "Bride To Be Cake",
    "category": "Special Occasion",
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO06.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO06",
    "createdAt": "2026-11-17T09:26:00.000Z",
    "variants": [
      {
        "id": "SO06-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "SO07",
    "name": "Graduation Cake",
    "category": "Special Occasion",
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO07.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO07",
    "createdAt": "2026-11-17T09:27:00.000Z",
    "variants": [
      {
        "id": "SO07-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "SO08",
    "name": "Graduation Cake",
    "category": "Special Occasion",
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO08.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO08",
    "createdAt": "2026-11-17T09:28:00.000Z",
    "variants": [
      {
        "id": "SO08-1kg",
        "label": "1 kg",
        "price": 900
      }
    ]
  },
  {
    "id": "SO09",
    "name": "Name Ceremony Cake",
    "category": "Special Occasion",
    "description": "Base price ₹1,000 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "imageUrl": "/src/assets/images/cakes/SO09.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "SO09",
    "createdAt": "2026-11-17T09:29:00.000Z",
    "variants": [
      {
        "id": "SO09-1kg",
        "label": "1 kg",
        "price": 1000
      }
    ]
  },
  {
    "id": "BC01",
    "name": "Chocolate Brownie",
    "category": "Brownies & Cupcakes",
    "description": "1 kg ₹700 • ½ kg ₹350. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/BC01.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BC01",
    "createdAt": "2026-11-17T09:30:00.000Z",
    "variants": [
      {
        "id": "BC01-0_5kg",
        "label": "½ kg",
        "price": 350
      },
      {
        "id": "BC01-1kg",
        "label": "1 kg",
        "price": 700
      }
    ]
  },
  {
    "id": "BC02",
    "name": "Brownie Chocolate Tower",
    "category": "Brownies & Cupcakes",
    "description": "1 kg ₹800. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/BC02.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BC02",
    "createdAt": "2026-11-17T09:31:00.000Z",
    "variants": [
      {
        "id": "BC02-1kg",
        "label": "1 kg",
        "price": 800
      }
    ]
  },
  {
    "id": "BC03",
    "name": "Nutella Brownie Tower",
    "category": "Brownies & Cupcakes",
    "description": "1 kg ₹1,200. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/BC03.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BC03",
    "createdAt": "2026-11-17T09:32:00.000Z",
    "variants": [
      {
        "id": "BC03-1kg",
        "label": "1 kg",
        "price": 1200
      }
    ]
  },
  {
    "id": "BC04",
    "name": "Nuts Brownie",
    "category": "Brownies & Cupcakes",
    "description": "1 kg ₹800 • ½ kg ₹400. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/BC04.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BC04",
    "createdAt": "2026-11-17T09:33:00.000Z",
    "variants": [
      {
        "id": "BC04-0_5kg",
        "label": "½ kg",
        "price": 400
      },
      {
        "id": "BC04-1kg",
        "label": "1 kg",
        "price": 800
      }
    ]
  },
  {
    "id": "BC05",
    "name": "Plain Brownie",
    "category": "Brownies & Cupcakes",
    "description": "1 kg ₹600 • ½ kg ₹300. Freshly baked on order with premium ingredients.",
    "imageUrl": "/src/assets/images/cakes/BC05.jpg",
    "egglessAvailable": true,
    "inStock": true,
    "sku": "BC05",
    "createdAt": "2026-11-17T09:34:00.000Z",
    "variants": [
      {
        "id": "BC05-0_5kg",
        "label": "½ kg",
        "price": 300
      },
      {
        "id": "BC05-1kg",
        "label": "1 kg",
        "price": 600
      }
    ]
  }
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
  return `EC-${yy}${mm}${dd}-${String(seq).padStart(3, '0')}`;
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
          key: 'SC01-SC01-1kg-std',
          cakeId: 'SC01',
          cakeName: 'Black Forest Cake',
          variantId: 'SC01-1kg',
          variantLabel: '1 kg',
          unitPrice: 800,
          quantity: 1,
          eggless: false,
        },
        {
          key: 'SC03-SC03-1kg-eggless',
          cakeId: 'SC03',
          cakeName: 'Red Velvet Cake',
          variantId: 'SC03-1kg',
          variantLabel: '1 kg',
          unitPrice: 850,
          quantity: 1,
          eggless: true,
        },
      ],
      subtotal: 1650,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 1650,
      paymentMethod: 'UPI',
      customerName: 'Priya Rajan',
      printedAt: earlier2.toISOString(),
      printMode: 'bluetooth',
    },
    {
      id: 'seed-ord-1',
      billNumber: formatBillNum(now, 1),
      createdAt: earlier1.toISOString(),
      items: [
        {
          key: 'BB26-BB26-2kg-eggless',
          cakeId: 'BB26',
          cakeName: 'Spiderman Theme Step Cake',
          variantId: 'BB26-2kg',
          variantLabel: '2 kg',
          unitPrice: 1800,
          quantity: 1,
          eggless: true,
          cakeMessage: 'Happy Birthday Arjun!',
        },
      ],
      subtotal: 1800,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 1800,
      paymentMethod: 'Cash',
      customerName: 'Murugan S.',
      customerPhone: '9876543210',
      printedAt: earlier1.toISOString(),
      printMode: 'bluetooth',
    },
  ];

  const recentDaySpecs: Array<{
    daysAgo: number;
    total: number;
    paymentMethod: BillOrder['paymentMethod'];
    cakeName: string;
    variantLabel: string;
    customerName: string;
  }> = [
    { daysAgo: 1, total: 1800, paymentMethod: 'UPI', cakeName: 'Unicorn Theme Cake', variantLabel: '2 kg', customerName: 'Kavitha M.' },
    { daysAgo: 2, total: 950, paymentMethod: 'Cash', cakeName: 'Chocolate Truffle Cake', variantLabel: '1 kg', customerName: 'Senthil K.' },
    { daysAgo: 3, total: 2700, paymentMethod: 'UPI', cakeName: 'Butterfly Wings Theme 2-Tier Cake', variantLabel: '3 kg', customerName: 'Nithya P.' },
    { daysAgo: 4, total: 980, paymentMethod: 'Card', cakeName: 'Gulab Jamun Cake', variantLabel: '1 kg', customerName: 'Rajesh V.' },
    { daysAgo: 5, total: 1500, paymentMethod: 'Cash', cakeName: 'Kitkat & Oreo Cake', variantLabel: '1.5 kg', customerName: 'Anand T.' },
    { daysAgo: 6, total: 3300, paymentMethod: 'UPI', cakeName: 'Elephant Fondant Toys Cake', variantLabel: '3 kg', customerName: 'Deepa R.' },
    { daysAgo: 7, total: 1200, paymentMethod: 'UPI', cakeName: 'Nutella Brownie Tower', variantLabel: '1 kg', customerName: 'Vimal A.' },
    { daysAgo: 9, total: 900, paymentMethod: 'Cash', cakeName: 'Anniversary Cake', variantLabel: '1 kg', customerName: 'Suresh B.' },
    { daysAgo: 10, total: 2000, paymentMethod: 'UPI', cakeName: 'Cocomelon Theme Cake', variantLabel: '2 kg', customerName: 'Lakshmi D.' },
    { daysAgo: 12, total: 1400, paymentMethod: 'Card', cakeName: 'Ferrero Cake', variantLabel: '1 kg', customerName: 'Pradeep N.' },
  ];

  const recentOrders: BillOrder[] = recentDaySpecs.map((spec, idx) => {
    const dt = buildDayDate(now, spec.daysAgo, 11 + (idx % 6), 20);
    return {
      id: `seed-day-${spec.daysAgo}`,
      billNumber: formatBillNum(dt, 1),
      createdAt: dt.toISOString(),
      items: [
        {
          key: `hist-day-${spec.daysAgo}`,
          cakeId: 'SC01',
          cakeName: spec.cakeName,
          variantId: 'SC01-1kg',
          variantLabel: spec.variantLabel,
          unitPrice: spec.total,
          quantity: 1,
          eggless: idx % 2 === 0,
        },
      ],
      subtotal: spec.total,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: spec.total,
      paymentMethod: spec.paymentMethod,
      customerName: spec.customerName,
      printedAt: dt.toISOString(),
      printMode: 'bluetooth',
    };
  });

  const monthlySpecs: Array<{
    monthsAgo: number;
    day: number;
    total: number;
    paymentMethod: BillOrder['paymentMethod'];
  }> = [
    { monthsAgo: 1, day: 8, total: 12500, paymentMethod: 'UPI' },
    { monthsAgo: 1, day: 21, total: 9800, paymentMethod: 'Card' },
    { monthsAgo: 2, day: 11, total: 8400, paymentMethod: 'UPI' },
    { monthsAgo: 2, day: 24, total: 7200, paymentMethod: 'Cash' },
    { monthsAgo: 3, day: 6, total: 15000, paymentMethod: 'Card' },
    { monthsAgo: 3, day: 19, total: 6800, paymentMethod: 'UPI' },
    { monthsAgo: 4, day: 14, total: 18500, paymentMethod: 'UPI' },
    { monthsAgo: 5, day: 16, total: 11200, paymentMethod: 'Card' },
  ];

  const priorMonthOrders: BillOrder[] = monthlySpecs.map((spec, idx) => {
    const dt = buildMonthDate(now, spec.monthsAgo, spec.day, 16);
    return {
      id: `seed-mo-${spec.monthsAgo}-${idx}`,
      billNumber: formatBillNum(dt, idx + 1),
      createdAt: dt.toISOString(),
      items: [
        {
          key: `hist-mo-${idx}`,
          cakeId: 'SC01',
          cakeName: 'Esai Cakes Order Bundle',
          variantId: 'SC01-1kg',
          variantLabel: 'Assorted',
          unitPrice: spec.total,
          quantity: 1,
          eggless: false,
        },
      ],
      subtotal: spec.total,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: spec.total,
      paymentMethod: spec.paymentMethod,
      printedAt: dt.toISOString(),
      printMode: 'bluetooth',
    };
  });

  return [...todayOrders, ...recentOrders, ...priorMonthOrders];
}
