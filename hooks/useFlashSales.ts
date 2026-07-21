import { useQuery } from '@tanstack/react-query';
import { promotionService } from '../services/promotionService';

export function useFlashSalesQuery(enabled = true) {
  return useQuery({
    queryKey: ['promotions', 'flash-sales'],
    queryFn: () => promotionService.getFlashSales(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
