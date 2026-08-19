'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import { X, ArrowRight, Scale, Trash2 } from 'lucide-react';

export const ComparisonTray: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useComparison();

  if (compareItems.length === 0) {
    return null;
  }

  const isReadyToCompare = compareItems.length >= 2;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-slide-up">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              Compare Products
              <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {compareItems.length}/4
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              {isReadyToCompare
                ? 'Ready to compare specifications side-by-side'
                : 'Select at least 2 products to compare'}
            </p>
          </div>
        </div>

        {/* Selected Product Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="relative group bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 pr-3 shrink-0"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shrink-0">
                <Image
                  src={item.image || '/images/placeholder.png'}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="max-w-[100px] sm:max-w-[120px] text-left hidden sm:block">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {item.name}
                </p>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  ₹{Number(item.price).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFromCompare(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                aria-label={`Remove ${item.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            href={
              isReadyToCompare
                ? `/compare?ids=${compareItems.map((i) => i.id).join(',')}`
                : '#'
            }
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              isReadyToCompare
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-orange-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            Compare Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
