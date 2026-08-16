'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Grid,
  List,
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
  X,
  Flame,
  Percent,
  CheckCircle2,
  PackageSearch
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCategories } from '../../../hooks/useCategories';
import { getLocalizedText } from '../../../utils/translation';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Filters } from '../../../components/Filters';
import { ProductCard } from '../../../components/ProductCard';
import { ProductQuickView } from '../../../components/ProductQuickView';
import { getProducts } from '../../../services/product';
import { Product, FilterParams } from '../../../types';

interface OfferConfig {
  slug: string;
  titleKey: string;
  titleDefault: string;
  subtitleKey: string;
  subtitleDefault: string;
  tagKey: string;
  tagDefault: string;
  descKey: string;
  descDefault: string;
  maxPrice?: number;
  minDiscount?: number;
  accentColor: string;
  tagColor: string;
  bgGradient: string;
  badgeIcon: string;
}

const offersConfigMap: Record<string, OfferConfig> = {
  'under-99': {
    slug: 'under-99',
    titleKey: 'promo.under99_title',
    titleDefault: 'Under ₹99',
    subtitleKey: 'promo.under99_sub',
    subtitleDefault: 'Great Products Starting at ₹99',
    tagKey: 'promo.under99_tag',
    tagDefault: 'Budget Store',
    descKey: 'offers.under99_desc',
    descDefault: 'Explore quality verified marketplace essentials and daily picks starting at ₹99 and below.',
    maxPrice: 99,
    accentColor: '#0284c7',
    tagColor: '#0369a1',
    bgGradient: 'linear-gradient(135deg, rgba(224, 242, 254, 0.6) 0%, rgba(240, 253, 244, 0.4) 60%, rgba(186, 230, 253, 0.5) 100%)',
    badgeIcon: 'Sparkles',
  },
  'flat-80-off': {
    slug: 'flat-80-off',
    titleKey: 'promo.flat80_title',
    titleDefault: 'Flat 80% Off',
    subtitleKey: 'promo.flat80_sub',
    subtitleDefault: 'Biggest Discounts On Top Products',
    tagKey: 'promo.flat80_tag',
    tagDefault: 'Mega Clearance',
    descKey: 'offers.flat80_desc',
    descDefault: 'Massive clearance savings with genuine discounts of 80% and above directly from source.',
    minDiscount: 80,
    accentColor: '#16a34a',
    tagColor: '#15803d',
    bgGradient: 'linear-gradient(135deg, rgba(220, 252, 231, 0.6) 0%, rgba(240, 253, 244, 0.4) 60%, rgba(187, 247, 208, 0.5) 100%)',
    badgeIcon: 'Percent',
  },
  'under-299': {
    slug: 'under-299',
    titleKey: 'promo.under299_title',
    titleDefault: 'Under ₹299',
    subtitleKey: 'promo.under299_sub',
    subtitleDefault: 'Best Deals Under ₹299',
    tagKey: 'promo.under299_tag',
    tagDefault: 'Value Deals',
    descKey: 'offers.under299_desc',
    descDefault: 'Top value fashion, home utility, and daily essentials all priced at or under ₹299.',
    maxPrice: 299,
    accentColor: '#e11d48',
    tagColor: '#be123c',
    bgGradient: 'linear-gradient(135deg, rgba(255, 228, 230, 0.6) 0%, rgba(255, 241, 242, 0.4) 60%, rgba(254, 205, 211, 0.5) 100%)',
    badgeIcon: 'Tag',
  },
  'under-399': {
    slug: 'under-399',
    titleKey: 'promo.under399_title',
    titleDefault: 'Under ₹399',
    subtitleKey: 'promo.under399_sub',
    subtitleDefault: 'Premium Picks Under ₹399',
    tagKey: 'promo.under399_tag',
    tagDefault: 'Premium Picks',
    descKey: 'offers.under399_desc',
    descDefault: 'Curated lifestyle, tech accessories, and grooming essentials all priced under ₹399.',
    maxPrice: 399,
    accentColor: '#7c3aed',
    tagColor: '#6b21a8',
    bgGradient: 'linear-gradient(135deg, rgba(243, 232, 255, 0.6) 0%, rgba(250, 245, 255, 0.4) 60%, rgba(233, 213, 255, 0.5) 100%)',
    badgeIcon: 'Flame',
  },
};

interface OfferPageProps {
  params: Promise<{ slug: string }>;
}

