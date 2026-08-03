'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchSuggestionsQuery } from '../hooks/useSearchSuggestions';
import { Search, X, Sparkles, TrendingUp, History } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useSearchSuggestionsQuery(query);

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (searchTerm?: string) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim();

    if (term) {
      const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    }

    setIsOpen(false);

    let searchUrl = `/search`;
    if (term) {
      searchUrl += `?q=${encodeURIComponent(term)}`;
    }

    router.push(searchUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Modern Full-Width Search Bar */}
      <div className="flex items-center w-full bg-background-secondary/80 hover:bg-card border border-border-custom/90 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl transition-all shadow-2xs">
        {/* Search Icon */}
        <div className="pl-4 pr-2 text-foreground/40 flex items-center justify-center shrink-0">
          <Search size={18} />
        </div>

        {/* Input Field expanding full width */}
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products, brands or categories..."
          className="w-full bg-transparent py-2.5 px-1 text-xs sm:text-sm font-semibold text-foreground placeholder:text-muted-custom focus:outline-none"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-foreground/40 hover:text-foreground shrink-0 mr-2 transition-colors"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* Right Search Button */}
        <button
          onClick={() => handleExecuteSearch()}
          className="bg-primary hover:bg-primary-hover text-white px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 my-1 mr-1 cursor-pointer hover:scale-[1.02] active:scale-95"
          title="Search Marketplace"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Instant Suggestions & Recent Searches Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border-custom/80 rounded-3xl shadow-2xl p-4 z-50 space-y-4">
          {suggestions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-primary flex items-center gap-1">
                <Sparkles size={12} />
                <span>Instant Suggestions</span>
              </span>
              <div className="space-y-1">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteSearch(sug.query)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span>{sug.query}</span>
                    {sug.category && (
                      <span className="text-[10px] text-foreground/40 font-semibold">{sug.category}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {recentSearches.length > 0 && !query && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-foreground/50 flex items-center gap-1">
                <History size={12} />
                <span>Recent Searches</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((rec, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteSearch(rec)}
                    className="px-2.5 py-1 bg-muted/40 hover:bg-muted/70 rounded-xl text-[11px] font-semibold text-foreground/80 transition-colors"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-500 flex items-center gap-1">
                <TrendingUp size={12} />
                <span>Popular Searches</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Wireless Headphones', 'Gaming Laptops', 'Smart Watches', 'Running Shoes'].map((pop, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteSearch(pop)}
                    className="px-2.5 py-1 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-xl text-[11px] font-bold transition-colors"
                  >
                    {pop}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
