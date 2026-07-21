'use client';

import React, { useState } from 'react';
import { useVendorOrdersQuery, useUpdateVendorOrderStatusMutation } from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { ShoppingBag } from 'lucide-react';

export default function VendorOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, isLoading } = useVendorOrdersQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const updateStatusMutation = useUpdateVendorOrderStatusMutation();

  const orders = data?.data || [];

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal', href: '/vendor' }, { label: 'Vendor Orders' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <span>Vendor Orders & Fulfillment</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Process customer orders, update packing & shipping statuses.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-2xl border border-border/40 text-xs font-bold">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                    statusFilter === tab
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading vendor orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Orders Found</h3>
              <p className="text-xs text-foreground/60">No orders matching your active filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-primary text-sm">#{ord.order_number}</span>
                      <span className="text-foreground/50">•</span>
                      <span className="text-foreground/60 font-medium">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-foreground/60 font-bold">Fulfillment Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusUpdate(ord.id, e.target.value)}
                        className="bg-muted/30 border border-border/40 text-foreground text-xs font-bold rounded-xl px-2.5 py-1 focus:outline-none focus:border-primary capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing (Packed)</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground truncate max-w-sm">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-black text-primary">
                          ₹{(item.unit_price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-foreground/60">
                      Customer: <span className="font-bold text-foreground">{ord.shipping_address_snapshot?.full_name || 'Verified Buyer'}</span>
                    </span>
                    <span className="text-base font-black text-primary">
                      Total: ₹{ord.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
