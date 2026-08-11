const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public', 'images', 'subcategories');

const allSubcategories = [
  // Juices & Syrups
  'fruit-juices', 'herbal-syrups', 'concentrates-squashes', 'ayurvedic-health-drinks', 'energy-wellness-drinks', 'organic-syrups',
  // Religious & Pooja Items
  'pooja-samagri-kits', 'incense-sticks-dhoop', 'diya-brass-oil-lamps', 'camphor-kapur', 'idol-statues-photo-frames', 'hawan-samagri',
  // Cosmetics
  'face-makeup-foundation', 'lipsticks-lip-care', 'eye-makeup-kajal', 'nail-care-polish', 'makeup-brushes-tools', 'organic-herbal-cosmetics',
  // Beauty & Personal Care
  'skincare-moisturizers', 'hair-oils-shampoos', 'soaps-body-wash', 'face-wash-cleansers', 'oral-care-toothpaste', 'mens-grooming-shaving',
  // Footwear
  'mens-shoes', 'womens-sandals-heels', 'ethnic-juttis-kolhapuris', 'sports-running-shoes', 'kids-footwear', 'slippers-flip-flops',
  // Pickles
  'mango-pickles', 'lemon-lime-pickles', 'chilli-garlic-pickles', 'mixed-veg-pickles', 'non-veg-pickles', 'traditional-regional-pickles',
  // Masale
  'whole-spices', 'ground-spice-powders', 'blended-garam-masala', 'regional-curry-powders', 'organic-hand-pounded-spices', 'biryani-chole-masala',
  // Fashion
  'mens-wear', 'womens-wear', 'ethnic-wear-sarees', 'kids-wear', 'fashion-accessories', 'winter-seasonal-wear',
  // Jewellery
  'gold-jewellery', 'silver-jewellery', 'artificial-fashion-jewellery', 'bridal-jewellery-sets', 'temple-jewellery', 'gemstone-beaded-jewellery',
  // Agriculture & Seeds
  'high-yield-seeds', 'bio-fertilizers-compost', 'organic-pesticides', 'farm-tools-equipment', 'drip-irrigation-kits', 'plant-care-gardening', 'organic-seeds', 'fertilizers-soil-boosters', 'irrigation-tools',
  // Auto Accessories
  'car-cleaning-care', 'helmet-riding-gear', 'car-seat-covers-mats', 'bike-accessories-covers', 'mobile-holders-chargers', 'automotive-led-lights',
  // Local & Homemade Products
  'handmade-snacks-khakhra', 'homemade-ghee-butter', 'artisan-craft-decor', 'handmade-soaps-candles', 'homemade-jams-preserves', 'traditional-sweets',
  // Pooja & Spiritual
  'rudraksha-mala-beads', 'gemstones-yantras', 'spiritual-books-beads', 'temple-brass-bell-shankh', 'gangajal-holy-water', 'pooja-thali-sets',
  // Gifts & Handicrafts
  'wooden-handicrafts', 'marble-brass-idols', 'festival-gift-hampers', 'customized-photo-gifts', 'traditional-terracotta-pottery', 'corporate-executive-gifts',
  // Baby & Kids
  'baby-clothing-onesies', 'diapers-baby-wipes', 'baby-bath-skin-care', 'toys-educational-games', 'baby-feeding-bottles', 'strollers-baby-gear',
  // Oil
  'cold-pressed-groundnut-oil', 'pure-mustard-oil', 'sesame-til-oil', 'virgin-coconut-oil', 'sunflower-rice-bran-oil', 'ayurvedic-massage-oils',
  // Papad & Kurdai
  'udad-dal-papad', 'moong-dal-papad', 'traditional-wheat-kurdai', 'rice-papad-chawal-wafers', 'sabudana-potato-wafers', 'spicy-masala-papad',
  // Astro Stone
  'yellow-sapphire-pukhraj', 'blue-sapphire-neelam', 'emerald-panna', 'ruby-manik', 'red-coral-moonga', 'pearl-moti-rings',
  // Diwali Faral
  'crunchy-chakli-chivda', 'sweet-karanji-anarse', 'besan-rava-ladoo', 'shankarpali-kadboli', 'dry-fruit-faral-mix', 'traditional-faral-hampers',
  // Electronics
  'smartphones-mobiles', 'laptops-computers', 'smart-watches-fitness-bands', 'bluetooth-speakers-audio', 'power-banks-cables', 'home-electronic-appliances',
  // Home & Kitchen
  'furniture', 'kitchen-appliances', 'home-decor', 'lighting-lamps', 'lighting', 'cookware', 'storage-containers', 'dining-serveware', 'cleaning-essentials'
];

let available = 0;
let missing = 0;
const missingList = [];

allSubcategories.forEach((slug) => {
  const svgPath = path.join(publicDir, `${slug}.svg`);
  const jpgPath = path.join(publicDir, `${slug}.jpg`);
  const pngPath = path.join(publicDir, `${slug}.png`);

  if (fs.existsSync(svgPath) || fs.existsSync(jpgPath) || fs.existsSync(pngPath)) {
    available++;
  } else {
    missing++;
    missingList.push(slug);
  }
});

console.log('====================================================');
console.log('AUTOMATIC SUBCATEGORY IMAGE COVERAGE REPORT');
console.log('====================================================');
console.log(`TOTAL SUBCATEGORIES TESTED: ${allSubcategories.length}`);
console.log(`IMAGES AVAILABLE:          ${available}`);
console.log(`MISSING IMAGES:            ${missing}`);

if (missing > 0) {
  console.log('\nMISSING SUBCATEGORY SLUGS:', missingList);
} else {
  console.log('\nSUCCESS: 100% Subcategory Image Coverage Achieved across all categories! MISSING IMAGES = 0');
}
