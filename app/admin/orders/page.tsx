'use client';

import React, { useState } from 'react';
import { useAdminOrdersQuery, useUpdateAdminOrderStatusMutation } from '../../../hooks/useAdmin';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { ShoppingBag, Search, Eye, Printer, FileText, CheckCircle2, Clock, Truck, XCircle, AlertCircle, Package } from 'lucide-react';
import { ApiOrder } from '../../../types/api';

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);

  const { data, isLoading } = useAdminOrdersQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const updateStatusMutation = useUpdateAdminOrderStatusMutation();

  const rawOrders = data?.data || [];
  const orders = rawOrders.filter((ord) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ord.order_number?.toLowerCase().includes(q) ||
      ord.shipping_address_snapshot?.full_name?.toLowerCase().includes(q) ||
      ord.shipping_address_snapshot?.phone?.includes(q)
    );
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const statusTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'processing', label: 'Processing' },
    { id: 'packed', label: 'Packed' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform Orders & Fulfillment Lifecycle"
        subtitle="Track multi-vendor customer orders, review payment & tax invoices, manage shipping labels, and override order statuses."
        badge="Order Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by Order # or Customer..."
                className="pl-9 pr-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-card border border-border-custom/80 text-muted-custom hover:text-foreground hover:bg-background-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
          Loading marketplace orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card border border-border-custom/80 rounded-3xl">
          <ShoppingBag className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Orders Found</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            No marketplace orders matching status & search criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-2xs space-y-4 hover:border-primary/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-custom/60 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-primary text-sm">#{ord.order_number}</span>
                  <span className="text-muted-custom font-medium">
                    {new Date(ord.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-custom font-bold">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusUpdate(ord.id, e.target.value)}
                      className="bg-background-secondary border border-border-custom/80 text-foreground text-xs font-black rounded-xl px-2.5 py-1 focus:outline-none capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="p-1.5 bg-background-secondary border border-border-custom/80 rounded-lg text-muted-custom hover:text-foreground transition-colors"
                    title="Inspect Full Invoice & Shipping Address"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {ord.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground truncate max-w-md">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-black text-primary">
                      ₹{(item.unit_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-border-custom/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-muted-custom font-medium">
                  Buyer: <span className="font-black text-foreground">{ord.shipping_address_snapshot?.full_name || 'Marketplace Buyer'}</span> ({ord.shipping_address_snapshot?.phone || 'No Phone'})
                </span>
                <span className="text-base font-black text-primary">
                  Grand Total: ₹{ord.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice & Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom/60">
              <div>
                <span className="text-xs font-black uppercase text-primary tracking-wider">Tax Invoice Breakdown</span>
                <h3 className="text-xl font-black text-foreground">Order #{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-muted-custom hover:text-foreground bg-background-secondary"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-background-secondary rounded-2xl border border-border-custom/80 space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-custom">Customer Info</span>
                <p className="font-black text-foreground">{selectedOrder.shipping_address_snapshot?.full_name}</p>
                <p className="text-muted-custom">{selectedOrder.shipping_address_snapshot?.phone}</p>
              </div>

              <div className="p-4 bg-background-secondary rounded-2xl border border-border-custom/80 space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-custom">Delivery Address</span>
                <p className="font-bold text-foreground truncate">{selectedOrder.shipping_address_snapshot?.address_line1}</p>
                <p className="text-muted-custom">{selectedOrder.shipping_address_snapshot?.city}, {selectedOrder.shipping_address_snapshot?.state} - {selectedOrder.shipping_address_snapshot?.postal_code}</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black text-foreground">Purchased Items ({selectedOrder.items?.length || 0})</span>
              <div className="divide-y divide-border-custom/60 border border-border-custom/80 rounded-2xl p-4 bg-background-secondary text-xs">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="py-2 flex justify-between">
                    <span>{item.quantity}x {item.product_name}</span>
                    <span className="font-black text-foreground">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border-custom/60">
              <span className="text-xs font-bold text-muted-custom">Total Paid</span>
              <span className="text-xl font-black text-primary">₹{selectedOrder.total_amount?.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-primary text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
