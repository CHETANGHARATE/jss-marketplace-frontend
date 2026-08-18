import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse, PaginatedApiResponse } from '../types/api';
import { Product } from '../types';
import { getLocalizedText } from '../utils/translation';

export interface ProductQueryParams {
  category?: string;
  category_id?: number | string;
  subcategory?: string;
  subcategory_id?: number | string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  discount?: number;
  stock_status?: string;
  sort?: 'newest' | 'price_low_high' | 'price_high_low' | 'popularity' | 'best_selling' | 'rating';
  sort_by?: string;
  search?: string;
  page?: number;
  per_page?: number;
  in_stock_first?: number;
}

export function mapApiProductToProduct(apiProd: ApiProduct): Product {
  const originalPrice = apiProd.originalPrice ?? apiProd.original_price ?? 0;
  const offerPrice = apiProd.offerPrice ?? apiProd.sale_price ?? originalPrice;
  const discountPercent = apiProd.discountPercent ?? (originalPrice > offerPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0);

  const categorySlug = typeof apiProd.category?.name === 'string'
    ? apiProd.category.name
    : (apiProd.category?.slug || 'general');

  const categoryId = apiProd.category_id || apiProd.category?.id;
  const subcategoryId = apiProd.subcategory_id || apiProd.subcategory?.id || (apiProd as any).child_category_id || (apiProd as any).child_category?.id;
  const subcategorySlug = apiProd.subcategory?.slug || (apiProd as any).child_category?.slug || '';

  let subcategoryName = '';
  if (typeof apiProd.subcategory === 'string') {
    subcategoryName = apiProd.subcategory;
  } else if (apiProd.subcategory && typeof apiProd.subcategory === 'object') {
    subcategoryName = getLocalizedText(apiProd.subcategory.name, 'en') || apiProd.subcategory.slug || '';
  } else if ((apiProd as any).child_category) {
    subcategoryName = getLocalizedText((apiProd as any).child_category.name, 'en') || (apiProd as any).child_category.slug || '';
  }

  const imgUrl = apiProd.image || apiProd.images?.[0] || '/placeholder-product.png';
  const stockStat = (apiProd.stockStatus || apiProd.stock_status || 'in_stock') as any;

  return {
    id: String(apiProd.id),
    slug: apiProd.slug || String(apiProd.id),
    name: apiProd.name,
    brand: apiProd.brand?.name || 'Generic',
    seller: {
      id: String(apiProd.seller_id || apiProd.seller?.id || 1),
      name: apiProd.seller?.name || 'Verified Marketplace Vendor',
      rating: 4.8,
      location: 'India',
      joinedDate: '2024',
      description: 'Verified marketplace vendor seller'
    },
    category: categorySlug,
    categoryId: categoryId,
    subcategory: subcategoryName,
    subcategoryId: subcategoryId,
    subcategorySlug: subcategorySlug,
    originalPrice,
    offerPrice,
    discountPercent,
    rating: apiProd.rating || 5,
    reviewsCount: apiProd.reviewsCount || apiProd.reviews_count || 0,
    stockStatus: stockStat,
    image: imgUrl,
    description: apiProd.description || '',
    features: apiProd.features || [],
    reviews: [],
    tags: []
  };
}

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/products', { params });
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<ApiProduct> {
    try {
      const response = await apiClient.get<ApiResponse<ApiProduct>>(`/products/${slug}`);
      if (response.data?.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`Direct product endpoint for '${slug}' returned error, using fallback catalog query...`, err);
    }

    // Fallback search by slug, ID, or SKU across product catalog
    try {
      const searchRes = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/products', {
        params: { search: slug, per_page: 50 }
      });
      const list = searchRes.data?.data || [];
      let matched = list.find(
        (p) => p.slug === slug || String(p.id) === String(slug) || p.sku === slug
      );

      if (!matched) {
        const generalRes = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/products', {
          params: { per_page: 50 }
        });
        const genList = generalRes.data?.data || [];
        matched = genList.find(
          (p) =>
            p.slug === slug ||
            String(p.id) === String(slug) ||
            p.sku === slug ||
            p.slug?.toLowerCase() === slug.toLowerCase()
        );
      }

      if (matched) {
        return matched;
      }
    } catch (fallbackErr) {
      console.error(`Fallback product query failed for '${slug}':`, fallbackErr);
    }

    throw new Error(`Product not found for identifier: ${slug}`);
  },

  async getFeaturedProducts(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/products/featured');
    return response.data.data;
  },

  async getTrendingProducts(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/products/trending');
    return response.data.data;
  },

  async getRelatedProducts(productId: number | string): Promise<ApiProduct[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiProduct[]>>(`/products/${productId}/related`);
      return response.data.data || [];
    } catch {
      const res = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/products', { params: { per_page: 4 } });
      return res.data?.data || [];
    }
  },

  async getFrequentlyBoughtTogether(productId: number | string): Promise<ApiProduct[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiProduct[]>>(`/products/${productId}/frequently-bought-together`);
      return response.data.data || [];
    } catch {
      return [];
    }
  }
};

