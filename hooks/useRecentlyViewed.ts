'use client';

import { useState, useEffect } from 'react';
import { ApiProduct } from '../types/api';

const RECENTLY_VIEWED_KEY = 'jss_recently_viewed';
const MAX_RECENT_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<ApiProduct[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (stored) {
          setRecentlyViewed(JSON.parse(stored));
        }
      } catch {
        // Fallback
      }
    }
  }, []);

  const addRecentlyViewed = (product: ApiProduct) => {
    if (typeof window === 'undefined' || !product) return;

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);

      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch {
        // Storage fallback
      }

      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
      setRecentlyViewed([]);
    }
  };

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
