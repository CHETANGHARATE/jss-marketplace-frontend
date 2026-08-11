const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'images', 'subcategories');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Master list of all subcategories across 20 categories with custom color palettes & badges
const subcategoryDefinitions = [
  // ─── 1. Home & Kitchen ───
  { slug: 'furniture', aliases: ['furnitures', 'sofas', 'beds'], label: 'Furniture & Living', color1: '#0F2027', color2: '#2C5364', accent: '#00D2FF', icon: '🛋️' },
  { slug: 'kitchen-appliances', aliases: ['appliances', 'mixers', 'blenders'], label: 'Kitchen Appliances', color1: '#D31027', color2: '#EA384D', accent: '#FFD700', icon: '📺' },
  { slug: 'home-decor', aliases: ['decor', 'wall-art'], label: 'Home Decor & Arts', color1: '#4A00E0', color2: '#8E2DE2', accent: '#00F2FE', icon: '✨' },
  { slug: 'lighting-lamps', aliases: ['lighting', 'lamps', 'pendant-lights'], label: 'Lighting & Lamps', color1: '#F7971E', color2: '#FFD200', accent: '#FFFFFF', icon: '💡' },
  { slug: 'cookware', aliases: ['cookware-pots', 'pots-pans'], label: 'Cookware & Pots', color1: '#B92B27', color2: '#1565C0', accent: '#FFD700', icon: '🥘' },
  { slug: 'storage-containers', aliases: ['containers', 'boxes'], label: 'Storage & Containers', color1: '#11998E', color2: '#38EF7D', accent: '#FFFFFF', icon: '📦' },
  { slug: 'dining-serveware', aliases: ['serveware', 'dining'], label: 'Dining & Serveware', color1: '#00B4DB', color2: '#0083B0', accent: '#FFD700', icon: '🍽️' },
  { slug: 'cleaning-essentials', aliases: ['mops-brooms', 'cleaning'], label: 'Cleaning Essentials', color1: '#1A2980', color2: '#26D0CE', accent: '#FFFFFF', icon: '🧹' },

  // ─── 2. Agriculture & Seeds ───
  { slug: 'high-yield-seeds', aliases: ['organic-seeds', 'seeds', 'high-yield-seeds'], label: 'Hybrid & Organic Seeds', color1: '#134E5E', color2: '#71B280', accent: '#A8E063', icon: '🌱' },
  { slug: 'bio-fertilizers-compost', aliases: ['fertilizers-soil-boosters', 'fertilizers', 'bio-fertilizers'], label: 'Bio Fertilizers & Compost', color1: '#3A7BD5', color2: '#3A6073', accent: '#38EF7D', icon: '🪴' },
  { slug: 'organic-pesticides', aliases: ['crop-protection', 'pesticides'], label: 'Organic Crop Defense', color1: '#1E3C72', color2: '#2A5298', accent: '#00F2FE', icon: '🛡️' },
  { slug: 'farm-tools-equipment', aliases: ['irrigation-tools', 'farm-tools', 'tools', 'garden-tools', 'farm-tools-equipment'], label: 'Farm Hand Tools', color1: '#434343', color2: '#000000', accent: '#FFD700', icon: '🛠️' },
  { slug: 'drip-irrigation-kits', aliases: ['irrigation-kits', 'drip-irrigation', 'drip-irrigation-kits'], label: 'Drip Irrigation Kits', color1: '#0F2027', color2: '#203A43', accent: '#00D2FF', icon: '💧' },
  { slug: 'plant-care-gardening', aliases: ['gardening', 'plant-care', 'plant-care-gardening'], label: 'Plant Care & Garden', color1: '#11998E', color2: '#38EF7D', accent: '#FFFFFF', icon: '🏡' },

  // ─── 3. Religious & Pooja ───
  { slug: 'pooja-samagri-kits', aliases: ['pooja-kits', 'samagri-kits'], label: 'Pooja Samagri Kits', color1: '#FF416C', color2: '#FF4B2B', accent: '#FFD700', icon: '🪔' },
  { slug: 'incense-sticks-dhoop', aliases: ['agarbatti', 'dhoop-sticks', 'incense-sticks'], label: 'Agarbatti & Dhoop', color1: '#4A00E0', color2: '#8E2DE2', accent: '#FFD700', icon: '🪔' },
  { slug: 'diya-brass-oil-lamps', aliases: ['brass-diyas', 'oil-lamps', 'diyas-lamps'], label: 'Diya & Brass Lamps', color1: '#F7971E', color2: '#FFD200', accent: '#FFFFFF', icon: '🕯️' },
  { slug: 'camphor-kapur', aliases: ['kapur', 'camphor-tablets'], label: 'Pure Camphor Kapur', color1: '#00B4DB', color2: '#0083B0', accent: '#FFFFFF', icon: '✨' },
  { slug: 'idol-statues-photo-frames', aliases: ['god-idols', 'brass-idols'], label: 'Devotional Idols', color1: '#D4145A', color2: '#FBB03B', accent: '#FFD700', icon: '🕉️' },
  { slug: 'hawan-samagri', aliases: ['havan-mix', 'sacred-fire'], label: 'Hawan Samagri', color1: '#E65C00', color2: '#F9D423', accent: '#FFFFFF', icon: '🔥' },

  // ─── 4. Juices & Syrups ───
  { slug: 'fruit-juices', aliases: ['fresh-juices'], label: 'Fresh Fruit Juices', color1: '#FF512F', color2: '#DD2476', accent: '#FFD700', icon: '🥤' },
  { slug: 'herbal-syrups', aliases: ['ayurvedic-syrups'], label: 'Ayurvedic Syrups', color1: '#11998E', color2: '#38EF7D', accent: '#FFFFFF', icon: '🌿' },
  { slug: 'concentrates-squashes', aliases: ['squash', 'sharbat', 'concentrates', 'cold-pressed'], label: 'Fruit Squashes', color1: '#FF8008', color2: '#FFC837', accent: '#FFFFFF', icon: '🍹' },
  { slug: 'ayurvedic-health-drinks', aliases: ['health-tonics'], label: 'Ayurvedic Health Tonics', color1: '#56AB2F', color2: '#A8E063', accent: '#FFFFFF', icon: '🧴' },
  { slug: 'energy-wellness-drinks', aliases: ['energy-drinks'], label: 'Energy Drinks', color1: '#00C6FF', color2: '#0072FF', accent: '#FFD700', icon: '⚡' },
  { slug: 'organic-syrups', aliases: ['natural-syrups'], label: 'Organic Syrups', color1: '#F2994A', color2: '#F2C94C', accent: '#FFFFFF', icon: '🍯' },

  // ─── 5. Cosmetics & Beauty ───
  { slug: 'face-makeup-foundation', aliases: ['foundation', 'face-makeup'], label: 'Face Makeup & Foundation', color1: '#EC6EAD', color2: '#3494E6', accent: '#FFFFFF', icon: '💄' },
  { slug: 'lipsticks-lip-care', aliases: ['lipsticks', 'lip-balm'], label: 'Lipsticks & Lip Care', color1: '#FF4E50', color2: '#F9D423', accent: '#FFFFFF', icon: '💋' },
  { slug: 'eye-makeup-kajal', aliases: ['kajal', 'mascara'], label: 'Eye Makeup & Kajal', color1: '#2C3E50', color2: '#4CA1AF', accent: '#00F2FE', icon: '👁️' },
  { slug: 'nail-care-polish', aliases: ['nail-polish'], label: 'Nail Care & Polish', color1: '#B92B27', color2: '#1565C0', accent: '#FFD700', icon: '💅' },
  { slug: 'makeup-brushes-tools', aliases: ['makeup-tools'], label: 'Brushes & Tools', color1: '#8E2DE2', color2: '#4A00E0', accent: '#FFFFFF', icon: '🖌️' },
  { slug: 'organic-herbal-cosmetics', aliases: ['herbal-makeup'], label: 'Herbal Cosmetics', color1: '#11998E', color2: '#38EF7D', accent: '#FFFFFF', icon: '🌱' },

  // ─── 6. Beauty & Personal Care ───
  { slug: 'skincare-moisturizers', aliases: ['skincare', 'face-cream'], label: 'Skincare & Creams', color1: '#89F7FE', color2: '#66A6FF', accent: '#FFFFFF', icon: '🧴' },
  { slug: 'hair-oils-shampoos', aliases: ['shampoos', 'hair-oils', 'haircare'], label: 'Shampoos & Hair Oils', color1: '#43E97B', color2: '#38F9D7', accent: '#FFFFFF', icon: '💆' },
  { slug: 'soaps-body-wash', aliases: ['soaps', 'body-wash'], label: 'Soaps & Body Wash', color1: '#FA709A', color2: '#FEE140', accent: '#FFFFFF', icon: '🧼' },
  { slug: 'face-wash-cleansers', aliases: ['face-wash', 'cleansers'], label: 'Face Wash & Cleansers', color1: '#4FB5E6', color2: '#00F2FE', accent: '#FFFFFF', icon: '🫧' },
  { slug: 'oral-care-toothpaste', aliases: ['toothpaste', 'oral-care'], label: 'Oral Care & Paste', color1: '#00C6FF', color2: '#0072FF', accent: '#FFFFFF', icon: '🪥' },
  { slug: 'mens-grooming-shaving', aliases: ['shaving-kit', 'grooming', 'personal-care', 'makeup'], label: 'Men\'s Grooming', color1: '#200122', color2: '#6F0000', accent: '#FFD700', icon: '🪒' },

  // ─── 7. Footwear ───
  { slug: 'mens-shoes', aliases: ['casual-shoes', 'formal-shoes', 'mens-footwear'], label: 'Men\'s Formal & Casual', color1: '#1F1C2C', color2: '#928DAB', accent: '#FFD700', icon: '👞' },
  { slug: 'womens-sandals-heels', aliases: ['heels', 'sandals', 'womens-footwear'], label: 'Women\'s Heels & Sandals', color1: '#FF9A9E', color2: '#FECFEF', accent: '#FFFFFF', icon: '👠' },
  { slug: 'ethnic-juttis-kolhapuris', aliases: ['juttis', 'kolhapuri', 'traditional-mojaris'], label: 'Ethnic Juttis & Mojaris', color1: '#F7971E', color2: '#FFD200', accent: '#FFFFFF', icon: '🥿' },
  { slug: 'sports-running-shoes', aliases: ['running-shoes', 'sneakers', 'sports-shoes'], label: 'Sports & Sneakers', color1: '#00C6FF', color2: '#0072FF', accent: '#FFD700', icon: '👟' },
  { slug: 'kids-footwear', aliases: ['kids-shoes'], label: 'Kids Footwear', color1: '#FF758C', color2: '#FF7EB3', accent: '#FFFFFF', icon: '👟' },
  { slug: 'slippers-flip-flops', aliases: ['flip-flops', 'chappals'], label: 'Slippers & Slides', color1: '#F2994A', color2: '#F2C94C', accent: '#FFFFFF', icon: '🩴' },

  // ─── 8. Pickles ───
  { slug: 'mango-pickles', aliases: ['aam-achar'], label: 'Mango Achar (Aam)', color1: '#FF9900', color2: '#FF5500', accent: '#FFD700', icon: '🥭' },
  { slug: 'lemon-lime-pickles', aliases: ['nimbu-achar'], label: 'Lemon & Lime Achar', color1: '#FFE600', color2: '#FF8800', accent: '#FFFFFF', icon: '🍋' },
  { slug: 'chilli-garlic-pickles', aliases: ['mirchi-achar'], label: 'Chilli & Garlic Achar', color1: '#DD0000', color2: '#880000', accent: '#FFD700', icon: '🌶️' },
  { slug: 'mixed-veg-pickles', aliases: ['mixed-achar'], label: 'Mixed Veg Achar', color1: '#00AA44', color2: '#FF8800', accent: '#FFFFFF', icon: '🥗' },
  { slug: 'non-veg-pickles', aliases: ['chicken-pickle'], label: 'Non-Veg Achar', color1: '#AA2200', color2: '#550000', accent: '#FFD700', icon: '🍗' },
  { slug: 'traditional-regional-pickles', aliases: ['traditional-pickles'], label: 'Regional Pickles', color1: '#CC5500', color2: '#772200', accent: '#FFD700', icon: '🫙' },

  // ─── 9. Masale ───
  { slug: 'whole-spices', aliases: ['khadya-masala'], label: 'Whole Spices (Khadya)', color1: '#8E0E00', color2: '#1F1C1C', accent: '#FFD700', icon: '🧄' },
  { slug: 'ground-spice-powders', aliases: ['spice-powders'], label: 'Ground Spice Powders', color1: '#F857A6', color2: '#FF5858', accent: '#FFFFFF', icon: '🌶️' },
  { slug: 'blended-garam-masala', aliases: ['garam-masala', 'blended-masalas'], label: 'Blended Garam Masala', color1: '#4776E6', color2: '#8E54E9', accent: '#FFD700', icon: '🥘' },
  { slug: 'regional-curry-powders', aliases: ['curry-powder'], label: 'Regional Curry Powders', color1: '#FF8008', color2: '#FFC837', accent: '#FFFFFF', icon: '🍲' },
  { slug: 'organic-hand-pounded-spices', aliases: ['hand-pounded'], label: 'Hand-Pounded Spices', color1: '#56AB2F', color2: '#A8E063', accent: '#FFFFFF', icon: '🌿' },
  { slug: 'biryani-chole-masala', aliases: ['biryani-masala'], label: 'Biryani & Chole Masala', color1: '#EDDE5D', color2: '#F09819', accent: '#FFFFFF', icon: '🍛' },

  // ─── 10. Fashion ───
  { slug: 'mens-wear', aliases: ['mens-clothing', 'mens-fashion'], label: 'Men\'s Apparel', color1: '#3A1C71', color2: '#D76D77', accent: '#00F2FE', icon: '👔' },
  { slug: 'womens-wear', aliases: ['womens-clothing', 'womens-fashion'], label: 'Women\'s Apparel', color1: '#FF758C', color2: '#FF7EB3', accent: '#FFFFFF', icon: '👗' },
  { slug: 'ethnic-wear-sarees', aliases: ['sarees', 'kurtis'], label: 'Ethnic Sarees & Kurtis', color1: '#E94057', color2: '#F27121', accent: '#FFD700', icon: '🥻' },
  { slug: 'kids-wear', aliases: ['kids-clothing', 'kids-fashion'], label: 'Kids Wear', color1: '#38EF7D', color2: '#11998E', accent: '#FFFFFF', icon: '👕' },
  { slug: 'fashion-accessories', aliases: ['handbags', 'belts'], label: 'Bags & Accessories', color1: '#8E2DE2', color2: '#4A00E0', accent: '#FFD700', icon: '👜' },
  { slug: 'winter-seasonal-wear', aliases: ['jackets', 'sweaters', 'winterwear'], label: 'Winterwear & Jackets', color1: '#00C6FF', color2: '#0072FF', accent: '#FFFFFF', icon: '🧥' },

  // ─── 11. Jewellery ───
  { slug: 'gold-jewellery', aliases: ['gold-necklace', 'necklaces'], label: 'Gold Jewellery', color1: '#BF953F', color2: '#AA771C', accent: '#FCF6BA', icon: '💍' },
  { slug: 'silver-jewellery', aliases: ['silver-anklet', 'silver-earrings'], label: 'Silver Jewellery', color1: '#8E9EAB', color2: '#EEF2F3', accent: '#FFFFFF', icon: '🥈' },
  { slug: 'artificial-fashion-jewellery', aliases: ['fashion-jewelry'], label: 'Fashion Jewellery', color1: '#F3A183', color2: '#EC6F66', accent: '#FFFFFF', icon: '💎' },
  { slug: 'bridal-jewellery-sets', aliases: ['bridal-sets'], label: 'Bridal Sets', color1: '#ED213A', color2: '#93291E', accent: '#FFD700', icon: '👑' },
  { slug: 'temple-jewellery', aliases: ['temple-design'], label: 'Temple Jewellery', color1: '#F7971E', color2: '#FFD200', accent: '#FFFFFF', icon: '📿' },
  { slug: 'gemstone-beaded-jewellery', aliases: ['gemstone-jewelry', 'bangles-bracelets'], label: 'Gemstone Jewellery', color1: '#00B4DB', color2: '#0083B0', accent: '#FFD700', icon: '🔮' },

  // ─── 12. Auto Accessories ───
  { slug: 'car-cleaning-care', aliases: ['car-shampoo', 'car-care'], label: 'Car Cleaning & Care', color1: '#0288D1', color2: '#4FC3F7', accent: '#FFFFFF', icon: '🚗' },
  { slug: 'helmet-riding-gear', aliases: ['helmets', 'helmets-gear'], label: 'Helmets & Gear', color1: '#212121', color2: '#757575', accent: '#FFD700', icon: '🪖' },
  { slug: 'car-seat-covers-mats', aliases: ['seat-covers'], label: 'Car Seat Covers', color1: '#3E2723', color2: '#8D6E63', accent: '#FFFFFF', icon: '🪑' },
  { slug: 'bike-accessories-covers', aliases: ['bike-covers'], label: 'Bike Accessories', color1: '#C62828', color2: '#EF5350', accent: '#FFD700', icon: '🏍️' },
  { slug: 'mobile-holders-chargers', aliases: ['car-charger', 'auto-gadgets'], label: 'Mobile Holders & Mounts', color1: '#1565C0', color2: '#64B5F6', accent: '#FFFFFF', icon: '📱' },
  { slug: 'automotive-led-lights', aliases: ['led-headlights'], label: 'Automotive LED Lights', color1: '#F57F17', color2: '#FFF176', accent: '#000000', icon: '💡' },

  // ─── 13. Local & Homemade ───
  { slug: 'handmade-snacks-khakhra', aliases: ['khakhra'], label: 'Handmade Khakhra', color1: '#F57C00', color2: '#FFB74D', accent: '#FFFFFF', icon: '🫓' },
  { slug: 'homemade-ghee-butter', aliases: ['desi-ghee', 'homemade-ghee'], label: 'Pure Desi Ghee', color1: '#FBC02D', color2: '#FFF59D', accent: '#000000', icon: '🧈' },
  { slug: 'artisan-craft-decor', aliases: ['handicrafts'], label: 'Artisan Handicrafts', color1: '#8E2DE2', color2: '#F00B51', accent: '#FFD700', icon: '🎨' },
  { slug: 'handmade-soaps-candles', aliases: ['soaps-candles'], label: 'Handmade Soaps', color1: '#E91E63', color2: '#F48FB1', accent: '#FFFFFF', icon: '🕯️' },
  { slug: 'homemade-jams-preserves', aliases: ['fruit-jam'], label: 'Homemade Jams', color1: '#C2185B', color2: '#F06292', accent: '#FFFFFF', icon: '🫙' },
  { slug: 'traditional-sweets', aliases: ['kaju-katli', 'ladoo', 'sweets-snacks'], label: 'Traditional Sweets', color1: '#FFA000', color2: '#FFD54F', accent: '#000000', icon: '🍬' },

  // ─── 14. Pooja & Spiritual ───
  { slug: 'rudraksha-mala-beads', aliases: ['rudraksha'], label: 'Rudraksha Mala Beads', color1: '#4E342E', color2: '#A1887F', accent: '#FFD700', icon: '📿' },
  { slug: 'gemstones-yantras', aliases: ['sri-yantra'], label: 'Gemstones & Yantras', color1: '#7B1FA2', color2: '#BA68C8', accent: '#FFD700', icon: '✡️' },
  { slug: 'spiritual-books-beads', aliases: ['bhagavad-gita'], label: 'Sacred Books & Mala', color1: '#E65100', color2: '#FF9800', accent: '#FFFFFF', icon: '📖' },
  { slug: 'temple-brass-bell-shankh', aliases: ['brass-bell', 'shankh'], label: 'Temple Brass Bell', color1: '#F57F17', color2: '#FBC02D', accent: '#000000', icon: '🔔' },
  { slug: 'gangajal-holy-water', aliases: ['gangajal'], label: 'Pure Gangajal Water', color1: '#0288D1', color2: '#81D4FA', accent: '#FFFFFF', icon: '🪔' },
  { slug: 'pooja-thali-sets', aliases: ['thali-sets'], label: 'Pooja Thali Sets', color1: '#FF8F00', color2: '#FFC107', accent: '#000000', icon: '🍽️' },

  // ─── 15. Gifts & Handicrafts ───
  { slug: 'wooden-handicrafts', aliases: ['wooden-craft'], label: 'Wooden Handicrafts', color1: '#5D4037', color2: '#8D6E63', accent: '#FFD700', icon: '🪵' },
  { slug: 'marble-brass-idols', aliases: ['marble-idols'], label: 'Marble & Brass Idols', color1: '#455A64', color2: '#90A4AE', accent: '#FFD700', icon: '🏛️' },
  { slug: 'festival-gift-hampers', aliases: ['gift-hampers'], label: 'Festival Gift Hampers', color1: '#D81B60', color2: '#F48FB1', accent: '#FFFFFF', icon: '🎁' },
  { slug: 'customized-photo-gifts', aliases: ['photo-gifts'], label: 'Customized Photo Gifts', color1: '#1976D2', color2: '#64B5F6', accent: '#FFFFFF', icon: '🖼️' },
  { slug: 'traditional-terracotta-pottery', aliases: ['terracotta-pots'], label: 'Terracotta Pottery', color1: '#D84315', color2: '#FF8A65', accent: '#FFFFFF', icon: '🏺' },
  { slug: 'corporate-executive-gifts', aliases: ['corporate-gifts'], label: 'Corporate Gifts', color1: '#37474F', color2: '#78909C', accent: '#FFD700', icon: '💼' },

  // ─── 16. Baby & Kids ───
  { slug: 'baby-clothing-onesies', aliases: ['baby-rompers'], label: 'Baby Onesies & Clothes', color1: '#EC407A', color2: '#F48FB1', accent: '#FFFFFF', icon: '👶' },
  { slug: 'diapers-baby-wipes', aliases: ['baby-wipes'], label: 'Diapers & Baby Wipes', color1: '#00ACC1', color2: '#80DEEA', accent: '#FFFFFF', icon: '🍼' },
  { slug: 'baby-bath-skin-care', aliases: ['baby-lotion'], label: 'Baby Bath & Skincare', color1: '#26A69A', color2: '#80CBC4', accent: '#FFFFFF', icon: '🛁' },
  { slug: 'toys-educational-games', aliases: ['wooden-toys'], label: 'Toys & Educational Games', color1: '#FF7043', color2: '#FFAB91', accent: '#FFFFFF', icon: '🧸' },
  { slug: 'baby-feeding-bottles', aliases: ['feeding-bottles'], label: 'Feeding Bottles & Gear', color1: '#AB47BC', color2: '#CE93D8', accent: '#FFFFFF', icon: '🍼' },
  { slug: 'strollers-baby-gear', aliases: ['baby-strollers'], label: 'Baby Strollers & Gear', color1: '#5C6BC0', color2: '#9FA8DA', accent: '#FFFFFF', icon: '🛒' },

  // ─── 17. Oil ───
  { slug: 'cold-pressed-groundnut-oil', aliases: ['groundnut-oil'], label: 'Groundnut Oil', color1: '#F57F17', color2: '#FFF59D', accent: '#000000', icon: '🥜' },
  { slug: 'pure-mustard-oil', aliases: ['mustard-oil', 'sarson-oil'], label: 'Sarson Mustard Oil', color1: '#FBC02D', color2: '#FFF9C4', accent: '#000000', icon: '🌼' },
  { slug: 'sesame-til-oil', aliases: ['til-oil'], label: 'Sesame & Til Oil', color1: '#AFB42B', color2: '#F0F4C3', accent: '#000000', icon: '🌱' },
  { slug: 'virgin-coconut-oil', aliases: ['coconut-oil'], label: 'Virgin Coconut Oil', color1: '#009688', color2: '#E0F2F1', accent: '#000000', icon: '🥥' },
  { slug: 'sunflower-rice-bran-oil', aliases: ['sunflower-oil'], label: 'Sunflower Oil', color1: '#FFB300', color2: '#FFE082', accent: '#000000', icon: '🌻' },
  { slug: 'ayurvedic-massage-oils', aliases: ['massage-oil'], label: 'Ayurvedic Massage Oil', color1: '#689F38', color2: '#DCEDC8', accent: '#000000', icon: '🪔' },

  // ─── 18. Papad & Kurdai ───
  { slug: 'udad-dal-papad', aliases: ['udad-papad'], label: 'Udad Dal Papad', color1: '#F57C00', color2: '#FFE0B2', accent: '#000000', icon: '🫓' },
  { slug: 'moong-dal-papad', aliases: ['moong-papad'], label: 'Moong Dal Papad', color1: '#689F38', color2: '#DCEDC8', accent: '#000000', icon: '🫓' },
  { slug: 'traditional-wheat-kurdai', aliases: ['wheat-kurdai', 'papads-kurdai'], label: 'Wheat Kurdai', color1: '#E65100', color2: '#FFCC80', accent: '#000000', icon: '🍥' },
  { slug: 'rice-papad-chawal-wafers', aliases: ['rice-wafers'], label: 'Rice Papad & Wafers', color1: '#757575', color2: '#E0E0E0', accent: '#000000', icon: '🍚' },
  { slug: 'sabudana-potato-wafers', aliases: ['sabudana-wafers'], label: 'Sabudana Wafers', color1: '#FBC02D', color2: '#FFF9C4', accent: '#000000', icon: '🥔' },
  { slug: 'spicy-masala-papad', aliases: ['masala-papad'], label: 'Spicy Masala Papad', color1: '#D32F2F', color2: '#FFCDD2', accent: '#000000', icon: '🌶️' },

  // ─── 19. Astro Stone ───
  { slug: 'yellow-sapphire-pukhraj', aliases: ['pukhraj'], label: 'Yellow Sapphire Pukhraj', color1: '#FBC02D', color2: '#FFF59D', accent: '#000000', icon: '💎' },
  { slug: 'blue-sapphire-neelam', aliases: ['neelam'], label: 'Blue Sapphire Neelam', color1: '#1976D2', color2: '#BBDEFB', accent: '#FFFFFF', icon: '🔷' },
  { slug: 'emerald-panna', aliases: ['panna'], label: 'Emerald Panna', color1: '#388E3C', color2: '#C8E6C9', accent: '#FFFFFF', icon: '🟢' },
  { slug: 'ruby-manik', aliases: ['manik'], label: 'Ruby Manik Gemstone', color1: '#D32F2F', color2: '#FFCDD2', accent: '#FFFFFF', icon: '♦️' },
  { slug: 'red-coral-moonga', aliases: ['moonga'], label: 'Red Coral Moonga', color1: '#E64A19', color2: '#FFCCBC', accent: '#FFFFFF', icon: '🔴' },
  { slug: 'pearl-moti-rings', aliases: ['moti-ring'], label: 'Pearl Moti Rings', color1: '#78909C', color2: '#CFD8DC', accent: '#000000', icon: '⚪' },

  // ─── 20. Diwali Faral ───
  { slug: 'crunchy-chakli-chivda', aliases: ['chakli'], label: 'Crunchy Chakli & Chivda', color1: '#F57C00', color2: '#FFE0B2', accent: '#000000', icon: '🥨' },
  { slug: 'sweet-karanji-anarse', aliases: ['karanji'], label: 'Sweet Karanji & Anarse', color1: '#E65100', color2: '#FFCC80', accent: '#000000', icon: '🥟' },
  { slug: 'besan-rava-ladoo', aliases: ['besan-ladoo'], label: 'Besan & Rava Ladoo', color1: '#FBC02D', color2: '#FFF9C4', accent: '#000000', icon: '🧆' },
  { slug: 'shankarpali-kadboli', aliases: ['shankarpali'], label: 'Shankarpali & Kadboli', color1: '#795548', color2: '#D7CCC8', accent: '#000000', icon: '🍪' },
  { slug: 'dry-fruit-faral-mix', aliases: ['faral-mix'], label: 'Dry Fruit Faral Mix', color1: '#5D4037', color2: '#BCAAA4', accent: '#FFFFFF', icon: '🥜' },
  { slug: 'traditional-faral-hampers', aliases: ['faral-hamper'], label: 'Faral Gift Hampers', color1: '#C2185B', color2: '#F8BBD0', accent: '#FFFFFF', icon: '🎁' },

  // ─── 21. Electronics ───
  { slug: 'smartphones-mobiles', aliases: ['smartphones', 'mobiles', 'mobile-accessories'], label: 'Smartphones & Mobiles', color1: '#1976D2', color2: '#90CAF9', accent: '#FFFFFF', icon: '📱' },
  { slug: 'laptops-computers', aliases: ['laptops'], label: 'Laptops & Computers', color1: '#37474F', color2: '#B0BEC5', accent: '#FFD700', icon: '💻' },
  { slug: 'smart-watches-fitness-bands', aliases: ['smartwatches'], label: 'Smart Watches', color1: '#00796B', color2: '#80CBC4', accent: '#FFFFFF', icon: '⌚' },
  { slug: 'bluetooth-speakers-audio', aliases: ['speakers', 'audio-headphones', 'home-audio'], label: 'Bluetooth Speakers', color1: '#5E35B1', color2: '#B39DDB', accent: '#FFFFFF', icon: '🔊' },
  { slug: 'power-banks-cables', aliases: ['power-banks'], label: 'Power Banks & Cables', color1: '#E53935', color2: '#FFCDD2', accent: '#FFFFFF', icon: '🔋' },
  { slug: 'home-electronic-appliances', aliases: ['home-appliances'], label: 'Home Electronics', color1: '#0288D1', color2: '#81D4FA', accent: '#FFFFFF', icon: '📺' },
];

