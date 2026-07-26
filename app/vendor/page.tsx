'use client';

import React from 'react';
import Link from 'next/link';
import { useVendorDashboardQuery } from '../../hooks/useVendor';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { VendorSidebar } from '../../components/VendorSidebar';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { data: dashboard, isLoading } = useVendorDashboardQuery();

  return (
    <div className="space-y-8 sm:space-y-10">
      <Breadcrumbs items={[{ label: 'Vendor Portal' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 space-y-6 min-w-0 w-full">
          {/* Store Hero Overview Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95" />
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  <ShieldCheck size={13} />
                  <span>GSTIN Verified Seller Storefront</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Seller Dashboard & Store Overview
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-lg leading-relaxed">
                  Track real-time store revenue, process buyer orders, update inventory stock levels, and monitor wallet settlements.
                </p>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-300 block">
                  Payout Status
                </span>
                <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Direct Escrow</span>
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3">
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-2xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">
                  ₹{dashboard?.total_revenue ? dashboard.total_revenue.toLocaleString() : '0'}
                </span>
                <span className="text-xs font-black text-muted-custom block">Total Net Revenue</span>
              </div>
            </div>

            <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">
                  {dashboard?.total_orders || 0}
                </span>
                <span className="text-xs font-black text-muted-custom block">Store Orders</span>
              </div>
            </div>

            <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-2xs">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">
                  {dashboard?.total_products || 0}
                </span>
                <span className="text-xs font-black text-muted-custom block">Listed Products</span>
              </div>
            </div>

            <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-2xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-amber-500 block">
                  {dashboard?.low_stock_count || 0}
                </span>
                <span className="text-xs font-black text-muted-custom block">Low Stock Alerts</span>
              </div>
            </div>
          </div>

          {/* Low Stock Warning Alert */}
          {dashboard && dashboard.low_stock_count > 0 && (
            <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-between gap-4 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5 text-amber-600 font-extrabold">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>
                  Attention: You have {dashboard.low_stock_count} products running low on stock!
                </span>
              </div>
              <Link
                href="/vendor/inventory"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-colors shrink-0 shadow-2xs"
              >
                Update Stock
              </Link>
            </div>
          )}

          {/* Recent Store Orders */}
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom/80">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Recent Vendor Orders</span>
              </h3>
              <Link
                href="/vendor/orders"
                className="text-xs font-black text-primary hover:underline flex items-center gap-1.5"
              >
                <span>Manage All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs font-bold text-muted-custom animate-pulse">
                Loading recent vendor orders...
              </div>
            ) : !dashboard?.recent_orders || dashboard.recent_orders.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <ShoppingBag className="w-10 h-10 text-muted-custom/30 mx-auto" />
                <p className="text-xs font-bold text-muted-custom">
                  No orders received for your store items yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.recent_orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-4 bg-background-secondary/80 rounded-2xl border border-border-custom/80 text-xs"
                  >
                    <div>
                      <span className="font-mono font-black text-primary text-sm">#{ord.order_number}</span>
                      <span className="text-muted-custom block font-semibold mt-0.5">
                        Received on {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="font-black text-foreground text-sm block">
                        ₹{ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="font-black text-[10px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
