'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { useAddressesQuery } from '../../hooks/useAddress';
import { useCheckoutMutation } from '../../hooks/useCheckout';
import { useCreatePaymentOrderMutation, useVerifyPaymentMutation } from '../../hooks/usePayment';
import { razorpayService } from '../../services/razorpayService';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AddressCard } from '../../components/AddressCard';
import { AddressModal } from '../../components/AddressModal';
import { PaymentSelector } from '../../components/PaymentSelector';
import { ShippingMethodSelector } from '../../components/ShippingMethodSelector';
import { PaymentStatusModal } from '../../components/PaymentStatusModal';
import { CartSummary } from '../../components/CartSummary';
import { ApiShippingMethod } from '../../services/shippingService';
import { ShoppingBag, Plus, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartItemCount, clearCart } = useCartWishlist();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddressesQuery();

  const checkoutMutation = useCheckoutMutation();
  const createPaymentOrderMutation = useCreatePaymentOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'stripe' | 'cod' | 'bank_transfer'>('razorpay');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ApiShippingMethod>({
    id: 1,
    code: 'standard',
    name: 'Standard Surface Delivery',
    cost: 99,
    estimated_days: '3-5 Days',
    is_free_eligible: true,
  });

  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');

  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'failed';
    errorMessage?: string;
  }>({ isOpen: false, status: 'processing' });

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
          <h2 className="text-3xl font-extrabold text-foreground">Order & Payment Confirmed!</h2>
          <p className="text-sm text-foreground/60">
            Thank you for your purchase. Your unique order reference number is:
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
            View Order Status & Tracking
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
        payment_method: paymentProvider === 'bank_transfer' ? 'cod' : paymentProvider,
      },
      {
        onSuccess: (order) => {
          if (paymentProvider === 'razorpay') {
            setPaymentModalState({ isOpen: true, status: 'processing' });

            createPaymentOrderMutation.mutate(
              { order_id: order.id, gateway: 'razorpay' },
              {
                onSuccess: async (razorpayData) => {
                  try {
                    await razorpayService.openCheckout({
                      key: razorpayData.key || 'rzp_test_placeholder',
                      amount: razorpayData.amount,
                      currency: razorpayData.currency || 'INR',
                      name: 'JSS Marketplace',
                      description: `Order #${order.order_number}`,
                      order_id: razorpayData.gateway_order_id,
                      handler: (response) => {
                        verifyPaymentMutation.mutate(
                          {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                          },
                          {
                            onSuccess: () => {
                              clearCart();
                              setPaymentModalState({ isOpen: false, status: 'success' });
                              setPlacedOrderNumber(order.order_number);
                              setIsOrderPlaced(true);
                            },
                            onError: () => {
                              setPaymentModalState({
                                isOpen: true,
                                status: 'failed',
                                errorMessage: 'Payment verification failed. Please contact support.',
                              });
                            },
                          }
                        );
                      },
                      modal: {
                        ondismiss: () => {
                          setPaymentModalState({
                            isOpen: true,
                            status: 'failed',
                            errorMessage: 'Payment window was closed before completion.',
                          });
                        },
                      },
                    });
                  } catch (err: any) {
                    setPaymentModalState({
                      isOpen: true,
                      status: 'failed',
                      errorMessage: err.message,
                    });
                  }
                },
                onError: () => {
                  setPaymentModalState({
                    isOpen: true,
                    status: 'failed',
                    errorMessage: 'Failed to initialize payment gateway order.',
                  });
                },
              }
            );
          } else {
            clearCart();
            setPlacedOrderNumber(order.order_number);
            setIsOrderPlaced(true);
          }
        },
        onError: (err: any) => {
          alert(err.message || 'Failed to process checkout.');
        },
      }
    );
  };

  const calculatedShippingFee =
    selectedShippingMethod.is_free_eligible && cartTotal > 1000 && selectedShippingMethod.code === 'standard'
      ? 0
      : selectedShippingMethod.cost;

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Checkout' }]} />

      <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Checkout & Order Fulfillment</h1>

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
              2. Shipping & Delivery Option
            </h3>
            <ShippingMethodSelector
              selectedMethodId={selectedShippingMethod.id}
              onSelect={setSelectedShippingMethod}
              subtotal={cartTotal}
            />
          </section>

          <section className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground pb-3 border-b border-border/40">
              3. Payment Provider & Option
            </h3>
            <PaymentSelector
              selectedProvider={paymentProvider}
              onSelect={setPaymentProvider}
            />
          </section>

          <button
            onClick={handlePlaceOrder}
            disabled={checkoutMutation.isPending || !selectedAddressId}
            className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {checkoutMutation.isPending ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Creating Order & Initializing Payment...</span>
              </>
            ) : (
              <span>Confirm & Complete Purchase &rarr;</span>
            )}
          </button>
        </div>

        <div className="lg:col-span-4">
          <CartSummary
            subtotal={cartTotal}
            shippingFee={calculatedShippingFee}
            itemCount={cartItemCount}
          />
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <PaymentStatusModal
        isOpen={paymentModalState.isOpen}
        status={paymentModalState.status}
        errorMessage={paymentModalState.errorMessage}
        onRetry={() => {
          setPaymentModalState({ isOpen: false, status: 'processing' });
          handlePlaceOrder();
        }}
        onClose={() => setPaymentModalState({ ...paymentModalState, isOpen: false })}
      />
    </div>
  );
}
