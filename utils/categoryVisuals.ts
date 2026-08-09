import {
  Leaf,
  Home,
  Sparkles,
  Shirt,
  Footprints,
  Flame,
  UtensilsCrossed,
  Package,
  Gem,
  Smartphone,
  Car,
  HeartHandshake,
  Dumbbell,
  BookOpen,
  Baby,
  Gift,
  ShoppingBag,
  LucideIcon
} from 'lucide-react';

export interface SubcategoryVisual {
  name: string;
  slug: string;
  image: string;
  description: string;
  visualPrompt?: string;
}

export interface CategoryVisualConfig {
  key: string;
  icon: LucideIcon;
  colorClass: string;
  iconBgLight: string;
  iconBgDark: string;
  defaultSubcategories: SubcategoryVisual[];
}

export const CATEGORY_VISUALS_MAP: Record<string, CategoryVisualConfig> = {
  juices_syrups: {
    key: 'juices_syrups',
    icon: UtensilsCrossed,
    colorClass: 'text-amber-500',
    iconBgLight: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    iconBgDark: 'dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
    defaultSubcategories: [
      {
        name: 'Fresh Fruit Juices',
        slug: 'fruit-juices',
        image: '/categories/juices.webp',
        description: 'Explore collection',
        visualPrompt: 'Fresh organic fruit juices in glass bottles with fresh oranges, mangoes and pomegranates on clean surface'
      },
      {
        name: 'Ayurvedic & Herbal Syrups',
        slug: 'herbal-syrups',
        image: '/categories/health.webp',
        description: 'Explore collection',
        visualPrompt: 'Ayurvedic herbal health syrups in amber glass bottles with natural herbs and ingredients'
      },
      {
        name: 'Concentrates & Sharbat',
        slug: 'concentrates',
        image: '/categories/homemade.webp',
        description: 'Explore collection',
        visualPrompt: 'Traditional fruit concentrates and sharbat bottles, artisanal e-commerce product photography'
      },
      {
        name: 'Organic Cold-Pressed',
        slug: 'cold-pressed',
        image: '/categories/groceries.webp',
        description: 'Explore collection',
        visualPrompt: 'Cold-pressed organic wellness juices in clear bottles with green vegetables and fruits'
      },
    ]
  },

  home_kitchen: {
    key: 'home_kitchen',
    icon: Home,
    colorClass: 'text-sky-500',
    iconBgLight: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    iconBgDark: 'dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30',
    defaultSubcategories: [
      {
        name: 'Furniture',
        slug: 'furniture',
        image: '/categories/furniture.webp',
        description: 'Explore collection',
        visualPrompt: 'Premium modern furniture collection featuring a stylish sofa, accent chair, coffee table and minimal side table'
      },
      {
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        image: '/categories/kitchen.webp',
        description: 'Explore collection',
        visualPrompt: 'Modern kitchen appliances including blender, air fryer, microwave oven and mixer'
      },
      {
        name: 'Home Decor',
        slug: 'home-decor',
        image: '/categories/diwali.webp',
        description: 'Explore collection',
        visualPrompt: 'Elegant home decor collection featuring ceramic vases, indoor plants, decorative objects and framed wall art'
      },
      {
        name: 'Lighting & Lamps',
        slug: 'lighting',
        image: '/categories/lighting.jpg',
        description: 'Explore collection',
        visualPrompt: 'Modern lighting collection featuring pendant lights, floor lamp and stylish table lamp in an elegant interior'
      },
      {
        name: 'Cookware',
        slug: 'cookware',
        image: '/categories/cookware.jpg',
        description: 'Explore collection',
        visualPrompt: 'Premium cookware collection featuring frying pans, sauce pans, cooking pots and kitchen utensils'
      },
      {
        name: 'Storage & Containers',
        slug: 'storage-containers',
        image: '/categories/storage.jpg',
        description: 'Explore collection',
        visualPrompt: 'Modern household storage collection featuring transparent food storage containers and kitchen organizers'
      },
      {
        name: 'Dining & Serveware',
        slug: 'dining-serveware',
        image: '/categories/kitchen.webp',
        description: 'Explore collection',
        visualPrompt: 'Elegant ceramic plates, bowls and serving dishes arranged neatly on a dining setup'
      },
      {
        name: 'Cleaning Essentials',
        slug: 'cleaning-essentials',
        image: '/categories/cleaning.jpg',
        description: 'Explore collection',
        visualPrompt: 'Household cleaning essentials including mop, bucket, cleaning brushes, spray bottles and tools'
      },
    ]
  },

  religious_pooja: {
    key: 'religious_pooja',
    icon: Flame,
    colorClass: 'text-yellow-500',
    iconBgLight: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    iconBgDark: 'dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
    defaultSubcategories: [
      {
        name: 'Brass & Copper Idols',
        slug: 'brass-idols',
        image: '/categories/pooja.webp',
        description: 'Explore collection',
        visualPrompt: 'Traditional brass and copper religious idols and temple items'
      },
      {
        name: 'Incense & Dhoop Sticks',
        slug: 'incense-sticks',
        image: '/categories/pooja.webp',
        description: 'Explore collection',
        visualPrompt: 'Aromatic incense sticks, dhoop cones and aromatic holders'
      },
      {
        name: 'Pooja Samagri Kits',
        slug: 'samagri-kits',
        image: '/categories/diwali.webp',
        description: 'Explore collection',
        visualPrompt: 'Complete devotional pooja samagri kits with brass thali and accessories'
      },
      {
        name: 'Diyas & Temple Lamps',
        slug: 'diyas-lamps',
        image: '/categories/pooja.webp',
        description: 'Explore collection',
        visualPrompt: 'Brass oil diyas, hanging temple lamps and festive lights'
      },
    ]
  },

  agriculture_seeds: {
    key: 'agriculture_seeds',
    icon: Leaf,
    colorClass: 'text-emerald-500',
    iconBgLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    iconBgDark: 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    defaultSubcategories: [
      {
        name: 'Organic Seeds & Saplings',
        slug: 'organic-seeds',
        image: '/categories/agriculture-seeds.webp',
        description: 'Explore collection',
        visualPrompt: 'Packaged organic vegetable and crop seeds with young green saplings'
      },
      {
        name: 'Bio Fertilizers & Soil',
        slug: 'bio-fertilizers',
        image: '/categories/agriculture-seeds.webp',
        description: 'Explore collection',
        visualPrompt: 'Bio fertilizers, organic soil nutrients and plant compost'
      },
      {
        name: 'Garden Tools & Sprayers',
        slug: 'garden-tools',
        image: '/categories/agriculture-seeds.webp',
        description: 'Explore collection',
        visualPrompt: 'Agricultural garden tools, pruning shears and pressure sprayers'
      },
      {
        name: 'Crop Protection & Care',
        slug: 'crop-protection',
        image: '/categories/agriculture-seeds.webp',
        description: 'Explore collection',
        visualPrompt: 'Agricultural crop protection and plant health products'
      },
    ]
  },

  cosmetics_beauty: {
    key: 'cosmetics_beauty',
    icon: Sparkles,
    colorClass: 'text-rose-500',
    iconBgLight: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    iconBgDark: 'dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
    defaultSubcategories: [
      {
        name: 'Skincare',
        slug: 'skincare',
        image: '/categories/skincare.jpg',
        description: 'Explore collection',
        visualPrompt: 'Premium skincare product collection featuring glass dropper bottles with serums, moisturizing creams and face lotions'
      },
      {
        name: 'Hair Care',
        slug: 'haircare',
        image: '/categories/beauty.webp',
        description: 'Explore collection',
        visualPrompt: 'Herbal hair care shampoos, conditioners and nourishing hair oils'
      },
      {
        name: 'Makeup',
        slug: 'makeup',
        image: '/categories/cosmetics.webp',
        description: 'Explore collection',
        visualPrompt: 'Cosmetics makeup palette, lipsticks, foundations and brushes'
      },
      {
        name: 'Personal Care',
        slug: 'personal-care',
        image: '/categories/health.webp',
        description: 'Explore collection',
        visualPrompt: 'Personal care grooming items and hygiene essentials'
      },
    ]
  },

  footwear: {
    key: 'footwear',
    icon: Footprints,
    colorClass: 'text-blue-500',
    iconBgLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    iconBgDark: 'dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    defaultSubcategories: [
      {
        name: "Men's Footwear",
        slug: 'mens-footwear',
        image: '/categories/footwear.webp',
        description: 'Explore collection',
        visualPrompt: "Men's leather formal shoes and stylish casual sneakers"
      },
      {
        name: "Women's Heels & Flats",
        slug: 'womens-footwear',
        image: '/categories/footwear.webp',
        description: 'Explore collection',
        visualPrompt: "Women's fashion heels, ethnic sandals and comfortable flats"
      },
      {
        name: 'Sports Shoes',
        slug: 'sports-shoes',
        image: '/categories/sports.webp',
        description: 'Explore collection',
        visualPrompt: 'Athletic running shoes and sports sneakers'
      },
      {
        name: 'Traditional Mojaris',
        slug: 'traditional-mojaris',
        image: '/categories/footwear.webp',
        description: 'Explore collection',
        visualPrompt: 'Handcrafted traditional Indian mojaris and ethnic footwear'
      },
    ]
  },

  pickles_spices: {
    key: 'pickles_spices',
    icon: Package,
    colorClass: 'text-orange-500',
    iconBgLight: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    iconBgDark: 'dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    defaultSubcategories: [
      {
        name: 'Homemade Pickles',
        slug: 'mango-pickles',
        image: '/categories/pickles.webp',
        description: 'Explore collection',
        visualPrompt: 'Traditional glass jars of homemade Indian mango, chili and lemon pickles'
      },
      {
        name: 'Whole Spices',
        slug: 'whole-spices',
        image: '/categories/spices.webp',
        description: 'Explore collection',
        visualPrompt: 'Authentic Indian whole spices including cardamom, cinnamon, star anise and cloves'
      },
      {
        name: 'Blended Masalas',
        slug: 'blended-masalas',
        image: '/categories/spices.webp',
        description: 'Explore collection',
        visualPrompt: 'Aromatic ground masala powders in bowls and glass containers'
      },
      {
        name: 'Papads & Kurdai',
        slug: 'papads-kurdai',
        image: '/categories/papad.webp',
        description: 'Explore collection',
        visualPrompt: 'Crispy sun-dried papads, kurdai and traditional accompaniments'
      },
    ]
  },

  fashion: {
    key: 'fashion',
    icon: Shirt,
    colorClass: 'text-purple-500',
    iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    defaultSubcategories: [
      {
        name: "Men's Clothing",
        slug: 'mens-fashion',
        image: '/categories/fashion.webp',
        description: 'Explore collection',
        visualPrompt: "Men's formal cotton shirts, trousers and casual t-shirts"
      },
      {
        name: "Women's Sarees & Kurtis",
        slug: 'womens-fashion',
        image: '/categories/fashion.webp',
        description: 'Explore collection',
        visualPrompt: 'Elegant silk sarees and designer ethnic kurtis'
      },
      {
        name: 'Kids Wear',
        slug: 'kids-fashion',
        image: '/categories/baby.webp',
        description: 'Explore collection',
        visualPrompt: "Children's colorful apparel and comfortable kids wear"
      },
      {
        name: 'Winterwear & Jackets',
        slug: 'winterwear',
        image: '/categories/fashion.webp',
        description: 'Explore collection',
        visualPrompt: 'Stylish winter jackets, coats and cozy sweaters'
      },
    ]
  },

  jewellery: {
    key: 'jewellery',
    icon: Gem,
    colorClass: 'text-amber-600',
    iconBgLight: 'bg-amber-600/10 text-amber-700 border-amber-600/20',
    iconBgDark: 'dark:bg-amber-600/20 dark:text-amber-400 dark:border-amber-600/30',
    defaultSubcategories: [
      {
        name: 'Necklaces',
        slug: 'necklaces',
        image: '/categories/jewellery.webp',
        description: 'Explore collection',
        visualPrompt: 'Gold plated traditional Indian necklace and pendant set'
      },
      {
        name: 'Earrings & Rings',
        slug: 'silver-earrings',
        image: '/categories/jewellery.webp',
        description: 'Explore collection',
        visualPrompt: 'Sterling silver jhumka earrings and gemstone rings'
      },
      {
        name: 'Fashion Accessories',
        slug: 'fashion-accessories',
        image: '/categories/jewellery.webp',
        description: 'Explore collection',
        visualPrompt: 'Trendy costume jewellery and designer accessories'
      },
      {
        name: 'Bangles & Bracelets',
        slug: 'bangles-bracelets',
        image: '/categories/jewellery.webp',
        description: 'Explore collection',
        visualPrompt: 'Traditional bangles and elegant wrist bracelets'
      },
    ]
  },

  electronics: {
    key: 'electronics',
    icon: Smartphone,
    colorClass: 'text-cyan-500',
    iconBgLight: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    iconBgDark: 'dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30',
    defaultSubcategories: [
      {
        name: 'Headphones & Earbuds',
        slug: 'audio-headphones',
        image: '/categories/electronics.webp',
        description: 'Explore collection',
        visualPrompt: 'Wireless noise-canceling headphones and bluetooth earbuds'
      },
      {
        name: 'Smartwatches',
        slug: 'smartwatches',
        image: '/categories/electronics.webp',
        description: 'Explore collection',
        visualPrompt: 'Modern smartwatch with fitness tracking display'
      },
      {
        name: 'Mobile Accessories',
        slug: 'mobile-accessories',
        image: '/categories/electronics.webp',
        description: 'Explore collection',
        visualPrompt: 'Smartphones, fast chargers and protective mobile cases'
      },
      {
        name: 'Speakers & Audio',
        slug: 'home-audio',
        image: '/categories/electronics.webp',
        description: 'Explore collection',
        visualPrompt: 'Portable bluetooth speakers and home audio soundbars'
      },
    ]
  },

  auto_accessories: {
    key: 'auto_accessories',
    icon: Car,
    colorClass: 'text-indigo-500',
    iconBgLight: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    iconBgDark: 'dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
    defaultSubcategories: [
      {
        name: 'Car Care & Polish',
        slug: 'car-care',
        image: '/categories/auto.webp',
        description: 'Explore collection',
        visualPrompt: 'Car wash shampoo, microfiber cloths and detailing wax'
      },
      {
        name: 'Helmets & Riding Gear',
        slug: 'helmets-gear',
        image: '/categories/auto.webp',
        description: 'Explore collection',
        visualPrompt: 'Full-face motorcycle helmet and protective riding gloves'
      },
      {
        name: 'Seat Covers & Mats',
        slug: 'seat-covers',
        image: '/categories/auto.webp',
        description: 'Explore collection',
        visualPrompt: 'Leatherette car seat covers and 7D floor mats'
      },
      {
        name: 'LED Lights & Gadgets',
        slug: 'auto-gadgets',
        image: '/categories/auto.webp',
        description: 'Explore collection',
        visualPrompt: 'Car LED headlights and dashboard accessories'
      },
    ]
  },

  local_homemade: {
    key: 'local_homemade',
    icon: HeartHandshake,
    colorClass: 'text-teal-500',
    iconBgLight: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    iconBgDark: 'dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30',
    defaultSubcategories: [
      {
        name: 'Artisanal Handicrafts',
        slug: 'handicrafts',
        image: '/categories/gifts.webp',
        description: 'Explore collection',
        visualPrompt: 'Handcrafted wooden art, pottery and traditional Indian gifts'
      },
      {
        name: 'Homemade Sweets',
        slug: 'sweets-snacks',
        image: '/categories/diwali.webp',
        description: 'Explore collection',
        visualPrompt: 'Authentic Indian festive sweets and homemade faral'
      },
      {
        name: 'Handmade Soaps',
        slug: 'soaps-candles',
        image: '/categories/cosmetics.webp',
        description: 'Explore collection',
        visualPrompt: 'Natural organic soaps and scented essential oil candles'
      },
      {
        name: 'Pure Desi Ghee',
        slug: 'homemade-ghee',
        image: '/categories/oil.webp',
        description: 'Explore collection',
        visualPrompt: 'Traditional glass jar of pure A2 cow desi ghee'
      },
    ]
  }
};

