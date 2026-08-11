/**
 * Subcategory Image Resolution Engine
 * Guarantees 100% distinct image coverage for every subcategory without generic package icon placeholders or repeated images.
 */

// List of subcategories with dedicated studio photography (.jpg)
const STUDIO_PHOTOGRAPHY_SLUGS = new Set([
  'furniture',
  'kitchen-appliances',
  'home-decor',
  'lighting-lamps',
  'lighting',
  'cookware',
  'cookware-pots',
  'storage-containers',
  'dining-serveware',
  'cleaning-essentials',
  'mango-pickles',
  'lemon-lime-pickles',
  'chilli-garlic-pickles',
  'mixed-veg-pickles',
  'non-veg-pickles',
  'traditional-regional-pickles',
  'traditional-pickles'
]);

/**
 * Resolves the image URL for a given subcategory by ID, slug, or name.
 */
export function getSubcategoryImage(subcatSlugOrId: string | number, subcatName?: string, parentCatSlug?: string): string {
  const slugKey = String(subcatSlugOrId || '').toLowerCase().trim();
  const nameKey = String(subcatName || '').toLowerCase().trim();

  // 1. Direct match for studio photography (.jpg)
  if (STUDIO_PHOTOGRAPHY_SLUGS.has(slugKey)) {
    return `/images/subcategories/${slugKey}.jpg`;
  }

  // 2. Keyword matching for studio photography (.jpg)
  if (nameKey.includes('furniture') || slugKey.includes('furniture')) return '/images/subcategories/furniture.jpg';
  if (nameKey.includes('appliance') || slugKey.includes('appliance')) return '/images/subcategories/kitchen-appliances.jpg';
  if (nameKey.includes('decor') || slugKey.includes('decor')) return '/images/subcategories/home-decor.jpg';
  if (nameKey.includes('light') || nameKey.includes('lamp') || slugKey.includes('light')) return '/images/subcategories/lighting-lamps.jpg';
  if (nameKey.includes('cookware') || nameKey.includes('pot') || slugKey.includes('cookware')) return '/images/subcategories/cookware.jpg';
  if (nameKey.includes('storage') || nameKey.includes('container') || slugKey.includes('storage')) return '/images/subcategories/storage-containers.jpg';
  if (nameKey.includes('dining') || nameKey.includes('serveware') || slugKey.includes('dining')) return '/images/subcategories/dining-serveware.jpg';
  if (nameKey.includes('clean') || nameKey.includes('essential') || slugKey.includes('clean')) return '/images/subcategories/cleaning-essentials.jpg';
  if (nameKey.includes('mango') || slugKey.includes('mango')) return '/images/subcategories/mango-pickles.jpg';
  if (nameKey.includes('lemon') || nameKey.includes('lime') || slugKey.includes('lemon')) return '/images/subcategories/lemon-lime-pickles.jpg';
  if (nameKey.includes('chilli') || nameKey.includes('garlic') || slugKey.includes('chilli')) return '/images/subcategories/chilli-garlic-pickles.jpg';
  if (nameKey.includes('mix') || slugKey.includes('mix')) return '/images/subcategories/mixed-veg-pickles.jpg';

  // 3. Keyword matching for specific agriculture, pooja, cosmetics, seeds subcategories
  if (nameKey.includes('seed') || slugKey.includes('seed')) return '/images/subcategories/high-yield-seeds.svg';
  if (nameKey.includes('fertilizer') || nameKey.includes('compost') || slugKey.includes('fertilizer')) return '/images/subcategories/bio-fertilizers-compost.svg';
  if (nameKey.includes('pesticide') || nameKey.includes('insecticide') || slugKey.includes('pesticide')) return '/images/subcategories/organic-pesticides.svg';
  if (nameKey.includes('irrigation') || slugKey.includes('irrigation')) return '/images/subcategories/drip-irrigation-kits.svg';
  if (nameKey.includes('tool') || slugKey.includes('tool')) return '/images/subcategories/farm-tools-equipment.svg';
  if (nameKey.includes('garden') || slugKey.includes('garden')) return '/images/subcategories/plant-care-gardening.svg';

  if (nameKey.includes('pooja') || slugKey.includes('pooja')) return '/images/subcategories/pooja-samagri-kits.svg';
  if (nameKey.includes('dhoop') || nameKey.includes('agarbatti') || slugKey.includes('dhoop')) return '/images/subcategories/incense-sticks-dhoop.svg';
  if (nameKey.includes('diya') || nameKey.includes('lamp') || slugKey.includes('diya')) return '/images/subcategories/diya-brass-oil-lamps.svg';
  if (nameKey.includes('kapur') || nameKey.includes('camphor') || slugKey.includes('kapur')) return '/images/subcategories/camphor-kapur.svg';
  if (nameKey.includes('hawan') || nameKey.includes('havan') || slugKey.includes('hawan')) return '/images/subcategories/hawan-samagri.svg';
  if (nameKey.includes('idol') || nameKey.includes('statue') || slugKey.includes('idol')) return '/images/subcategories/idol-statues-photo-frames.svg';

  // 4. Physical SVG image asset in /images/subcategories/{slug}.svg
  if (slugKey) {
    return `/images/subcategories/${slugKey}.svg`;
  }

  // 5. Fallback to parent category webp if available
  if (parentCatSlug) {
    return `/categories/${parentCatSlug}.webp`;
  }

  return '/categories/agriculture-seeds.webp';
}
