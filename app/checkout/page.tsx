'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { useAddressesQuery } from '../../hooks/useAddress';
import { useCheckoutMutation } from '../../hooks/useCheckout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AddressCard } from '../../components/AddressCard';
import { AddressModal } from '../../components/AddressModal';
import { CartSummary } from '../../components/CartSummary';
import { ApiAddress } from '../../types/api';
import { ShoppingBag, Plus, CreditCard, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartItemCount, clearCart } = useCartWishlist();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddressesQuery();
  const checkoutMutation = useCheckoutMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'cod'>('razorpay');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');

  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />
        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-2xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-foreground/30 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Your Cart is Empty</h2>
          <p className="text-sm text-foreground/60">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="py-16 text-center bg-card border border-border/40 rounded-3xl space-y-6 shadow-sm max-w-2xl mx-auto p-8">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-foreground">Order Placed Successfully!</h2>
          <p className="text-sm text-foreground/60">
            Thank you for your order. Your unique order reference number is:
          </p>
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-mono font-bold text-lg rounded-xl">
            {placedOrderNumber}
          </span>
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/orders/${placedOrderNumber}`}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all text-center"
          >
            View Order Status & Details
          </Link>
          <Link
            href="/orders"
            className="w-full sm:w-auto px-6 py-3 border border-border/40 text-foreground font-bold rounded-2xl hover:bg-muted transition-all text-center"
          >
            Order History
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert('Please select or add a shipping address.');
      return;
    }

    checkoutMutation.mutate(
      {
        shipping_address_id: selectedAddressId,
        payment_method: paymentMethod,
      },
      {
        onSuccess: (order) => {
          clearCart();
          setPlacedOrderNumber(order.order_number);
          setIsOrderPlaced(true);
        },
        onError: (err: any) => {
          alert(err.message || 'Failed to place order. Please try again.');
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Checkout' }]} />

      <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Checkout & Place Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="text-lg font-bold text-foreground">1. Shipping Address</h3>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {isAddressesLoading ? (
              <div className="py-8 text-center text-xs text-foreground/50 animate-pulse">
                Loading saved addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div className="py-8 text-center text-xs text-foreground/60 space-y-2">
                <p>No saved addresses found. Please add a shipping address to proceed.</p>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl"
                >
                  Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    isSelected={selectedAddressId === addr.id}
                    onSelect={() => setSelectedAddressId(addr.id)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground pb-3 border-b border-border/40">
              2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-card border-border/40 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <span className="font-bold text-xs text-foreground block">Razorpay Gateway</span>
                <span className="text-[11px] text-foreground/60 block">UPI, Cards, Netbanking</span>
              </div>

              <div
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-card border-border/40 hover:border-primary/40'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-xs text-foreground block">Stripe Global</span>
                <span className="text-[11px] text-foreground/60 block">International Cards</span>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-card border-border/40 hover:border-primary/40'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-xs text-foreground block">Cash on Delivery</span>
                <span className="text-[11px] text-foreground/60 block">Pay upon delivery</span>
              </div>
            </div>
          </section>

          <button
            onClick={handlePlaceOrder}
            disabled={checkoutMutation.isPending || !selectedAddressId}
            className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {checkoutMutation.isPending ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Processing Order & Reserving Stock...</span>
              </>
            ) : (
              <span>Confirm & Place Order &rarr;</span>
            )}
          </button>
        </div>

        <div className="lg:col-span-4">
          <CartSummary subtotal={cartTotal} itemCount={cartItemCount} />
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}
