import { useQuery } from '@tanstack/react-query';
import { promotionService } from '../services/promotionService';

export function usePromotionalBannersQuery(enabled = true) {
  return useQuery({
    queryKey: ['promotions', 'banners'],
    queryFn: () => promotionService.getBanners(),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCampaignsQuery(enabled = true) {
  return useQuery({
    queryKey: ['promotions', 'campaigns'],
    queryFn: () => promotionService.getCampaigns(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
