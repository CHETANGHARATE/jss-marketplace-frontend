import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService, CreatePaymentOrderPayload, VerifyPaymentPayload } from '../services/paymentService';

export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: ['payment', 'methods'],
    queryFn: () => paymentService.getPaymentMethods(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreatePaymentOrderMutation() {
  return useMutation({
    mutationFn: (payload: CreatePaymentOrderPayload) => paymentService.createPaymentOrder(payload),
  });
}

export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => paymentService.verifyPayment(payload),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', payment.order_id] });
    },
  });
}

export function usePaymentStatusQuery(paymentId: number | string, enabled = true) {
  return useQuery({
    queryKey: ['payment', 'status', paymentId],
    queryFn: () => paymentService.getPaymentStatus(paymentId),
    enabled: !!paymentId && enabled,
    refetchInterval: (query) => (query.state.data?.status === 'initiated' ? 3000 : false),
  });
}
