import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlistService';

export function useWishlistQuery(enabled = true) {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistService.toggleWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistService.removeWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
