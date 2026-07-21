import { MetadataRoute } from 'next';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/promotions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  try {
    const productsRes = await productService.getProducts({ per_page: 50 });
    const productRoutes: MetadataRoute.Sitemap = (productsRes.data || []).map((p) => ({
      url: `${baseUrl}/product/${p.slug || p.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    const categoriesRes = await categoryService.getCategories();
    const categoryRoutes: MetadataRoute.Sitemap = (categoriesRes || []).map((c) => ({
      url: `${baseUrl}/category/${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const brandsRes = await brandService.getBrands();
    const brandRoutes: MetadataRoute.Sitemap = (brandsRes || []).map((b) => ({
      url: `${baseUrl}/brand/${b.slug || b.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