export default function OfferPage({ params }: OfferPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const { language, t } = useLanguage();
  const { data: allCategories = [] } = useCategories();

  // Find or generate offer configuration
  const offerConfig: OfferConfig = offersConfigMap[slug] || {
    slug,
    titleKey: `offers.${slug}_title`,
    titleDefault: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitleKey: `offers.${slug}_sub`,
    subtitleDefault: 'Exclusive Promotional Offer',
    tagKey: 'offers.active_filter',
    tagDefault: 'Special Offer',
    descKey: 'offers.title',
    descDefault: 'Explore exclusive deals and verified products on JSS Marketplace.',
    accentColor: '#2563eb',
    tagColor: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, rgba(238, 242, 255, 0.6) 0%, rgba(245, 243, 255, 0.4) 100%)',
    badgeIcon: 'Sparkles',
  };

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSubcatParam = searchParams.get('subcategory') || searchParams.get('subcategories') || '';
  const initialSubcategories = initialSubcatParam
    ? initialSubcatParam.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Combine offer-level constraint with user filters
  const [filters, setFilters] = useState<FilterParams>({
    category: initialCategory || undefined,
    maxPrice: offerConfig.maxPrice,
    discount: offerConfig.minDiscount,
    sortBy: 'popularity',
    searchQuery: initialSearch,
    subcategories: initialSubcategories,
    subcategory: initialSubcategories.length === 1 ? initialSubcategories[0] : undefined,
  });

  // Extract all available subcategories across categories for sidebar filter
  const allSubcategories = allCategories.flatMap((cat: any) => {
    return (cat.children || cat.subcategories || []).map((sub: any) => ({
      id: sub.id,
      slug: sub.slug,
      name: sub.name || sub.slug,
    }));
  });

  // Extract all popular brands across products or catalog
  const popularBrands = ['Tata Sampann', 'Fortune Oil', 'Everest', 'MDH', 'Suhana', 'Gemini', 'Lijjat', 'Chitale'];

  // Load products based on combined filters
  useEffect(() => {
    const loadOfferProducts = async () => {
      setLoading(true);
      try {
        // Enforce offer fixed boundary:
        const activeParams: FilterParams = {
          ...filters,
          maxPrice: offerConfig.maxPrice
            ? (filters.maxPrice ? Math.min(filters.maxPrice, offerConfig.maxPrice) : offerConfig.maxPrice)
            : filters.maxPrice,
          discount: offerConfig.minDiscount
            ? (filters.discount ? Math.max(filters.discount, offerConfig.minDiscount) : offerConfig.minDiscount)
            : filters.discount,
        };

        const data = await getProducts(activeParams);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching offer products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOfferProducts();
  }, [filters, offerConfig]);

  // Handle pagination calculation
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage) || 1;
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setCurrentPage(1);
    setFilters({
      ...newFilters,
      maxPrice: offerConfig.maxPrice
        ? (newFilters.maxPrice ? Math.min(newFilters.maxPrice, offerConfig.maxPrice) : offerConfig.maxPrice)
        : newFilters.maxPrice,
      discount: offerConfig.minDiscount
        ? (newFilters.discount ? Math.max(newFilters.discount, offerConfig.minDiscount) : offerConfig.minDiscount)
        : newFilters.discount,
    });
  };

  const offerTitle = t(offerConfig.titleKey) || offerConfig.titleDefault;
  const offerSubtitle = t(offerConfig.subtitleKey) || offerConfig.subtitleDefault;
  const offerTag = t(offerConfig.tagKey) || offerConfig.tagDefault;
  const offerDesc = t(offerConfig.descKey) || offerConfig.descDefault;

  return (
    <div className="space-y-6 lg:space-y-8 pb-12">
      {/* ── Breadcrumb ── */}
      <Breadcrumbs
        items={[
          { label: t('nav.home') || 'Home', href: '/' },
          { label: t('offers.breadcrumb') || 'Offers', href: '/promotions' },
          { label: offerTitle },
        ]}
      />

      {/* ── Offer Hero Header Banner ── */}
      <div
        className="relative rounded-3xl p-6 sm:p-10 border border-border-custom/80 shadow-xs overflow-hidden"
        style={{ background: offerConfig.bgGradient }}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          {/* Badge Pill */}
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs border border-black/5"
            style={{ backgroundColor: `${offerConfig.accentColor}15`, color: offerConfig.tagColor }}
          >
            <Sparkles size={12} style={{ color: offerConfig.accentColor }} />
            <span>{offerTag}</span>
          </div>

          {/* Offer Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
            style={{ color: offerConfig.tagColor }}
          >
            {offerTitle}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-foreground/80 font-medium leading-relaxed">
            <span className="font-bold text-foreground">{offerSubtitle}</span> — {offerDesc}
          </p>

          {/* Total Matching Products Counter */}
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-foreground/70">
            <CheckCircle2 size={15} style={{ color: offerConfig.accentColor }} />
            <span>
              {t('offers.showing_count') || 'Showing'}{' '}
              <span className="font-extrabold text-foreground">{totalProducts}</span>{' '}
              {t('offers.matching_products') || 'matching products'}
            </span>
          </div>
        </div>

        {/* Decorative background radial blur accent */}
        <div
          className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full opacity-30 pointer-events-none blur-3xl"
          style={{ backgroundColor: offerConfig.accentColor }}
        />
      </div>

      {/* ── Main Layout: Sidebar Filters + Products Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <Filters
            subcategories={allSubcategories}
            popularBrands={popularBrands}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Toolbar: Active Filter Chip, Results Count & Sorting */}
          <div className="bg-card border border-border-custom/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            {/* Active Offer Filter Chip */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-custom">
                {t('offers.active_filter') || 'Active Offer'}:
              </span>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-white shadow-2xs transition-transform hover:scale-105"
                style={{ backgroundColor: offerConfig.accentColor }}
              >
                <span>{offerTitle}</span>
                <button
                  onClick={() => router.push('/promotions')}
                  aria-label="Remove offer filter"
                  className="hover:opacity-80 transition-opacity ml-1 cursor-pointer"
                  title="Explore all promotions"
                >
                  <X size={13} />
                </button>
              </div>

              {filters.category && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-background-secondary border border-border-custom text-foreground">
                  <span>Category: {filters.category}</span>
                  <button
                    onClick={() => handleFilterChange({ ...filters, category: undefined })}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* View Mode & Sort Selector */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-custom">
                <span className="shrink-0">Sort:</span>
                <select
                  value={filters.sortBy || 'popularity'}
                  onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value as any })}
                  className="bg-background-secondary border border-border-custom text-foreground rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_low_high">Price: Low to High</option>
                  <option value="price_high_low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center gap-1 bg-background-secondary p-1 rounded-xl border border-border-custom">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isGridView ? 'bg-card text-primary shadow-xs' : 'text-muted-custom hover:text-foreground'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    !isGridView ? 'bg-card text-primary shadow-xs' : 'text-muted-custom hover:text-foreground'
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Listing */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-background-secondary rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-card border border-border-custom/80 rounded-3xl p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-2xs">
                <PackageSearch size={32} />
              </div>
              <h3 className="text-xl font-black text-foreground">
                {t('offers.no_products') || 'No products available for this offer'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-custom max-w-md mx-auto leading-relaxed">
                {t('offers.no_products_desc') ||
                  'Try exploring our other promotional offers or adjusting your selected filters.'}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() =>
                    handleFilterChange({
                      category: undefined,
                      subcategory: undefined,
                      subcategories: undefined,
                      brand: undefined,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-background-secondary border border-border-custom text-xs font-bold text-foreground hover:border-primary transition-colors cursor-pointer"
                >
                  Reset Extra Filters
                </button>
                <Link
                  href="/promotions"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
                >
                  {t('offers.explore_all') || 'Explore All Offers'}
                </Link>
              </div>
            </div>
          ) : (
            /* Products Grid / List */
            <div
              className={
                isGridView
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5'
                  : 'space-y-4'
              }
            >
              {paginatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={setQuickViewProductId}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border-custom/80">
              <p className="text-xs font-semibold text-muted-custom">
                Showing{' '}
                <span className="font-bold text-foreground">
                  {startIndex + 1}–{Math.min(startIndex + productsPerPage, totalProducts)}
                </span>{' '}
                of <span className="font-bold text-foreground">{totalProducts}</span> products
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="p-2 rounded-xl bg-background-secondary border border-border-custom text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors shadow-2xs cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={`page_${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-background-secondary border border-border-custom text-foreground hover:bg-muted-custom/20'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="p-2 rounded-xl bg-background-secondary border border-border-custom text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors shadow-2xs cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProductId && (
        <ProductQuickView
          productId={quickViewProductId}
          onClose={() => setQuickViewProductId(null)}
        />
      )}
    </div>
  );
}
