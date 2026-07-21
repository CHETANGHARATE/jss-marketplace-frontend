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

  const handleExecuteSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim();

    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch(query);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products, brands, or categories..."
          className="w-full bg-muted/40 border border-border/40 rounded-2xl py-2.5 pl-11 pr-10 text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3" />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-foreground/40 hover:text-foreground absolute right-3 top-2.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/40 rounded-3xl shadow-xl p-4 z-50 space-y-4">
          {suggestions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
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
                <History className="w-3 h-3" />
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
                <TrendingUp className="w-3 h-3" />
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
