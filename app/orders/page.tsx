'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrdersQuery } from '../../hooks/useOrders';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OrderSkeleton } from '../../components/OrderSkeleton';
import { Package, Search, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrdersQuery();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.items?.some((i) => i.product_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || ord.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'My Orders' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Order History</h1>
          <p className="text-sm text-foreground/60 font-medium mt-1">
            Track and manage your past marketplace orders and shipments.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-card border border-border/40 p-1.5 rounded-2xl">
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab}
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

      {isLoading ? (
        <OrderSkeleton count={3} />
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-xl mx-auto">
          <Package className="w-12 h-12 text-foreground/30 mx-auto" />
          <h3 className="text-xl font-bold text-foreground">No Orders Found</h3>
          <p className="text-sm text-foreground/60">
            {searchTerm || statusFilter !== 'all'
              ? 'No orders matched your active search filters.'
              : "You haven't placed any orders yet."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary/90"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
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
                  className={`inline-flex items-center gap-1 font-bold px-3 py-1 rounded-full capitalize text-[11px] w-fit ${
                    ord.status === 'delivered'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : ord.status === 'cancelled'
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  {ord.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                  {ord.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                  {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                    <Clock className="w-3 h-3" />
                  )}
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
          ))}
        </div>
      )}
    </div>
  );
}
