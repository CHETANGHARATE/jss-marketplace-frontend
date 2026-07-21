import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '../services/couponService';

export function useCouponsQuery(enabled = true) {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponService.getAvailableCoupons(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useApplyCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal?: number }) =>
      couponService.applyCoupon(code, subtotal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => couponService.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
