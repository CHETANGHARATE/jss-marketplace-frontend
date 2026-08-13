'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminDashboardQuery, useAdminSalesAnalyticsQuery } from '../../hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import {
  ShoppingBag,
  DollarSign,
  Package,
  Store,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Tag,
  Layers,
  FileSpreadsheet,
  Activity,
  AlertCircle,
  CheckCircle2,
  BarChart2,
  Calendar,
  Check,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0];
}

// Status colours for order donut
const STATUS_COLORS: Record<string, string> = {
  delivered: '#22C55E',
  processing: '#3B82F6',
  shipped: '#F59E0B',
  pending: '#A855F7',
  cancelled: '#EF4444',
  confirmed: '#10B981',
};

const STATUS_LABEL: Record<string, string> = {
  delivered: 'Delivered',
  processing: 'Processing',
  shipped: 'Shipped',
  pending: 'Pending',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
};

type DatePreset = 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'last_month' | 'all' | 'custom';

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
      <div className="h-8 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: string; up: boolean };
}

function KpiCard({ title, value, subtitle, icon, iconBg, trend }: KpiCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-black text-slate-800 leading-tight truncate">{value}</p>
          {trend && (
            <p className={`text-[11px] font-semibold flex items-center gap-1 ${trend.up ? 'text-emerald-600' : 'text-rose-500'}`}>
              {trend.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {trend.value}
            </p>
          )}
          {subtitle && !trend && (
            <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Custom Tooltip for chart ─────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name === 'revenue' ? `Revenue: ${formatINR(p.value)}` : `Orders: ${p.value}`}
        </p>
      ))}
    </div>
  );
}

// ─── Order status donut legend ────────────────────────────────────────────────

