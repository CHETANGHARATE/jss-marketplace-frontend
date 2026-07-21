import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, AddCartItemPayload } from '../services/cartService';

export function useCartQuery() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => cartService.addItem(payload),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useMergeCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.mergeCart(),
    onSuccess: (mergedCart) => {
      queryClient.setQueryData(['cart'], mergedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
