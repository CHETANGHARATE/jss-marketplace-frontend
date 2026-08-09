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
  CircleDot,
  ShoppingBag,
  LucideIcon
} from 'lucide-react';

export interface SubcategoryVisual {
  name: string;
  slug: string;
  image: string;
  description: string;
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
      { name: 'Fresh Fruit Juices', slug: 'fruit-juices', image: '/categories/juices.webp', description: 'Explore collection' },
      { name: 'Ayurvedic & Herbal Syrups', slug: 'herbal-syrups', image: '/categories/health.webp', description: 'Explore collection' },
      { name: 'Concentrates & Sharbat', slug: 'concentrates', image: '/categories/homemade.webp', description: 'Explore collection' },
      { name: 'Organic Cold-Pressed', slug: 'cold-pressed', image: '/categories/groceries.webp', description: 'Explore collection' },
    ]
  },

  home_kitchen: {
    key: 'home_kitchen',
    icon: Home,
    colorClass: 'text-sky-500',
    iconBgLight: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    iconBgDark: 'dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30',
    defaultSubcategories: [
      { name: 'Furniture & Living', slug: 'furniture', image: '/categories/furniture.webp', description: 'Explore collection' },
      { name: 'Kitchen Appliances', slug: 'kitchen-appliances', image: '/categories/kitchen.webp', description: 'Explore collection' },
      { name: 'Home Decor & Vases', slug: 'home-decor', image: '/categories/diwali.webp', description: 'Explore collection' },
      { name: 'Lighting & Lamps', slug: 'lighting', image: '/categories/kitchen.webp', description: 'Explore collection' },
      { name: 'Cookware & Pots', slug: 'cookware', image: '/categories/kitchen.webp', description: 'Explore collection' },
      { name: 'Storage & Containers', slug: 'storage-containers', image: '/categories/homemade.webp', description: 'Explore collection' },
      { name: 'Dining & Serveware', slug: 'dining-serveware', image: '/categories/kitchen.webp', description: 'Explore collection' },
      { name: 'Cleaning Essentials', slug: 'cleaning-essentials', image: '/categories/groceries.webp', description: 'Explore collection' },
    ]
  },

  religious_pooja: {
    key: 'religious_pooja',
    icon: Flame,
    colorClass: 'text-yellow-500',
    iconBgLight: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    iconBgDark: 'dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
    defaultSubcategories: [
      { name: 'Brass & Copper Idols', slug: 'brass-idols', image: '/categories/pooja.webp', description: 'Explore collection' },
      { name: 'Incense & Dhoop Sticks', slug: 'incense-sticks', image: '/categories/pooja.webp', description: 'Explore collection' },
      { name: 'Pooja Samagri Kits', slug: 'samagri-kits', image: '/categories/diwali.webp', description: 'Explore collection' },
      { name: 'Diyas & Temple Lamps', slug: 'diyas-lamps', image: '/categories/pooja.webp', description: 'Explore collection' },
    ]
  },

  agriculture_seeds: {
    key: 'agriculture_seeds',
    icon: Leaf,
    colorClass: 'text-emerald-500',
    iconBgLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    iconBgDark: 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    defaultSubcategories: [
      { name: 'Organic Seeds & Saplings', slug: 'organic-seeds', image: '/categories/agriculture-seeds.webp', description: 'Explore collection' },
      { name: 'Bio Fertilizers & Soil', slug: 'bio-fertilizers', image: '/categories/agriculture-seeds.webp', description: 'Explore collection' },
      { name: 'Garden Tools & Sprayers', slug: 'garden-tools', image: '/categories/agriculture-seeds.webp', description: 'Explore collection' },
      { name: 'Crop Protection & Care', slug: 'crop-protection', image: '/categories/agriculture-seeds.webp', description: 'Explore collection' },
    ]
  },

  cosmetics_beauty: {
    key: 'cosmetics_beauty',
    icon: Sparkles,
    colorClass: 'text-rose-500',
    iconBgLight: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    iconBgDark: 'dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
    defaultSubcategories: [
      { name: 'Skincare & Serums', slug: 'skincare', image: '/categories/cosmetics.webp', description: 'Explore collection' },
      { name: 'Haircare & Herbal Oils', slug: 'haircare', image: '/categories/beauty.webp', description: 'Explore collection' },
      { name: 'Makeup Essentials', slug: 'makeup', image: '/categories/cosmetics.webp', description: 'Explore collection' },
      { name: 'Personal Care & Hygiene', slug: 'personal-care', image: '/categories/health.webp', description: 'Explore collection' },
    ]
  },

  footwear: {
    key: 'footwear',
    icon: Footprints,
    colorClass: 'text-blue-500',
    iconBgLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    iconBgDark: 'dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    defaultSubcategories: [
      { name: "Men's Formal & Casual", slug: 'mens-footwear', image: '/categories/footwear.webp', description: 'Explore collection' },
      { name: "Women's Heels & Flats", slug: 'womens-footwear', image: '/categories/footwear.webp', description: 'Explore collection' },
      { name: 'Sports & Running Shoes', slug: 'sports-shoes', image: '/categories/sports.webp', description: 'Explore collection' },
      { name: 'Traditional Mojaris', slug: 'traditional-mojaris', image: '/categories/footwear.webp', description: 'Explore collection' },
    ]
  },

  pickles_spices: {
    key: 'pickles_spices',
    icon: Package,
    colorClass: 'text-orange-500',
    iconBgLight: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    iconBgDark: 'dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    defaultSubcategories: [
      { name: 'Homemade Mango Pickles', slug: 'mango-pickles', image: '/categories/pickles.webp', description: 'Explore collection' },
      { name: 'Authentic Whole Spices', slug: 'whole-spices', image: '/categories/spices.webp', description: 'Explore collection' },
      { name: 'Blended Masala Powders', slug: 'blended-masalas', image: '/categories/spices.webp', description: 'Explore collection' },
      { name: 'Crispy Papads & Kurdai', slug: 'papads-kurdai', image: '/categories/papad.webp', description: 'Explore collection' },
    ]
  },

  fashion: {
    key: 'fashion',
    icon: Shirt,
    colorClass: 'text-purple-500',
    iconBgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    iconBgDark: 'dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    defaultSubcategories: [
      { name: "Men's Wear & Shirts", slug: 'mens-fashion', image: '/categories/fashion.webp', description: 'Explore collection' },
      { name: 'Ethnic Sarees & Kurtis', slug: 'womens-fashion', image: '/categories/fashion.webp', description: 'Explore collection' },
      { name: 'Kidswear & Accessories', slug: 'kids-fashion', image: '/categories/baby.webp', description: 'Explore collection' },
      { name: 'Jackets & Winterwear', slug: 'winterwear', image: '/categories/fashion.webp', description: 'Explore collection' },
    ]
  },

  jewellery: {
    key: 'jewellery',
    icon: Gem,
    colorClass: 'text-amber-600',
    iconBgLight: 'bg-amber-600/10 text-amber-700 border-amber-600/20',
    iconBgDark: 'dark:bg-amber-600/20 dark:text-amber-400 dark:border-amber-600/30',
    defaultSubcategories: [
      { name: 'Traditional Necklaces', slug: 'necklaces', image: '/categories/jewellery.webp', description: 'Explore collection' },
      { name: 'Silver Earrings & Rings', slug: 'silver-earrings', image: '/categories/jewellery.webp', description: 'Explore collection' },
      { name: 'Fashion Costume Accessories', slug: 'fashion-accessories', image: '/categories/jewellery.webp', description: 'Explore collection' },
      { name: 'Bangles & Bracelets', slug: 'bangles-bracelets', image: '/categories/jewellery.webp', description: 'Explore collection' },
    ]
  },

  electronics: {
    key: 'electronics',
    icon: Smartphone,
    colorClass: 'text-cyan-500',
    iconBgLight: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    iconBgDark: 'dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30',
    defaultSubcategories: [
      { name: 'Headphones & Earbuds', slug: 'audio-headphones', image: '/categories/electronics.webp', description: 'Explore collection' },
      { name: 'Smartwatches & Fitness Bands', slug: 'smartwatches', image: '/categories/electronics.webp', description: 'Explore collection' },
      { name: 'Mobile Accessories & Cables', slug: 'mobile-accessories', image: '/categories/electronics.webp', description: 'Explore collection' },
      { name: 'Speakers & Home Audio', slug: 'home-audio', image: '/categories/electronics.webp', description: 'Explore collection' },
    ]
  },

  auto_accessories: {
    key: 'auto_accessories',
    icon: Car,
    colorClass: 'text-indigo-500',
    iconBgLight: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    iconBgDark: 'dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
    defaultSubcategories: [
      { name: 'Car Care & Polish', slug: 'car-care', image: '/categories/auto.webp', description: 'Explore collection' },
      { name: 'Riding Helmets & Gear', slug: 'helmets-gear', image: '/categories/auto.webp', description: 'Explore collection' },
      { name: 'Seat Covers & Cushions', slug: 'seat-covers', image: '/categories/auto.webp', description: 'Explore collection' },
      { name: 'LED Lights & Gadgets', slug: 'auto-gadgets', image: '/categories/auto.webp', description: 'Explore collection' },
    ]
  },

  local_homemade: {
    key: 'local_homemade',
    icon: HeartHandshake,
    colorClass: 'text-teal-500',
    iconBgLight: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    iconBgDark: 'dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30',
    defaultSubcategories: [
      { name: 'Artisanal Handicrafts', slug: 'handicrafts', image: '/categories/gifts.webp', description: 'Explore collection' },
      { name: 'Traditional Sweets & Snacks', slug: 'sweets-snacks', image: '/categories/diwali.webp', description: 'Explore collection' },
      { name: 'Handmade Soaps & Candles', slug: 'soaps-candles', image: '/categories/cosmetics.webp', description: 'Explore collection' },
      { name: 'Pure Homemade Ghee', slug: 'homemade-ghee', image: '/categories/oil.webp', description: 'Explore collection' },
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
