'use client';

import React, { useState } from 'react';
import { useAdminReportsQuery } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { BarChart3, Download, Award } from 'lucide-react';

export default function AdminReportsPage() {
  const [range, setRange] = useState<string>('30d');
  const { data: reports, isLoading } = useAdminReportsQuery(range);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Executive Reports' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-rose-500" />
                <span>Executive Reports & Intelligence</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Analyze marketplace sales volume, gross revenue, and vendor performance statistics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-2xl border border-border/40 text-xs font-bold">
                {['7d', '30d', '90d', '1y'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-xl uppercase transition-all ${
                      range === r
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-xs font-bold rounded-2xl hover:bg-rose-600 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Compiling executive analytics...
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Top Grossing Merchants</span>
                </h3>

                {!reports?.top_vendors || reports.top_vendors.length === 0 ? (
                  <p className="text-xs text-foreground/50 py-4">No merchant sales data for selected timeframe.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reports.top_vendors.map((ven, idx) => (
                      <div
                        key={ven.id}
                        className="p-4 bg-card border border-border/40 rounded-2xl flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-500 font-black flex items-center justify-center text-xs">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs text-foreground line-clamp-1">{ven.name}</span>
                        </div>
                        <span className="text-xs font-black text-rose-500 shrink-0">
                          ₹{ven.revenue?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
