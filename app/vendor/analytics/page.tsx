'use client';

import React, { useState } from 'react';
import { useVendorAnalyticsQuery } from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { BarChart3, TrendingUp, Award } from 'lucide-react';

export default function VendorAnalyticsPage() {
  const [range, setRange] = useState<string>('30d');
  const { data: analytics, isLoading } = useVendorAnalyticsQuery(range);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal', href: '/vendor' }, { label: 'Sales Analytics' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <span>Sales Analytics & Business Intelligence</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Analyze revenue trends, top performing products, and customer order volumes.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-2xl border border-border/40 text-xs font-bold">
              {['7d', '30d', '90d', '1y'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-xl uppercase transition-all ${
                    range === r
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Generating analytics report...
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Top Performing Products</span>
                </h3>

                {!analytics?.top_products || analytics.top_products.length === 0 ? (
                  <p className="text-xs text-foreground/50 py-4">No product sales records for selected timeframe.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analytics.top_products.map((prod, idx) => (
                      <div
                        key={prod.id}
                        className="p-4 bg-card border border-border/40 rounded-2xl flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-xs">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs text-foreground line-clamp-1">{prod.name}</span>
                        </div>
                        <span className="text-xs font-black text-primary shrink-0">
                          {prod.sales_count} Sold
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {analytics?.order_status_counts && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Fulfillment Status Breakdown</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {Object.entries(analytics.order_status_counts).map(([status, count]) => (
                      <div key={status} className="p-4 bg-muted/20 border border-border/40 rounded-2xl space-y-1">
                        <span className="text-2xl font-black text-foreground block">{count}</span>
                        <span className="text-xs font-bold text-foreground/60 uppercase block">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
