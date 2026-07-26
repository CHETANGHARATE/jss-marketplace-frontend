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
  TrendingUp
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { data: dashboard, isLoading } = useVendorDashboardQuery();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 space-y-6 min-w-0 w-full">
          {/* Store Overview Card */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-4 h-4" />
              <span>Multi-Vendor Marketplace Store</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Seller Dashboard & Store Overview
            </h1>
            <p className="text-xs text-muted-custom font-medium max-w-xl">
              Track real-time store revenue, process customer orders, manage inventory stock levels, and monitor settlements.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs space-y-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-black text-foreground block">
                ₹{dashboard?.total_revenue ? dashboard.total_revenue.toLocaleString() : '0'}
              </span>
              <span className="text-xs font-bold text-muted-custom block">Total Net Revenue</span>
            </div>

            <div className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs space-y-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="text-2xl font-black text-foreground block">
                {dashboard?.total_orders || 0}
              </span>
              <span className="text-xs font-bold text-muted-custom block">Store Orders</span>
            </div>

            <div className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs space-y-2">
              <Package className="w-5 h-5 text-indigo-500" />
              <span className="text-2xl font-black text-foreground block">
                {dashboard?.total_products || 0}
              </span>
              <span className="text-xs font-bold text-muted-custom block">Listed Products</span>
            </div>

            <div className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs space-y-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-black text-amber-500 block">
                {dashboard?.low_stock_count || 0}
              </span>
              <span className="text-xs font-bold text-muted-custom block">Low Stock Alerts</span>
            </div>
          </div>

          {/* Low Stock Warning Alert */}
          {dashboard && dashboard.low_stock_count > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Attention: You have {dashboard.low_stock_count} products running low on stock!
                </span>
              </div>
              <Link
                href="/vendor/inventory"
                className="px-3 py-1.5 bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-600 transition-colors shrink-0"
              >
                Update Stock
              </Link>
            </div>
          )}

          {/* Recent Store Orders */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Recent Vendor Orders</span>
              </h3>
              <Link
                href="/vendor/orders"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Manage All Orders</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-muted-custom animate-pulse">
                Loading recent vendor orders...
              </div>
            ) : !dashboard?.recent_orders || dashboard.recent_orders.length === 0 ? (
              <p className="text-xs text-muted-custom py-6 text-center">
                No orders received for your store items yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {dashboard.recent_orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-3.5 bg-background-secondary rounded-2xl border border-border-custom text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-primary">#{ord.order_number}</span>
                      <span className="text-muted-custom block font-medium mt-0.5">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-foreground block">
                        ₹{ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="font-bold text-[10px] text-emerald-600 uppercase tracking-wider">
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