const DEFAULT_FALLBACK_CONFIG: CategoryVisualConfig = {
  key: 'default',
  icon: ShoppingBag,
  colorClass: 'text-primary',
  iconBgLight: 'bg-primary/10 text-primary border-primary/20',
  iconBgDark: 'dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  defaultSubcategories: [
    { name: 'Popular Collections', slug: 'popular', image: '/categories/groceries.webp', description: 'Explore collection' },
    { name: 'New Product Arrivals', slug: 'new', image: '/categories/electronics.webp', description: 'Explore collection' },
    { name: 'Featured Catalog Items', slug: 'featured', image: '/categories/fashion.webp', description: 'Explore collection' },
    { name: 'Best Values & Deals', slug: 'deals', image: '/categories/kitchen.webp', description: 'Explore collection' },
  ]
};

/**
 * Utility to match an API Category to its visual configuration (Icon, Color, Image presets)
 */
export function getCategoryVisualConfig(category: any): CategoryVisualConfig {
  if (!category) return DEFAULT_FALLBACK_CONFIG;

  const rawSlug = String(category.slug || category.id || '').toLowerCase().trim();
  const rawName = typeof category.name === 'string'
    ? category.name.toLowerCase()
    : (category.name?.en || category.name?.hi || category.name?.mr || '').toLowerCase();

  const combined = `${rawSlug} ${rawName}`;

  if (combined.includes('juice') || combined.includes('syrup')) return CATEGORY_VISUALS_MAP.juices_syrups;
  if (combined.includes('kitchen') || combined.includes('home') || combined.includes('furniture')) return CATEGORY_VISUALS_MAP.home_kitchen;
  if (combined.includes('pooja') || combined.includes('religious') || combined.includes('spiritual')) return CATEGORY_VISUALS_MAP.religious_pooja;
  if (combined.includes('agriculture') || combined.includes('seed')) return CATEGORY_VISUALS_MAP.agriculture_seeds;
  if (combined.includes('cosmetic') || combined.includes('beauty') || combined.includes('personal care')) return CATEGORY_VISUALS_MAP.cosmetics_beauty;
  if (combined.includes('footwear') || combined.includes('shoe')) return CATEGORY_VISUALS_MAP.footwear;
  if (combined.includes('pickle') || combined.includes('masale') || combined.includes('spice')) return CATEGORY_VISUALS_MAP.pickles_spices;
  if (combined.includes('fashion') || combined.includes('cloth')) return CATEGORY_VISUALS_MAP.fashion;
  if (combined.includes('jewel')) return CATEGORY_VISUALS_MAP.jewellery;
  if (combined.includes('electronic') || combined.includes('mobile')) return CATEGORY_VISUALS_MAP.electronics;
  if (combined.includes('auto') || combined.includes('car') || combined.includes('vehicle')) return CATEGORY_VISUALS_MAP.auto_accessories;
  if (combined.includes('homemade') || combined.includes('gift') || combined.includes('handicraft')) return CATEGORY_VISUALS_MAP.local_homemade;

  return DEFAULT_FALLBACK_CONFIG;
}

