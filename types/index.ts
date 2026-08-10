export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  location: string;
  joinedDate: string;
  description: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  seller: Seller;
  category: string;
  subcategory: string;
  originalPrice: number;
  offerPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  image: string;
  description: string;
  features: string[];
  reviews: Review[];
  tags: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string; // key for translations
  icon: string; // icon name from lucide
  description: string;
  image: string;
  subcategories: string[];
  popularBrands: string[];
  faqs: FAQ[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterParams {
  category?: string;
  subcategory?: string;
  subcategories?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  discount?: number;
  stockStatus?: string;
  searchQuery?: string;
  sortBy?: 'newest' | 'popularity' | 'price_low_high' | 'price_high_low' | 'rating';
}
