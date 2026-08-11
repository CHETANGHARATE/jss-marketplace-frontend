/**
 * Subcategory Image Resolution Engine
 * Maps subcategory slug / ID / name to dedicated product category images.
 */

export const SUBCATEGORY_IMAGE_MAP: Record<string, string> = {
  // ─── Home & Kitchen ───
  'furniture': '/images/subcategories/furniture.jpg',
  'kitchen-appliances': '/images/subcategories/kitchen-appliances.jpg',
  'home-decor': '/images/subcategories/home-decor.jpg',
  'lighting-lamps': '/images/subcategories/lighting-lamps.jpg',
  'lighting': '/images/subcategories/lighting-lamps.jpg',
  'cookware': '/images/subcategories/cookware.jpg',
  'cookware-pots': '/images/subcategories/cookware.jpg',
  'storage-containers': '/images/subcategories/storage-containers.jpg',
  'dining-serveware': '/images/subcategories/dining-serveware.jpg',
  'cleaning-essentials': '/images/subcategories/cleaning-essentials.jpg',

  // ─── Pickles ───
  'mango-pickles': '/images/subcategories/mango-pickles.jpg',
  'lemon-lime-pickles': '/images/subcategories/lemon-lime-pickles.jpg',
  'chilli-garlic-pickles': '/images/subcategories/chilli-garlic-pickles.jpg',
  'mixed-veg-pickles': '/images/subcategories/mixed-veg-pickles.jpg',
  'non-veg-pickles': '/images/subcategories/non-veg-pickles.jpg',
  'traditional-regional-pickles': '/images/subcategories/traditional-pickles.jpg',
  'traditional-pickles': '/images/subcategories/traditional-pickles.jpg',

  // ─── Juices & Syrups ───
  'fruit-juices': '/categories/juices.webp',
  'herbal-syrups': '/categories/juices.webp',
  'concentrates-squashes': '/categories/juices.webp',
  'ayurvedic-health-drinks': '/categories/juices.webp',

  // ─── Religious & Pooja ───
  'pooja-samagri-kits': '/categories/pooja.webp',
  'incense-sticks-dhoop': '/categories/pooja.webp',
  'diya-brass-oil-lamps': '/categories/pooja.webp',
  'idol-statues-photo-frames': '/categories/pooja.webp',

  // ─── Cosmetics & Beauty ───
  'face-makeup-foundation': '/categories/cosmetics.webp',
  'lipsticks-lip-care': '/categories/cosmetics.webp',
  'eye-makeup-kajal': '/categories/cosmetics.webp',
  'skincare-moisturizers': '/categories/skincare.jpg',
  'hair-oils-shampoos': '/categories/beauty.webp',
  'soaps-body-wash': '/categories/beauty.webp',

  // ─── Footwear ───
  'mens-shoes': '/categories/footwear.webp',
  'womens-sandals-heels': '/categories/footwear.webp',
  'ethnic-juttis-kolhapuris': '/categories/footwear.webp',
  'sports-running-shoes': '/categories/footwear.webp',

  // ─── Agriculture & Seeds ───
  'high-yield-seeds': '/categories/agriculture-seeds.webp',
  'bio-fertilizers-compost': '/categories/agriculture-seeds.webp',
  'organic-pesticides': '/categories/agriculture-seeds.webp',
  'farm-tools-equipment': '/categories/agriculture-seeds.webp',

  // ─── Masale & Spices ───
  'whole-spices': '/categories/spices.webp',
  'ground-spice-powders': '/categories/spices.webp',
  'blended-garam-masala': '/categories/spices.webp',
  'regional-curry-powders': '/categories/spices.webp',

  // ─── Fashion ───
  'mens-wear': '/categories/fashion.webp',
  'womens-wear': '/categories/fashion.webp',
  'ethnic-wear-sarees': '/categories/fashion.webp',
  'kids-wear': '/categories/fashion.webp',

  // ─── Jewellery ───
  'gold-jewellery': '/categories/jewellery.webp',
  'silver-jewellery': '/categories/jewellery.webp',
  'artificial-fashion-jewellery': '/categories/jewellery.webp',

  // ─── Electronics ───
  'smartphones-mobiles': '/categories/electronics.webp',
  'laptops-computers': '/categories/electronics.webp',
  'smart-watches-fitness-bands': '/categories/electronics.webp',

  // ─── Auto ───
  'car-cleaning-care': '/categories/auto.webp',
  'helmet-riding-gear': '/categories/auto.webp',

  // ─── Local & Homemade ───
  'handmade-snacks-khakhra': '/categories/homemade.webp',
  'homemade-ghee-butter': '/categories/oil.webp',
  'artisan-craft-decor': '/categories/gifts.webp',
};