function generateHighDefSVG(item) {
  const safeId = item.slug.replace(/[^a-z0-9]/g, '_');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 260" width="360" height="260">
  <defs>
    <!-- Background Multi-Stop Gradient -->
    <linearGradient id="bg_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.color1}" />
      <stop offset="100%" stop-color="${item.color2}" />
    </linearGradient>

    <!-- Inner Glow Ring -->
    <radialGradient id="glow_${safeId}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <!-- Studio Pedestal Shadow -->
    <filter id="shadow_${safeId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.22" />
    </filter>

    <filter id="badge_shadow_${safeId}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Card Canvas -->
  <rect width="360" height="260" rx="20" fill="url(#bg_${safeId})" />

  <!-- Radial Glow Backdrop -->
  <circle cx="180" cy="110" r="75" fill="url(#glow_${safeId})" />

  <!-- Studio Emblem Pedestal -->
  <circle cx="180" cy="110" r="54" fill="#FFFFFF" fill-opacity="0.25" />
  <circle cx="180" cy="110" r="44" fill="#FFFFFF" filter="url(#shadow_${safeId})" />

  <!-- Center Product Icon -->
  <text x="180" y="123" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" text-anchor="middle">${item.icon}</text>

  <!-- Glassmorphism Label Badge -->
  <rect x="24" y="190" width="312" height="50" rx="14" fill="#FFFFFF" fill-opacity="0.95" filter="url(#badge_shadow_${safeId})" />
  
  <!-- Subtle Top Border Highlight on Badge -->
  <rect x="24" y="190" width="312" height="2" rx="1" fill="${item.color1}" fill-opacity="0.3" />

  <!-- Category Title -->
  <text x="180" y="221" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#0F172A" text-anchor="middle" letter-spacing="0.3">${item.label}</text>
</svg>`;
}

let count = 0;

subcategoryDefinitions.forEach((item) => {
  const svg = generateHighDefSVG(item);
  
  // Save primary slug SVG
  fs.writeFileSync(path.join(outputDir, `${item.slug}.svg`), svg, 'utf8');
  count++;

  // Save alias SVGs
  if (item.aliases && item.aliases.length > 0) {
    item.aliases.forEach(alias => {
      fs.writeFileSync(path.join(outputDir, `${alias}.svg`), svg, 'utf8');
      count++;
    });
  }
});

console.log(`Successfully generated ${count} high-definition subcategory SVG studio images in public/images/subcategories/`);
