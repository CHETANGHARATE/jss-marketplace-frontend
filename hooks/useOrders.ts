import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useOrdersQuery(enabled = true) {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
    enabled,
    staleTime: 1000 * 60 * 2,
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
