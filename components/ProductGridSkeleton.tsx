'use client';

import React from 'react';

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="h-[380px] bg-card border border-border/40 rounded-3xl p-4 space-y-4 animate-pulse"
        >
          <div className="w-full h-44 bg-muted/60 rounded-2xl" />
          <div className="h-4 bg-muted/60 rounded w-3/4" />
          <div className="h-3 bg-muted/60 rounded w-1/2" />
          <div className="h-6 bg-muted/60 rounded w-1/3 pt-4" />
        </div>
      ))}
    </div>
  );
}
