'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useOrderByNumberQuery, useCancelOrderMutation, useOrderShipmentQuery } from '../../../hooks/useOrders';
import { orderService } from '../../../services/orderService';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { OrderStatusTimeline } from '../../../components/OrderStatusTimeline';
import { ShipmentTrackingCard } from '../../../components/ShipmentTrackingCard';
import { OrderSkeleton } from '../../../components/OrderSkeleton';
import { ApiOrderItem } from '../../../types/api';
import {
  Printer,
  Download,
  Ban,
  MapPin,
  CreditCard,
  Calendar,
  PackageCheck,
  ArrowLeft,
  AlertCircle,
  Coins,
  Tag,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { useToast } from '../../../components/Toast';

export default function OrderDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const orderNumber = typeof params?.orderNumber === 'string' ? params.orderNumber : '';

  const { data: order, isLoading, isError } = useOrderByNumberQuery(orderNumber);
  const { data: shipment } = useOrderShipmentQuery(orderNumber, !!order);
  const cancelMutation = useCancelOrderMutation();

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [showOrderCancelModal, setShowOrderCancelModal] = useState(false);
  const [orderCancelReason, setOrderCancelReason] = useState('Customer requested order cancellation');

  // Single Item Cancellation State (Feature 139)
  const [cancellingItem, setCancellingItem] = useState<ApiOrderItem | null>(null);
  const [itemCancelReason, setItemCancelReason] = useState('Ordered by mistake');
  const [customItemReason, setCustomItemReason] = useState('');
  const [isCancellingItem, setIsCancellingItem] = useState(false);

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

  // Handle Server-Side GST PDF Invoice Download (Feature 53)
  const handleDownloadInvoice = async () => {
    setIsDownloadingPdf(true);
    try {
      const blob = await orderService.downloadInvoicePdf(order.order_number);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tax_Invoice_${order.order_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toastSuccess('Tax Invoice PDF downloaded successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to download invoice PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const confirmCancelEntireOrder = () => {
    cancelMutation.mutate(order.order_number, {
      onSuccess: () => {
        toastSuccess(`Order #${order.order_number} cancelled successfully.`);
        setShowOrderCancelModal(false);
        queryClient.invalidateQueries({ queryKey: ['orders', orderNumber] });
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to cancel order.');
        setShowOrderCancelModal(false);
      },
    });
  };

  // Handle Single Item Cancellation (Feature 139)
  const handleConfirmCancelItem = async () => {
    if (!cancellingItem) return;

    const finalReason = itemCancelReason === 'Other' ? (customItemReason || 'Customer requested item cancellation') : itemCancelReason;

    setIsCancellingItem(true);
    try {
      await orderService.cancelOrderItem(order.order_number, cancellingItem.id, finalReason);
      toastSuccess(`Item '${cancellingItem.product_name}' cancelled successfully.`);
      setCancellingItem(null);
      queryClient.invalidateQueries({ queryKey: ['orders', orderNumber] });
    } catch (err: any) {
      toastError(err.message || 'Failed to cancel item.');
    } finally {
      setIsCancellingItem(false);
    }
  };

  const canCancelOrder = ['pending', 'confirmed'].includes(order.status?.toLowerCase());
  const shippingAddr = order.shipping_address_snapshot;
  const financials = order.financials;

  const loyaltyDiscount = Number(financials?.loyalty_discount ?? order.loyalty_discount_amount ?? 0);
  const loyaltyPoints = Number(financials?.loyalty_points_redeemed ?? order.loyalty_points_redeemed ?? 0);
  const couponDiscount = Number(financials?.discount ?? order.discount_amount ?? 0);
  const subtotal = Number(financials?.subtotal ?? order.subtotal ?? 0);
  const shippingCharge = Number(financials?.shipping ?? order.shipping_fee ?? order.shipping_amount ?? 0);
  const grandTotal = Number(financials?.total ?? order.total_amount ?? 0);

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

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          {/* Download GST Invoice PDF (Feature 53) */}
          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {isDownloadingPdf ? (
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download GST Invoice (PDF)</span>
          </button>

          {canCancelOrder && (
            <button
              onClick={() => setShowOrderCancelModal(true)}
              disabled={cancelMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-500/30 text-rose-500 bg-rose-500/10 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Entire Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Order Status Visual Timeline */}
      <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50 mb-4">
          Shipment Progress Tracking
        </h3>
        <OrderStatusTimeline status={order.status} />
      </div>

      <ShipmentTrackingCard tracking={shipment} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ordered Items with Single Item Cancellation (Feature 139) */}
        <div className="lg:col-span-8 bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-3 border-b border-border/40">
            <PackageCheck className="w-5 h-5 text-primary" />
            <span>Ordered Items ({order.items?.length || 0})</span>
          </h3>

          <div className="space-y-4">
            {order.items?.map((item, idx) => {
              const isItemCancelled = item.status === 'cancelled';
              const canCancelThisItem = canCancelOrder && !isItemCancelled && (order.items?.length || 0) > 0;

              return (
                <div
                  key={item.id || idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                    isItemCancelled ? 'bg-rose-500/5 border-rose-500/20 opacity-75' : 'bg-muted/20 border-border/40'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isItemCancelled ? 'bg-rose-500/10 text-rose-600' : 'bg-muted/50 text-foreground'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm text-foreground ${isItemCancelled ? 'line-through text-foreground/60' : ''}`}>
                          {item.product_name}
                        </h4>
                        {isItemCancelled && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md border border-rose-500/30">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-foreground/60 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>₹{Number(item.unit_price).toLocaleString('en-IN')} each</span>
                        {item.product_sku && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[11px]">SKU: {item.product_sku}</span>
                          </>
                        )}
                      </div>
                      {isItemCancelled && item.cancellation_reason && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">
                          Reason: {item.cancellation_reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="text-left sm:text-right">
                      <span className={`text-sm font-black ${isItemCancelled ? 'line-through text-foreground/50' : 'text-primary'}`}>
                        ₹{(Number(item.unit_price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Single Item Cancel Button (Feature 139) */}
                    {canCancelThisItem && (
                      <button
                        type="button"
                        onClick={() => setCancellingItem(item)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                      >
                        Cancel Item
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Addresses & Financial Breakdown with Coins & Coupons */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Delivery Address</span>
            </h4>
            <div className="text-xs text-foreground/80 space-y-1 font-medium">
              <p className="font-bold text-foreground">{shippingAddr?.name || shippingAddr?.full_name || 'Customer'}</p>
              <p>{shippingAddr?.address_line_1}</p>
              {shippingAddr?.address_line_2 && <p>{shippingAddr.address_line_2}</p>}
              <p>
                {shippingAddr?.city}, {shippingAddr?.state} - {shippingAddr?.pin_code || shippingAddr?.pincode}
              </p>
              <p className="pt-1 text-foreground/60">Phone: {shippingAddr?.phone}</p>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4 text-xs font-semibold">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50 flex items-center gap-1.5 pb-2 border-b border-border/40">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Payment & Financials</span>
            </h4>

            <div className="flex justify-between text-foreground/70">
              <span>Items Subtotal</span>
              <span className="font-bold text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Coupon Discount</span>
                </span>
                <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  <span>JSS Coins ({loyaltyPoints} pts)</span>
                </span>
                <span>-₹{loyaltyDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-foreground/70">
              <span>Shipping & Delivery</span>
              <span className="font-bold text-foreground">
                {shippingCharge === 0 ? <span className="text-emerald-600 font-black">FREE</span> : `₹${shippingCharge.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-between items-baseline">
              <span className="text-sm font-bold text-foreground">Total Paid / Payable</span>
              <span className="text-xl font-black text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 text-[11px] text-foreground/60">
              <span>Payment Mode: </span>
              <span className="font-bold text-foreground uppercase">{order.payment_method || 'COD'}</span>
              <span className="mx-1">•</span>
              <span className={`font-bold ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.payment_status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Item Cancellation Modal (Feature 139) */}
      {cancellingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border/40 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <Ban className="w-5 h-5" />
              <h3 className="text-lg font-bold">Cancel Line Item</h3>
            </div>
            
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to cancel <strong>{cancellingItem.product_name}</strong>? Other items in this order will remain active.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Reason for item cancellation:</label>
              <select
                value={itemCancelReason}
                onChange={(e) => setItemCancelReason(e.target.value)}
                className="w-full bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
                <option value="Delivery time too long">Delivery time is too long</option>
                <option value="Changed mind">Changed mind</option>
                <option value="Other">Other reason</option>
              </select>

              {itemCancelReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify reason..."
                  value={customItemReason}
                  onChange={(e) => setCustomItemReason(e.target.value)}
                  className="w-full mt-2 bg-muted/40 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCancellingItem(null)}
                disabled={isCancellingItem}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-border/40 hover:bg-muted transition-colors cursor-pointer"
              >
                Keep Item
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelItem}
                disabled={isCancellingItem}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCancellingItem ? 'Cancelling Item...' : 'Confirm Item Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entire Order Cancellation Modal */}
      {showOrderCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border/40 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Cancel Entire Order #{order.order_number}?</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to cancel all items in this order? Any redeemed JSS Coins will be refunded to your account.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowOrderCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-border/40 hover:bg-muted transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={confirmCancelEntireOrder}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              >
                {cancelMutation.isPending ? 'Cancelling Order...' : 'Yes, Cancel Entire Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
