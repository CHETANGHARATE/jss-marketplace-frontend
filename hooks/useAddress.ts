import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService, CreateAddressPayload } from '../services/addressService';

export function useAddressesQuery(enabled = true) {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAddresses(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}
