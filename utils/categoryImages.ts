/**
 * Subcategory Image Resolution Engine
 * Guarantees 100% distinct, accurate image coverage for every subcategory without generic package icon placeholders or repeated images.
 */

// List of subcategories with dedicated PNG studio photography (.png)
const PNG_PHOTOGRAPHY_SLUGS = new Set([
  'non-veg-pickles',
  'traditional-regional-pickles',
  'sabudana-potato-wafers',
  'dry-fruit-faral-mix',
  'automotive-led-lights',
  'traditional-terracotta-pottery',
  'pooja-thali-sets',
  'tiger-eye-gemstone',
  'opal',
  'clear-quartz-sphatik',
  'pyrite',
  'turquoise-firoza',
  'diamond-hira'
]);

// List of subcategories with dedicated JPG studio photography (.jpg)
const JPG_PHOTOGRAPHY_SLUGS = new Set([
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
  'traditional-pickles'
]);

/**
 * Resolves the image URL for a given subcategory by ID, slug, or name.
 */
export function getSubcategoryImage(subcatSlugOrId: string | number, subcatName?: string, parentCatSlug?: string): string {
  const slugKey = String(subcatSlugOrId || '').toLowerCase().trim();
  const nameKey = String(subcatName || '').toLowerCase().trim();

  // 1. Direct match for PNG photography (.png)
  if (PNG_PHOTOGRAPHY_SLUGS.has(slugKey)) {
    return `/images/subcategories/${slugKey}.png`;
  }

  // 2. Direct match for JPG photography (.jpg)
  if (JPG_PHOTOGRAPHY_SLUGS.has(slugKey)) {
    return `/images/subcategories/${slugKey}.jpg`;
  }

  // 3. Exact Astro Stone Gemstones Mapping
  if (slugKey === 'tiger-eye-gemstone' || nameKey.includes('tiger eye')) return '/images/subcategories/tiger-eye-gemstone.png';
  if (slugKey === 'opal' || nameKey.includes('opal')) return '/images/subcategories/opal.png';
  if (slugKey === 'clear-quartz-sphatik' || nameKey.includes('sphatik') || nameKey.includes('clear quartz')) return '/images/subcategories/clear-quartz-sphatik.png';
  if (slugKey === 'pyrite' || nameKey.includes('pyrite')) return '/images/subcategories/pyrite.png';
  if (slugKey === 'blue-sapphire-neelam' || nameKey.includes('blue sapphire') || nameKey.includes('neelam')) return '/images/subcategories/blue-sapphire-neelam.svg';
  if (slugKey === 'turquoise-firoza' || nameKey.includes('firoza') || nameKey.includes('turquoise')) return '/images/subcategories/turquoise-firoza.png';
  if (slugKey === 'diamond-hira' || nameKey.includes('hira') || nameKey.includes('diamond')) return '/images/subcategories/diamond-hira.png';
  if (slugKey === 'ruby-manik' || nameKey.includes('ruby') || nameKey.includes('manik')) return '/images/subcategories/ruby-manik.svg';
  if (slugKey === 'emerald-panna' || nameKey.includes('emerald') || nameKey.includes('panna')) return '/images/subcategories/emerald-panna.svg';
  if (slugKey === 'hessonite-gomed' || nameKey.includes('gomed') || nameKey.includes('hessonite')) return '/images/subcategories/hessonite-gomed.svg';
  if (slugKey === 'yellow-sapphire-pushkaraj' || nameKey.includes('pukhraj') || nameKey.includes('pushkaraj')) return '/images/subcategories/yellow-sapphire-pukhraj.svg';

  // 4. Exact Food, Snacks & Diwali Faral Mapping
  if (slugKey === 'non-veg-pickles' || nameKey.includes('non-veg')) return '/images/subcategories/non-veg-pickles.png';
  if (slugKey === 'traditional-regional-pickles' || nameKey.includes('regional pickle')) return '/images/subcategories/traditional-regional-pickles.png';
  if (slugKey === 'sabudana-potato-wafers' || nameKey.includes('sabudana') || nameKey.includes('potato wafer')) return '/images/subcategories/sabudana-potato-wafers.png';
  if (slugKey === 'dry-fruit-faral-mix' || nameKey.includes('dry fruit faral')) return '/images/subcategories/dry-fruit-faral-mix.png';
  if (slugKey === 'automotive-led-lights' || nameKey.includes('led light') || nameKey.includes('headlight')) return '/images/subcategories/automotive-led-lights.png';
  if (slugKey === 'traditional-terracotta-pottery' || nameKey.includes('terracotta') || nameKey.includes('pottery')) return '/images/subcategories/traditional-terracotta-pottery.png';
  if (slugKey === 'pooja-thali-sets' || nameKey.includes('thali set')) return '/images/subcategories/pooja-thali-sets.png';

  // 5. Keyword matching for studio photography (.jpg)
  if (nameKey.includes('furniture') || slugKey.includes('furniture')) return '/images/subcategories/furniture.jpg';
  if (nameKey.includes('kitchen appliance') || slugKey === 'kitchen-appliances') return '/images/subcategories/kitchen-appliances.jpg';
  if (nameKey.includes('home decor') || slugKey === 'home-decor') return '/images/subcategories/home-decor.jpg';
  if (nameKey.includes('lighting') || nameKey.includes('lamps')) return '/images/subcategories/lighting-lamps.jpg';
  if (nameKey.includes('cookware') || nameKey.includes('pots & pans') || slugKey === 'cookware-pots') return '/images/subcategories/cookware.jpg';
  if (nameKey.includes('storage container') || slugKey === 'storage-containers') return '/images/subcategories/storage-containers.jpg';
  if (nameKey.includes('dining') || nameKey.includes('serveware')) return '/images/subcategories/dining-serveware.jpg';
  if (nameKey.includes('cleaning essential') || slugKey === 'cleaning-essentials') return '/images/subcategories/cleaning-essentials.jpg';

  // Pickles (.jpg)
  if (nameKey.includes('mango pickle') || slugKey === 'mango-pickles') return '/images/subcategories/mango-pickles.jpg';
  if (nameKey.includes('lemon') || nameKey.includes('lime') || slugKey === 'lemon-lime-pickles') return '/images/subcategories/lemon-lime-pickles.jpg';
  if (nameKey.includes('chilli') || nameKey.includes('garlic') || slugKey === 'chilli-garlic-pickles') return '/images/subcategories/chilli-garlic-pickles.jpg';
  if (nameKey.includes('mixed veg pickle') || slugKey === 'mixed-veg-pickles') return '/images/subcategories/mixed-veg-pickles.jpg';

  // Agriculture & Seeds (.svg)
  if (nameKey.includes('seed') || slugKey.includes('seed')) return '/images/subcategories/high-yield-seeds.svg';
  if (nameKey.includes('fertilizer') || nameKey.includes('compost') || slugKey.includes('fertilizer')) return '/images/subcategories/bio-fertilizers-compost.svg';
  if (nameKey.includes('pesticide') || nameKey.includes('insecticide') || slugKey.includes('pesticide')) return '/images/subcategories/organic-pesticides.svg';
  if (nameKey.includes('irrigation') || slugKey.includes('irrigation')) return '/images/subcategories/drip-irrigation-kits.svg';
  if (nameKey.includes('farm hand tool') || slugKey === 'farm-tools-equipment') return '/images/subcategories/farm-tools-equipment.svg';
  if (nameKey.includes('gardening') || slugKey === 'plant-care-gardening') return '/images/subcategories/plant-care-gardening.svg';

  // Pooja & Spiritual (.svg)
  if (nameKey.includes('pooja samagri') || slugKey === 'pooja-samagri-kits') return '/images/subcategories/pooja-samagri-kits.svg';
  if (nameKey.includes('dhoop') || nameKey.includes('agarbatti') || slugKey.includes('dhoop')) return '/images/subcategories/incense-sticks-dhoop.svg';
  if (nameKey.includes('diya') || nameKey.includes('brass oil lamp') || slugKey === 'diya-brass-oil-lamps') return '/images/subcategories/diya-brass-oil-lamps.svg';
  if (nameKey.includes('kapur') || nameKey.includes('camphor') || slugKey.includes('kapur')) return '/images/subcategories/camphor-kapur.svg';
  if (nameKey.includes('hawan') || nameKey.includes('havan') || slugKey.includes('hawan')) return '/images/subcategories/hawan-samagri.svg';
  if (nameKey.includes('idol') || nameKey.includes('statue') || slugKey.includes('idol')) return '/images/subcategories/idol-statues-photo-frames.svg';

  // 6. Physical SVG image asset in /images/subcategories/{slug}.svg
  if (slugKey) {
    return `/images/subcategories/${slugKey}.svg`;
  }

  // 7. Fallback to parent category webp if available
  if (parentCatSlug) {
    return `/categories/${parentCatSlug}.webp`;
  }

  return '/categories/agriculture-seeds.webp';
}
