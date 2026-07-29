'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Sparkles, Folder, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getSearchSuggestions, SearchSuggestions } from '../services/search';

interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit: (q: string) => void;
  onProductClick: (productId: string) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  query,
  isOpen,
  onClose,
  onSearchSubmit,
  onProductClick,
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    products: [],
    categories: [],
    trending: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await getSearchSuggestions(query);
        setSuggestions(res);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (isOpen) {
        fetchSuggestions();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Click outside to close can be handled in parent, but let's provide internal layout
  if (!isOpen) return null;

  const handleTrendClick = (term: string) => {
    onSearchSubmit(term);
    onClose();
  };

  const handleCategoryClick = (categorySlugOrId: string) => {
    router.push(`/category/${categorySlugOrId}`);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card text-card-foreground border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-border-custom max-h-[480px] overflow-y-auto">
      {/* Search Input Autocomplete Loading indicator */}
      {loading && query && (
        <div className="px-4 py-2 text-xs text-muted-custom animate-pulse">
          Searching...
        </div>
      )}

      {/* Categories Match */}
      {suggestions.categories.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-custom tracking-wider uppercase mb-2">
            <Folder size={14} className="text-primary" />
            <span>Matching Categories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug || cat.id)}
                className="flex items-center justify-between text-left p-2.5 rounded-xl hover:bg-background-secondary transition-colors group text-sm font-medium border border-transparent hover:border-border-custom"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {t(cat.nameKey)}
                </span>
                <ArrowRight size={14} className="text-muted-custom group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Match */}
      {suggestions.products.length > 0 ? (
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-custom tracking-wider uppercase mb-2">
            <Sparkles size={14} className="text-accent" />
            <span>Matching Products</span>
          </div>
          <div className="space-y-1">
            {suggestions.products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => {
                  onProductClick(prod.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between text-left p-2.5 rounded-xl hover:bg-background-secondary transition-colors group text-sm border border-transparent hover:border-border-custom"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search size={14} className="text-muted-custom shrink-0" />
                  <span className="truncate text-foreground group-hover:text-primary transition-colors">
                    {prod.name}
                  </span>
                </div>
                <span className="text-[10px] text-muted-custom bg-background border border-border-custom px-2 py-0.5 rounded-md flex items-center gap-1">
                  Quick View <CornerDownLeft size={8} />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        query && !loading && (
          <div className="p-4 text-sm text-muted-custom text-center">
            No products found matching "{query}"
          </div>
        )
      )}

      {/* Trending Searches */}
      {suggestions.trending.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-custom tracking-wider uppercase mb-3">
            <TrendingUp size={14} className="text-primary" />
            <span>Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.trending.map((term) => (
              <button
                key={term}
                onClick={() => handleTrendClick(term)}
                className="text-xs font-medium text-muted-custom hover:text-primary hover:bg-background-secondary bg-background border border-border-custom hover:border-primary px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5"
              >
                <Search size={12} />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