function DonutLegend({ data, total }: { data: { name: string; value: number; color: string }[]; total: number }) {
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-xs font-medium text-slate-600">{d.name}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800">{d.value.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 ml-1">({total > 0 ? Math.round((d.value / total) * 100) : 0}%)</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ── Date Range State & Preset Logic ──────────────────────────────────────
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('all');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toISODate(d);
  });
  const [customEnd, setCustomEnd] = useState<string>(() => toISODate(new Date()));

  // Close date picker dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  // Compute start_date and end_date based on selected preset
  const dateRangeParams = useMemo(() => {
    const now = new Date();
    const today = toISODate(now);

    switch (selectedPreset) {
      case 'today':
        return { start_date: today, end_date: today };
      case 'yesterday': {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yStr = toISODate(y);
        return { start_date: yStr, end_date: yStr };
      }
      case '7d': {
        const d7 = new Date();
        d7.setDate(d7.getDate() - 7);
        return { start_date: toISODate(d7), end_date: today };
      }
      case '30d': {
        const d30 = new Date();
        d30.setDate(d30.getDate() - 30);
        return { start_date: toISODate(d30), end_date: today };
      }
      case 'this_month': {
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start_date: toISODate(firstOfMonth), end_date: today };
      }
      case 'last_month': {
        const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start_date: toISODate(firstOfLastMonth), end_date: toISODate(lastOfLastMonth) };
      }
      case 'custom':
        return { start_date: customStart, end_date: customEnd };
      case 'all':
      default:
        return undefined;
    }
  }, [selectedPreset, customStart, customEnd]);

  // Dynamic label for the Date Range button
  const dateRangeLabel = useMemo(() => {
    const todayFormatted = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    switch (selectedPreset) {
      case 'today':
        return `${todayFormatted} — Today`;
      case 'yesterday':
        return 'Yesterday';
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case 'this_month':
        return `This Month (${new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })})`;
      case 'last_month':
        return 'Last Month';
      case 'custom':
        return `${formatDate(customStart)} – ${formatDate(customEnd)}`;
      case 'all':
      default:
        return `${todayFormatted} — All Time`;
    }
  }, [selectedPreset, customStart, customEnd]);

  // ── Queries with date filtering ───────────────────────────────────────────
  const [chartPeriod, setChartPeriod] = useState<'7d' | '14d' | '30d'>('30d');
  const { data: dashboard, isLoading, refetch } = useAdminDashboardQuery(dateRangeParams);
  const { data: salesAnalytics } = useAdminSalesAnalyticsQuery(dateRangeParams);

  // ── Refresh Handler ───────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] }),
        refetch(),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // ── Derived chart data ────────────────────────────────────────────────────
  const salesChartData = useMemo(() => {
    const raw = dashboard?.sales_chart ?? [];
    const days = chartPeriod === '7d' ? 7 : chartPeriod === '14d' ? 14 : 30;
    const sliced = raw.slice(-days);
    return sliced.map((d) => ({
      ...d,
      label: formatDate(d.date),
    }));
  }, [dashboard?.sales_chart, chartPeriod]);

  const donutData = useMemo(() => {
    const statusMap = dashboard?.orders_by_status ?? salesAnalytics?.orders_by_status ?? {};
    return Object.entries(statusMap)
      .filter(([, v]) => v > 0)
      .map(([key, val]) => ({
        name: STATUS_LABEL[key] ?? key,
        value: val,
        color: STATUS_COLORS[key] ?? '#94A3B8',
      }))
      .sort((a, b) => b.value - a.value);
  }, [dashboard?.orders_by_status, salesAnalytics?.orders_by_status]);

  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);
  const topCategories = dashboard?.top_categories ?? [];

  // ── Quick actions ─────────────────────────────────────────────────────────
  const quickActions = [
    {
      label: 'Add Product',
      sub: 'Create New Product',
      href: '/admin/products/create',
      icon: PlusCircle,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'Add Category',
      sub: 'Create New Category',
      href: '/admin/categories',
      icon: Layers,
      color: 'bg-green-50 text-green-600 border-green-100',
    },
    {
      label: 'Add Seller',
      sub: 'Register New Seller',
      href: '/admin/vendors',
      icon: Store,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      label: 'New Offer',
      sub: 'Create Offer / Coupon',
      href: '/admin/coupons',
      icon: Tag,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      label: 'View Orders',
      sub: 'Manage All Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      label: 'Bulk Import',
      sub: 'Import Product CSV',
      href: '/admin/products/import',
      icon: FileSpreadsheet,
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
  ];

  // ── Status badge colour ────────────────────────────────────────────────────
  function statusBadge(status: string) {
    const map: Record<string, string> = {
      delivered: 'bg-emerald-100 text-emerald-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-amber-100 text-amber-700',
      pending: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-rose-100 text-rose-700',
      confirmed: 'bg-teal-100 text-teal-700',
    };
    return map[status] ?? 'bg-slate-100 text-slate-600';
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-8">

      {/* ── Welcome Header with Interactive Controls ──────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-0.5">Welcome back,</p>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            {user?.name || 'JDS Technologies'}
            <span className="text-blue-500">
              <CheckCircle2 size={22} />
            </span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Super Admin</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 relative" ref={datePickerRef}>
          {/* Interactive Date Range Button */}
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-98 transition-all cursor-pointer"
            title="Filter dashboard by date range"
          >
            <Calendar size={15} className="text-blue-600 shrink-0" />
            <span>{dateRangeLabel}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180 text-blue-600' : ''}`} />
          </button>

          {/* Date Range Dropdown Popover */}
          {isDatePickerOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 border-b border-slate-100 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Date Range</span>
              </div>

              {/* Preset Buttons */}
              <div className="space-y-1">
                {[
                  { id: 'all' as DatePreset, label: 'All Time (Default)' },
                  { id: 'today' as DatePreset, label: 'Today' },
                  { id: 'yesterday' as DatePreset, label: 'Yesterday' },
                  { id: '7d' as DatePreset, label: 'Last 7 Days' },
                  { id: '30d' as DatePreset, label: 'Last 30 Days' },
                  { id: 'this_month' as DatePreset, label: 'This Month' },
                  { id: 'last_month' as DatePreset, label: 'Last Month' },
                  { id: 'custom' as DatePreset, label: 'Custom Range' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      if (preset.id !== 'custom') {
                        setIsDatePickerOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      selectedPreset === preset.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {selectedPreset === preset.id && <Check size={14} className="text-blue-600" />}
                  </button>
                ))}
              </div>

              {/* Custom Date Inputs (when Custom Range is active) */}
              {selectedPreset === 'custom' && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">End Date</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(false)}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Apply Custom Range
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interactive Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-60"
            title="Refresh dashboard data"
          >
            <RefreshCw
              size={15}
              className={`${isRefreshing || isLoading ? 'animate-spin text-blue-600' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <KpiCard
              title="Total Orders"
              value={(dashboard?.total_orders ?? 0).toLocaleString()}
              icon={<ShoppingBag size={22} className="text-blue-600" />}
              iconBg="bg-blue-50"
              trend={{ value: 'Filtered period', up: true }}
            />
            <KpiCard
              title="Total Revenue"
              value={formatINR(dashboard?.total_revenue ?? 0)}
              icon={<DollarSign size={22} className="text-emerald-600" />}
              iconBg="bg-emerald-50"
              trend={{ value: 'vs prev period', up: true }}
            />
            <KpiCard
              title="Total Products"
              value={(dashboard?.total_products ?? 0).toLocaleString()}
              icon={<Package size={22} className="text-violet-600" />}
              iconBg="bg-violet-50"
              subtitle="Active in catalog"
            />
            <KpiCard
              title="Total Sellers"
              value={(dashboard?.total_vendors ?? 0).toLocaleString()}
              icon={<Store size={22} className="text-orange-500" />}
              iconBg="bg-orange-50"
              subtitle="Active marketplace sellers"
            />
            <KpiCard
              title="Total Customers"
              value={(dashboard?.total_customers ?? 0).toLocaleString()}
              icon={<Users size={22} className="text-rose-500" />}
              iconBg="bg-rose-50"
              subtitle="Verified accounts"
            />
          </>
        )}
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Sales Overview Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-slate-800">Sales Overview</h2>
              <p className="text-xs text-slate-400 font-medium">Revenue & Orders trend</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['7d', '14d', '30d'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setChartPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    chartPeriod === p
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p === '7d' ? '7 Days' : p === '14d' ? '14 Days' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {salesChartData.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-slate-400 gap-2">
              <BarChart2 size={36} className="opacity-30" />
              <p className="text-xs font-semibold">No sales data for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="rev"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatINR(v)}
                />
                <YAxis
                  yAxisId="ord"
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  yAxisId="rev"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#revGradient)"
                  dot={{ r: 3, fill: '#3B82F6' }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  yAxisId="ord"
                  type="monotone"
                  dataKey="orders"
                  stroke="#F97316"
                  strokeWidth={2}
                  fill="url(#ordGradient)"
                  dot={{ r: 3, fill: '#F97316' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Chart legend */}
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />
              <span className="text-[11px] font-semibold text-slate-500">Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-orange-400 rounded-full inline-block" />
              <span className="text-[11px] font-semibold text-slate-500">Orders</span>
            </div>
          </div>
        </div>

        {/* Order Status Donut */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-black text-slate-800">Order Status</h2>
            <span className="text-xs text-slate-400 font-semibold">
              Total Orders
            </span>
          </div>
          <p className="text-2xl font-black text-slate-800 mb-3">{donutTotal.toLocaleString()}</p>

          {donutData.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Activity size={32} className="opacity-30" />
              <p className="text-xs font-semibold">No order data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [Number(value).toLocaleString(), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <DonutLegend data={donutData} total={donutTotal} />
            </>
          )}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border bg-white hover:shadow-md transition-all group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color} transition-transform group-hover:scale-110`}>
                <Icon size={20} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">{a.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{a.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Recent Orders + Top Categories ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-800">Recent Orders</h2>
              <p className="text-[11px] text-slate-400 font-medium">Latest marketplace transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !dashboard?.recent_orders?.length ? (
            <div className="py-14 flex flex-col items-center justify-center text-slate-400 gap-2">
              <ShoppingBag size={36} className="opacity-30" />
              <p className="text-xs font-semibold">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 font-bold text-slate-500 uppercase tracking-wide text-[10px]">Order ID</th>
                    <th className="text-left px-3 py-3 font-bold text-slate-500 uppercase tracking-wide text-[10px]">Customer</th>
                    <th className="text-right px-3 py-3 font-bold text-slate-500 uppercase tracking-wide text-[10px]">Amount</th>
                    <th className="text-center px-3 py-3 font-bold text-slate-500 uppercase tracking-wide text-[10px]">Status</th>
                    <th className="text-right px-5 py-3 font-bold text-slate-500 uppercase tracking-wide text-[10px]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboard.recent_orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono font-black text-blue-600">#{ord.order_number}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[10px] shrink-0">
                            {(ord as any)?.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-semibold text-slate-700 truncate max-w-[100px]">
                            {(ord as any)?.user?.name ?? 'Customer'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-black text-slate-800">
                        ₹{ord.total_amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-slate-400 font-medium">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Selling Categories */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-800">Top Selling Categories</h2>
              <p className="text-[11px] text-slate-400 font-medium">By items sold</p>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topCategories.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Layers size={36} className="opacity-30" />
              <p className="text-xs font-semibold">No category data yet</p>
              <p className="text-[11px] text-slate-300">Categories will appear once orders are placed</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {topCategories.map((cat, idx) => {
                const barColors = ['#FF1654', '#F97316', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7'];
                const color = barColors[idx % barColors.length];
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ background: color }}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">{cat.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800">{cat.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${cat.percentage}%`, background: color }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 w-16 text-right font-medium">
                        {cat.total_sold.toLocaleString()} sold
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Action Alerts + System Status ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Action Required Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-0.5">Pending Vendor KYC</p>
              <p className="text-xl font-black text-amber-700">
                {dashboard?.pending_vendor_approvals ?? 0} <span className="text-sm font-semibold">Stores</span>
              </p>
            </div>
            <Link href="/admin/vendors" className="px-3 py-2 bg-amber-500 text-white text-[11px] font-bold rounded-xl hover:bg-amber-600 transition-colors shrink-0 cursor-pointer">
              Verify
            </Link>
          </div>

          <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-0.5">Pending Review</p>
              <p className="text-xl font-black text-blue-700">
                {dashboard?.pending_product_approvals ?? 0} <span className="text-sm font-semibold">Products</span>
              </p>
            </div>
            <Link href="/admin/products" className="px-3 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-xl hover:bg-blue-700 transition-colors shrink-0 cursor-pointer">
              Review
            </Link>
          </div>

          <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <AlertCircle size={10} /> Low / Out of Stock
              </p>
              <p className="text-xl font-black text-rose-700">
                {dashboard?.low_stock_count ?? 0} <span className="text-sm font-semibold">Alerts</span>
              </p>
            </div>
            <Link href="/admin/inventory" className="px-3 py-2 bg-rose-500 text-white text-[11px] font-bold rounded-xl hover:bg-rose-600 transition-colors shrink-0 cursor-pointer">
              Inventory
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            System & Service Status
          </h2>
          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Laravel REST API (v1)', status: dashboard?.system_health === 'healthy' ? 'OPERATIONAL' : 'DEGRADED', ok: dashboard?.system_health === 'healthy' },
              { label: 'MySQL Database', status: 'CONNECTED', ok: true },
              { label: 'Media & Cloud Storage', status: 'ACTIVE', ok: true },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">{s.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  s.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
