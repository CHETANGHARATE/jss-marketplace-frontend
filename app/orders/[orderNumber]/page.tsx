'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrderByNumberQuery, useCancelOrderMutation } from '../../../hooks/useOrders';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { OrderStatusTimeline } from '../../../components/OrderStatusTimeline';
import { OrderSkeleton } from '../../../components/OrderSkeleton';
import {
  Printer,
  Ban,
  MapPin,
  CreditCard,
  Calendar,
  PackageCheck,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = typeof params?.orderNumber === 'string' ? params.orderNumber : '';

  const { data: order, isLoading, isError } = useOrderByNumberQuery(orderNumber);
  const cancelMutation = useCancelOrderMutation();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: 'Orders', href: '/orders' }, { label: orderNumber }]} />
        <OrderSkeleton count={1} />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-sm text-foreground/60">
          The requested order #{orderNumber} could not be found in your account history.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  const handlePrintInvoice = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCancelOrder = () => {
    if (confirm(`Are you sure you want to cancel Order #${order.order_number}?`)) {
      cancelMutation.mutate(order.order_number, {
        onSuccess: () => alert('Order cancelled successfully.'),
      });
    }
  };

  const canCancel = ['pending', 'confirmed'].includes(order.status.toLowerCase());
  const shippingAddr = order.shipping_address_snapshot;

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Orders', href: '/orders' }, { label: `#${order.order_number}` }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <span>Order #{order.order_number}</span>
          </h1>
          <p className="text-xs text-foreground/60 font-semibold mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Placed on{' '}
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrintInvoice}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border/40 rounded-xl text-xs font-bold text-foreground/80 hover:border-primary transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-500/30 text-rose-500 bg-rose-500/10 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50 mb-4">
          Shipment Progress Tracking
        </h3>
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
            <PackageCheck className="w-5 h-5 text-primary" />
            <span>Ordered Items ({order.items?.length || 0})</span>
          </h3>

          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3 bg-muted/20 rounded-2xl border border-border/40"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted/40 rounded-xl flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{item.product_name}</h4>
                    <span className="text-xs text-foreground/60">Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-primary">
                    ₹{(item.unit_price * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-foreground/50 block">₹{item.unit_price} each</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Delivery Address</span>
            </h4>
            <div className="text-xs text-foreground/80 space-y-1 font-medium">
              <p className="font-bold text-foreground">{shippingAddr?.full_name || 'Customer'}</p>
              <p>{shippingAddr?.address_line_1}</p>
              <p>
                {shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.pincode}
              </p>
              <p className="pt-1 text-foreground/60">Phone: {shippingAddr?.phone}</p>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4 text-xs font-semibold">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50 flex items-center gap-1.5 pb-2 border-b border-border/40">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Payment & Totals</span>
            </h4>

            <div className="flex justify-between text-foreground/70">
              <span>Subtotal</span>
              <span className="font-bold text-foreground">₹{order.subtotal?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-foreground/70">
              <span>Tax (GST)</span>
              <span className="font-bold text-foreground">₹{order.tax?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-foreground/70">
              <span>Shipping Charge</span>
              <span className="font-bold text-foreground">₹{order.shipping_fee || 0}</span>
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-between items-baseline">
              <span className="text-sm font-bold text-foreground">Total Paid</span>
              <span className="text-xl font-black text-primary">₹{order.total_amount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
