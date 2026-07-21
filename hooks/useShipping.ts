import { useQuery, useMutation } from '@tanstack/react-query';
import { shippingService } from '../services/shippingService';

export function useShippingMethodsQuery(addressId?: number) {
  return useQuery({
    queryKey: ['shipping', 'methods', addressId],
    queryFn: () => shippingService.getShippingMethods(addressId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCalculateShippingCostMutation() {
  return useMutation({
    mutationFn: (payload: { address_id: number; shipping_method_id: number }) =>
      shippingService.calculateShippingCost(payload),
  });
}

export function useShipmentTrackingQuery(trackingNumber: string, enabled = true) {
  return useQuery({
    queryKey: ['shipping', 'tracking', trackingNumber],
    queryFn: () => shippingService.getShipmentTracking(trackingNumber),
    enabled: !!trackingNumber && enabled,
    staleTime: 1000 * 60 * 2,
  });
}
