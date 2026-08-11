const fs = require('fs');
const path = require('path');

// Extract all subcategories from CategorySeeder.php
const seederPath = path.join(__dirname, '..', '..', 'jss-marketplace-backend', 'database', 'seeders', 'CategorySeeder.php');
const seederContent = fs.readFileSync(seederPath, 'utf8');

const subcatRegex = /'name'\s*=>\s*\[\s*'en'\s*=>\s*'([^']+)'[^\]]*\],\s*'slug'\s*=>\s*'([^']+)'/g;
const subcategories = [];
let match;

while ((match = subcatRegex.exec(seederContent)) !== null) {
  const name = match[1];
  const slug = match[2];
  // Filter out parent category slugs
  const isParent = ['juices-syrups', 'religious-pooja-items', 'cosmetics', 'beauty-personal-care', 'footwear', 'pickles', 'masale', 'fashion', 'jewellery', 'agriculture-seeds', 'auto-accessories', 'local-homemade-products', 'pooja-spiritual', 'gifts-handicrafts', 'baby-kids', 'oil', 'papad-kurdai', 'astro-stone', 'diwali-faral', 'electronics'].includes(slug);

  if (!isParent) {
    subcategories.push({ name, slug });
  }
}

// Add preset subcategories from categoryVisuals.ts
const presetSubcategories = [
  'furniture', 'kitchen-appliances', 'home-decor', 'lighting-lamps', 'lighting', 'cookware', 'storage-containers', 'dining-serveware', 'cleaning-essentials',
  'mango-pickles', 'lemon-lime-pickles', 'chilli-garlic-pickles', 'mixed-veg-pickles', 'non-veg-pickles', 'traditional-regional-pickles', 'traditional-pickles'
];

presetSubcategories.forEach(slug => {
  if (!subcategories.some(s => s.slug === slug)) {
    subcategories.push({ name: slug, slug });
  }
});

const imageDir = path.join(__dirname, '..', 'public', 'images', 'subcategories');
const legacyDir = path.join(__dirname, '..', 'public', 'categories');

let availableCount = 0;
let missingCount = 0;
const missingList = [];

subcategories.forEach(sub => {
  const jpgPath = path.join(imageDir, `${sub.slug}.jpg`);
  const svgPath = path.join(imageDir, `${sub.slug}.svg`);
  const webpPath = path.join(imageDir, `${sub.slug}.webp`);
  const legacyWebp = path.join(legacyDir, `${sub.slug}.webp`);
  const legacyJpg = path.join(legacyDir, `${sub.slug}.jpg`);

  const exists = fs.existsSync(jpgPath) || fs.existsSync(svgPath) || fs.existsSync(webpPath) || fs.existsSync(legacyWebp) || fs.existsSync(legacyJpg);

  if (exists) {
    availableCount++;
  } else {
    missingCount++;
    missingList.push(sub);
  }
});

console.log('====================================================');
console.log('AUTOMATIC SUBCATEGORY IMAGE COVERAGE REPORT');
console.log('====================================================');
console.log(`TOTAL SUBCATEGORIES: ${subcategories.length}`);
console.log(`IMAGES AVAILABLE:   ${availableCount}`);
console.log(`MISSING IMAGES:     ${missingCount}`);

if (missingCount > 0) {
  console.log('\nMissing Subcategories:');
  missingList.forEach(m => console.log(` - ${m.name} (${m.slug})`));
  process.exit(1);
} else {
  console.log('\nSUCCESS: 100% Subcategory Image Coverage Achieved! MISSING IMAGES = 0');
  process.exit(0);
}
