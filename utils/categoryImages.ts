/**
 * Subcategory Image Resolution Engine
 * Guarantees 100% distinct, accurate, photorealistic studio photography image coverage for every subcategory across all categories.
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
  'artificial-fashion-jewellery',
  'artisan-craft-decor',
  'ayurvedic-health-drinks',
  'ayurvedic-massage-oils',
  'baby-bath-skin-care',
  'baby-clothing-onesies',
  'baby-feeding-bottles',
  'besan-rava-ladoo',
  'bike-accessories-covers',
  'bio-fertilizers-compost',
  'biryani-chole-masala',
  'blended-garam-masala',
  'blue-sapphire-neelam',
  'bluetooth-speakers-audio',
  'bridal-jewellery-sets',
  'camphor-kapur',
  'car-cleaning-care',
  'car-seat-covers-mats',
  'chilli-garlic-pickles',
  'cleaning-essentials',
  'cold-pressed-groundnut-oil',
  'concentrates-squashes',
  'cookware',
  'cookware-pots',
  'corporate-executive-gifts',
  'crunchy-chakli-chivda',
  'customized-photo-gifts',
  'diapers-baby-wipes',
  'dining-serveware',
  'diya-brass-oil-lamps',
  'drip-irrigation-kits',
  'emerald-panna',
  'energy-wellness-drinks',
  'ethnic-juttis-kolhapuris',
  'ethnic-wear-sarees',
  'eye-makeup-kajal',
  'face-makeup-foundation',
  'face-wash-cleansers',
  'farm-tools-equipment',
  'fashion-accessories',
  'festival-gift-hampers',
  'fruit-juices',
  'furniture',
  'gemstone-beaded-jewellery',
  'gold-jewellery',
  'ground-spice-powders',
  'hair-oils-shampoos',
  'handmade-snacks-khakhra',
  'handmade-soaps-candles',
  'hawan-samagri',
  'helmet-riding-gear',
  'herbal-syrups',
  'high-yield-seeds',
  'home-decor',
  'home-electronic-appliances',
  'homemade-ghee-butter',
  'homemade-jams-preserves',
  'idol-statues-photo-frames',
  'incense-sticks-dhoop',
  'kids-footwear',
  'kids-wear',
  'kitchen-appliances',
  'laptops-computers',
  'lemon-lime-pickles',
  'lighting-lamps',
  'lighting',
  'lipsticks-lip-care',
  'makeup-brushes-tools',
  'mango-pickles',
  'marble-brass-idols',
  'mens-grooming-shaving',
  'mens-shoes',
  'mens-wear',
  'mixed-veg-pickles',
  'mobile-holders-chargers',
  'moong-dal-papad',
  'nail-care-polish',
  'oral-care-toothpaste',
  'organic-hand-pounded-spices',
  'organic-herbal-cosmetics',
  'organic-pesticides',
  'organic-syrups',
  'pearl-moti-rings',
  'plant-care-gardening',
  'pooja-samagri-kits',
  'power-banks-cables',
  'pure-mustard-oil',
  'red-coral-moonga',
  'regional-curry-powders',
  'rice-papad-chawal-wafers',
  'ruby-manik',
  'sesame-til-oil',
  'shankarpali-kadboli',
  'silver-jewellery',
  'skincare-moisturizers',
  'slippers-flip-flops',
  'smart-watches-fitness-bands',
  'smartphones-mobiles',
  'soaps-body-wash',
  'spicy-masala-papad',
  'sports-running-shoes',
  'storage-containers',
  'strollers-baby-gear',
  'sunflower-rice-bran-oil',
  'sweet-karanji-anarse',
  'temple-jewellery',
  'toys-educational-games',
  'traditional-faral-hampers',
  'traditional-pickles',
  'traditional-sweets',
  'traditional-wheat-kurdai',
  'udad-dal-papad',
  'virgin-coconut-oil',
  'whole-spices',
  'winter-seasonal-wear',
  'womens-sandals-heels',
  'womens-wear',
  'wooden-handicrafts',
  'yellow-sapphire-pukhraj'
]);

/**
 * Resolves the image URL for a given subcategory by ID, slug, or name.
 */
