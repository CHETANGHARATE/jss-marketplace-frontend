import { useQuery } from '@tanstack/react-query';
import { productService, ProductQueryParams } from '../services/productService';

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ['products', 'trending'],
    queryFn: () => productService.getTrendingProducts(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRelatedProducts(productId: number | string) {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: () => productService.getRelatedProducts(productId),
    enabled: !!productId,
  });
}
