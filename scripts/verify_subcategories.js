const fs = require('fs');
const path = require('path');

// Extract categories and subcategories from CategorySeeder.php
const seederPath = path.join(__dirname, '..', '..', 'jss-marketplace-backend', 'database', 'seeders', 'CategorySeeder.php');
const seederContent = fs.readFileSync(seederPath, 'utf8');

const subcategoryRegex = /'name'\s*=>\s*\[\s*'en'\s*=>\s*'([^']+)'[^\]]*\],\s*'slug'\s*=>\s*'([^']+)'/g;

const subcategories = [];
let match;

while ((match = subcategoryRegex.exec(seederContent)) !== null) {
  // Only capture subcategories (has slug)
  if (match[2] && !match[2].includes('juices-syrups') && !match[2].includes('religious-pooja') && !match[2].includes('cosmetics') && !match[2].includes('beauty-personal-care')) {
    subcategories.push({ name: match[1], slug: match[2] });
  }
}

console.log(`Extracted subcategories: ${subcategories.length}`);
console.log(JSON.stringify(subcategories, null, 2));
