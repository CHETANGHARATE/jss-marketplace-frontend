import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutService, ProcessCheckoutPayload } from '../services/checkoutService';

export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProcessCheckoutPayload) => checkoutService.processCheckout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
