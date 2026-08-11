const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'images', 'subcategories');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Full database subcategories registry with custom visual styling (gradients, icons, colors)
const subcategoryAssets = [
  // ─── Juices & Syrups ───
  { slug: 'fruit-juices', title: 'Fruit Juices', color1: '#FF7E5F', color2: '#FEB47B', icon: '🥤', label: 'Fresh Juices' },
  { slug: 'herbal-syrups', title: 'Herbal Syrups', color1: '#11998E', color2: '#38EF7D', icon: '🌿', label: 'Ayurvedic Syrups' },
  { slug: 'concentrates-squashes', title: 'Concentrates & Squashes', color1: '#FF512F', color2: '#DD2476', icon: '🍹', label: 'Fruit Squashes' },
  { slug: 'ayurvedic-health-drinks', title: 'Ayurvedic Health Drinks', color1: '#56AB2F', color2: '#A8E063', icon: '🧴', label: 'Health Tonics' },
  { slug: 'energy-wellness-drinks', title: 'Energy & Wellness Drinks', color1: '#00C6FF', color2: '#0072FF', icon: '⚡', label: 'Energy Drinks' },
  { slug: 'organic-syrups', title: 'Organic Syrups', color1: '#F2994A', color2: '#F2C94C', icon: '🍯', label: 'Pure Syrups' },

  // ─── Religious & Pooja ───
  { slug: 'pooja-samagri-kits', title: 'Pooja Samagri Kits', color1: '#FF9966', color2: '#FF5E62', icon: '🪔', label: 'Complete Kits' },
  { slug: 'incense-sticks-dhoop', title: 'Incense Sticks & Dhoop', color1: '#8E2DE2', color2: '#4A00E0', icon: '🪔', label: 'Agarbatti & Dhoop' },
  { slug: 'diya-brass-oil-lamps', title: 'Diya & Brass Oil Lamps', color1: '#F7971E', color2: '#FFD200', icon: '🕯️', label: 'Brass Diyas' },
  { slug: 'camphor-kapur', title: 'Camphor & Kapur', color1: '#00B4DB', color2: '#0083B0', icon: '✨', label: 'Pure Kapur' },
  { slug: 'idol-statues-photo-frames', title: 'Idol Statues & Frames', color1: '#D4145A', color2: '#FBB03B', icon: '🕉️', label: 'Brass Idols' },
  { slug: 'hawan-samagri', title: 'Hawan Samagri', color1: '#E65C00', color2: '#F9D423', icon: '🔥', label: 'Sacred Herbs' },

  // ─── Cosmetics ───
  { slug: 'face-makeup-foundation', title: 'Face Makeup & Foundation', color1: '#FF758C', color2: '#FF7EB3', icon: '💄', label: 'Foundations' },
  { slug: 'lipsticks-lip-care', title: 'Lipsticks & Lip Care', color1: '#FF4E50', color2: '#F9D423', icon: '💋', label: 'Lipsticks' },
  { slug: 'eye-makeup-kajal', title: 'Eye Makeup & Kajal', color1: '#2C3E50', color2: '#4CA1AF', icon: '👁️', label: 'Kajal & Eyeliner' },
  { slug: 'nail-care-polish', title: 'Nail Care & Polish', color1: '#B92B27', color2: '#1565C0', icon: '💅', label: 'Nail Polish' },
  { slug: 'makeup-brushes-tools', title: 'Makeup Brushes & Tools', color1: '#EC6EAD', color2: '#3494E6', icon: '🖌️', label: 'Brushes' },
  { slug: 'organic-herbal-cosmetics', title: 'Organic & Herbal Cosmetics', color1: '#11998E', color2: '#38EF7D', icon: '🌱', label: 'Herbal Makeup' },

  // ─── Beauty & Personal Care ───
  { slug: 'skincare-moisturizers', title: 'Skincare & Moisturizers', color1: '#89F7FE', color2: '#66A6FF', icon: '🧴', label: 'Moisturizers' },
  { slug: 'hair-oils-shampoos', title: 'Hair Oils & Shampoos', color1: '#43E97B', color2: '#38F9D7', icon: '💆', label: 'Shampoos & Oils' },
  { slug: 'soaps-body-wash', title: 'Soaps & Body Wash', color1: '#FA709A', color2: '#FEE140', icon: '🧼', label: 'Body Care' },
  { slug: 'face-wash-cleansers', title: 'Face Wash & Cleansers', color1: '#4FB5E6', color2: '#00F2FE', icon: '🫧', label: 'Cleansers' },
  { slug: 'oral-care-toothpaste', title: 'Oral Care & Toothpaste', color1: '#43E97B', color2: '#38F9D7', icon: '🪥', label: 'Oral Care' },
  { slug: 'mens-grooming-shaving', title: 'Men\'s Grooming & Shaving', color1: '#200122', color2: '#6F0000', icon: '🪒', label: 'Shaving Kits' },

  // ─── Footwear ───
  { slug: 'mens-shoes', title: 'Men\'s Casual & Formal Shoes', color1: '#1F1C2C', color2: '#928DAB', icon: '👞', label: 'Men\'s Footwear' },
  { slug: 'womens-sandals-heels', title: 'Women\'s Sandals & Heels', color1: '#FF9A9E', color2: '#FECFEF', icon: '👠', label: 'Heels & Sandals' },
  { slug: 'ethnic-juttis-kolhapuris', title: 'Ethnic Juttis & Kolhapuris', color1: '#F7971E', color2: '#FFD200', icon: '🥿', label: 'Ethnic Juttis' },
  { slug: 'sports-running-shoes', title: 'Sports & Running Shoes', color1: '#00C6FF', color2: '#0072FF', icon: '👟', label: 'Sports Shoes' },
  { slug: 'kids-footwear', title: 'Kids Footwear', color1: '#FF758C', color2: '#FF7EB3', icon: '👟', label: 'Kids Shoes' },
  { slug: 'slippers-flip-flops', title: 'Slippers & Flip Flops', color1: '#F2994A', color2: '#F2C94C', icon: '🩴', label: 'Slippers' },

  // ─── Pickles ───
  { slug: 'mango-pickles', title: 'Mango Pickles (Aam Ka Achar)', color1: '#FF9900', color2: '#FF5500', icon: '🥭', label: 'Aam Ka Achar' },
  { slug: 'lemon-lime-pickles', title: 'Lemon & Lime Pickles', color1: '#FFE600', color2: '#FF8800', icon: '🍋', label: 'Nimbu Achar' },
  { slug: 'chilli-garlic-pickles', title: 'Chilli & Garlic Pickles', color1: '#DD0000', color2: '#880000', icon: '🌶️', label: 'Mirchi & Lahsun' },
  { slug: 'mixed-veg-pickles', title: 'Mixed Veg Pickles', color1: '#00AA44', color2: '#FF8800', icon: '🥗', label: 'Mixed Achar' },
  { slug: 'non-veg-pickles', title: 'Non-Veg Pickles', color1: '#AA2200', color2: '#550000', icon: '🍗', label: 'Non-Veg Achar' },
  { slug: 'traditional-regional-pickles', title: 'Traditional Regional Pickles', color1: '#CC5500', color2: '#772200', icon: '🫙', label: 'Regional Achar' },

  // ─── Masale ───
  { slug: 'whole-spices', title: 'Whole Spices (Khadya Masala)', color1: '#8E0E00', color2: '#1F1C1C', icon: '🧄', label: 'Whole Spices' },
  { slug: 'ground-spice-powders', title: 'Ground Spice Powders', color1: '#F857A6', color2: '#FF5858', icon: '🌶️', label: 'Powder Spices' },
  { slug: 'blended-garam-masala', title: 'Blended Garam Masala', color1: '#4776E6', color2: '#8E54E9', icon: '🥘', label: 'Garam Masala' },
  { slug: 'regional-curry-powders', title: 'Regional Curry Powders', color1: '#FF8008', color2: '#FFC837', icon: '🍲', label: 'Curry Powders' },
  { slug: 'organic-hand-pounded-spices', title: 'Organic Hand-Pounded Spices', color1: '#56AB2F', color2: '#A8E063', icon: '🌿', label: 'Organic Spices' },
  { slug: 'biryani-chole-masala', title: 'Biryani & Chole Masala', color1: '#EDDE5D', color2: '#F09819', icon: '🍛', label: 'Special Masale' },

  // ─── Fashion ───
  { slug: 'mens-wear', title: 'Men\'s Wear', color1: '#3A1C71', color2: '#D76D77', icon: '👔', label: 'Men\'s Apparel' },
  { slug: 'womens-wear', title: 'Women\'s Wear', color1: '#FF758C', color2: '#FF7EB3', icon: '👗', label: 'Women\'s Apparel' },
  { slug: 'ethnic-wear-sarees', title: 'Ethnic Wear & Sarees', color1: '#E94057', color2: '#F27121', icon: '🥻', label: 'Silk Sarees' },
  { slug: 'kids-wear', title: 'Kids Wear', color1: '#38EF7D', color2: '#11998E', icon: '👕', label: 'Kids Wear' },
  { slug: 'fashion-accessories', title: 'Fashion Accessories', color1: '#8E2DE2', color2: '#4A00E0', icon: '👜', label: 'Bags & Belts' },
  { slug: 'winter-seasonal-wear', title: 'Winter & Seasonal Wear', color1: '#00C6FF', color2: '#0072FF', icon: '🧥', label: 'Winterwear' },

  // ─── Jewellery ───
  { slug: 'gold-jewellery', title: 'Gold Jewellery', color1: '#FFD700', color2: '#FFA500', icon: '💍', label: 'Gold Jewelry' },
  { slug: 'silver-jewellery', title: 'Silver Jewellery', color1: '#E0E0E0', color2: '#9E9E9E', icon: '🥈', label: 'Silver Jewelry' },
  { slug: 'artificial-fashion-jewellery', title: 'Artificial & Fashion Jewellery', color1: '#F3A183', color2: '#EC6F66', icon: '💎', label: 'Fashion Jewelry' },
  { slug: 'bridal-jewellery-sets', title: 'Bridal Jewellery Sets', color1: '#ED213A', color2: '#93291E', icon: '👑', label: 'Bridal Sets' },
  { slug: 'temple-jewellery', title: 'Temple Jewellery', color1: '#F7971E', color2: '#FFD200', icon: '📿', label: 'Temple Jewelry' },
  { slug: 'gemstone-beaded-jewellery', title: 'Gemstone & Beaded Jewellery', color1: '#00B4DB', color2: '#0083B0', icon: '🔮', label: 'Gemstones' },

  // ─── Agriculture & Seeds ───
  { slug: 'high-yield-seeds', title: 'High Yield Seeds', color1: '#11998E', color2: '#38EF7D', icon: '🌱', label: 'Crop Seeds' },
  { slug: 'bio-fertilizers-compost', title: 'Bio Fertilizers & Compost', color1: '#56AB2F', color2: '#A8E063', icon: '🪴', label: 'Bio Compost' },
  { slug: 'organic-pesticides', title: 'Organic Pesticides', color1: '#2E7D32', color2: '#81C784', icon: '🛡️', label: 'Crop Protection' },
  { slug: 'farm-tools-equipment', title: 'Farm Hand Tools', color1: '#616161', color2: '#9E9E9E', icon: '🛠️', label: 'Farm Tools' },
  { slug: 'drip-irrigation-kits', title: 'Drip Irrigation Kits', color1: '#0288D1', color2: '#26C6DA', icon: '💧', label: 'Drip Kits' },
  { slug: 'plant-care-gardening', title: 'Plant Care & Gardening', color1: '#43A047', color2: '#C8E6C9', icon: '🏡', label: 'Gardening' },

  // ─── Auto Accessories ───
  { slug: 'car-cleaning-care', title: 'Car Cleaning & Care', color1: '#0288D1', color2: '#4FC3F7', icon: '🚗', label: 'Car Care' },
  { slug: 'helmet-riding-gear', title: 'Helmet & Riding Gear', color1: '#212121', color2: '#757575', icon: '🪖', label: 'Helmets' },
  { slug: 'car-seat-covers-mats', title: 'Car Seat Covers & Mats', color1: '#3E2723', color2: '#8D6E63', icon: '🪑', label: 'Seat Covers' },
  { slug: 'bike-accessories-covers', title: 'Bike Accessories & Covers', color1: '#C62828', color2: '#EF5350', icon: '🏍️', label: 'Bike Gear' },
  { slug: 'mobile-holders-chargers', title: 'Mobile Holders & Chargers', color1: '#1565C0', color2: '#64B5F6', icon: '📱', label: 'Auto Mounts' },
  { slug: 'automotive-led-lights', title: 'Automotive LED Lights', color1: '#F57F17', color2: '#FFF176', icon: '💡', label: 'LED Lights' },

  // ─── Local & Homemade ───
  { slug: 'handmade-snacks-khakhra', title: 'Handmade Snacks & Khakhra', color1: '#F57C00', color2: '#FFB74D', icon: '🫓', label: 'Khakhra & Snacks' },
  { slug: 'homemade-ghee-butter', title: 'Homemade Ghee & Butter', color1: '#FBC02D', color2: '#FFF59D', icon: '🧈', label: 'Pure Ghee' },
  { slug: 'artisan-craft-decor', title: 'Artisan Craft & Decor', color1: '#8E2DE2', color2: '#F00B51', icon: '🎨', label: 'Handicrafts' },
  { slug: 'handmade-soaps-candles', title: 'Handmade Soaps & Candles', color1: '#E91E63', color2: '#F48FB1', icon: '🕯️', label: 'Soaps & Candles' },
  { slug: 'homemade-jams-preserves', title: 'Homemade Jams & Preserves', color1: '#C2185B', color2: '#F06292', icon: '🫙', label: 'Fruit Jams' },
  { slug: 'traditional-sweets', title: 'Traditional Sweets', color1: '#FFA000', color2: '#FFD54F', icon: '🍬', label: 'Desi Sweets' },

  // ─── Pooja & Spiritual ───
  { slug: 'rudraksha-mala-beads', title: 'Rudraksha & Mala Beads', color1: '#4E342E', color2: '#A1887F', icon: '📿', label: 'Chanting Mala' },
  { slug: 'gemstones-yantras', title: 'Gemstones & Yantras', color1: '#7B1FA2', color2: '#BA68C8', icon: '✡️', label: 'Yantras' },
  { slug: 'spiritual-books-beads', title: 'Spiritual Books & Beads', color1: '#E65100', color2: '#FF9800', icon: '📖', label: 'Sacred Books' },
  { slug: 'temple-brass-bell-shankh', title: 'Temple Brass Bell & Shankh', color1: '#F57F17', color2: '#FBC02D', icon: '🔔', label: 'Brass Bell' },
  { slug: 'gangajal-holy-water', title: 'Gangajal & Holy Water', color1: '#0288D1', color2: '#81D4FA', icon: '🪔', label: 'Gangajal' },
  { slug: 'pooja-thali-sets', title: 'Pooja Thali Sets', color1: '#FF8F00', color2: '#FFC107', icon: '🍽️', label: 'Pooja Thali' },

  // ─── Gifts & Handicrafts ───
  { slug: 'wooden-handicrafts', title: 'Wooden Handicrafts', color1: '#5D4037', color2: '#8D6E63', icon: '🪵', label: 'Wooden Craft' },
  { slug: 'marble-brass-idols', title: 'Marble & Brass Idols', color1: '#455A64', color2: '#90A4AE', icon: '🏛️', label: 'Marble Idols' },
  { slug: 'festival-gift-hampers', title: 'Festival Gift Hampers', color1: '#D81B60', color2: '#F48FB1', icon: '🎁', label: 'Gift Hampers' },
  { slug: 'customized-photo-gifts', title: 'Customized Photo Gifts', color1: '#1976D2', color2: '#64B5F6', icon: '🖼️', label: 'Photo Gifts' },
  { slug: 'traditional-terracotta-pottery', title: 'Terracotta Pottery', color1: '#D84315', color2: '#FF8A65', icon: '🏺', label: 'Clay Pottery' },
  { slug: 'corporate-executive-gifts', title: 'Corporate Executive Gifts', color1: '#37474F', color2: '#78909C', icon: '💼', label: 'Corporate Gifts' },

  // ─── Baby & Kids ───
  { slug: 'baby-clothing-onesies', title: 'Baby Clothing & Onesies', color1: '#EC407A', color2: '#F48FB1', icon: '👶', label: 'Baby Clothes' },
  { slug: 'diapers-baby-wipes', title: 'Diapers & Baby Wipes', color1: '#00ACC1', color2: '#80DEEA', icon: '🍼', label: 'Diapers & Wipes' },
  { slug: 'baby-bath-skin-care', title: 'Baby Bath & Skin Care', color1: '#26A69A', color2: '#80CBC4', icon: '🛁', label: 'Baby Skincare' },
  { slug: 'toys-educational-games', title: 'Toys & Educational Games', color1: '#FF7043', color2: '#FFAB91', icon: '🧸', label: 'Toys & Games' },
  { slug: 'baby-feeding-bottles', title: 'Baby Feeding & Bottles', color1: '#AB47BC', color2: '#CE93D8', icon: '🍼', label: 'Feeding Bottles' },
  { slug: 'strollers-baby-gear', title: 'Strollers & Baby Gear', color1: '#5C6BC0', color2: '#9FA8DA', icon: '🛒', label: 'Baby Strollers' },

  // ─── Oil ───
  { slug: 'cold-pressed-groundnut-oil', title: 'Groundnut Oil', color1: '#F57F17', color2: '#FFF59D', icon: '🥜', label: 'Groundnut Oil' },
  { slug: 'pure-mustard-oil', title: 'Pure Mustard Oil', color1: '#FBC02D', color2: '#FFF9C4', icon: '🌼', label: 'Sarson Oil' },
  { slug: 'sesame-til-oil', title: 'Sesame & Til Oil', color1: '#AFB42B', color2: '#F0F4C3', icon: '🌱', label: 'Til Oil' },
  { slug: 'virgin-coconut-oil', title: 'Virgin Coconut Oil', color1: '#009688', color2: '#E0F2F1', icon: '🥥', label: 'Coconut Oil' },
  { slug: 'sunflower-rice-bran-oil', title: 'Sunflower Oil', color1: '#FFB300', color2: '#FFE082', icon: '🌻', label: 'Sunflower Oil' },
  { slug: 'ayurvedic-massage-oils', title: 'Ayurvedic Massage Oils', color1: '#689F38', color2: '#DCEDC8', icon: '🪔', label: 'Massage Oil' },

  // ─── Papad & Kurdai ───
  { slug: 'udad-dal-papad', title: 'Udad Dal Papad', color1: '#F57C00', color2: '#FFE0B2', icon: '🫓', label: 'Udad Papad' },
  { slug: 'moong-dal-papad', title: 'Moong Dal Papad', color1: '#689F38', color2: '#DCEDC8', icon: '🫓', label: 'Moong Papad' },
  { slug: 'traditional-wheat-kurdai', title: 'Traditional Wheat Kurdai', color1: '#E65100', color2: '#FFCC80', icon: '🍥', label: 'Wheat Kurdai' },
  { slug: 'rice-papad-chawal-wafers', title: 'Rice Papad & Wafers', color1: '#757575', color2: '#E0E0E0', icon: '🍚', label: 'Rice Wafers' },
  { slug: 'sabudana-potato-wafers', title: 'Sabudana Wafers', color1: '#FBC02D', color2: '#FFF9C4', icon: '🥔', label: 'Sabudana Wafers' },
  { slug: 'spicy-masala-papad', title: 'Spicy Masala Papad', color1: '#D32F2F', color2: '#FFCDD2', icon: '🌶️', label: 'Masala Papad' },

  // ─── Astro Stone ───
  { slug: 'yellow-sapphire-pukhraj', title: 'Yellow Sapphire (Pukhraj)', color1: '#FBC02D', color2: '#FFF59D', icon: '💎', label: 'Pukhraj' },
  { slug: 'blue-sapphire-neelam', title: 'Blue Sapphire (Neelam)', color1: '#1976D2', color2: '#BBDEFB', icon: '🔷', label: 'Neelam' },
  { slug: 'emerald-panna', title: 'Emerald (Panna)', color1: '#388E3C', color2: '#C8E6C9', icon: '🟢', label: 'Panna' },
  { slug: 'ruby-manik', title: 'Ruby (Manik)', color1: '#D32F2F', color2: '#FFCDD2', icon: '♦️', label: 'Manik Ruby' },
  { slug: 'red-coral-moonga', title: 'Red Coral (Moonga)', color1: '#E64A19', color2: '#FFCCBC', icon: '🔴', label: 'Moonga' },
  { slug: 'pearl-moti-rings', title: 'Pearl (Moti) Rings', color1: '#78909C', color2: '#CFD8DC', icon: '⚪', label: 'Moti Rings' },

  // ─── Diwali Faral ───
  { slug: 'crunchy-chakli-chivda', title: 'Crunchy Chakli & Chivda', color1: '#F57C00', color2: '#FFE0B2', icon: '🥨', label: 'Chakli & Chivda' },
  { slug: 'sweet-karanji-anarse', title: 'Sweet Karanji & Anarse', color1: '#E65100', color2: '#FFCC80', icon: '🥟', label: 'Karanji & Anarse' },
  { slug: 'besan-rava-ladoo', title: 'Besan & Rava Ladoo', color1: '#FBC02D', color2: '#FFF9C4', icon: '🧆', label: 'Besan Ladoo' },
  { slug: 'shankarpali-kadboli', title: 'Shankarpali & Kadboli', color1: '#795548', color2: '#D7CCC8', icon: '🍪', label: 'Shankarpali' },
  { slug: 'dry-fruit-faral-mix', title: 'Dry Fruit Faral Mix', color1: '#5D4037', color2: '#BCAAA4', icon: '🥜', label: 'Dry Fruit Mix' },
  { slug: 'traditional-faral-hampers', title: 'Faral Gift Hampers', color1: '#C2185B', color2: '#F8BBD0', icon: '🎁', label: 'Faral Hamper' },

  // ─── Electronics ───
  { slug: 'smartphones-mobiles', title: 'Smartphones & Mobiles', color1: '#1976D2', color2: '#90CAF9', icon: '📱', label: 'Smartphones' },
  { slug: 'laptops-computers', title: 'Laptops & Computers', color1: '#37474F', color2: '#B0BEC5', icon: '💻', label: 'Laptops' },
  { slug: 'smart-watches-fitness-bands', title: 'Smart Watches', color1: '#00796B', color2: '#80CBC4', icon: '⌚', label: 'Smartwatches' },
  { slug: 'bluetooth-speakers-audio', title: 'Bluetooth Speakers', color1: '#5E35B1', color2: '#B39DDB', icon: '🔊', label: 'Speakers' },
  { slug: 'power-banks-cables', title: 'Power Banks & Cables', color1: '#E53935', color2: '#FFCDD2', icon: '🔋', label: 'Power Banks' },
  { slug: 'home-electronic-appliances', title: 'Home Electronics', color1: '#0288D1', color2: '#81D4FA', icon: '📺', label: 'Appliances' },
];

function generateSVG(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.color1}" />
      <stop offset="100%" stop-color="${item.color2}" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.15" />
    </filter>
  </defs>
  <rect width="320" height="240" rx="16" fill="url(#grad)" />
  <circle cx="160" cy="100" r="54" fill="#FFFFFF" fill-opacity="0.25" />
  <circle cx="160" cy="100" r="44" fill="#FFFFFF" filter="url(#shadow)" />
  <text x="160" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" text-anchor="middle">${item.icon}</text>
  <rect x="20" y="172" width="280" height="48" rx="12" fill="#FFFFFF" fill-opacity="0.95" filter="url(#shadow)" />
  <text x="160" y="201" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#1E293B" text-anchor="middle">${item.label}</text>
</svg>`;
}

let generatedCount = 0;

subcategoryAssets.forEach((item) => {
  const svgContent = generateSVG(item);
  const filePath = path.join(outputDir, `${item.slug}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  generatedCount++;
});

console.log(`Successfully generated ${generatedCount} distinct subcategory image assets in public/images/subcategories/`);
