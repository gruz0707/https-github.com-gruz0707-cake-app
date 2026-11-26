// AUTO-GENERATED from F:/EsaiCakes/cakes.json — do not hand-edit.
// Snapshot generated on 2026-11-18. Live Supabase catalog was NOT verified
// (DNS resolution failed during inspection); this local snapshot is authoritative.
// Category names are kept exactly as the source uses them so business rules do
// not break if app-facing labels are renamed.
export interface SourceWeightRecord {
  weight: string;
  label: string;
  price: number;
  displayPrice: string;
}

export interface SourceCakeRecord {
  id: string;
  name: string;
  sourceCategory: string;
  priceText: string;
  numericPrice: number;
  description: string;
  image: string;
  fallbackImage: string;
  available: boolean;
  defaultWeight: string;
  weights: SourceWeightRecord[];
}

export const CATALOG_SOURCE_VERSION = '2026-11-18-local-snapshot';
export const CATALOG_SOURCE_PATH = 'F:/EsaiCakes/cakes.json';
export const CATALOG_SOURCE_COUNT = 215;

export const SOURCE_CAKES: SourceCakeRecord[] = [
  {
    "id": "SC01",
    "name": "Black Forest Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹800 / kg",
    "numericPrice": 800,
    "description": "1 kg ₹800 • ½ kg ₹400. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC01.jpg?v=2",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 400,
        "displayPrice": "₹400"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 800,
        "displayPrice": "₹800"
      }
    ]
  },
  {
    "id": "SC02",
    "name": "White Forest Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹700 / kg",
    "numericPrice": 700,
    "description": "1 kg ₹700 • ½ kg ₹400. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 400,
        "displayPrice": "₹400"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 700,
        "displayPrice": "₹700"
      }
    ]
  },
  {
    "id": "SC03",
    "name": "Red Velvet Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹850 / kg",
    "numericPrice": 850,
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 450,
        "displayPrice": "₹450"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 850,
        "displayPrice": "₹850"
      }
    ]
  },
  {
    "id": "SC04",
    "name": "Gulab Jamun Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹980 / kg",
    "numericPrice": 980,
    "description": "1 kg ₹980 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 980,
        "displayPrice": "₹980"
      }
    ]
  },
  {
    "id": "SC05",
    "name": "Vancho Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹1,000 / kg",
    "numericPrice": 1000,
    "description": "1 kg ₹1,000. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "SC06",
    "name": "White Truffle Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹980 / kg",
    "numericPrice": 980,
    "description": "1 kg ₹980 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC06.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 980,
        "displayPrice": "₹980"
      }
    ]
  },
  {
    "id": "SC07",
    "name": "Red Bee Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹980 / kg",
    "numericPrice": 980,
    "description": "1 kg ₹980. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC07.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 980,
        "displayPrice": "₹980"
      }
    ]
  },
  {
    "id": "SC08",
    "name": "Kulfi Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC08.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "SC09",
    "name": "Irish Coffee Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC09.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "SC10",
    "name": "Classic Vanilla Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹600 / kg",
    "numericPrice": 600,
    "description": "1 kg ₹600 • ½ kg ₹350. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC10.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 350,
        "displayPrice": "₹350"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 600,
        "displayPrice": "₹600"
      }
    ]
  },
  {
    "id": "SC11",
    "name": "Pista Truffle Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC11.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "SC12",
    "name": "Honey Almond Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹900 / kg",
    "numericPrice": 900,
    "description": "1 kg ₹900 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC12.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "SC13",
    "name": "Fresh Fruit Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹1,100 / kg",
    "numericPrice": 1100,
    "description": "1 kg ₹1,100. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC13.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1100,
        "displayPrice": "₹1,100"
      }
    ]
  },
  {
    "id": "SC14",
    "name": "Butterscotch Cake",
    "sourceCategory": "Special cakes",
    "priceText": "₹890 / kg",
    "numericPrice": 890,
    "description": "1 kg ₹890 • ½ kg ₹480. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/SC14.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 480,
        "displayPrice": "₹480"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 890,
        "displayPrice": "₹890"
      }
    ]
  },
  {
    "id": "TR01",
    "name": "Gulab Jamoon Cake",
    "sourceCategory": "Trending Cakes",
    "priceText": "₹980 / kg",
    "numericPrice": 980,
    "description": "1 kg ₹980 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/TR01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 980,
        "displayPrice": "₹980"
      }
    ]
  },
  {
    "id": "TR02",
    "name": "Kulfi Cake",
    "sourceCategory": "Trending Cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/TR02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "TR03",
    "name": "Irish Coffee Cake",
    "sourceCategory": "Trending Cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/TR03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "TR04",
    "name": "Butterscotch Cake",
    "sourceCategory": "Trending Cakes",
    "priceText": "₹890 / kg",
    "numericPrice": 890,
    "description": "1 kg ₹890 • ½ kg ₹480. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/TR04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 480,
        "displayPrice": "₹480"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 890,
        "displayPrice": "₹890"
      }
    ]
  },
  {
    "id": "TR05",
    "name": "Rasamalai Cake",
    "sourceCategory": "Trending Cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/TR05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CH01",
    "name": "Choco Forest Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CH02",
    "name": "Kitkat & Gems Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹1,500 / 1.5kg",
    "numericPrice": 1500,
    "description": "Custom chocolate cake. Base price ₹1,500 for 1.5 kg — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1500,
        "displayPrice": "₹1,500"
      }
    ]
  },
  {
    "id": "CH03",
    "name": "Kitkat & Oreo Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹1,500 / 1.5kg",
    "numericPrice": 1500,
    "description": "Custom chocolate cake. Base price ₹1,500 for 1.5 kg — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1500,
        "displayPrice": "₹1,500"
      }
    ]
  },
  {
    "id": "CH04",
    "name": "Chocolate Web Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹1,000 / kg",
    "numericPrice": 1000,
    "description": "1 kg ₹1,000 • ½ kg ₹550. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 550,
        "displayPrice": "₹550"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "CH05",
    "name": "Choco Oreo Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CH06",
    "name": "Chocolate Almonds Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹980 / kg",
    "numericPrice": 980,
    "description": "1 kg ₹980 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH06.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 980,
        "displayPrice": "₹980"
      }
    ]
  },
  {
    "id": "CH07",
    "name": "German Black Forest Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹890 / kg",
    "numericPrice": 890,
    "description": "1 kg ₹890 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH07.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 890,
        "displayPrice": "₹890"
      }
    ]
  },
  {
    "id": "CH08",
    "name": "Chocolate Truffle Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH08.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CH09",
    "name": "Double Chocolate Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH09.jpg?v=2",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CH10",
    "name": "Choco Fantasy Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH10.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CH11",
    "name": "Chocolate Model Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹1,100 / kg",
    "numericPrice": 1100,
    "description": "1 kg ₹1,100 • ½ kg ₹600. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH11.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 600,
        "displayPrice": "₹600"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1100,
        "displayPrice": "₹1,100"
      }
    ]
  },
  {
    "id": "CH12",
    "name": "Chocolate Fruits Cake",
    "sourceCategory": "Chocolate cakes",
    "priceText": "₹1,200 / kg",
    "numericPrice": 1200,
    "description": "1 kg ₹1,200 • ½ kg ₹700. Custom order — final price varies with weight and eggless selection.",
    "image": "images/cakes/CH12.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 700,
        "displayPrice": "₹700"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1200,
        "displayPrice": "₹1,200"
      }
    ]
  },
  {
    "id": "FF01",
    "name": "Black Currant Cake",
    "sourceCategory": "Fruit Flavors",
    "priceText": "₹850 / kg",
    "numericPrice": 850,
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/FF01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 450,
        "displayPrice": "₹450"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 850,
        "displayPrice": "₹850"
      }
    ]
  },
  {
    "id": "FF02",
    "name": "Blueberry Cake",
    "sourceCategory": "Fruit Flavors",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/FF02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "FF03",
    "name": "Mango Cake",
    "sourceCategory": "Fruit Flavors",
    "priceText": "₹850 / kg",
    "numericPrice": 850,
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/FF03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 450,
        "displayPrice": "₹450"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 850,
        "displayPrice": "₹850"
      }
    ]
  },
  {
    "id": "FF04",
    "name": "Pineapple Cake",
    "sourceCategory": "Fruit Flavors",
    "priceText": "₹850 / kg",
    "numericPrice": 850,
    "description": "1 kg ₹850 • ½ kg ₹450. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/FF04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 450,
        "displayPrice": "₹450"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 850,
        "displayPrice": "₹850"
      }
    ]
  },
  {
    "id": "PR01",
    "name": "Caramelized Pineapple Cake",
    "sourceCategory": "Premium cakes",
    "priceText": "₹1,400 / 1kg",
    "numericPrice": 1400,
    "description": "Custom premium cake. Base price ₹1,400 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/PR01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "PR02",
    "name": "Rafaello Cake",
    "sourceCategory": "Premium cakes",
    "priceText": "₹1,300 / 1kg",
    "numericPrice": 1300,
    "description": "Custom premium cake. Base price ₹1,300 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/PR02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1300,
        "displayPrice": "₹1,300"
      }
    ]
  },
  {
    "id": "PR03",
    "name": "Ferrero Cake",
    "sourceCategory": "Premium cakes",
    "priceText": "₹1,400 / 1kg",
    "numericPrice": 1400,
    "description": "Custom premium cake. Base price ₹1,400 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/PR03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "PR04",
    "name": "Rainbow Cake (3 Colours)",
    "sourceCategory": "Premium cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "1 kg ₹900. Custom premium cake — freshly baked on order with premium ingredients.",
    "image": "images/cakes/PR04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "CC01",
    "name": "Blueberry Cheesecake",
    "sourceCategory": "Cheese cakes",
    "priceText": "₹950 / kg",
    "numericPrice": 950,
    "description": "1 kg ₹950 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/CC01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 950,
        "displayPrice": "₹950"
      }
    ]
  },
  {
    "id": "CC02",
    "name": "Strawberry Cheesecake",
    "sourceCategory": "Cheese cakes",
    "priceText": "₹800 / kg",
    "numericPrice": 800,
    "description": "1 kg ₹800 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/CC02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 800,
        "displayPrice": "₹800"
      }
    ]
  },
  {
    "id": "CC03",
    "name": "Choco Oreo Cheesecake",
    "sourceCategory": "Cheese cakes",
    "priceText": "₹900 / kg",
    "numericPrice": 900,
    "description": "1 kg ₹900 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/CC03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "CC04",
    "name": "Mango Cheesecake",
    "sourceCategory": "Cheese cakes",
    "priceText": "₹800 / kg",
    "numericPrice": 800,
    "description": "1 kg ₹800 • ½ kg ₹500. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/CC04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 500,
        "displayPrice": "₹500"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 800,
        "displayPrice": "₹800"
      }
    ]
  },
  {
    "id": "BG03",
    "name": "Doll Theme 2-Tier Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG04",
    "name": "Butterfly Wings Theme 2-Tier Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "BG05",
    "name": "Doll Theme 2-Tier Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "BG06",
    "name": "Doll & Wings Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG06.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG07",
    "name": "Doll With Wings Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG07.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG08",
    "name": "Butterfly Girl Baby Theme 2-Tier Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG08.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG09",
    "name": "Girl Theme Butterfly Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,300 / 1.5kg",
    "numericPrice": 1300,
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG09.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1300,
        "displayPrice": "₹1,300"
      }
    ]
  },
  {
    "id": "BG10",
    "name": "Girl Theme Butterfly Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG10.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG11",
    "name": "1st Birthday Girl Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG11.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG12",
    "name": "Girl Baby Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG12.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG13",
    "name": "Girl Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG13.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG14",
    "name": "Girl Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG14.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG15",
    "name": "Butterfly Girl Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,300 / 1.5kg",
    "numericPrice": 1300,
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG15.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1300,
        "displayPrice": "₹1,300"
      }
    ]
  },
  {
    "id": "BG16",
    "name": "Butterfly Wings With Doll 3-Tier Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹5,000 / 5kg",
    "numericPrice": 5000,
    "description": "3-tier designer cake. Base price ₹5,000 for 5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG16.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "5 kg",
    "weights": [
      {
        "weight": "5 kg",
        "label": "5 kg",
        "price": 5000,
        "displayPrice": "₹5,000"
      }
    ]
  },
  {
    "id": "BG17",
    "name": "Doll Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,900 / 2kg",
    "numericPrice": 1900,
    "description": "Base price ₹1,900 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG17.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1900,
        "displayPrice": "₹1,900"
      }
    ]
  },
  {
    "id": "BG18",
    "name": "Butterfly Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹3,400 / 4kg",
    "numericPrice": 3400,
    "description": "3-tier designer cake. Base price ₹3,400 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG18.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 3400,
        "displayPrice": "₹3,400"
      }
    ]
  },
  {
    "id": "BG19",
    "name": "Butterfly Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG19.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG20",
    "name": "Girl Baby Butterfly Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG20.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "BG21",
    "name": "Cintrella With Butterfly Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG21.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "BG22",
    "name": "Blue Queen Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,450 / 1.5kg",
    "numericPrice": 1450,
    "description": "Base price ₹1,450 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG22.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1450,
        "displayPrice": "₹1,450"
      }
    ]
  },
  {
    "id": "BG23",
    "name": "Barbie Girl Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,600 / 1.5kg",
    "numericPrice": 1600,
    "description": "Base price ₹1,600 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG23.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1600,
        "displayPrice": "₹1,600"
      }
    ]
  },
  {
    "id": "BG24",
    "name": "Barbie Girl Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,600 / 1.5kg",
    "numericPrice": 1600,
    "description": "Base price ₹1,600 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG24.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1600,
        "displayPrice": "₹1,600"
      }
    ]
  },
  {
    "id": "BG25",
    "name": "Step Cake With Barbie Girl",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹4,000 / 4kg",
    "numericPrice": 4000,
    "description": "3-tier designer cake. Base price ₹4,000 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG25.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 4000,
        "displayPrice": "₹4,000"
      }
    ]
  },
  {
    "id": "BG26",
    "name": "Minnie Mouse Theme 2-Tier Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG26.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG27",
    "name": "Minnie Mouse Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG27.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG28",
    "name": "Kitty Doll Theme Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG28.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG29",
    "name": "Kitty Doll Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG29.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG30",
    "name": "Unicorn Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG30.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG31",
    "name": "Unicorn Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG31.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG32",
    "name": "Unicorn Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG32.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG33",
    "name": "Cat Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹850 / 1kg",
    "numericPrice": 850,
    "description": "Base price ₹850 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG33.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 850,
        "displayPrice": "₹850"
      }
    ]
  },
  {
    "id": "BG34",
    "name": "Unicorn Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG34.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG35",
    "name": "Unicorn Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG35.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG36",
    "name": "Unicorn Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG36.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "BG37",
    "name": "Unicorn Theme Birthday Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹3,600 / 4kg",
    "numericPrice": 3600,
    "description": "3-tier designer cake. Base price ₹3,600 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG37.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 3600,
        "displayPrice": "₹3,600"
      }
    ]
  },
  {
    "id": "BG38",
    "name": "Unicorn Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG38.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG39",
    "name": "Mushroom Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG39.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG40",
    "name": "Mermaid Theme 2-Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG40.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG41",
    "name": "Mermaid Theme 2-Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG41.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG42",
    "name": "Mermaid Theme 2-Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Step designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG42.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG43",
    "name": "Mermaid Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,000 / 1kg",
    "numericPrice": 1000,
    "description": "Base price ₹1,000 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG43.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "BG44",
    "name": "Sea Theme 3-Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹5,000 / 5kg",
    "numericPrice": 5000,
    "description": "3-tier designer cake. Base price ₹5,000 for 5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG44.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "5 kg",
    "weights": [
      {
        "weight": "5 kg",
        "label": "5 kg",
        "price": 5000,
        "displayPrice": "₹5,000"
      }
    ]
  },
  {
    "id": "BG45",
    "name": "Mermaid Theme 3-Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹4,000 / 4kg",
    "numericPrice": 4000,
    "description": "3-tier designer cake. Base price ₹4,000 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG45.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 4000,
        "displayPrice": "₹4,000"
      }
    ]
  },
  {
    "id": "BG46",
    "name": "Mermaid Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,500 / 1.5kg",
    "numericPrice": 1500,
    "description": "Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG46.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1500,
        "displayPrice": "₹1,500"
      }
    ]
  },
  {
    "id": "BG47",
    "name": "Makeup With Cintrella Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹3,200 / 3.5kg",
    "numericPrice": 3200,
    "description": "Base price ₹3,200 for 3.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG47.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3.5 kg",
    "weights": [
      {
        "weight": "3.5 kg",
        "label": "3.5 kg",
        "price": 3200,
        "displayPrice": "₹3,200"
      }
    ]
  },
  {
    "id": "BG48",
    "name": "Make-up Theme Edible Fondant Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,200 / 1kg",
    "numericPrice": 1200,
    "description": "Base price ₹1,200 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG48.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1200,
        "displayPrice": "₹1,200"
      }
    ]
  },
  {
    "id": "BG49",
    "name": "Makeup Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,350 / 1.5kg",
    "numericPrice": 1350,
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG49.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1350,
        "displayPrice": "₹1,350"
      }
    ]
  },
  {
    "id": "BG50",
    "name": "Butterfly Shape Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG50.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG51",
    "name": "Butterfly Barbie Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG51.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG52",
    "name": "Butterfly Barbie Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG52.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG53",
    "name": "Dora Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG53.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG54",
    "name": "Dora Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,350 / 1.5kg",
    "numericPrice": 1350,
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG54.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1350,
        "displayPrice": "₹1,350"
      }
    ]
  },
  {
    "id": "BG55",
    "name": "Dora Theme Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG55.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG56",
    "name": "Dora Theme Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹3,500 / 4kg",
    "numericPrice": 3500,
    "description": "3-tier designer cake. Base price ₹3,500 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG56.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 3500,
        "displayPrice": "₹3,500"
      }
    ]
  },
  {
    "id": "BG57",
    "name": "Frozen Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG57.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG58",
    "name": "Frozen Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,500 / 1.5kg",
    "numericPrice": 1500,
    "description": "Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG58.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1500,
        "displayPrice": "₹1,500"
      }
    ]
  },
  {
    "id": "BG59",
    "name": "Frozen Theme Fondant Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹3,800 / 4kg",
    "numericPrice": 3800,
    "description": "2-tier designer cake. Base price ₹3,800 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG59.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 3800,
        "displayPrice": "₹3,800"
      }
    ]
  },
  {
    "id": "BG60",
    "name": "Frozen Theme Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG60.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG61",
    "name": "Girl Theme With Wings Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG61.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG62",
    "name": "Baby Girl Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG62.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BG63",
    "name": "Butterfly Birthday Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG63.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BG64",
    "name": "Butterfly Theme Cake With Cupcake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,350 / 1.5kg",
    "numericPrice": 1350,
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG64.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1350,
        "displayPrice": "₹1,350"
      }
    ]
  },
  {
    "id": "BG65",
    "name": "Masha & Bear Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG65.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG66",
    "name": "Masha & Bear Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG66.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG67",
    "name": "Masha & Bear Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,300 / 1.5kg",
    "numericPrice": 1300,
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG67.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1300,
        "displayPrice": "₹1,300"
      }
    ]
  },
  {
    "id": "BG68",
    "name": "Masha & Bear Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,300 / 1.5kg",
    "numericPrice": 1300,
    "description": "Base price ₹1,300 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG68.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1300,
        "displayPrice": "₹1,300"
      }
    ]
  },
  {
    "id": "BG69",
    "name": "Masha & Bear Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG69.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG70",
    "name": "Chutti Kannama Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG70.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BG71",
    "name": "Butterfly & Girl Theme Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG71.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BG72",
    "name": "1st Birthday Butterfly Step Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹3,600 / 4kg",
    "numericPrice": 3600,
    "description": "3-tier designer cake. Base price ₹3,600 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG72.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 3600,
        "displayPrice": "₹3,600"
      }
    ]
  },
  {
    "id": "BG73",
    "name": "1st Birthday Teddy Bear Cake",
    "sourceCategory": "Birthday Girl cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BG73.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "BB01",
    "name": "Cocomelon Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BB02",
    "name": "Tom & Jerry Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB03",
    "name": "Panda cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB04",
    "name": "Doremon Shape Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BB05",
    "name": "Football Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,350 / 1.5kg",
    "numericPrice": 1350,
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1350,
        "displayPrice": "₹1,350"
      }
    ]
  },
  {
    "id": "BB06",
    "name": "Space Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,350 / 1.5kg",
    "numericPrice": 1350,
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB06.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1350,
        "displayPrice": "₹1,350"
      }
    ]
  },
  {
    "id": "BB07",
    "name": "Baby Shark Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB07.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB08",
    "name": "Panda Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB08.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB09",
    "name": "Mickey Mouse Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB09.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB10",
    "name": "Teddy Bear Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB10.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB11",
    "name": "Teddy Bear Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹4,500 / 5kg",
    "numericPrice": 4500,
    "description": "3-tier designer cake. Base price ₹4,500 for 5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB11.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "5 kg",
    "weights": [
      {
        "weight": "5 kg",
        "label": "5 kg",
        "price": 4500,
        "displayPrice": "₹4,500"
      }
    ]
  },
  {
    "id": "BB12",
    "name": "Panda Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,350 / 1.5kg",
    "numericPrice": 1350,
    "description": "Base price ₹1,350 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB12.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1350,
        "displayPrice": "₹1,350"
      }
    ]
  },
  {
    "id": "BB13",
    "name": "Zimba Theme Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB13.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB14",
    "name": "Zimba Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹4,500 / 5kg",
    "numericPrice": 4500,
    "description": "3-tier designer cake. Base price ₹4,500 for 5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB14.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "5 kg",
    "weights": [
      {
        "weight": "5 kg",
        "label": "5 kg",
        "price": 4500,
        "displayPrice": "₹4,500"
      }
    ]
  },
  {
    "id": "BB15",
    "name": "Zimba Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB15.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB16",
    "name": "Zimba Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,500 / 1.5kg",
    "numericPrice": 1500,
    "description": "Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB16.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1500,
        "displayPrice": "₹1,500"
      }
    ]
  },
  {
    "id": "BB17",
    "name": "Lion Photo Print Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB17.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BB18",
    "name": "Animal Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB18.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB19",
    "name": "Elephant Fondant Toys Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹3,300 / 3kg",
    "numericPrice": 3300,
    "description": "2-tier designer cake. Base price ₹3,300 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB19.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 3300,
        "displayPrice": "₹3,300"
      }
    ]
  },
  {
    "id": "BB20",
    "name": "Teddy Bear Fondant Toys Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹3,300 / 3kg",
    "numericPrice": 3300,
    "description": "2-tier designer cake. Base price ₹3,300 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB20.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 3300,
        "displayPrice": "₹3,300"
      }
    ]
  },
  {
    "id": "BB21",
    "name": "Jungle Theme Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB21.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB22",
    "name": "Jungle Theme Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹5,000 / 5kg",
    "numericPrice": 5000,
    "description": "3-tier designer cake. Base price ₹5,000 for 5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB22.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "5 kg",
    "weights": [
      {
        "weight": "5 kg",
        "label": "5 kg",
        "price": 5000,
        "displayPrice": "₹5,000"
      }
    ]
  },
  {
    "id": "BB23",
    "name": "Animal Fondant Toys Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹4,500 / 4kg",
    "numericPrice": 4500,
    "description": "3-tier designer cake. Base price ₹4,500 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB23.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 4500,
        "displayPrice": "₹4,500"
      }
    ]
  },
  {
    "id": "BB24",
    "name": "Animal Theme Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB24.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB25",
    "name": "Animal Theme Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹4,000 / 4kg",
    "numericPrice": 4000,
    "description": "3-tier designer cake. Base price ₹4,000 for 4 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB25.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "4 kg",
    "weights": [
      {
        "weight": "4 kg",
        "label": "4 kg",
        "price": 4000,
        "displayPrice": "₹4,000"
      }
    ]
  },
  {
    "id": "BB26",
    "name": "Spiderman Theme Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB26.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB27",
    "name": "Football Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB27.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BB28",
    "name": "Spiderman Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB28.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BB29",
    "name": "Spiderman Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB29.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BB30",
    "name": "JCB Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB30.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "BB31",
    "name": "Hulk & Spiderman Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB31.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB32",
    "name": "Avengers Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB32.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BB33",
    "name": "Avengers Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB33.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB34",
    "name": "Tom & Jerry Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB34.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB35",
    "name": "Tom & Jerry Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB35.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB36",
    "name": "Tom And Jerry Step Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB36.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "BB37",
    "name": "Spiderman Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB37.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB38",
    "name": "Mickey Mouse Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB38.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB39",
    "name": "Boss Baby Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB39.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB40",
    "name": "Boss Baby Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "Step designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB40.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "BB41",
    "name": "Boss Baby Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB41.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB42",
    "name": "Baby Duck Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB42.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "BB43",
    "name": "Baby Lion King Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹3,000 / 3kg",
    "numericPrice": 3000,
    "description": "2-tier designer cake. Base price ₹3,000 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB43.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 3000,
        "displayPrice": "₹3,000"
      }
    ]
  },
  {
    "id": "BB44",
    "name": "Cocomelon Theme Cake With Spacer",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "3-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB44.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BB45",
    "name": "Jungle Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,500 / 1.5kg",
    "numericPrice": 1500,
    "description": "2-tier designer cake. Base price ₹1,500 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB45.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1500,
        "displayPrice": "₹1,500"
      }
    ]
  },
  {
    "id": "BB46",
    "name": "Animal Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB46.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB47",
    "name": "Boss Baby Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB47.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB48",
    "name": "Naruto Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB48.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB49",
    "name": "Fisherman Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB49.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "BB50",
    "name": "Spiderman Marble Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,200 / 2kg",
    "numericPrice": 2200,
    "description": "Base price ₹2,200 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB50.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2200,
        "displayPrice": "₹2,200"
      }
    ]
  },
  {
    "id": "BB51",
    "name": "Tooth Shape Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,000 / 1kg",
    "numericPrice": 1000,
    "description": "Base price ₹1,000 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB51.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "BB52",
    "name": "Muruga Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB52.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "BB53",
    "name": "Murugan Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB53.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "BB54",
    "name": "Murugan Theme Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB54.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "BB55",
    "name": "One Piece Characters Cake",
    "sourceCategory": "Birthday Boy cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/BB55.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "WC01",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "WC02",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "WC03",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC04",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier designer cake. Base price ₹1,800 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "WC05",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹3,300 / 3.5kg",
    "numericPrice": 3300,
    "description": "3-tier designer cake. Base price ₹3,300 for 3.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3.5 kg",
    "weights": [
      {
        "weight": "3.5 kg",
        "label": "3.5 kg",
        "price": 3300,
        "displayPrice": "₹3,300"
      }
    ]
  },
  {
    "id": "WC06",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC06.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "WC07",
    "name": "Wedding Cake With Dummy Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹3,000 / 2kg",
    "numericPrice": 3000,
    "description": "3-tier designer cake. Base price ₹3,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC07.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 3000,
        "displayPrice": "₹3,000"
      }
    ]
  },
  {
    "id": "WC08",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹2,700 / 3kg",
    "numericPrice": 2700,
    "description": "2-tier designer cake. Base price ₹2,700 for 3 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC08.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3 kg",
    "weights": [
      {
        "weight": "3 kg",
        "label": "3 kg",
        "price": 2700,
        "displayPrice": "₹2,700"
      }
    ]
  },
  {
    "id": "WC09",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,700 / 2kg",
    "numericPrice": 1700,
    "description": "2-tier designer cake. Base price ₹1,700 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC09.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1700,
        "displayPrice": "₹1,700"
      }
    ]
  },
  {
    "id": "WC10",
    "name": "Wedding Cake With Dummy Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹3,000 / 2kg",
    "numericPrice": 3000,
    "description": "3-tier designer cake. Base price ₹3,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC10.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 3000,
        "displayPrice": "₹3,000"
      }
    ]
  },
  {
    "id": "WC11",
    "name": "Wedding Cake With Dummy",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹3,500 / 2kg",
    "numericPrice": 3500,
    "description": "3-tier designer cake. Base price ₹3,500 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC11.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 3500,
        "displayPrice": "₹3,500"
      }
    ]
  },
  {
    "id": "WC12",
    "name": "Wedding Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹2,000 / 2kg",
    "numericPrice": 2000,
    "description": "2-tier designer cake. Base price ₹2,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC12.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 2000,
        "displayPrice": "₹2,000"
      }
    ]
  },
  {
    "id": "WC13",
    "name": "Wedding Cake With Dummy Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹3,000 / 2kg",
    "numericPrice": 3000,
    "description": "3-tier designer cake. Base price ₹3,000 for 2 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC13.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 3000,
        "displayPrice": "₹3,000"
      }
    ]
  },
  {
    "id": "WC14",
    "name": "Wedding Cake Model",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹3,200 / 3.5kg",
    "numericPrice": 3200,
    "description": "3-tier designer cake. Base price ₹3,200 for 3.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC14.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "3.5 kg",
    "weights": [
      {
        "weight": "3.5 kg",
        "label": "3.5 kg",
        "price": 3200,
        "displayPrice": "₹3,200"
      }
    ]
  },
  {
    "id": "WC15",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC15.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC16",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC16.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC17",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC17.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "WC18",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC18.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "WC19",
    "name": "Love Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC19.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC20",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC20.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "WC21",
    "name": "Engagement Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC21.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC22",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC22.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC23",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC23.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC24",
    "name": "Love Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC24.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC25",
    "name": "Love Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC25.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC26",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹850 / 1kg",
    "numericPrice": 850,
    "description": "Base price ₹850 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC26.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 850,
        "displayPrice": "₹850"
      }
    ]
  },
  {
    "id": "WC27",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC27.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC28",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC28.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC29",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,400 / 1.5kg",
    "numericPrice": 1400,
    "description": "Base price ₹1,400 for 1.5 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC29.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1.5 kg",
    "weights": [
      {
        "weight": "1.5 kg",
        "label": "1.5 kg",
        "price": 1400,
        "displayPrice": "₹1,400"
      }
    ]
  },
  {
    "id": "WC30",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC30.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC31",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC31.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "WC32",
    "name": "Anniversary Cake",
    "sourceCategory": "Wedding Cakes",
    "priceText": "₹1,000 / 1kg",
    "numericPrice": 1000,
    "description": "Base price ₹1,000 for 1 kg — final price varies with flavour selection and design details.",
    "image": "images/cakes/WC32.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "SO01",
    "name": "Baby Shower Theme Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "SO02",
    "name": "Baby Shower Step Cake (2-Tier)",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹1,800 / 2kg",
    "numericPrice": 1800,
    "description": "2-tier step designer cake. Base price ₹1,800 for 2 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "2 kg",
    "weights": [
      {
        "weight": "2 kg",
        "label": "2 kg",
        "price": 1800,
        "displayPrice": "₹1,800"
      }
    ]
  },
  {
    "id": "SO03",
    "name": "Half Birthday Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹1,000 / 1kg",
    "numericPrice": 1000,
    "description": "Base price ₹1,000 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "SO04",
    "name": "Half Birthday Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹1,000 / 1kg",
    "numericPrice": 1000,
    "description": "Base price ₹1,000 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "SO05",
    "name": "Bride To Be Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "SO06",
    "name": "Bride To Be Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO06.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "SO07",
    "name": "Graduation Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO07.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "SO08",
    "name": "Graduation Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹900 / 1kg",
    "numericPrice": 900,
    "description": "Base price ₹900 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO08.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 900,
        "displayPrice": "₹900"
      }
    ]
  },
  {
    "id": "SO09",
    "name": "Name Ceremony Cake",
    "sourceCategory": "Special Occasion Cakes",
    "priceText": "₹1,000 / 1kg",
    "numericPrice": 1000,
    "description": "Base price ₹1,000 for 1 kg — final price varies with weight, flavour and eggless selection.",
    "image": "images/cakes/SO09.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1000,
        "displayPrice": "₹1,000"
      }
    ]
  },
  {
    "id": "BC01",
    "name": "Chocolate Brownie",
    "sourceCategory": "Brownies/Cupcakes",
    "priceText": "₹700 / kg",
    "numericPrice": 700,
    "description": "1 kg ₹700 • ½ kg ₹350. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/BC01.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 350,
        "displayPrice": "₹350"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 700,
        "displayPrice": "₹700"
      }
    ]
  },
  {
    "id": "BC02",
    "name": "Brownie Chocolate Tower",
    "sourceCategory": "Brownies/Cupcakes",
    "priceText": "₹800 / kg",
    "numericPrice": 800,
    "description": "1 kg ₹800. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/BC02.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 800,
        "displayPrice": "₹800"
      }
    ]
  },
  {
    "id": "BC03",
    "name": "Nutella Brownie Tower",
    "sourceCategory": "Brownies/Cupcakes",
    "priceText": "₹1,200 / kg",
    "numericPrice": 1200,
    "description": "1 kg ₹1,200. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/BC03.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 1200,
        "displayPrice": "₹1,200"
      }
    ]
  },
  {
    "id": "BC04",
    "name": "Nuts Brownie",
    "sourceCategory": "Brownies/Cupcakes",
    "priceText": "₹800 / kg",
    "numericPrice": 800,
    "description": "1 kg ₹800 • ½ kg ₹400. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/BC04.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 400,
        "displayPrice": "₹400"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 800,
        "displayPrice": "₹800"
      }
    ]
  },
  {
    "id": "BC05",
    "name": "Plain Brownie",
    "sourceCategory": "Brownies/Cupcakes",
    "priceText": "₹600 / kg",
    "numericPrice": 600,
    "description": "1 kg ₹600 • ½ kg ₹300. Freshly baked on order with premium ingredients.",
    "image": "images/cakes/BC05.jpg",
    "fallbackImage": "images/logo.png",
    "available": true,
    "defaultWeight": "1 kg",
    "weights": [
      {
        "weight": "0.5 kg",
        "label": "½ kg",
        "price": 300,
        "displayPrice": "₹300"
      },
      {
        "weight": "1 kg",
        "label": "1 kg",
        "price": 600,
        "displayPrice": "₹600"
      }
    ]
  }
];
