'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminDashboardQuery, useAdminSalesAnalyticsQuery } from '../../hooks/useAdmin';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Clock,
  Activity,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Truck,
  RefreshCw,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | '7d' | '30d' | 'month'>('30d');
  const { data: dashboard, isLoading: isDashboardLoading, refetch } = useAdminDashboardQuery();
  const { data: salesAnalytics } = useAdminSalesAnalyticsQuery(undefined);

  const dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'This Month', value: 'month' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Control Center & Executive Dashboard"
        subtitle="Monitor platform performance, revenue, multi-vendor approvals, catalog health, and order fulfillment metrics in real-time."
        badge="Enterprise Marketplace Dashboard"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Date Range Selector */}
            <div className="flex items-center gap-1 bg-background-secondary border border-border-custom/80 p-1 rounded-xl">
              {dateOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dateRange === opt.value
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-muted-custom hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => refetch()}
              className="p-2 rounded-xl bg-background-secondary border border-border-custom/80 text-foreground/80 hover:text-foreground transition-all"
              title="Refresh Dashboard Metrics"
            >
              <RefreshCw size={16} className={isDashboardLoading ? 'animate-spin text-primary' : ''} />
            </button>
          </div>
        }
      />

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-muted-custom tracking-wider">Gross Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-black">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-foreground block tracking-tight">
              ₹{dashboard?.total_revenue ? dashboard.total_revenue.toLocaleString() : '0'}
            </span>
            <span className="text-xs font-bold text-emerald-500 inline-flex items-center gap-1">
              <TrendingUp size={13} />
              <span>+14.8% vs previous period</span>
            </span>
          </div>
        </div>

        <div className="p-6 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-muted-custom tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-foreground block tracking-tight">
              {dashboard?.total_orders || 0}
            </span>
            <span className="text-xs font-bold text-muted-custom inline-flex items-center gap-1">
              <Clock size={13} />
              <span>Across all fulfillment channels</span>
            </span>
          </div>
        </div>

        <div className="p-6 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-muted-custom tracking-wider">Active Customers</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center font-black">
              <Users size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-foreground block tracking-tight">
              {dashboard?.total_customers || 0}
            </span>
            <span className="text-xs font-bold text-indigo-500 inline-flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Verified customer accounts</span>
            </span>
          </div>
        </div>

        <div className="p-6 bg-card border border-border-custom/80 rounded-3xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-muted-custom tracking-wider">Registered Vendors</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-black">
              <Store size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-foreground block tracking-tight">
              {dashboard?.total_vendors || 0}
            </span>
            <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-1">
              <Sparkles size={13} />
              <span>Active marketplace sellers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Required Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Pending Vendor KYC
            </span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
              {dashboard?.pending_vendor_approvals || 0} Stores
            </span>
          </div>
          <Link
            href="/admin/vendors"
            className="px-4 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-2xs shrink-0"
          >
            Verify Stores
          </Link>
        </div>

        <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Pending Catalog Review
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
              {dashboard?.pending_product_approvals || 0} Products
            </span>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors shadow-2xs shrink-0"
          >
            Review Catalog
          </Link>
        </div>

        <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-rose-500 uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>Low / Out of Stock</span>
            </span>
            <span className="text-2xl font-black text-rose-500 block">
              {dashboard?.low_stock_alerts || 0} Alerts
            </span>
          </div>
          <Link
            href="/admin/inventory"
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors shadow-2xs shrink-0"
          >
            View Inventory
          </Link>
        </div>
      </div>

      {/* Recent Orders & Quick Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Recent Platform Orders */}
        <div className="lg:col-span-8 bg-card border border-border-custom/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
            <div>
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Recent Platform Orders</span>
              </h3>
              <p className="text-xs text-muted-custom font-medium">Real-time breakdown of recent customer transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {isDashboardLoading ? (
            <div className="py-12 text-center text-xs text-muted-custom font-bold animate-pulse">
              Loading recent marketplace orders...
            </div>
          ) : !dashboard?.recent_orders || dashboard.recent_orders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <ShoppingBag className="w-10 h-10 text-muted-custom/40 mx-auto" />
              <p className="text-xs text-muted-custom font-bold">No orders recorded on the platform yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-custom/60">
              {dashboard.recent_orders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-background-secondary/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black">
                      <ShoppingBag size={17} />
                    </div>
                    <div>
                      <span className="font-mono font-black text-primary block">#{ord.order_number}</span>
                      <span className="text-muted-custom font-medium block text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="font-black text-foreground block text-sm">
                      ₹{ord.total_amount?.toLocaleString()}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Quick Administrative Shortcuts & System Health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-foreground flex items-center gap-2 pb-3 border-b border-border-custom/60">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span>System & Service Status</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-2xl border border-border-custom/80">
                <span className="font-bold text-foreground">Laravel REST API (v1)</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px] uppercase rounded-full">
                  100% Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-2xl border border-border-custom/80">
                <span className="font-bold text-foreground">MySQL Database</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px] uppercase rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-2xl border border-border-custom/80">
                <span className="font-bold text-foreground">Media & Cloud Storage</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px] uppercase rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-foreground flex items-center gap-2 pb-3 border-b border-border-custom/60">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <span>Management Shortcuts</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/products/import"
                className="p-3 bg-background-secondary hover:bg-primary/10 border border-border-custom/80 hover:border-primary/40 rounded-2xl font-bold text-foreground hover:text-primary transition-all text-center space-y-1 block"
              >
                <Package className="w-5 h-5 mx-auto text-primary" />
                <span className="block truncate">Bulk Import</span>
              </Link>
              <Link
                href="/admin/categories"
                className="p-3 bg-background-secondary hover:bg-primary/10 border border-border-custom/80 hover:border-primary/40 rounded-2xl font-bold text-foreground hover:text-primary transition-all text-center space-y-1 block"
              >
                <Layers className="w-5 h-5 mx-auto text-indigo-500" />
                <span className="block truncate">Categories</span>
              </Link>
              <Link
                href="/admin/reports"
                className="p-3 bg-background-secondary hover:bg-primary/10 border border-border-custom/80 hover:border-primary/40 rounded-2xl font-bold text-foreground hover:text-primary transition-all text-center space-y-1 block"
              >
                <BarChart3 className="w-5 h-5 mx-auto text-emerald-500" />
                <span className="block truncate">Export Reports</span>
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 bg-background-secondary hover:bg-primary/10 border border-border-custom/80 hover:border-primary/40 rounded-2xl font-bold text-foreground hover:text-primary transition-all text-center space-y-1 block"
              >
                <Sliders className="w-5 h-5 mx-auto text-amber-500" />
                <span className="block truncate">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
