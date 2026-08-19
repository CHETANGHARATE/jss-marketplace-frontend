'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/Toast';

export interface CompareProductItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  original_price?: number;
  rating?: number;
  brand?: string;
  category?: string;
}

interface ComparisonContextType {
  compareItems: CompareProductItem[];
  addToCompare: (product: CompareProductItem) => boolean;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'jss_compare_products';
const MAX_COMPARE_ITEMS = 4;

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<CompareProductItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { success, error, info } = useToast();

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed.slice(0, MAX_COMPARE_ITEMS));
        }
      }
    } catch (e) {
      console.error('Failed to load comparison products from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    } catch (e) {
      console.error('Failed to save comparison products to storage', e);
    }
  }, [compareItems, isInitialized]);

  const addToCompare = (product: CompareProductItem): boolean => {
    if (compareItems.some((item) => item.id === product.id)) {
      error(`${product.name} is already in comparison list.`, 'Already Added');
      return false;
    }

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      error(`You can compare maximum ${MAX_COMPARE_ITEMS} products at once.`, 'Comparison Limit');
      return false;
    }

    const updated = [...compareItems, product];
    setCompareItems(updated);
    success(`Added to compare (${updated.length}/${MAX_COMPARE_ITEMS})`, 'Product Compared');
    return true;
  };

  const removeFromCompare = (id: number) => {
    setCompareItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      info('Removed product from comparison.', 'Comparison Updated');
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    info('Comparison list cleared.', 'Comparison Reset');
  };

  const isInCompare = (id: number): boolean => {
    return compareItems.some((item) => item.id === id);
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore: compareItems.length < MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
