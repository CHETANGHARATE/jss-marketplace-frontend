import { useQuery } from '@tanstack/react-query';
import { referralService } from '../services/referralService';

export function useReferralQuery(enabled = true) {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: () => referralService.getSummary(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
