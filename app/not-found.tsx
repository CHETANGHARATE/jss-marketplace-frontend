'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
      <div className="h-16 w-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">404 Error</span>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Page Not Found</h1>
        <p className="text-xs text-foreground/60 leading-relaxed font-medium">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          className="flex-1 py-3 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <Link
          href="/search"
          className="flex-1 py-3 px-4 bg-muted/40 text-foreground text-xs font-bold rounded-2xl hover:bg-muted/70 transition-all flex items-center justify-center gap-2 border border-border/40"
        >
          <Search className="w-4 h-4" />
          <span>Search Products</span>
        </Link>
      </div>
    </div>
  );
}
