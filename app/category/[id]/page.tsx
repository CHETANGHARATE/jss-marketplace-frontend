'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Grid,
  List,
  Sparkles,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCategoryBySlug, useCategories } from '../../../hooks/useCategories';
import { getLocalizedText } from '../../../utils/translation';
import { CategoryHeader } from '../../../components/CategoryHeader';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Filters } from '../../../components/Filters';
import { ProductCard } from '../../../components/ProductCard';
import { ProductQuickView } from '../../../components/ProductQuickView';
import { getProducts } from '../../../services/product';
import { Product, FilterParams } from '../../../types';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id: categorySlug } = use(params);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { language, t } = useLanguage();
  const { data: category, isLoading: isCategoryLoading, isError } = useCategoryBySlug(categorySlug);
  const { data: allCategories = [] } = useCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const [filters, setFilters] = useState<FilterParams>({
    category: categorySlug,
    sortBy: 'popularity',
    searchQuery: initialSearch,
  });

  React.useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching filtered products', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters]);

  if (isCategoryLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-foreground/60">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium">Loading Category Catalog...</p>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Category Not Found</h2>
        <p className="text-sm text-foreground/60">
          The requested category catalog could not be found or has been moved.
        </p>
      </div>
    );
  }

  const categoryName = getLocalizedText(category.name, language);

  const handleSortChange = (sortByVal: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortByVal as any,
    }));
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubcategoryPillClick = (subcatSlug: string) => {
    setFilters((prev) => ({
      ...prev,
      subcategory: prev.subcategory === subcatSlug ? undefined : subcatSlug,
    }));
    setCurrentPage(1);
  };

  const relatedCats = allCategories.filter((c) => c.slug !== categorySlug).slice(0, 4);

  return (
    <div className="space-y-8">
      
      <Breadcrumbs
        items={[
          { label: 'Categories', href: '/categories' },
          { label: categoryName },
        ]}
      />

      <CategoryHeader category={category} />

      {category.children && category.children.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-custom">Explore Subcategories</h3>
          <div className="flex flex-wrap gap-2">
            {category.children.map((subcat) => {
              const isSelected = filters.subcategory === subcat.slug;
              const subName = getLocalizedText(subcat.name, language);
              return (
                <button
                  key={subcat.id}
                  onClick={() => handleSubcategoryPillClick(subcat.slug)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-card border-border-custom hover:border-primary text-muted-custom hover:text-primary'
                  }`}
                >
                  {subName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div id="products-section" className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start scroll-mt-24">
        
        <div className="lg:col-span-1">
          <Filters
            subcategories={category.children?.map(c => getLocalizedText(c.name, language)) || []}
            popularBrands={[]}
            activeFilters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border-custom p-4 rounded-2xl shadow-xs">
            <p className="text-xs text-muted-custom font-semibold">
              Showing <span className="text-foreground font-bold">{products.length}</span> products in {categoryName}
            </p>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted-custom">{t('cat.sort_by')}:</span>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-background-secondary border border-border-custom text-foreground text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-primary cursor-pointer transition-colors"
                >
                  <option value="popularity">{t('cat.sort_popularity')}</option>
                  <option value="newest">{t('cat.sort_newest')}</option>
                  <option value="price_low_high">{t('cat.sort_low_high')}</option>
                  <option value="price_high_low">{t('cat.sort_high_low')}</option>
                  <option value="rating">{t('cat.sort_rating')}</option>
                </select>
              </div>

              <div className="flex border border-border-custom rounded-xl overflow-hidden shrink-0">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-1.5 transition-colors ${isGridView ? 'bg-primary text-white' : 'bg-background-secondary text-muted-custom hover:text-foreground'}`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-1.5 transition-colors ${!isGridView ? 'bg-primary text-white' : 'bg-background-secondary text-muted-custom hover:text-foreground'}`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {filters.searchQuery && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl w-max text-xs font-bold">
              <span>Search query: "{filters.searchQuery}"</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: undefined }))}
                className="hover:text-rose-500 ml-1 text-sm font-bold"
              >
                ×
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-[380px] bg-card border border-border-custom rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border-custom rounded-3xl shadow-xs space-y-3">
              <ShoppingBag size={44} className="text-muted-custom/30 mx-auto" />
              <p className="text-xs font-semibold text-muted-custom">{t('cat.no_products')}</p>
            </div>
          ) : isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {currentProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={setQuickViewProductId}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentProducts.map((prod) => (
                <div 
                  key={`list_${prod.id}`}
                  onClick={() => setQuickViewProductId(prod.id)}
                  className="group bg-card text-card-foreground border border-border-custom hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 cursor-pointer relative"
                >
                  <div className="h-36 w-full sm:w-36 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 flex items-center justify-center relative shrink-0 border border-border-custom/50">
                    <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105" />
                    {prod.discountPercent > 0 && (
                      <span className="absolute top-2 left-2 bg-foreground text-background text-[9px] font-black px-2 py-0.5 rounded uppercase">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-muted-custom font-semibold">
                        <span>{prod.brand}</span>
                        <span className={prod.stockStatus === 'in_stock' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {t(`prod.${prod.stockStatus}`)}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-muted-custom line-clamp-2 leading-relaxed">{prod.description}</p>
                      
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} fill={i < Math.floor(prod.rating) ? 'currentColor' : 'none'} className={i < Math.floor(prod.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'} />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-foreground">{prod.rating}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-border-custom/60 mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                        {prod.originalPrice > prod.offerPrice && (
                          <span className="text-xs text-muted-custom line-through">₹{prod.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                        Quick Inspect →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-border-custom hover:border-primary rounded-xl disabled:opacity-40 disabled:hover:border-border-custom transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`h-8 w-8 rounded-xl font-bold text-xs border transition-colors ${
                    currentPage === idx + 1
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-card border-border-custom hover:border-primary text-foreground'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-border-custom hover:border-primary rounded-xl disabled:opacity-40 disabled:hover:border-border-custom transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </div>

      {relatedCats.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border-custom">
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('cat.related_categories')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCats.map((relCat) => (
              <Link
                key={relCat.id}
                href={`/category/${relCat.slug}`}
                className="bg-card text-card-foreground border border-border-custom hover:border-primary p-4 rounded-xl shadow-xs text-center font-bold text-xs block transition-colors"
              >
                {getLocalizedText(relCat.name, language)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {quickViewProductId && (
        <ProductQuickView
          productId={quickViewProductId}
          onClose={() => setQuickViewProductId(null)}
        />
      )}

    </div>
  );
}
