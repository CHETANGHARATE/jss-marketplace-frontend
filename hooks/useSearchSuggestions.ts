import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';

export function useSearchSuggestionsQuery(query: string) {
  return useQuery({
    queryKey: ['search', 'suggestions', query],
    queryFn: () => searchService.getSuggestions(query),
    enabled: !!query && query.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}