/**
 * Resolves the image URL for a given subcategory by ID, slug, or name.
 */
export function getSubcategoryImage(subcatSlugOrId: string | number, subcatName?: string, parentCatSlug?: string): string {
  const slugKey = String(subcatSlugOrId || '').toLowerCase().trim();
  const nameKey = String(subcatName || '').toLowerCase().trim();

  // 1. Direct slug match
  if (SUBCATEGORY_IMAGE_MAP[slugKey]) {
    return SUBCATEGORY_IMAGE_MAP[slugKey];
  }

  // 2. Keyword matching for Home & Kitchen subcategories
  if (nameKey.includes('furniture') || slugKey.includes('furniture')) return '/images/subcategories/furniture.jpg';
  if (nameKey.includes('appliance') || slugKey.includes('appliance')) return '/images/subcategories/kitchen-appliances.jpg';
  if (nameKey.includes('decor') || slugKey.includes('decor')) return '/images/subcategories/home-decor.jpg';
  if (nameKey.includes('light') || nameKey.includes('lamp') || slugKey.includes('light')) return '/images/subcategories/lighting-lamps.jpg';
  if (nameKey.includes('cookware') || nameKey.includes('pot') || slugKey.includes('cookware')) return '/images/subcategories/cookware.jpg';
  if (nameKey.includes('storage') || nameKey.includes('container') || slugKey.includes('storage')) return '/images/subcategories/storage-containers.jpg';
  if (nameKey.includes('dining') || nameKey.includes('serveware') || slugKey.includes('dining')) return '/images/subcategories/dining-serveware.jpg';
  if (nameKey.includes('clean') || nameKey.includes('essential') || slugKey.includes('clean')) return '/images/subcategories/cleaning-essentials.jpg';

  // 3. Keyword matching for Pickles
  if (nameKey.includes('mango') || slugKey.includes('mango')) return '/images/subcategories/mango-pickles.jpg';
  if (nameKey.includes('lemon') || nameKey.includes('lime') || slugKey.includes('lemon')) return '/images/subcategories/lemon-lime-pickles.jpg';
  if (nameKey.includes('chilli') || nameKey.includes('garlic') || slugKey.includes('chilli')) return '/images/subcategories/chilli-garlic-pickles.jpg';
  if (nameKey.includes('mix') || slugKey.includes('mix')) return '/images/subcategories/mixed-veg-pickles.jpg';
  if (nameKey.includes('non-veg') || slugKey.includes('non-veg')) return '/images/subcategories/non-veg-pickles.jpg';
  if (nameKey.includes('pickle') || slugKey.includes('pickle')) return '/images/subcategories/traditional-pickles.jpg';

  // 4. Fallback to parent category image if available
  if (parentCatSlug) {
    const parentKey = parentCatSlug.toLowerCase();
    if (parentKey.includes('kitchen') || parentKey.includes('home')) return '/categories/kitchen.webp';
    if (parentKey.includes('pickle')) return '/categories/pickles.webp';
    if (parentKey.includes('juice')) return '/categories/juices.webp';
    if (parentKey.includes('pooja') || parentKey.includes('religious')) return '/categories/pooja.webp';
    if (parentKey.includes('cosmetic') || parentKey.includes('beauty')) return '/categories/cosmetics.webp';
    if (parentKey.includes('footwear')) return '/categories/footwear.webp';
    if (parentKey.includes('spice') || parentKey.includes('masale')) return '/categories/spices.webp';
    if (parentKey.includes('fashion')) return '/categories/fashion.webp';
    if (parentKey.includes('jewel')) return '/categories/jewellery.webp';
    if (parentKey.includes('electro')) return '/categories/electronics.webp';
    if (parentKey.includes('auto')) return '/categories/auto.webp';
    if (parentKey.includes('agri') || parentKey.includes('seed')) return '/categories/agriculture-seeds.webp';
  }

  return '/categories/kitchen.webp';
}
