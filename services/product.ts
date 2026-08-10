import { productService, mapApiProductToProduct } from './productService';
import { FilterParams, Product } from '../types';

export const getProducts = async (filters?: FilterParams): Promise<Product[]> => {
  try {
    const apiParams: any = {};
    if (filters?.searchQuery) apiParams.search = filters.searchQuery;
    if (filters?.category) apiParams.category = filters.category;

    if (filters?.subcategories && filters.subcategories.length > 0) {
      apiParams.subcategory = filters.subcategories.join(',');
    } else if (filters?.subcategory) {
      apiParams.subcategory = filters.subcategory;
    }

    if (filters?.brand && filters.brand.length > 0) apiParams.brand = filters.brand.join(',');
    if (filters?.minPrice !== undefined) apiParams.min_price = filters.minPrice;
    if (filters?.maxPrice !== undefined) apiParams.max_price = filters.maxPrice;
    if (filters?.rating !== undefined) apiParams.rating = filters.rating;
    if (filters?.discount !== undefined) apiParams.discount = filters.discount;
    if (filters?.stockStatus) apiParams.stock_status = filters.stockStatus;
    if (filters?.sortBy) apiParams.sort_by = filters.sortBy;
    apiParams.per_page = 50;

    const response = await productService.getProducts(apiParams);
    const apiProducts = response.data || [];
    let mapped = apiProducts.map(mapApiProductToProduct);

    // Client-side fallback OR-logic filtering for selected subcategories
    const selectedSubs = filters?.subcategories || (filters?.subcategory ? [filters.subcategory] : []);
    if (selectedSubs.length > 0) {
      const selectedSubsLower = selectedSubs.map((s) => s.toLowerCase().trim());
      mapped = mapped.filter((p) => {
        if (!p.subcategory) return true;
        const pSub = p.subcategory.toLowerCase().trim();
        return selectedSubsLower.some((s) => pSub.includes(s) || s.includes(pSub));
      });
    }

    return mapped;
  } catch (err) {
    console.error('Error fetching live products in getProducts:', err);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const apiProd = await productService.getProductBySlug(id);
    return apiProd ? mapApiProductToProduct(apiProd) : undefined;
  } catch (err) {
    console.error('Error fetching product by ID/slug:', err);
    return undefined;
  }
};

export const getTrendingProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const apiProducts = await productService.getTrendingProducts();
    return (apiProducts || []).slice(0, limit).map(mapApiProductToProduct);
  } catch (err) {
    console.error('Error fetching trending products:', err);
    return [];
  }
};

export const getNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    const response = await productService.getProducts({ sort_by: 'newest', per_page: limit });
    return (response.data || []).map(mapApiProductToProduct);
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    return [];
  }
};

export const getBestSellers = async (limit = 8): Promise<Product[]> => {
  try {
    const response = await productService.getProducts({ sort_by: 'popularity', per_page: limit });
    return (response.data || []).map(mapApiProductToProduct);
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    return [];
  }
};

export const getFeaturedProductsByCategory = async (
  categoryId: string,
  limit = 6
): Promise<Product[]> => {
  try {
    const response = await productService.getProducts({ category: categoryId, per_page: limit });
    return (response.data || []).map(mapApiProductToProduct);
  } catch (err) {
    console.error('Error fetching category products:', err);
    return [];
  }
};
