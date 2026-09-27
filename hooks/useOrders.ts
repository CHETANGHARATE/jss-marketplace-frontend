import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useOrdersQuery(options?: { enabled?: boolean; status?: string } | boolean) {
  const isEnabled = typeof options === 'boolean' ? options : (options?.enabled ?? true);
  const status = typeof options === 'object' ? options?.status : undefined;

  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => orderService.getOrders(status ? { status } : undefined),
    enabled: isEnabled,
    staleTime: 1000 * 5,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useOrderByNumberQuery(orderNumber: string) {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderNumber: string) => orderService.cancelOrder(orderNumber),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(['order', updatedOrder.order_number], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrderShipmentQuery(orderNumber: string, enabled = true) {
  return useQuery({
    queryKey: ['order', orderNumber, 'shipment'],
    queryFn: () => orderService.getOrderShipment(orderNumber),
    enabled: !!orderNumber && enabled,
  });
}
