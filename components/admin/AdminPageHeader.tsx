'use client';

import React from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { Sparkles } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-4">
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                <Sparkles size={12} />
                <span>{badge}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-muted-custom font-medium max-w-3xl leading-relaxed">{subtitle}</p>}
          </div>

          {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
