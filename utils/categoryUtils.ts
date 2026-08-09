/**
 * Helper to generate consistent, valid category page URLs across the marketplace.
 * Prefers slug if available, falls back to numeric ID.
 */
export function getCategoryUrl(category: any): string {
  if (!category) return '/#categories';
  const identifier = category.slug || category.id;
  if (!identifier) return '/#categories';
  return `/category/${identifier}`;
}
