import { useQuery } from '@tanstack/react-query';
import { searchService, SearchQueryParams } from '../services/searchService';

export function useSearch(params: SearchQueryParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchService.search(params),
    enabled: !!params.query && params.query.trim().length > 0,
  });
}

export function useAutocompleteSuggestions(query: string) {
  return useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => searchService.getAutocompleteSuggestions(query),
    enabled: !!query && query.trim().length >= 2,
    staleTime: 1000 * 60,
  });
}
