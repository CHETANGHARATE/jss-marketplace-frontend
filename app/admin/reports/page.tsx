'use client';

import React, { useState } from 'react';
import { useAdminReportsQuery } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { BarChart3, Download, IndianRupee, ShoppingBag, TrendingUp, PieChart } from 'lucide-react';

export default function AdminReportsPage() {
  const [range, setRange] = useState<string>('30d');
  const { data: reports, isLoading } = useAdminReportsQuery(range);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />

      <main className="flex-1 flex flex-col p-6 sm:p-10 lg:p-12 overflow-auto">
        <div className="max-w-7xl w-full mx-auto space-y-8">
          <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Executive Reports' }]} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-rose-500" />
                <span>Executive Analytics</span>
              </h1>
              <p className="text-sm text-foreground/60 font-medium mt-1">
                Analyze marketplace sales volume, gross revenue, and order statistics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-xl border border-border/40 text-sm font-semibold">
                {['7d', '30d', '90d', '1y'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-4 py-2 rounded-lg uppercase transition-all ${
                      range === r
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-foreground/50 animate-pulse">
              <BarChart3 className="w-12 h-12" />
              <span>Compiling executive analytics...</span>
            </div>
          ) : !reports ? (
            <div className="py-20 text-center text-foreground/50">
              No analytics data found for the selected timeframe.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                      <IndianRupee className="w-6 h-6" />
                    </span>
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Revenue</h3>
                  <div className="text-3xl font-extrabold text-foreground">₹{(reports.total_revenue || 0).toLocaleString()}</div>
                </div>

                <div className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                      <ShoppingBag className="w-6 h-6" />
                    </span>
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Orders</h3>
                  <div className="text-3xl font-extrabold text-foreground">{(reports.total_orders || 0).toLocaleString()}</div>
                </div>

                <div className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                      <TrendingUp className="w-6 h-6" />
                    </span>
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium mb-1">Avg. Order Value</h3>
                  <div className="text-3xl font-extrabold text-foreground">₹{(reports.average_order_value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Orders By Status */}
                <div className="p-6 sm:p-8 bg-card border border-border/40 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-rose-500" />
                    <span>Orders by Status</span>
                  </h3>
                  
                  {(!reports.orders_by_status || Object.keys(reports.orders_by_status).length === 0) ? (
                    <p className="text-sm text-foreground/50 py-4">No order status data available.</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(reports.orders_by_status).map(([status, count]) => (
                        <div key={status} className="flex items-center gap-4">
                          <span className="w-32 text-sm font-medium text-foreground/70 capitalize truncate">{status.replace('_', ' ')}</span>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-500 rounded-full" 
                              style={{ width: `${Math.max(2, (count / reports.total_orders) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-12 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Revenue Timeline */}
                <div className="p-6 sm:p-8 bg-card border border-border/40 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-rose-500" />
                    <span>Revenue Timeline</span>
                  </h3>

                  {(!reports.revenue_by_day || reports.revenue_by_day.length === 0) ? (
                    <p className="text-sm text-foreground/50 py-4">No timeline data available.</p>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {reports.revenue_by_day.map((day, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-2xl hover:bg-muted/30 transition-colors">
                          <span className="text-sm font-medium text-foreground/70">
                            {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            ₹{day.revenue.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
