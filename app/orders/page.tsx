'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useOrdersQuery } from '../../hooks/useOrders';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OrderSkeleton } from '../../components/OrderSkeleton';
import {
  Package,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrdersQuery({
    enabled: isAuthenticated && !isAuthLoading,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((ord) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      ord.order_number?.toLowerCase().includes(term) ||
      ord.items?.some((i) => i.product_name?.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === 'all' || ord.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'delivered':
        return {
          classes: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      case 'confirmed':
        return {
          classes: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      case 'processing':
        return {
          classes: 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'shipped':
        return {
          classes: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
          icon: <Package className="w-3 h-3" />,
        };
      case 'cancelled':
        return {
          classes: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
          icon: <XCircle className="w-3 h-3" />,
        };
      case 'pending':
      default:
        return {
          classes: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
          icon: <Clock className="w-3 h-3" />,
        };
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'My Orders' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Order History</h1>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh Orders"
              className="p-1.5 rounded-lg border border-border/40 hover:bg-muted text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-foreground/60 font-medium mt-1">
            Track and manage your past marketplace orders and shipments.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-card border border-border/40 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order number or product name..."
          className="w-full bg-card border border-border/40 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
        />
        <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3.5" />
      </div>

      {/* Loading state */}
      {isAuthLoading || (isOrdersLoading && isAuthenticated) ? (
        <OrderSkeleton count={3} />
      ) : !isAuthenticated && !isAuthLoading ? (
        /* Not logged in */
        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-xl mx-auto">
          <Package className="w-12 h-12 text-foreground/30 mx-auto" />
          <h3 className="text-xl font-bold text-foreground">Sign In Required</h3>
          <p className="text-sm text-foreground/60">
            Please sign in to your account to view your past orders and live tracking updates.
          </p>
          <Link
            href="/login?redirect=/orders"
            className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary/90"
          >
            Sign In to Account
          </Link>
        </div>
      ) : isError ? (
        /* API error state */
        <div className="py-20 text-center bg-card border border-rose-500/20 rounded-3xl space-y-4 shadow-sm max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-foreground">Failed to Load Orders</h3>
          <p className="text-sm text-foreground/60 max-w-md mx-auto">
            {(error as any)?.message ||
              'We could not retrieve your orders at this time. Please check your connection and try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary/90 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty results */
        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-xl mx-auto">
          <Package className="w-12 h-12 text-foreground/30 mx-auto" />
          <h3 className="text-xl font-bold text-foreground">No Orders Found</h3>
          <p className="text-sm text-foreground/60">
            {searchTerm || statusFilter !== 'all'
              ? 'No orders matched your active search filters.'
              : "You haven't placed any orders yet."}
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="inline-block px-6 py-2.5 bg-muted text-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-muted/80"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary/90"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        /* Render orders list */
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            return (
              <div
                key={ord.id}
                className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm hover:border-primary/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/40 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary text-sm">#{ord.order_number}</span>
                    <span className="text-foreground/50">•</span>
                    <span className="text-foreground/60 font-medium">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 font-bold px-3 py-1 rounded-full capitalize text-[11px] w-fit ${badge.classes}`}
                  >
                    {badge.icon}
                    <span>{ord.status}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {ord.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground truncate max-w-xs">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-bold text-foreground/80">
                        ₹{(item.unit_price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {ord.items && ord.items.length > 3 && (
                    <span className="text-[11px] text-foreground/50 font-semibold block">
                      + {ord.items.length - 3} more items...
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div>
                    <span className="text-xs text-foreground/50 block font-medium">Total Amount</span>
                    <span className="text-lg font-black text-primary">₹{ord.total_amount?.toLocaleString()}</span>
                  </div>

                  <Link
                    href={`/orders/${ord.order_number}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors"
                  >
                    <span>Order Details & Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
