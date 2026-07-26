'use client';

import React from 'react';
import { Star, RotateCcw, ShieldCheck, Tag, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { FilterParams } from '../types';

interface FiltersProps {
  subcategories: string[];
  popularBrands: string[];
  activeFilters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  subcategories,
  popularBrands,
  activeFilters,
  onFilterChange,
}) => {
  const { t } = useLanguage();

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', val: string) => {
    const numVal = val === '' ? undefined : Number(val);
    onFilterChange({
      ...activeFilters,
      [field]: numVal,
    });
  };

  const handleSubcatToggle = (subcat: string) => {
    const isSelected = activeFilters.subcategory === subcat;
    onFilterChange({
      ...activeFilters,
      subcategory: isSelected ? undefined : subcat,
    });
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = activeFilters.brand || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange({
      ...activeFilters,
      brand: newBrands.length > 0 ? newBrands : undefined,
    });
  };

  const handleRatingSelect = (rating: number) => {
    onFilterChange({
      ...activeFilters,
      rating: activeFilters.rating === rating ? undefined : rating,
    });
  };

  const handleDiscountSelect = (discount: number) => {
    onFilterChange({
      ...activeFilters,
      discount: activeFilters.discount === discount ? undefined : discount,
    });
  };

  const handleStockToggle = (status: string) => {
    onFilterChange({
      ...activeFilters,
      stockStatus: activeFilters.stockStatus === status ? undefined : status,
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      category: activeFilters.category,
      sortBy: activeFilters.sortBy,
    });
  };

  return (
    <div className="space-y-7 bg-card text-card-foreground border border-border-custom/80 p-6 rounded-3xl shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-custom/80">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-primary" />
          <h3 className="font-extrabold text-base uppercase tracking-wider">{t('cat.filter_by')}</h3>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs font-extrabold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} />
          {t('cat.clear_all')}
        </button>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">Subcategories</h4>
          <div className="space-y-2">
            {subcategories.map((subcat) => (
              <label
                key={subcat}
                className="flex items-center gap-2.5 text-xs font-medium text-muted-custom hover:text-foreground cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.subcategory === subcat}
                  onChange={() => handleSubcatToggle(subcat)}
                  className="h-4 w-4 rounded-md border-border-custom text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
                <span>{subcat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div className="space-y-3 pt-4 border-t border-border-custom/80">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">{t('cat.price_range')}</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-muted-custom uppercase">{t('cat.min')}</span>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-xs text-muted-custom font-bold">₹</span>
              <input
                type="number"
                value={activeFilters.minPrice ?? ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full bg-background-secondary text-foreground text-xs font-semibold pl-7 pr-3 py-2 rounded-xl border border-border-custom/80 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="text-muted-custom self-end mb-2 font-bold text-xs">-</div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-muted-custom uppercase">{t('cat.max')}</span>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-xs text-muted-custom font-bold">₹</span>
              <input
                type="number"
                value={activeFilters.maxPrice ?? ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                placeholder="99,999"
                className="w-full bg-background-secondary text-foreground text-xs font-semibold pl-7 pr-3 py-2 rounded-xl border border-border-custom/80 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Filters */}
      {popularBrands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border-custom/80">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">{t('cat.brand_filter')}</h4>
          <div className="space-y-2">
            {popularBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-xs font-medium text-muted-custom hover:text-foreground cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(activeFilters.brand || []).includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="h-4 w-4 rounded-md border-border-custom text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Customer Rating */}
      <div className="space-y-3 pt-4 border-t border-border-custom/80">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">{t('cat.rating_filter')}</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingSelect(stars)}
              className={`w-full flex items-center justify-between text-left p-2 rounded-xl text-xs transition-all border ${
                activeFilters.rating === stars
                  ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                  : 'border-transparent text-muted-custom hover:bg-background-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={13}
                      fill={idx < stars ? 'currentColor' : 'none'}
                      className={idx < stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                    />
                  ))}
                </div>
                <span className="font-bold">& Above</span>
              </div>
              <span className="text-[10px] bg-background border border-border-custom/80 px-2 py-0.5 rounded-lg font-black text-muted-custom">
                {stars}★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Discount Percentage */}
      <div className="space-y-3 pt-4 border-t border-border-custom/80">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">{t('cat.discount_filter')}</h4>
        <div className="space-y-2">
          {[50, 30, 10].map((disc) => (
            <button
              key={disc}
              onClick={() => handleDiscountSelect(disc)}
              className={`w-full flex items-center justify-between text-left p-2 rounded-xl text-xs transition-all border ${
                activeFilters.discount === disc
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 font-bold'
                  : 'border-transparent text-muted-custom hover:bg-background-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Tag size={13} className={activeFilters.discount === disc ? 'text-rose-500' : 'text-muted-custom'} />
                <span className="font-bold">{disc}% Off or more</span>
              </div>
              <span className="text-[10px] bg-background border border-border-custom/80 px-2 py-0.5 rounded-lg font-black text-muted-custom">
                {disc}%+
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability (Stock Status) */}
      <div className="space-y-3 pt-4 border-t border-border-custom/80">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">Stock Status</h4>
        <div className="space-y-2">
          {['in_stock', 'low_stock', 'out_of_stock'].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2.5 text-xs font-medium text-muted-custom hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={activeFilters.stockStatus === status}
                onChange={() => handleStockToggle(status)}
                className="h-4 w-4 rounded-md border-border-custom text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              />
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Certified Protection Badge */}
      <div className="p-4 bg-background-secondary rounded-2xl border border-border-custom/80 text-center space-y-1.5">
        <ShieldCheck size={26} className="text-emerald-500 mx-auto" />
        <h5 className="font-bold text-xs text-foreground">JSS Assured Quality</h5>
        <p className="text-[10px] text-muted-custom leading-relaxed">All products undergo 100% authenticity and vendor GSTIN verification.</p>
      </div>

    </div>
  );
};
