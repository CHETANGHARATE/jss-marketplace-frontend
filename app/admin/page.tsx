'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminDashboardQuery } from '../../hooks/useAdmin';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AdminSidebar } from '../../components/AdminSidebar';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Clock,
  Activity,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useAdminDashboardQuery();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 space-y-8 min-w-0 w-full">
          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500">
                    Enterprise Marketplace Control Center
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
                  Global System Administrator Dashboard
                </h1>
                <p className="text-xs text-foreground/60 font-medium mt-1">
                  Monitor marketplace health, approve multi-vendor store applications, moderate product catalogs, and review revenue reports.
                </p>
              </div>

              <div className="shrink-0 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">
                  API & Microservices Status
                </span>
                <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-1.5 mt-0.5">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>100% Operational</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-black text-foreground block">
                ₹{dashboard?.total_revenue ? dashboard.total_revenue.toLocaleString() : '0'}
              </span>
              <span className="text-xs font-bold text-foreground/60 block">Gross Revenue</span>
            </div>

            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="text-2xl font-black text-foreground block">
                {dashboard?.total_orders || 0}
              </span>
              <span className="text-xs font-bold text-foreground/60 block">Total Orders</span>
            </div>

            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-2xl font-black text-foreground block">
                {dashboard?.total_customers || 0}
              </span>
              <span className="text-xs font-bold text-foreground/60 block">Active Customers</span>
            </div>

            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <Store className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-black text-foreground block">
                {dashboard?.total_vendors || 0}
              </span>
              <span className="text-xs font-bold text-foreground/60 block">Registered Vendors</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase block">
                  Pending Vendor Applications
                </span>
                <span className="text-2xl font-black text-amber-600 block">
                  {dashboard?.pending_vendor_approvals || 0} Vendors
                </span>
              </div>
              <Link
                href="/admin/vendors"
                className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors"
              >
                Review Vendors
              </Link>
            </div>

            <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase block">
                  Pending Catalog Products
                </span>
                <span className="text-2xl font-black text-indigo-600 block">
                  {dashboard?.pending_product_approvals || 0} Items
                </span>
              </div>
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Moderate Catalog
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                <span>Recent Platform Orders</span>
              </h3>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-foreground/50 animate-pulse">
                Loading marketplace orders...
              </div>
            ) : !dashboard?.recent_orders || dashboard.recent_orders.length === 0 ? (
              <p className="text-xs text-foreground/50 py-4 text-center">
                No orders recorded on the marketplace platform yet.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboard.recent_orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-3.5 bg-muted/20 rounded-2xl border border-border/40 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-rose-500">#{ord.order_number}</span>
                      <span className="text-foreground/60 block font-medium">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-foreground block">
                        ₹{ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="font-bold text-[11px] text-emerald-600 capitalize">
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
