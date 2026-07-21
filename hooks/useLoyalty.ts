import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loyaltyService } from '../services/loyaltyService';

export function useLoyaltyQuery(enabled = true) {
  return useQuery({
    queryKey: ['loyalty'],
    queryFn: () => loyaltyService.getSummary(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRedeemPointsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (points: number) => loyaltyService.redeemPoints(points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
