'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
      <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Something went wrong!</h1>
        <p className="text-xs text-foreground/60 leading-relaxed font-medium">
          An unhandled error occurred while processing your request. Don't worry, our team has been notified.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={reset}
          className="flex-1 py-3 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="flex-1 py-3 px-4 bg-muted/40 text-foreground text-xs font-bold rounded-2xl hover:bg-muted/70 transition-all flex items-center justify-center gap-2 border border-border/40"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
