import { useQuery } from '@tanstack/react-query';
import { personalizationService } from '../services/personalizationService';

export function usePersonalizedRecommendationsQuery(enabled = true) {
  return useQuery({
    queryKey: ['personalization', 'recommendations'],
    queryFn: () => personalizationService.getPersonalizedRecommendations(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingProductsQuery(enabled = true) {
  return useQuery({
    queryKey: ['personalization', 'trending'],
    queryFn: () => personalizationService.getTrendingProducts(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useContinueShoppingQuery(enabled = true) {
  return useQuery({
    queryKey: ['personalization', 'continue-shopping'],
    queryFn: () => personalizationService.getContinueShopping(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
