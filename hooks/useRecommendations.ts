import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '../services/recommendationService';

export function useTrendingRecommendations() {
  return useQuery({
    queryKey: ['recommendations', 'trending'],
    queryFn: () => recommendationService.getTrendingRecommendations(),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePersonalizedRecommendations(enabled = true) {
  return useQuery({
    queryKey: ['recommendations', 'personalized'],
    queryFn: () => recommendationService.getPersonalizedRecommendations(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
