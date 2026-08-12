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
  LucideIcon,
  Armchair,
  CookingPot,
  Lamp,
  Box,
  WashingMachine,
  Droplets,
  Scissors,
  FlaskConical,
  Headphones,
  Watch,
  Laptop,
  Tablet,
  Sprout,
  Shield,
  Utensils,
  CupSoda,
  Wine,
  Cake,
  CircleDot,
  Wrench,
  Volume2,
  Tv,
  Crown,
  Palette,
  Archive,
  SprayCan,
  Shapes,
  Sun,
  Grid
} from 'lucide-react';

export interface SubcategoryIconConfig {
  icon: LucideIcon;
  iconBgLight: string;
  iconBgDark: string;
}

export interface SubcategoryVisual {
  name: string;
  slug: string;
  description: string;
  icon?: LucideIcon;
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
      { name: 'Fresh Fruit Juices', slug: 'fruit-juices', description: 'Explore collection', icon: CupSoda },
      { name: 'Ayurvedic & Herbal Syrups', slug: 'herbal-syrups', description: 'Explore collection', icon: FlaskConical },
      { name: 'Concentrates & Sharbat', slug: 'concentrates', description: 'Explore collection', icon: Wine },
      { name: 'Organic Cold-Pressed', slug: 'cold-pressed', description: 'Explore collection', icon: Droplets },
    ]
  },

  home_kitchen: {
    key: 'home_kitchen',
    icon: Home,
    colorClass: 'text-sky-500',
    iconBgLight: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    iconBgDark: 'dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30',
    defaultSubcategories: [
      { name: 'Furniture', slug: 'furniture', description: 'Explore collection', icon: Armchair },
      { name: 'Kitchen Appliances', slug: 'kitchen-appliances', description: 'Explore collection', icon: Tv },
      { name: 'Home Decor', slug: 'home-decor', description: 'Explore collection', icon: Sparkles },
      { name: 'Lighting & Lamps', slug: 'lighting', description: 'Explore collection', icon: Lamp },
      { name: 'Cookware & Pots', slug: 'cookware', description: 'Explore collection', icon: CookingPot },
      { name: 'Storage & Containers', slug: 'storage-containers', description: 'Explore collection', icon: Box },
      { name: 'Dining & Serveware', slug: 'dining-serveware', description: 'Explore collection', icon: Utensils },
      { name: 'Cleaning Essentials', slug: 'cleaning-essentials', description: 'Explore collection', icon: WashingMachine },
    ]
  },

  religious_pooja: {
    key: 'religious_pooja',
    icon: Flame,
    colorClass: 'text-yellow-500',
    iconBgLight: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    iconBgDark: 'dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
    defaultSubcategories: [
      { name: 'Brass & Copper Idols', slug: 'brass-idols', description: 'Explore collection', icon: Crown },
      { name: 'Incense & Dhoop Sticks', slug: 'incense-sticks', description: 'Explore collection', icon: Flame },
      { name: 'Pooja Samagri Kits', slug: 'samagri-kits', description: 'Explore collection', icon: Sparkles },
      { name: 'Diyas & Temple Lamps', slug: 'diyas-lamps', description: 'Explore collection', icon: Sun },
    ]
  },

  agriculture_seeds: {
    key: 'agriculture_seeds',
    icon: Leaf,
    colorClass: 'text-emerald-500',
    iconBgLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    iconBgDark: 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    defaultSubcategories: [
      { name: 'Organic Seeds & Saplings', slug: 'organic-seeds', description: 'Explore collection', icon: Sprout },
      { name: 'Bio Fertilizers & Soil', slug: 'bio-fertilizers', description: 'Explore collection', icon: Leaf },
      { name: 'Garden Tools & Sprayers', slug: 'garden-tools', description: 'Explore collection', icon: Wrench },
      { name: 'Crop Protection & Care', slug: 'crop-protection', description: 'Explore collection', icon: Shield },
    ]
  },

  cosmetics_beauty: {
    key: 'cosmetics_beauty',
    icon: Sparkles,
    colorClass: 'text-rose-500',
    iconBgLight: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    iconBgDark: 'dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
    defaultSubcategories: [
      { name: 'Skincare', slug: 'skincare', description: 'Explore collection', icon: Droplets },
      { name: 'Hair Care', slug: 'haircare', description: 'Explore collection', icon: Scissors },
      { name: 'Makeup', slug: 'makeup', description: 'Explore collection', icon: Palette },
      { name: 'Personal Care', slug: 'personal-care', description: 'Explore collection', icon: Sparkles },
    ]
  },

  footwear: {
    key: 'footwear',
    icon: Footprints,
    colorClass: 'text-blue-500',
    iconBgLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    iconBgDark: 'dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    defaultSubcategories: [
      { name: "Men's Footwear", slug: 'mens-footwear', description: 'Explore collection', icon: Footprints },
      { name: "Women's Heels & Flats", slug: 'womens-footwear', description: 'Explore collection', icon: Footprints },
      { name: 'Sports Shoes', slug: 'sports-shoes', description: 'Explore collection', icon: Dumbbell },
      { name: 'Traditional Mojaris', slug: 'traditional-mojaris', description: 'Explore collection', icon: Footprints },
    ]
  },

  pickles_spices: {
    key: 'pickles_spices',
    icon: Package,
    colorClass: 'text-orange-500',
    iconBgLight: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    iconBgDark: 'dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    defaultSubcategories: [
      { name: 'Homemade Pickles', slug: 'mango-pickles', description: 'Explore collection', icon: Package },
      { name: 'Authentic Whole Spices', slug: 'whole-spices', description: 'Explore collection', icon: Flame },
      { name: 'Blended Masalas', slug: 'blended-masalas', description: 'Explore collection', icon: Package },
      { name: 'Papads & Kurdai', slug: 'papads-kurdai', description: 'Explore collection', icon: CircleDot },
    ]
  },

  fashion: {
    key: 'fashion',
    icon: Shirt,
    colorClass: 'text-purple-500',
    iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    defaultSubcategories: [
      { name: "Men's Clothing", slug: 'mens-fashion', description: 'Explore collection', icon: Shirt },
      { name: "Women's Sarees & Kurtis", slug: 'womens-fashion', description: 'Explore collection', icon: Shirt },
      { name: 'Kids Wear', slug: 'kids-fashion', description: 'Explore collection', icon: Baby },
      { name: 'Winterwear & Jackets', slug: 'winterwear', description: 'Explore collection', icon: Shirt },
    ]
  },

  jewellery: {
    key: 'jewellery',
    icon: Gem,
    colorClass: 'text-amber-600',
    iconBgLight: 'bg-amber-600/10 text-amber-700 border-amber-600/20',
    iconBgDark: 'dark:bg-amber-600/20 dark:text-amber-400 dark:border-amber-600/30',
    defaultSubcategories: [
      { name: 'Necklaces', slug: 'necklaces', description: 'Explore collection', icon: Gem },
      { name: 'Earrings & Rings', slug: 'silver-earrings', description: 'Explore collection', icon: Crown },
      { name: 'Fashion Accessories', slug: 'fashion-accessories', description: 'Explore collection', icon: Sparkles },
      { name: 'Bangles & Bracelets', slug: 'bangles-bracelets', description: 'Explore collection', icon: CircleDot },
    ]
  },

  electronics: {
    key: 'electronics',
    icon: Smartphone,
    colorClass: 'text-cyan-500',
    iconBgLight: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    iconBgDark: 'dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30',
    defaultSubcategories: [
      { name: 'Headphones & Earbuds', slug: 'audio-headphones', description: 'Explore collection', icon: Headphones },
      { name: 'Smartwatches', slug: 'smartwatches', description: 'Explore collection', icon: Watch },
      { name: 'Mobile Accessories', slug: 'mobile-accessories', description: 'Explore collection', icon: Smartphone },
      { name: 'Speakers & Audio', slug: 'home-audio', description: 'Explore collection', icon: Volume2 },
    ]
  },

  auto_accessories: {
    key: 'auto_accessories',
    icon: Car,
    colorClass: 'text-indigo-500',
    iconBgLight: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    iconBgDark: 'dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
    defaultSubcategories: [
      { name: 'Car Care & Polish', slug: 'car-care', description: 'Explore collection', icon: SprayCan },
      { name: 'Riding Helmets & Gear', slug: 'helmets-gear', description: 'Explore collection', icon: Shield },
      { name: 'Seat Covers & Mats', slug: 'seat-covers', description: 'Explore collection', icon: Car },
      { name: 'LED Lights & Gadgets', slug: 'auto-gadgets', description: 'Explore collection', icon: Lamp },
    ]
  },

  local_homemade: {
    key: 'local_homemade',
    icon: HeartHandshake,
    colorClass: 'text-teal-500',
    iconBgLight: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    iconBgDark: 'dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30',
    defaultSubcategories: [
      { name: 'Artisanal Handicrafts', slug: 'handicrafts', description: 'Explore collection', icon: Gift },
      { name: 'Homemade Sweets', slug: 'sweets-snacks', description: 'Explore collection', icon: Cake },
      { name: 'Handmade Soaps', slug: 'soaps-candles', description: 'Explore collection', icon: Sparkles },
      { name: 'Pure Desi Ghee', slug: 'homemade-ghee', description: 'Explore collection', icon: Droplets },
    ]
  },

  astro_stone: {
    key: 'astro_stone',
    icon: Gem,
    colorClass: 'text-purple-500',
    iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    defaultSubcategories: [
      { name: 'Opal', slug: 'opal', description: 'Explore collection', icon: Gem },
      { name: 'Clear Quartz / Sphatik', slug: 'clear-quartz-sphatik', description: 'Explore collection', icon: Sparkles },
      { name: 'Ruby / Manik', slug: 'ruby-manik', description: 'Explore collection', icon: Gem },
      { name: 'Pyrite', slug: 'pyrite', description: 'Explore collection', icon: Sparkles },
      { name: 'Blue Sapphire / Neelam', slug: 'blue-sapphire-neelam', description: 'Explore collection', icon: Gem },
      { name: 'Turquoise / Firoza', slug: 'turquoise-firoza', description: 'Explore collection', icon: Gem },
      { name: 'Diamond / Hira', slug: 'diamond-hira', description: 'Explore collection', icon: Crown },
      { name: 'Emerald / Panna', slug: 'emerald-panna', description: 'Explore collection', icon: Gem },
      { name: 'Hessonite / Gomed', slug: 'hessonite-gomed', description: 'Explore collection', icon: Gem },
      { name: 'Yellow Sapphire / Pushkaraj', slug: 'yellow-sapphire-pushkaraj', description: 'Explore collection', icon: Gem },
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
    { name: 'Popular Collections', slug: 'popular', description: 'Explore collection', icon: ShoppingBag },
    { name: 'New Product Arrivals', slug: 'new', description: 'Explore collection', icon: Sparkles },
    { name: 'Featured Catalog Items', slug: 'featured', description: 'Explore collection', icon: Package },
    { name: 'Best Values & Deals', slug: 'deals', description: 'Explore collection', icon: Gift },
  ]
};