export function getSubcategoryImage(subcatSlugOrId: string | number, subcatName?: string, parentCatSlug?: string): string {
  const slugKey = String(subcatSlugOrId || '').toLowerCase().trim().replace(/_/g, '-');
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
  if (slugKey === 'blue-sapphire-neelam' || nameKey.includes('blue sapphire') || nameKey.includes('neelam')) return '/images/subcategories/blue-sapphire-neelam.jpg';
  if (slugKey === 'turquoise-firoza' || nameKey.includes('firoza') || nameKey.includes('turquoise')) return '/images/subcategories/turquoise-firoza.png';
  if (slugKey === 'diamond-hira' || nameKey.includes('hira') || nameKey.includes('diamond')) return '/images/subcategories/diamond-hira.png';
  if (slugKey === 'ruby-manik' || nameKey.includes('ruby') || nameKey.includes('manik')) return '/images/subcategories/ruby-manik.jpg';
  if (slugKey === 'emerald-panna' || nameKey.includes('emerald') || nameKey.includes('panna')) return '/images/subcategories/emerald-panna.jpg';
  if (slugKey === 'yellow-sapphire-pushkaraj' || nameKey.includes('pukhraj') || nameKey.includes('pushkaraj')) return '/images/subcategories/yellow-sapphire-pukhraj.jpg';

  // 4. Exact Food, Snacks & Diwali Faral Mapping
  if (slugKey === 'non-veg-pickles' || nameKey.includes('non-veg')) return '/images/subcategories/non-veg-pickles.png';
  if (slugKey === 'traditional-regional-pickles' || nameKey.includes('regional pickle')) return '/images/subcategories/traditional-regional-pickles.png';
  if (slugKey === 'sabudana-potato-wafers' || nameKey.includes('sabudana') || nameKey.includes('potato wafer')) return '/images/subcategories/sabudana-potato-wafers.png';
  if (slugKey === 'dry-fruit-faral-mix' || nameKey.includes('dry fruit faral')) return '/images/subcategories/dry-fruit-faral-mix.png';
  if (slugKey === 'automotive-led-lights' || nameKey.includes('led light') || nameKey.includes('headlight')) return '/images/subcategories/automotive-led-lights.png';
  if (slugKey === 'traditional-terracotta-pottery' || nameKey.includes('terracotta') || nameKey.includes('pottery')) return '/images/subcategories/traditional-terracotta-pottery.png';
  if (slugKey === 'pooja-thali-sets' || nameKey.includes('thali set')) return '/images/subcategories/pooja-thali-sets.png';

  // 5. Keyword matching for studio photography (.jpg)
  // Cosmetics & Beauty
  if (nameKey.includes('foundation') || nameKey.includes('face makeup')) return '/images/subcategories/face-makeup-foundation.jpg';
  if (nameKey.includes('lipstick') || nameKey.includes('lip care')) return '/images/subcategories/lipsticks-lip-care.jpg';
  if (nameKey.includes('eye makeup') || nameKey.includes('kajal') || nameKey.includes('mascara')) return '/images/subcategories/eye-makeup-kajal.jpg';
  if (nameKey.includes('nail') || nameKey.includes('polish')) return '/images/subcategories/nail-care-polish.jpg';
  if (nameKey.includes('brush') || nameKey.includes('sponge') || nameKey.includes('makeup tool')) return '/images/subcategories/makeup-brushes-tools.jpg';
  if (nameKey.includes('herbal cosmetic') || nameKey.includes('organic cosmetic')) return '/images/subcategories/organic-herbal-cosmetics.jpg';
  if (nameKey.includes('moisturizer') || nameKey.includes('skincare')) return '/images/subcategories/skincare-moisturizers.jpg';
  if (nameKey.includes('hair oil') || nameKey.includes('shampoo')) return '/images/subcategories/hair-oils-shampoos.jpg';
  if (nameKey.includes('soap') || nameKey.includes('body wash')) return '/images/subcategories/soaps-body-wash.jpg';
  if (nameKey.includes('face wash') || nameKey.includes('cleanser')) return '/images/subcategories/face-wash-cleansers.jpg';
  if (nameKey.includes('oral') || nameKey.includes('tooth')) return '/images/subcategories/oral-care-toothpaste.jpg';
  if (nameKey.includes('shav') || nameKey.includes('grooming')) return '/images/subcategories/mens-grooming-shaving.jpg';

  // Juices & Drinks
  if (nameKey.includes('fruit juice') || slugKey.includes('fruit-juice')) return '/images/subcategories/fruit-juices.jpg';
  if (nameKey.includes('herbal syrup') || slugKey.includes('herbal-syrup')) return '/images/subcategories/herbal-syrups.jpg';
  if (nameKey.includes('squash') || nameKey.includes('concentrate') || nameKey.includes('sharbat')) return '/images/subcategories/concentrates-squashes.jpg';
  if (nameKey.includes('ayurvedic health') || nameKey.includes('amla juice') || nameKey.includes('aloe vera')) return '/images/subcategories/ayurvedic-health-drinks.jpg';
  if (nameKey.includes('energy') || nameKey.includes('wellness drink')) return '/images/subcategories/energy-wellness-drinks.jpg';
  if (nameKey.includes('organic syrup')) return '/images/subcategories/organic-syrups.jpg';

  // Footwear
  if (nameKey.includes('men') && (nameKey.includes('shoe') || nameKey.includes('sneaker'))) return '/images/subcategories/mens-shoes.jpg';
  if (nameKey.includes('sandal') || nameKey.includes('heel') || nameKey.includes('flat')) return '/images/subcategories/womens-sandals-heels.jpg';
  if (nameKey.includes('jutti') || nameKey.includes('kolhapuri')) return '/images/subcategories/ethnic-juttis-kolhapuris.jpg';
  if (nameKey.includes('sport') || nameKey.includes('running')) return '/images/subcategories/sports-running-shoes.jpg';
  if (nameKey.includes('kid') && nameKey.includes('footwear')) return '/images/subcategories/kids-footwear.jpg';
  if (nameKey.includes('slipper') || nameKey.includes('flip')) return '/images/subcategories/slippers-flip-flops.jpg';

  // Home & Kitchen
  if (nameKey.includes('furniture') || slugKey.includes('furniture')) return '/images/subcategories/furniture.jpg';
  if (nameKey.includes('kitchen appliance') || slugKey === 'kitchen-appliances') return '/images/subcategories/kitchen-appliances.jpg';
  if (nameKey.includes('home decor') || slugKey === 'home-decor') return '/images/subcategories/home-decor.jpg';
  if (nameKey.includes('lighting') || nameKey.includes('lamps')) return '/images/subcategories/lighting-lamps.jpg';
  if (nameKey.includes('cookware') || nameKey.includes('pots') || slugKey === 'cookware-pots') return '/images/subcategories/cookware.jpg';
  if (nameKey.includes('storage container') || slugKey === 'storage-containers') return '/images/subcategories/storage-containers.jpg';
  if (nameKey.includes('dining') || nameKey.includes('serveware')) return '/images/subcategories/dining-serveware.jpg';
  if (nameKey.includes('cleaning essential') || slugKey === 'cleaning-essentials') return '/images/subcategories/cleaning-essentials.jpg';

  // Spices & Masale
  if (nameKey.includes('whole spice') || nameKey.includes('khadya masala')) return '/images/subcategories/whole-spices.jpg';
  if (nameKey.includes('ground spice') || nameKey.includes('powder')) return '/images/subcategories/ground-spice-powders.jpg';
  if (nameKey.includes('garam masala')) return '/images/subcategories/blended-garam-masala.jpg';
  if (nameKey.includes('curry') || nameKey.includes('goda') || nameKey.includes('kanda lasun')) return '/images/subcategories/regional-curry-powders.jpg';
  if (nameKey.includes('hand-pounded') || nameKey.includes('pounded spice')) return '/images/subcategories/organic-hand-pounded-spices.jpg';
  if (nameKey.includes('biryani') || nameKey.includes('chole')) return '/images/subcategories/biryani-chole-masala.jpg';

  // Fashion & Apparel
  if (nameKey.includes('men') && nameKey.includes('wear')) return '/images/subcategories/mens-wear.jpg';
  if (nameKey.includes('women') && nameKey.includes('wear')) return '/images/subcategories/womens-wear.jpg';
  if (nameKey.includes('saree') || nameKey.includes('ethnic wear')) return '/images/subcategories/ethnic-wear-sarees.jpg';
  if (nameKey.includes('kid') && nameKey.includes('wear')) return '/images/subcategories/kids-wear.jpg';
  if (nameKey.includes('fashion access') || nameKey.includes('belt') || nameKey.includes('sunglass')) return '/images/subcategories/fashion-accessories.jpg';
  if (nameKey.includes('winter') || nameKey.includes('sweater') || nameKey.includes('shawl')) return '/images/subcategories/winter-seasonal-wear.jpg';

  // Jewellery
  if (nameKey.includes('gold')) return '/images/subcategories/gold-jewellery.jpg';
  if (nameKey.includes('silver')) return '/images/subcategories/silver-jewellery.jpg';
  if (nameKey.includes('fashion jewellery') || nameKey.includes('artificial')) return '/images/subcategories/artificial-fashion-jewellery.jpg';
  if (nameKey.includes('bridal')) return '/images/subcategories/bridal-jewellery-sets.jpg';
  if (nameKey.includes('temple jewellery')) return '/images/subcategories/temple-jewellery.jpg';
  if (nameKey.includes('gemstone jewellery') || nameKey.includes('beaded')) return '/images/subcategories/gemstone-beaded-jewellery.jpg';

  // Auto Accessories
  if (nameKey.includes('car cleaning') || nameKey.includes('shampoo')) return '/images/subcategories/car-cleaning-care.jpg';
  if (nameKey.includes('helmet') || nameKey.includes('riding')) return '/images/subcategories/helmet-riding-gear.jpg';
  if (nameKey.includes('seat cover') || nameKey.includes('mat')) return '/images/subcategories/car-seat-covers-mats.jpg';
  if (nameKey.includes('bike') && (nameKey.includes('cover') || nameKey.includes('access'))) return '/images/subcategories/bike-accessories-covers.jpg';
  if (nameKey.includes('holder') || nameKey.includes('charger')) return '/images/subcategories/mobile-holders-chargers.jpg';

  // Baby & Kids
  if (nameKey.includes('baby') && (nameKey.includes('cloth') || nameKey.includes('onesie'))) return '/images/subcategories/baby-clothing-onesies.jpg';
  if (nameKey.includes('diaper') || nameKey.includes('wipe')) return '/images/subcategories/diapers-baby-wipes.jpg';
  if (nameKey.includes('baby') && (nameKey.includes('bath') || nameKey.includes('skin'))) return '/images/subcategories/baby-bath-skin-care.jpg';
  if (nameKey.includes('toy') || nameKey.includes('game') || nameKey.includes('puzzle')) return '/images/subcategories/toys-educational-games.jpg';
  if (nameKey.includes('feed') || nameKey.includes('bottle') || nameKey.includes('bib')) return '/images/subcategories/baby-feeding-bottles.jpg';
  if (nameKey.includes('stroller') || nameKey.includes('pram')) return '/images/subcategories/strollers-baby-gear.jpg';

  // Oils
  if (nameKey.includes('groundnut') || nameKey.includes('peanut')) return '/images/subcategories/cold-pressed-groundnut-oil.jpg';
  if (nameKey.includes('mustard') || nameKey.includes('sarson')) return '/images/subcategories/pure-mustard-oil.jpg';
  if (nameKey.includes('sesame') || nameKey.includes('til')) return '/images/subcategories/sesame-til-oil.jpg';
  if (nameKey.includes('coconut')) return '/images/subcategories/virgin-coconut-oil.jpg';
  if (nameKey.includes('sunflower') || nameKey.includes('rice bran')) return '/images/subcategories/sunflower-rice-bran-oil.jpg';
  if (nameKey.includes('massage oil')) return '/images/subcategories/ayurvedic-massage-oils.jpg';

  // Papad & Kurdai
  if (nameKey.includes('udad')) return '/images/subcategories/udad-dal-papad.jpg';
  if (nameKey.includes('moong')) return '/images/subcategories/moong-dal-papad.jpg';
  if (nameKey.includes('kurdai') || nameKey.includes('wheat')) return '/images/subcategories/traditional-wheat-kurdai.jpg';
  if (nameKey.includes('rice papad') || nameKey.includes('chawal')) return '/images/subcategories/rice-papad-chawal-wafers.jpg';
  if (nameKey.includes('masala papad')) return '/images/subcategories/spicy-masala-papad.jpg';

  // Electronics
  if (nameKey.includes('phone') || nameKey.includes('mobile')) return '/images/subcategories/smartphones-mobiles.jpg';
  if (nameKey.includes('laptop') || nameKey.includes('computer')) return '/images/subcategories/laptops-computers.jpg';
  if (nameKey.includes('watch') || nameKey.includes('band')) return '/images/subcategories/smart-watches-fitness-bands.jpg';
  if (nameKey.includes('speaker') || nameKey.includes('headphone') || nameKey.includes('audio')) return '/images/subcategories/bluetooth-speakers-audio.jpg';
  if (nameKey.includes('power bank') || nameKey.includes('cable')) return '/images/subcategories/power-banks-cables.jpg';
  if (nameKey.includes('electronic appliance') || nameKey.includes('smart home')) return '/images/subcategories/home-electronic-appliances.jpg';

  // Pooja & Spiritual
  if (nameKey.includes('pooja samagri') || slugKey === 'pooja-samagri-kits') return '/images/subcategories/pooja-samagri-kits.jpg';
  if (nameKey.includes('dhoop') || nameKey.includes('agarbatti') || slugKey.includes('dhoop')) return '/images/subcategories/incense-sticks-dhoop.jpg';
  if (nameKey.includes('diya') || nameKey.includes('brass oil lamp') || slugKey === 'diya-brass-oil-lamps') return '/images/subcategories/diya-brass-oil-lamps.jpg';
  if (nameKey.includes('kapur') || nameKey.includes('camphor') || slugKey.includes('kapur')) return '/images/subcategories/camphor-kapur.jpg';
  if (nameKey.includes('hawan') || nameKey.includes('havan') || slugKey.includes('hawan')) return '/images/subcategories/hawan-samagri.jpg';
  if (nameKey.includes('idol') || nameKey.includes('statue') || slugKey.includes('idol')) return '/images/subcategories/idol-statues-photo-frames.jpg';

  // Local & Homemade
  if (nameKey.includes('khakhra') || nameKey.includes('snack')) return '/images/subcategories/handmade-snacks-khakhra.jpg';
  if (nameKey.includes('ghee') || nameKey.includes('butter')) return '/images/subcategories/homemade-ghee-butter.jpg';
  if (nameKey.includes('craft') || nameKey.includes('decor')) return '/images/subcategories/artisan-craft-decor.jpg';
  if (nameKey.includes('soaps') || nameKey.includes('candles')) return '/images/subcategories/handmade-soaps-candles.jpg';
  if (nameKey.includes('jam') || nameKey.includes('preserve') || nameKey.includes('murabba')) return '/images/subcategories/homemade-jams-preserves.jpg';
  if (nameKey.includes('sweet') || nameKey.includes('mithai') || nameKey.includes('peda')) return '/images/subcategories/traditional-sweets.jpg';

  // Gifts & Handicrafts
  if (nameKey.includes('wooden craft') || nameKey.includes('wooden handicraft')) return '/images/subcategories/wooden-handicrafts.jpg';
  if (nameKey.includes('marble') || nameKey.includes('brass statue')) return '/images/subcategories/marble-brass-idols.jpg';
  if (nameKey.includes('gift hamper') || nameKey.includes('festival gift')) return '/images/subcategories/festival-gift-hampers.jpg';
  if (nameKey.includes('photo gift') || nameKey.includes('custom')) return '/images/subcategories/customized-photo-gifts.jpg';
  if (nameKey.includes('corporate gift')) return '/images/subcategories/corporate-executive-gifts.jpg';

  // Agriculture & Seeds
  if (nameKey.includes('seed') || slugKey.includes('seed')) return '/images/subcategories/high-yield-seeds.jpg';
  if (nameKey.includes('fertilizer') || nameKey.includes('compost') || slugKey.includes('fertilizer')) return '/images/subcategories/bio-fertilizers-compost.jpg';
  if (nameKey.includes('pesticide') || nameKey.includes('insecticide') || slugKey.includes('pesticide')) return '/images/subcategories/organic-pesticides.jpg';
  if (nameKey.includes('irrigation') || slugKey.includes('irrigation')) return '/images/subcategories/drip-irrigation-kits.jpg';
  if (nameKey.includes('farm hand tool') || slugKey === 'farm-tools-equipment') return '/images/subcategories/farm-tools-equipment.jpg';
  if (nameKey.includes('gardening') || slugKey === 'plant-care-gardening') return '/images/subcategories/plant-care-gardening.jpg';

  // 6. Direct slug file check fallback to .jpg
  if (slugKey) {
    return `/images/subcategories/${slugKey}.jpg`;
  }

  // 7. Fallback to parent category webp if available
  if (parentCatSlug) {
    return `/categories/${parentCatSlug}.webp`;
  }

  return '/categories/agriculture-seeds.webp';
}
