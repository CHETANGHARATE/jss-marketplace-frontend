'use client';

import React from 'react';

export function OrderSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-6 bg-card border border-border/40 rounded-3xl space-y-4 animate-pulse"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border/40">
            <div className="h-4 bg-muted/60 rounded w-1/4" />
            <div className="h-4 bg-muted/60 rounded w-1/6" />
          </div>
          <div className="h-16 bg-muted/60 rounded-2xl w-full" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-muted/60 rounded w-1/5" />
            <div className="h-6 bg-muted/60 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