export function getCategoryVisualConfig(category: any): CategoryVisualConfig {
  if (!category) return DEFAULT_FALLBACK_CONFIG;

  const rawSlug = String(category.slug || category.id || '').toLowerCase().trim();
  const rawName = typeof category.name === 'string'
    ? category.name.toLowerCase()
    : (category.name?.en || category.name?.hi || category.name?.mr || '').toLowerCase();

  const combined = `${rawSlug} ${rawName}`;

  if (combined.includes('astro') || combined.includes('stone') || combined.includes('gem') || combined.includes('crystal')) return CATEGORY_VISUALS_MAP.astro_stone;
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
 * EXACT SUBCATEGORY VECTOR ICON ENGINE
 * Maps subcategory name or slug to exact Lucide vector icon + soft tint background.
 */
export function getSubcategoryIconConfig(subcatNameOrSlug: string, parentCatObj?: any): SubcategoryIconConfig {
  const str = String(subcatNameOrSlug || '').toLowerCase().trim();

  // 1. Furniture
  if (str.includes('furniture') || str.includes('sofa') || str.includes('chair') || str.includes('table') || str.includes('bed')) {
    return {
      icon: Armchair,
      iconBgLight: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
      iconBgDark: 'dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30'
    };
  }
  // 2. Kitchen Appliances
  if (str.includes('appliance') || str.includes('blender') || str.includes('microwave') || str.includes('air fryer') || str.includes('mixer')) {
    return {
      icon: Tv,
      iconBgLight: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      iconBgDark: 'dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30'
    };
  }
  // 3. Lighting & Lamps
  if (str.includes('light') || str.includes('lamp') || str.includes('pendant') || str.includes('bulb')) {
    return {
      icon: Lamp,
      iconBgLight: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      iconBgDark: 'dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
    };
  }
  // 4. Cookware & Pots
  if (str.includes('cookware') || str.includes('pan') || str.includes('pot') || str.includes('bakeware')) {
    return {
      icon: CookingPot,
      iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30'
    };
  }
  // 5. Storage & Containers
  if (str.includes('storage') || str.includes('container') || str.includes('organizer') || str.includes('box')) {
    return {
      icon: Box,
      iconBgLight: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      iconBgDark: 'dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
    };
  }
  // 6. Dining & Serveware
  if (str.includes('dining') || str.includes('serveware') || str.includes('plate') || str.includes('bowl')) {
    return {
      icon: Utensils,
      iconBgLight: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
      iconBgDark: 'dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30'
    };
  }
  // 7. Cleaning Essentials
  if (str.includes('clean') || str.includes('mop') || str.includes('bucket') || str.includes('essential')) {
    return {
      icon: WashingMachine,
      iconBgLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      iconBgDark: 'dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30'
    };
  }
  // 8. Skincare & Serums
  if (str.includes('skincare') || str.includes('serum') || str.includes('cream') || str.includes('lotion')) {
    return {
      icon: Droplets,
      iconBgLight: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      iconBgDark: 'dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
    };
  }
  // 9. Makeup & Cosmetics
  if (str.includes('makeup') || str.includes('lipstick') || str.includes('cosmetic')) {
    return {
      icon: Palette,
      iconBgLight: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      iconBgDark: 'dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30'
    };
  }
  // 10. Hair Care
  if (str.includes('hair') || str.includes('shampoo') || str.includes('conditioner')) {
    return {
      icon: Scissors,
      iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30'
    };
  }
  // 11. Footwear
  if (str.includes('footwear') || str.includes('shoe') || str.includes('sandal') || str.includes('heel') || str.includes('mojari')) {
    return {
      icon: Footprints,
      iconBgLight: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      iconBgDark: 'dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30'
    };
  }
  // 12. Jewellery
  if (str.includes('jewel') || str.includes('necklace') || str.includes('ring') || str.includes('earring') || str.includes('bangle') || str.includes('gold') || str.includes('silver')) {
    return {
      icon: Gem,
      iconBgLight: 'bg-amber-600/10 text-amber-700 border-amber-600/20',
      iconBgDark: 'dark:bg-amber-600/20 dark:text-amber-400 dark:border-amber-600/30'
    };
  }
  // 13. Mobile Phones & Gadgets
  if (str.includes('phone') || str.includes('mobile') || str.includes('accessory')) {
    return {
      icon: Smartphone,
      iconBgLight: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      iconBgDark: 'dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30'
    };
  }
  // 14. Headphones & Audio
  if (str.includes('headphone') || str.includes('earbud') || str.includes('audio') || str.includes('speaker')) {
    return {
      icon: Headphones,
      iconBgLight: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
      iconBgDark: 'dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/30'
    };
  }
  // 15. Smartwatches
  if (str.includes('watch') || str.includes('band')) {
    return {
      icon: Watch,
      iconBgLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      iconBgDark: 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
    };
  }
  // 16. Agriculture & Seeds
  if (str.includes('seed') || str.includes('sapling') || str.includes('sprout')) {
    return {
      icon: Sprout,
      iconBgLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      iconBgDark: 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
    };
  }
  if (str.includes('fertilizer') || str.includes('soil') || str.includes('crop') || str.includes('garden')) {
    return {
      icon: Leaf,
      iconBgLight: 'bg-green-500/10 text-green-600 border-green-500/20',
      iconBgDark: 'dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30'
    };
  }
  // 17. Fashion & Clothing
  if (str.includes('fashion') || str.includes('cloth') || str.includes('shirt') || str.includes('saree') || str.includes('kurti') || str.includes('dress') || str.includes('wear')) {
    return {
      icon: Shirt,
      iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30'
    };
  }
  // 18. Kids Wear / Baby
  if (str.includes('baby') || str.includes('kid')) {
    return {
      icon: Baby,
      iconBgLight: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      iconBgDark: 'dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30'
    };
  }
  // 19. Pickles & Spices
  if (str.includes('pickle') || str.includes('masala') || str.includes('spice')) {
    return {
      icon: Package,
      iconBgLight: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      iconBgDark: 'dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30'
    };
  }
  // 20. Juices & Syrups
  if (str.includes('juice') || str.includes('syrup') || str.includes('sharbat')) {
    return {
      icon: CupSoda,
      iconBgLight: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      iconBgDark: 'dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
    };
  }
  // 21. Religious & Pooja Items
  if (str.includes('pooja') || str.includes('idol') || str.includes('incense') || str.includes('dhoop') || str.includes('diya') || str.includes('temple')) {
    return {
      icon: Flame,
      iconBgLight: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      iconBgDark: 'dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
    };
  }
  // 22. Auto Accessories
  if (str.includes('auto') || str.includes('car') || str.includes('helmet') || str.includes('gear')) {
    return {
      icon: Car,
      iconBgLight: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      iconBgDark: 'dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30'
    };
  }
  // 23. Handicrafts & Gifts
  if (str.includes('gift') || str.includes('handicraft') || str.includes('sweet')) {
    return {
      icon: Gift,
      iconBgLight: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      iconBgDark: 'dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
    };
  }

  // Fallback to parent config icon or neutral package icon
  if (parentCatObj) {
    const parentConfig = getCategoryVisualConfig(parentCatObj);
    return {
      icon: parentConfig.icon,
      iconBgLight: parentConfig.iconBgLight,
      iconBgDark: parentConfig.iconBgDark
    };
  }

  return {
    icon: Package,
    iconBgLight: 'bg-primary/10 text-primary border-primary/20',
    iconBgDark: 'dark:bg-primary/20 dark:text-primary dark:border-primary/30'
  };
}
