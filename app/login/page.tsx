'use client';

import React, { Suspense } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Sparkles } from 'lucide-react';

function LoginContent() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Login' },
        ]}
      />
      <AuthLayout initialMode="login" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-foreground/60">
          <Sparkles className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-bold tracking-wide">Loading Authentication Portal...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
