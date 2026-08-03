import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

function getCategoryNameString(name: any): string {
  if (typeof name === 'string') return name.trim().toLowerCase();
  if (typeof name === 'object' && name !== null) {
    return (name.en || name.hi || name.mr || '').trim().toLowerCase();
  }
  return '';
}

export function deduplicateCategories(categories: any[]): any[] {
  if (!Array.isArray(categories)) return [];
  const seenIds = new Set<number | string>();
  const seenSlugs = new Set<string>();
  const seenNames = new Set<string>();
  const result: any[] = [];

  for (const cat of categories) {
    if (!cat) continue;

    const id = cat.id;
    const slug = (cat.slug || '').trim().toLowerCase();
    const nameStr = getCategoryNameString(cat.name);

    const isDuplicate =
      (id && seenIds.has(id)) ||
      (slug && seenSlugs.has(slug)) ||
      (nameStr && seenNames.has(nameStr));

    if (!isDuplicate) {
      if (id) seenIds.add(id);
      if (slug) seenSlugs.add(slug);
      if (nameStr) seenNames.add(nameStr);

      const cleanCat = { ...cat };
      if (Array.isArray(cleanCat.children) && cleanCat.children.length > 0) {
        cleanCat.children = deduplicateCategories(cleanCat.children);
      }
      if (Array.isArray(cleanCat.subcategories) && cleanCat.subcategories.length > 0) {
        cleanCat.subcategories = deduplicateCategories(cleanCat.subcategories);
      }
      result.push(cleanCat);
    }
  }

  return result;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await categoryService.getCategories();
      return deduplicateCategories(data);
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}
