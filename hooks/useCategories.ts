import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

function getCategoryNameString(name: any): string {
  if (typeof name === 'string') return name.trim().toLowerCase();
  if (typeof name === 'object' && name !== null) {
    return (name.en || name.hi || name.mr || '').trim().toLowerCase();
  }
  return '';
}

export function getCanonicalCategoryKey(cat: any): string {
  if (!cat) return '';
  const rawId = String(cat.id || '').trim().toLowerCase();
  const rawSlug = String(cat.slug || '').trim().toLowerCase();
  const nameStr = getCategoryNameString(cat.name);

  const combined = `${nameStr} ${rawSlug}`;

  if (combined.includes('agriculture') || combined.includes('seed')) {
    return 'agriculture_seeds';
  }
  if (combined.includes('beauty') || combined.includes('cosmetic') || combined.includes('personal care')) {
    return 'beauty_personal_care';
  }
  if (combined.includes('pooja') || combined.includes('religious') || combined.includes('spiritual')) {
    return 'religious_pooja';
  }
  if (combined.includes('masale') || combined.includes('spice')) {
    return 'masale_spices';
  }
  if (combined.includes('homemade') || combined.includes('local')) {
    return 'local_homemade';
  }
  if (combined.includes('juice') || combined.includes('syrup')) {
    return 'juices_syrups';
  }

  return rawSlug || nameStr || rawId;
}

export function deduplicateCategories(categories: any[]): any[] {
  if (!Array.isArray(categories)) return [];
  const seenIds = new Set<number | string>();
  const seenSlugs = new Set<string>();
  const seenCanonicalKeys = new Set<string>();
  const result: any[] = [];

  for (const cat of categories) {
    if (!cat) continue;

    const id = cat.id;
    const slug = (cat.slug || '').trim().toLowerCase();
    const canonicalKey = getCanonicalCategoryKey(cat);

    const isDuplicate =
      (id && seenIds.has(id)) ||
      (slug && seenSlugs.has(slug)) ||
      (canonicalKey && seenCanonicalKeys.has(canonicalKey));

    if (!isDuplicate) {
      if (id) seenIds.add(id);
      if (slug) seenSlugs.add(slug);
      if (canonicalKey) seenCanonicalKeys.add(canonicalKey);

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
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
  });
}
