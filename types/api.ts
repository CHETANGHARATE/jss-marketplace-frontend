/**
|--------------------------------------------------------------------------
| Standard API Response Wrappers
|--------------------------------------------------------------------------
*/

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  unread_count?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta?: PaginatedMeta;
  unread_count?: number;
}

/**
|--------------------------------------------------------------------------
| Backend Domain Model Interfaces
|--------------------------------------------------------------------------
*/

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'seller' | 'customer';
  email_verified_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiCategory {
  id: number;
  name: {
    en?: string;
    hi?: string;
    mr?: string;
    [key: string]: string | undefined;
  } | string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  parent_id?: number;
  children?: ApiCategory[];
  created_at?: string;
}

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  created_at?: string;
}

export interface ApiAttributeValue {
  id: number;
  attribute_id: number;
  value: string;
}

export interface ApiAttribute {
  id: number;
  name: string;
  code?: string;
  values?: ApiAttributeValue[];
}

export interface ApiProduct {
  id: number;
  seller_id?: number;
  category_id?: number;
  brand_id?: number;
  name: string;
  slug: string;
  sku?: string;
  original_price?: number;
  originalPrice?: number;
  offer_price?: number;
  offerPrice?: number;
  sale_price?: number;
  discountPercent?: number;
  stock_quantity?: number;
  stockQuantity?: number;
  stock_status?: string;
  stockStatus?: string;
  status: string;
  rating?: number;
  reviews_count?: number;
  reviewsCount?: number;
  description?: string;
  features?: string[];
  image?: string;
  images?: string[];
  category?: ApiCategory;
  brand?: ApiBrand;
  seller?: { id: number; name: string };
  created_at?: string;
}

export interface ApiCartItem {
  id: number;
  cart_id?: number;
  product_id: number;
  product: ApiProduct;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ApiCart {
  id: number;
  user_id?: number;
  session_id?: string;
  items: ApiCartItem[];
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total_amount: number;
}

export interface ApiAddress {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface ApiOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  seller_id?: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'failed';
  subtotal: number;
  tax?: number;
  shipping_fee?: number;
  total_amount: number;
  shipping_address_snapshot?: ApiAddress;
  billing_address_snapshot?: ApiAddress;
  items?: ApiOrderItem[];
  user?: ApiUser;
  created_at: string;
}

export interface ApiPayment {
  id: number;
  payment_number: string;
  order_id: number;
  gateway: 'razorpay' | 'stripe' | 'cod';
  transaction_reference?: string;
  amount: number;
  status: 'initiated' | 'captured' | 'failed' | 'refunded';
  created_at: string;
}

export interface ApiReview {
  id: number;
  product_id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
  };
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ApiVendorStore {
  id: number;
  user_id: number;
  store_name: string;
  slug: string;
  store_email?: string;
  store_phone?: string;
  logo?: string;
  banner?: string;
  description?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  status: 'pending' | 'active' | 'suspended';
  commission_rate: number;
  created_at: string;
}

export interface ApiVendorWallet {
  id: number;
  vendor_store_id: number;
  balance: number;
  pending_balance: number;
  total_withdrawn: number;
}

export interface ApiCoupon {
  id: number;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
}

export interface ApiNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
}

export interface ApiHealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: { healthy: boolean; message?: string };
    cache: { healthy: boolean; message?: string };
    storage: { healthy: boolean; free_space_mb?: number };
  };
}
