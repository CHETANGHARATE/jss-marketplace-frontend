'use client';

import React, { useState, use, useEffect } from 'react';
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
  AlertCircle,
  ArrowRight
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
  const initialSubcatParam = searchParams.get('subcategory') || searchParams.get('subcategories') || '';
  
  const initialSubcategories = initialSubcatParam
    ? initialSubcatParam.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const { language, t } = useLanguage();
  const {
    data: category,
    isLoading: isCategoryLoading,
    isError,
    error: categoryError,
    refetch: refetchCategory,
  } = useCategoryBySlug(categorySlug);
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
    subcategories: initialSubcategories,
    subcategory: initialSubcategories.length === 1 ? initialSubcategories[0] : undefined,
  });

  // Sync selected subcategories to URL query state so page refreshes preserve state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (filters.subcategories && filters.subcategories.length > 0) {
        url.searchParams.set('subcategory', filters.subcategories.join(','));
      } else {
        url.searchParams.delete('subcategory');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [filters.subcategories]);

  useEffect(() => {
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
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-foreground/60">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold tracking-wide">Loading Category Catalog...</p>
      </div>
    );
  }

  const is404 = isError && (categoryError as any)?.response?.status === 404;

  if (isError || !category) {
    if (is404) {
      return (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Category Not Found</h2>
          <p className="text-xs text-muted-custom leading-relaxed font-medium">
            The requested category catalog could not be found or has been moved to another marketplace section.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-white bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-2xl transition-all shadow-xs"
          >
            Return to Marketplace Home
          </Link>
        </div>
      );
    }

    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Unable to Load Category</h2>
        <p className="text-xs text-muted-custom leading-relaxed font-medium">
          {(categoryError as Error)?.message || 'A network or server error occurred while retrieving this category.'}
        </p>
        <button 
          onClick={() => refetchCategory()}
          className="inline-flex items-center gap-2 text-xs font-black text-white bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-2xl transition-all shadow-xs"
        >
          Try Again
        </button>
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
    const currentSlugs = filters.subcategories || (filters.subcategory ? [filters.subcategory] : []);
    const isSelected = currentSlugs.includes(subcatSlug);
    const updatedSlugs = isSelected
      ? currentSlugs.filter((s) => s !== subcatSlug)
      : [...currentSlugs, subcatSlug];

    setFilters((prev) => ({
      ...prev,
      subcategory: updatedSlugs.length === 1 ? updatedSlugs[0] : undefined,
      subcategories: updatedSlugs.length > 0 ? updatedSlugs : undefined,
    }));
    setCurrentPage(1);
  };

  const relatedCats = allCategories.filter((c) => c.slug !== categorySlug).slice(0, 4);

  const subcategoryList = category.children || (category as any).subcategories || [];
  const selectedSubcatSlugs = filters.subcategories || (filters.subcategory ? [filters.subcategory] : []);

  return (
    <div className="space-y-8 sm:space-y-10">
      
      <Breadcrumbs
        items={[
          { label: 'Categories', href: '/#categories' },
          { label: categoryName },
        ]}
      />

      {/* Category Hero Header */}
      <CategoryHeader category={category} />

      {/* Subcategory Pills Carousel */}
      {subcategoryList.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">Explore Subcategories</h3>
          <div className="flex flex-wrap gap-2.5">
            {subcategoryList.map((subcat: any) => {
              const subSlug = subcat.slug || String(subcat.id || '');
              const isSelected = selectedSubcatSlugs.includes(subSlug);
              const subName = getLocalizedText(subcat.name, language);
              return (
                <button
                  key={subcat.id || subSlug}
                  onClick={() => handleSubcategoryPillClick(subSlug)}
                  className={`text-xs font-black px-4 py-2 rounded-2xl border transition-all shadow-2xs ${
                    isSelected
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-card border-border-custom/80 hover:border-primary/60 text-muted-custom hover:text-primary'
                  }`}
                >
                  {subName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Catalog Section */}
      <div id="products-section" className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start scroll-mt-24">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <Filters
            subcategories={subcategoryList}
            popularBrands={[]}
            activeFilters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Product Catalog Grid & View Controls */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border-custom/80 p-4 rounded-3xl shadow-xs">
            <p className="text-xs text-muted-custom font-semibold">
              Showing <span className="text-foreground font-black">{products.length}</span> products in <strong className="text-foreground">{categoryName}</strong>
            </p>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-muted-custom uppercase">{t('cat.sort_by')}:</span>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-background-secondary border border-border-custom/80 text-foreground text-xs font-bold px-3.5 py-2 rounded-2xl focus:outline-none focus:border-primary cursor-pointer transition-colors"
                >
                  <option value="popularity">{t('cat.sort_popularity')}</option>
                  <option value="newest">{t('cat.sort_newest')}</option>
                  <option value="price_low_high">{t('cat.sort_low_high')}</option>
                  <option value="price_high_low">{t('cat.sort_high_low')}</option>
                  <option value="rating">{t('cat.sort_rating')}</option>
                </select>
              </div>

              <div className="flex border border-border-custom/80 rounded-2xl overflow-hidden shrink-0">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 transition-colors ${isGridView ? 'bg-primary text-white' : 'bg-background-secondary text-muted-custom hover:text-foreground'}`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 transition-colors ${!isGridView ? 'bg-primary text-white' : 'bg-background-secondary text-muted-custom hover:text-foreground'}`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Search Pill Tag */}
          {filters.searchQuery && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-2xl w-max text-xs font-black">
              <span>Search query: "{filters.searchQuery}"</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: undefined }))}
                className="hover:text-rose-500 ml-1 text-sm font-black"
              >
                ×
              </button>
            </div>
          )}

          {/* Catalog State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-[380px] bg-card border border-border-custom/80 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3">
              <ShoppingBag size={48} className="text-muted-custom/30 mx-auto" />
              <p className="text-xs font-bold text-muted-custom">{t('cat.no_products')}</p>
            </div>
          ) : isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  className="group bg-card text-card-foreground border border-border-custom/80 hover:border-primary/50 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 cursor-pointer relative"
                >
                  <div className="h-40 w-full sm:w-40 bg-[#ECEFF3] dark:bg-slate-900/40 rounded-2xl relative shrink-0 border border-border-custom/60 overflow-hidden">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105" />
                    {prod.discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-muted-custom font-bold">
                        <span className="uppercase tracking-wider bg-background-secondary border border-border-custom/80 px-2 py-0.5 rounded-md">{prod.brand}</span>
                        <span className={prod.stockStatus === 'in_stock' ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>
                          {t(`prod.${prod.stockStatus}`)}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-muted-custom line-clamp-2 leading-relaxed font-normal">{prod.description}</p>
                      
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} fill={i < Math.floor(prod.rating) ? 'currentColor' : 'none'} className={i < Math.floor(prod.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'} />
                          ))}
                        </div>
                        <span className="text-xs font-black text-foreground">{prod.rating}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-border-custom/60 mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                        {prod.originalPrice > prod.offerPrice && (
                          <span className="text-xs text-muted-custom line-through font-semibold">₹{prod.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <span className="text-xs font-black text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Quick Inspect</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 border border-border-custom/80 hover:border-primary rounded-2xl disabled:opacity-40 disabled:hover:border-border-custom transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`h-9 w-9 rounded-2xl font-black text-xs border transition-all ${
                    currentPage === idx + 1
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-card border-border-custom/80 hover:border-primary text-foreground'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 border border-border-custom/80 hover:border-primary rounded-2xl disabled:opacity-40 disabled:hover:border-border-custom transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Related Categories Footer Bar */}
      {relatedCats.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-border-custom/80">
          <h3 className="text-xl font-black text-foreground tracking-tight">{t('cat.related_categories')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedCats.map((relCat) => (
              <Link
                key={relCat.id}
                href={`/category/${relCat.slug}`}
                className="bg-card text-card-foreground border border-border-custom/80 hover:border-primary/60 p-5 rounded-3xl shadow-2xs text-center font-black text-xs block transition-all hover:-translate-y-0.5"
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
