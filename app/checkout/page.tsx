'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { useAddressesQuery } from '../../hooks/useAddress';
import { useCheckoutMutation } from '../../hooks/useCheckout';
import { useCreatePaymentOrderMutation, useVerifyPaymentMutation } from '../../hooks/usePayment';
import { razorpayService } from '../../services/razorpayService';
import { loyaltyService } from '../../services/loyaltyService';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AddressModal } from '../../components/AddressModal';
import { PaymentStatusModal } from '../../components/PaymentStatusModal';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast';
import { ApiShippingMethod } from '../../services/shippingService';
import { ApiAddress } from '../../types/api';
import {
  ShieldCheck,
  Lock,
  Truck,
  RotateCcw,
  Plus,
  Edit2,
  Phone,
  Zap,
  Clock,
  CreditCard,
  Building2,
  Banknote,
  Coins,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Tag,
  MapPin,
  Check
} from 'lucide-react';

const DEFAULT_SHIPPING_METHODS: ApiShippingMethod[] = [
  {
    id: 1,
    code: 'standard',
    name: 'Standard Surface Delivery',
    description: 'Delivered in 3-5 business days across India',
    cost: 99,
    estimated_days: '3-5 Days',
    is_free_eligible: true,
  },
  {
    id: 2,
    code: 'express',
    name: 'Express Air Shipping',
    description: 'Priority handling with 1-2 business days express delivery',
    cost: 199,
    estimated_days: '1-2 Days',
  },
  {
    id: 3,
    code: 'same_day',
    name: 'Same Day Metro Express',
    description: 'Delivered within 12 hours for eligible metro pincodes',
    cost: 299,
    estimated_days: 'Same Day',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { warning, error: toastError, success: toastSuccess } = useToast();
  const { cart, cartTotal, cartItemCount, clearCart } = useCartWishlist();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddressesQuery();

  const checkoutMutation = useCheckoutMutation();
  const createPaymentOrderMutation = useCreatePaymentOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ApiShippingMethod>(DEFAULT_SHIPPING_METHODS[0]);
  const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'stripe' | 'cod' | 'bank_transfer'>('razorpay');

  // Coupon and Coin states
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const [availableCoins, setAvailableCoins] = useState<number>(0);
  const [isCoinsRedeemed, setIsCoinsRedeemed] = useState<boolean>(false);
  const [coinsToRedeem, setCoinsToRedeem] = useState<number>(0);
  const [coinsDiscount, setCoinsDiscount] = useState<number>(0);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<ApiAddress | undefined>(undefined);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');

  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'failed';
    errorMessage?: string;
  }>({ isOpen: false, status: 'processing' });

  // Select default address if none selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  // Load user JSS coins balance
  useEffect(() => {
    if (isAuthenticated) {
      loyaltyService.getPointsBalance().then((data) => {
        setAvailableCoins(data.points_balance || 0);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  // Handle coins calculation
  useEffect(() => {
    if (isCoinsRedeemed && availableCoins > 0) {
      const maxAllowedDiscount = Math.floor(cartTotal * 0.5);
      const usablePoints = Math.min(availableCoins, maxAllowedDiscount);
      setCoinsToRedeem(usablePoints);
      setCoinsDiscount(usablePoints);
    } else {
      setCoinsToRedeem(0);
      setCoinsDiscount(0);
    }
  }, [isCoinsRedeemed, availableCoins, cartTotal]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) {
      toastError('Please enter a coupon code.', 'Coupon Required');
      return;
    }

    if (cleanCode === 'JSS10' || cleanCode === 'SAVE10') {
      const discount = Math.round(cartTotal * 0.1);
      setAppliedCoupon(cleanCode);
      setCouponDiscount(discount);
      toastSuccess(`Coupon ${cleanCode} applied! 10% discount added (₹${discount}).`, 'Coupon Applied');
    } else if (cleanCode === 'FLAT80') {
      const discount = Math.min(cartTotal, Math.round(cartTotal * 0.8));
      setAppliedCoupon(cleanCode);
      setCouponDiscount(discount);
      toastSuccess(`Coupon FLAT80 applied! ₹${discount} discount added.`, 'Coupon Applied');
    } else {
      toastError('Invalid coupon code. Try JSS10 for 10% off!', 'Invalid Coupon');
    }
  };

  const handleToggleCoins = () => {
    if (availableCoins <= 0) {
      warning('You currently have 0 JSS Coins in your wallet.', 'No Coins Available');
      return;
    }
    setIsCoinsRedeemed(!isCoinsRedeemed);
  };

  const calculatedShippingFee =
    selectedShippingMethod.is_free_eligible && cartTotal > 1000 && selectedShippingMethod.code === 'standard'
      ? 0
      : selectedShippingMethod.cost;

  const estimatedGst = Math.round(cartTotal * 0.18);
  const grandTotal = Math.max(0, cartTotal + estimatedGst + calculatedShippingFee - couponDiscount - coinsDiscount);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handlePlaceOrder = () => {
    if (!selectedAddressId && addresses.length === 0) {
      warning('Please add a shipping address to proceed.', 'Address Required');
      setIsAddressModalOpen(true);
      return;
    }

    checkoutMutation.mutate(
      {
        shipping_address_id: selectedAddressId || addresses[0]?.id,
        payment_method: paymentProvider === 'bank_transfer' ? 'cod' : paymentProvider,
        points_to_redeem: coinsToRedeem > 0 ? coinsToRedeem : undefined,
        coupon_code: appliedCoupon || undefined,
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
          toastError(err.message || 'Failed to process checkout.', 'Checkout Failed');
        },
      }
    );
  };

  if (isAuthLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-foreground/60">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />
        <div className="py-16 px-6 text-center bg-card border border-border-custom/80 rounded-3xl space-y-5 shadow-xl max-w-xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">Authentication Required</h2>
            <p className="text-xs text-muted-custom leading-relaxed font-medium max-w-md mx-auto">
              Please sign in or create a customer account to select delivery address, process payment, and complete your purchase.
            </p>
          </div>
          <Link
            href="/login?redirect=/checkout"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xs hover:bg-primary-hover transition-all active:scale-95"
          >
            <span>Sign In / Register to Checkout</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />
        <div className="py-16 px-6 text-center bg-card border border-border/60 rounded-3xl space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Your Cart is Empty</h2>
          <p className="text-xs text-foreground/60">
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs hover:bg-primary/90 transition-all"
          >
            Start Shopping Now
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
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all text-center"
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ─── Breadcrumbs ─── */}
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Checkout' }]} />

      {/* ─── Page Header with Trust Badges ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Checkout</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Complete your order by providing your details below.
          </p>
        </div>

        {/* Top Right 3-Pill Trust Badges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-900">Secure Payments</div>
              <div className="text-[10px] text-slate-500 font-medium">256-bit SSL Encrypted</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-900">Fast Delivery</div>
              <div className="text-[10px] text-slate-500 font-medium">Across India</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-900">Easy Returns</div>
              <div className="text-[10px] text-slate-500 font-medium">7-Day Return Policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid: Left Steps + Right Order Summary ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── LEFT COLUMN: Steps 1, 2, 3 with Vertical Step Line ─── */}
        <div className="lg:col-span-8 flex gap-4 sm:gap-6">
          
          {/* Vertical Step Progress Indicator (Hidden on smallest screens, visible on sm+) */}
          <div className="hidden sm:flex flex-col items-center pt-5 shrink-0 select-none">
            {/* Step 1 Circle */}
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-md shadow-blue-500/20">
              1
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-primary flex items-center justify-center my-1">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            {/* Connecting Line 1 -> 2 */}
            <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200 my-2 min-h-[170px]" />

            {/* Step 2 Circle */}
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-md shadow-blue-500/20">
              2
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-primary flex items-center justify-center my-1">
              <Truck className="w-3.5 h-3.5" />
            </div>
            {/* Connecting Line 2 -> 3 */}
            <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200 my-2 min-h-[170px]" />

            {/* Step 3 Circle */}
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-md shadow-blue-500/20">
              3
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-primary flex items-center justify-center my-1">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Steps Form Containers */}
          <div className="flex-1 space-y-6">

            {/* ─── STEP 1: SHIPPING ADDRESS ─── */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="sm:hidden w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">1</span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Shipping Address</h2>
                </div>
                <button
                  onClick={() => {
                    setAddressToEdit(undefined);
                    setIsAddressModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary-dark transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isAddressesLoading ? (
                <div className="py-8 text-center text-xs text-slate-400 font-bold animate-pulse">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-300 rounded-2xl text-center space-y-3 bg-slate-50/50">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">No saved shipping addresses found.</p>
                  <button
                    onClick={() => {
                      setAddressToEdit(undefined);
                      setIsAddressModalOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary-dark transition-all cursor-pointer"
                  >
                    Add Address Now
                  </button>
                </div>
              ) : (
                /* Selected Address Visual Card */
                <div className="relative p-5 sm:p-6 rounded-2xl border-2 border-primary bg-gradient-to-r from-blue-50/25 to-white shadow-xs space-y-3 overflow-hidden">
                  
                  {/* Subtle City Skyline Watermark */}
                  <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-2 translate-y-2">
                    <Building2 className="w-32 h-32 text-primary" />
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      {/* Radio Selected Indicator */}
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-white shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          {selectedAddress?.full_name || 'Chetan Gharate'}
                        </span>
                        {selectedAddress?.is_default && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setAddressToEdit(selectedAddress);
                        setIsAddressModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Address Text */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-lg pl-8 relative z-10">
                    {selectedAddress?.address_line_1}
                    {selectedAddress?.address_line_2 ? `, ${selectedAddress.address_line_2}` : ''}, {selectedAddress?.city}, {selectedAddress?.state} -{' '}
                    <span className="font-black text-slate-900">{selectedAddress?.pincode}</span>
                  </p>

                  {/* Phone Line */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 pl-8 pt-1 relative z-10">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedAddress?.phone || '+91 7490923553'}</span>
                  </div>
                </div>
              )}
            </section>

            {/* ─── STEP 2: SHIPPING & DELIVERY OPTIONS ─── */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="sm:hidden w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">2</span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Shipping & Delivery Options</h2>
              </div>

              <div className="space-y-3">
                {DEFAULT_SHIPPING_METHODS.map((method) => {
                  const isSelected = selectedShippingMethod.id === method.id;
                  const isFree = method.is_free_eligible && cartTotal > 1000 && method.code === 'standard';
                  const cost = isFree ? 0 : method.cost;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShippingMethod(method)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-primary bg-blue-50/20 shadow-xs'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Radio selector */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-white' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>

                        {/* Icon Box */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          method.code === 'express'
                            ? 'bg-purple-50 text-purple-600 border border-purple-100'
                            : method.code === 'same_day'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-blue-50 text-primary border border-blue-100'
                        }`}>
                          {method.code === 'express' ? (
                            <Zap className="w-5 h-5" />
                          ) : method.code === 'same_day' ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Truck className="w-5 h-5" />
                          )}
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">{method.name}</span>
                            {isFree && (
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full uppercase">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                            {method.description} • <span className="text-slate-600 font-semibold">Est. {method.estimated_days}</span>
                          </p>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="text-right shrink-0">
                        <span className="font-black text-sm sm:text-base text-primary">
                          {cost === 0 ? 'FREE' : `₹${cost}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ─── STEP 3: PAYMENT METHOD ─── */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="sm:hidden w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">3</span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Payment Method</h2>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>All transactions are secure and encrypted</span>
                </span>
              </div>

              {/* 2x2 Payment Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 1. Razorpay */}
                <div
                  onClick={() => setPaymentProvider('razorpay')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentProvider === 'razorpay'
                      ? 'border-primary bg-blue-50/20 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${paymentProvider === 'razorpay' ? 'border-primary bg-white' : 'border-slate-300'}`}>
                    {paymentProvider === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 flex items-center gap-1 italic">
                        Razorpay
                      </span>
                      <span className="text-[9px] font-extrabold text-primary bg-blue-100/70 border border-blue-200 px-2 py-0.2 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">Razorpay Gateway</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight">UPI, Cards, Wallets, Netbanking</div>
                  </div>
                </div>

                {/* 2. Stripe */}
                <div
                  onClick={() => setPaymentProvider('stripe')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentProvider === 'stripe'
                      ? 'border-primary bg-blue-50/20 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${paymentProvider === 'stripe' ? 'border-primary bg-white' : 'border-slate-300'}`}>
                    {paymentProvider === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  <div className="space-y-1">
                    <span className="font-black text-sm text-indigo-700 lowercase tracking-tight">stripe</span>
                    <div className="text-xs font-bold text-slate-800">Stripe International</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight">Global Cards & Multi-Currency Payments</div>
                  </div>
                </div>

                {/* 3. Cash on Delivery */}
                <div
                  onClick={() => setPaymentProvider('cod')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentProvider === 'cod'
                      ? 'border-primary bg-blue-50/20 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${paymentProvider === 'cod' ? 'border-primary bg-white' : 'border-slate-300'}`}>
                    {paymentProvider === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">Cash on Delivery</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight">Pay cash or UPI upon receiving delivery</div>
                  </div>
                </div>

                {/* 4. Direct Bank Transfer */}
                <div
                  onClick={() => setPaymentProvider('bank_transfer')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentProvider === 'bank_transfer'
                      ? 'border-primary bg-blue-50/20 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${paymentProvider === 'bank_transfer' ? 'border-primary bg-white' : 'border-slate-300'}`}>
                    {paymentProvider === 'bank_transfer' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">Direct Bank Transfer</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight">Offline NEFT / RTGS payment</div>
                  </div>
                </div>

              </div>
            </section>

            {/* ─── BOTTOM MAIN ACTION BUTTON & GUARANTEE ─── */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handlePlaceOrder}
                disabled={checkoutMutation.isPending || (addresses.length === 0 && !selectedAddressId)}
                className="w-full py-4 px-8 bg-primary hover:bg-primary-dark text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Lock className="w-5 h-5" />
                {checkoutMutation.isPending ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Processing Secure Order...</span>
                  </>
                ) : (
                  <span>Confirm & Complete Purchase &rarr;</span>
                )}
              </button>

              <p className="text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your data is safe with us. We never share your information.</span>
              </p>
            </div>

          </div>
        </div>

        {/* ─── RIGHT COLUMN: Order Summary Card ─── */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden">
            
            {/* Top Royal Blue Header Area */}
            <div className="bg-gradient-to-r from-[#1565D8] to-[#2563EB] text-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white tracking-tight">Order Summary</h3>
                <span className="text-xs bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full font-extrabold">
                  {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Promo / Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo / Coupon Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g., JSS10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white border-0 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 uppercase shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-200 font-bold">
                    ✓ Applied {appliedCoupon} (-₹{couponDiscount})
                  </p>
                )}
              </form>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-5">
              
              {/* Redeem JSS Coins Box */}
              <div
                onClick={handleToggleCoins}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCoinsRedeemed
                    ? 'bg-amber-100/60 border-amber-300'
                    : 'bg-amber-50/50 hover:bg-amber-50 border-amber-200/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center shrink-0 border border-amber-300/40 shadow-2xs">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>Redeem JSS Coins</span>
                      {isCoinsRedeemed && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                          Applied
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold">
                      Balance: <span className="text-amber-600">{availableCoins} Coins (₹{availableCoins})</span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Items Subtotal ({cartItemCount} items)</span>
                  <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Estimated GST (18%)</span>
                  <span className="font-bold text-slate-900">₹{estimatedGst.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Delivery & Shipping</span>
                  <span className="font-bold text-slate-900">
                    {calculatedShippingFee === 0 ? (
                      <span className="text-emerald-600 font-black uppercase">FREE</span>
                    ) : (
                      `₹${calculatedShippingFee}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {coinsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 font-bold">
                    <span>JSS Coins Redeemed</span>
                    <span>-₹{coinsDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">Grand Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-primary">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Encrypted SSL Badge */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl py-3 px-4 text-center flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted 256-bit SSL Secure Checkout</span>
              </div>

              {/* 3 Trust Info Mini Cards */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 text-primary rounded-lg shrink-0 mt-0.5">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Secure Payment</div>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug">Your payment information is safe with us.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 text-primary rounded-lg shrink-0 mt-0.5">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Fast Delivery</div>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug">Quick and reliable delivery across India.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 text-primary rounded-lg shrink-0 mt-0.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Easy Returns</div>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug">7-day easy return policy on eligible items.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Address Management Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      {/* Payment Status Modal */}
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