/**
 * EXACT SUBCATEGORY VISUAL MATCHING ENGINE
 * Maps subcategory name or slug to exact relevant asset.
 */
export function getSubcategoryImage(subcatNameOrSlug: string, parentCatObj?: any): string {
  const str = String(subcatNameOrSlug || '').toLowerCase().trim();

  if (str.includes('cookware') || str.includes('pan') || str.includes('pot') || str.includes('bakeware')) {
    return '/categories/cookware.jpg';
  }
  if (str.includes('light') || str.includes('lamp') || str.includes('pendant')) {
    return '/categories/lighting.jpg';
  }
  if (str.includes('storage') || str.includes('container') || str.includes('organizer')) {
    return '/categories/storage.jpg';
  }
  if (str.includes('clean') || str.includes('mop') || str.includes('bucket')) {
    return '/categories/cleaning.jpg';
  }
  if (str.includes('skincare') || str.includes('serum') || str.includes('cream') || str.includes('lotion')) {
    return '/categories/skincare.jpg';
  }
  if (str.includes('furniture') || str.includes('sofa') || str.includes('chair') || str.includes('table') || str.includes('bed')) {
    return '/categories/furniture.webp';
  }
  if (str.includes('appliance') || str.includes('blender') || str.includes('microwave') || str.includes('air fryer') || str.includes('mixer')) {
    return '/categories/kitchen.webp';
  }
  if (str.includes('decor') || str.includes('vase') || str.includes('wall art')) {
    return '/categories/diwali.webp';
  }
  if (str.includes('dining') || str.includes('serveware') || str.includes('plate') || str.includes('bowl')) {
    return '/categories/kitchen.webp';
  }
  if (str.includes('makeup') || str.includes('lipstick') || str.includes('foundation')) {
    return '/categories/cosmetics.webp';
  }
  if (str.includes('hair') || str.includes('shampoo') || str.includes('conditioner')) {
    return '/categories/beauty.webp';
  }
  if (str.includes('personal') || str.includes('hygiene') || str.includes('health')) {
    return '/categories/health.webp';
  }
  if (str.includes('footwear') || str.includes('shoe') || str.includes('sandal') || str.includes('heel') || str.includes('mojari')) {
    return '/categories/footwear.webp';
  }
  if (str.includes('jewel') || str.includes('necklace') || str.includes('ring') || str.includes('earring') || str.includes('bangle') || str.includes('silver')) {
    return '/categories/jewellery.webp';
  }
  if (str.includes('seed') || str.includes('sapling') || str.includes('fertilizer') || str.includes('soil') || str.includes('crop') || str.includes('garden')) {
    return '/categories/agriculture-seeds.webp';
  }
  if (str.includes('headphone') || str.includes('earbud') || str.includes('smartwatch') || str.includes('audio') || str.includes('speaker') || str.includes('mobile') || str.includes('electronic')) {
    return '/categories/electronics.webp';
  }
  if (str.includes('fashion') || str.includes('cloth') || str.includes('saree') || str.includes('kurti') || str.includes('shirt') || str.includes('jacket') || str.includes('winterwear')) {
    return '/categories/fashion.webp';
  }
  if (str.includes('pickle') || str.includes('chutney')) {
    return '/categories/pickles.webp';
  }
  if (str.includes('spice') || str.includes('masala')) {
    return '/categories/spices.webp';
  }
  if (str.includes('papad') || str.includes('kurdai')) {
    return '/categories/papad.webp';
  }
  if (str.includes('juice') || str.includes('sharbat') || str.includes('beverage')) {
    return '/categories/juices.webp';
  }
  if (str.includes('syrup') || str.includes('ayurved')) {
    return '/categories/health.webp';
  }
  if (str.includes('pooja') || str.includes('idol') || str.includes('incense') || str.includes('dhoop') || str.includes('diya') || str.includes('samagri') || str.includes('temple')) {
    return '/categories/pooja.webp';
  }
  if (str.includes('auto') || str.includes('car') || str.includes('helmet') || str.includes('riding') || str.includes('seat')) {
    return '/categories/auto.webp';
  }
  if (str.includes('handicraft') || str.includes('gift') || str.includes('artisan')) {
    return '/categories/gifts.webp';
  }
  if (str.includes('baby') || str.includes('kid')) {
    return '/categories/baby.webp';
  }
  if (str.includes('book') || str.includes('stationery')) {
    return '/categories/books.webp';
  }
  if (str.includes('sport') || str.includes('fitness')) {
    return '/categories/sports.webp';
  }
  if (str.includes('pet') || str.includes('dog') || str.includes('cat')) {
    return '/categories/pet.webp';
  }
  if (str.includes('sweet') || str.includes('snack') || str.includes('diwali')) {
    return '/categories/diwali.webp';
  }

  // Parent fallback
  if (parentCatObj) {
    const parentConfig = getCategoryVisualConfig(parentCatObj);
    if (parentConfig.defaultSubcategories[0]?.image) {
      return parentConfig.defaultSubcategories[0].image;
    }
  }

  return '/categories/groceries.webp';
}
