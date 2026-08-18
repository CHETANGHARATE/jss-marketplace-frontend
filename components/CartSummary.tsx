'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Tag, ShieldCheck, Lock, Coins, Check, Sparkles } from 'lucide-react';
import { loyaltyService } from '../services/loyaltyService';
import { useToast } from './Toast';

interface CartSummaryProps {
  subtotal: number;
  tax?: number;
  shippingFee?: number;
  itemCount: number;
  onCheckout?: () => void;
  isCheckoutPage?: boolean;
  onRedeemCoinsChange?: (redeem: boolean, points: number, discount: number) => void;
  onCouponApply?: (code: string, discount: number) => void;
}

export function CartSummary({
  subtotal,
  tax = Math.round(subtotal * 0.18),
  shippingFee = subtotal >= 499 ? 0 : 49,
  itemCount,
  onCheckout,
  isCheckoutPage = false,
  onRedeemCoinsChange,
  onCouponApply,
}: CartSummaryProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { error, success } = useToast();

  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // JSS Coins Redemption State (Feature 25)
  const [availableCoins, setAvailableCoins] = useState<number>(0);
  const [isCoinsRedeemed, setIsCoinsRedeemed] = useState<boolean>(false);
  const [coinsToRedeem, setCoinsToRedeem] = useState<number>(0);
  const [coinsDiscount, setCoinsDiscount] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      loyaltyService.getPointsBalance().then((data) => {
        setAvailableCoins(data.points_balance || 0);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  // Recalculate max usable coins whenever subtotal or availableCoins changes
  useEffect(() => {
    if (isCoinsRedeemed && availableCoins > 0) {
      // Max 50% of subtotal, 1 Coin = ₹1
      const maxAllowedDiscount = Math.floor(subtotal * 0.5);
      const usablePoints = Math.min(availableCoins, maxAllowedDiscount);
      const discount = usablePoints; // 1 Coin = ₹1

      setCoinsToRedeem(usablePoints);
      setCoinsDiscount(discount);

      if (onRedeemCoinsChange) {
        onRedeemCoinsChange(true, usablePoints, discount);
      }
    } else {
      setCoinsToRedeem(0);
      setCoinsDiscount(0);
      if (onRedeemCoinsChange) {
        onRedeemCoinsChange(false, 0, 0);
      }
    }
  }, [isCoinsRedeemed, availableCoins, subtotal]);

  const handleToggleCoins = () => {
    if (!isAuthenticated) {
      error('Please sign in to redeem JSS Coins.');
      return;
    }
    if (availableCoins <= 0) {
      error('You do not have any JSS Coins to redeem.');
      return;
    }
    setIsCoinsRedeemed(!isCoinsRedeemed);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) {
      error('Please enter a valid coupon code.');
      return;
    }

    if (cleanCode === 'JSS10' || cleanCode === 'SAVE10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon(cleanCode);
      setCouponDiscount(discount);
      success(`Coupon ${cleanCode} applied! 10% discount added (₹${discount}).`);
      if (onCouponApply) onCouponApply(cleanCode, discount);
    } else if (cleanCode === 'FLAT80') {
      const discount = Math.min(subtotal, Math.round(subtotal * 0.8));
      setAppliedCoupon(cleanCode);
      setCouponDiscount(discount);
      success(`Coupon FLAT80 applied! ₹${discount} discount added.`);
      if (onCouponApply) onCouponApply(cleanCode, discount);
    } else {
      error('Invalid or expired coupon code. Try JSS10 or SAVE10 for 10% Off!');
    }
  };

  const grandTotal = Math.max(0, subtotal + tax + shippingFee - couponDiscount - coinsDiscount);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/account?tab=login&redirect=/checkout');
      return;
    }
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
      <h3 className="text-xl font-bold text-foreground pb-4 border-b border-border/40 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </span>
      </h3>

      {/* Coupon / Promo Code Form */}
      <form onSubmit={handleApplyCoupon} className="space-y-2">
        <label className="text-xs font-bold text-foreground/70 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <span>Promo / Coupon Code</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code (e.g. JSS10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 bg-muted/30 border border-border/40 rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            Apply
          </button>
        </div>
        {appliedCoupon && (
          <span className="text-[11px] font-bold text-emerald-600 block">
            ✓ Coupon {appliedCoupon} applied (-₹{couponDiscount.toLocaleString('en-IN')})
          </span>
        )}
      </form>

      {/* JSS Coins Redemption Section (Feature 25) */}
      {isAuthenticated && (
        <div className={`p-4 rounded-2xl border transition-all ${
          isCoinsRedeemed ? 'bg-amber-500/10 border-amber-500/30' : 'bg-muted/20 border-border/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-foreground block">
                  Redeem JSS Coins
                </span>
                <span className="text-[10px] text-foreground/60 font-semibold block">
                  Balance: {availableCoins.toLocaleString('en-IN')} Coins (₹{availableCoins.toLocaleString('en-IN')})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleCoins}
              disabled={availableCoins <= 0}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                isCoinsRedeemed ? 'bg-amber-500 text-white' : 'bg-card border border-border text-transparent'
              } disabled:opacity-30 cursor-pointer`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {isCoinsRedeemed && (
            <div className="mt-2.5 pt-2.5 border-t border-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-300 flex justify-between">
              <span>Redeeming {coinsToRedeem.toLocaleString('en-IN')} Coins:</span>
              <span>-₹{coinsDiscount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      )}

      {/* Detailed Financial Calculation */}
      <div className="space-y-3 pt-4 border-t border-border/40 text-sm">
        <div className="flex justify-between text-foreground/70 font-medium">
          <span>Items Subtotal</span>
          <span className="font-bold text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount</span>
            <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {coinsDiscount > 0 && (
          <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
            <span>JSS Coins Discount</span>
            <span>-₹{coinsDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-foreground/70 font-medium">
          <span>Estimated GST (18%)</span>
          <span className="font-bold text-foreground">₹{tax.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-foreground/70 font-medium">
          <span>Delivery & Shipping</span>
          <span className="font-bold text-foreground">
            {shippingFee === 0 ? <span className="text-emerald-600 uppercase font-black">FREE</span> : `₹${shippingFee.toLocaleString('en-IN')}`}
          </span>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-between items-baseline">
          <span className="text-base font-bold text-foreground">Grand Total</span>
          <span className="text-2xl font-black text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {!isCheckoutPage && (
        <Link
          href="/checkout"
          onClick={handleCheckoutClick}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 text-center"
        >
          {isAuthenticated ? <ShoppingBag className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
          <span>{isAuthenticated ? 'Proceed to Checkout' : 'Sign In / Register to Checkout'}</span>
        </Link>
      )}

      <div className="flex items-center justify-center gap-1.5 text-xs text-foreground/60 font-medium pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Encrypted 256-Bit SSL Secure Checkout</span>
      </div>
    </div>
  );
}
