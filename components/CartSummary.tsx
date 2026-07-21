'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Tag, ShieldCheck } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  tax?: number;
  shippingFee?: number;
  itemCount: number;
  onCheckout?: () => void;
}

export function CartSummary({
  subtotal,
  tax = Math.round(subtotal * 0.18),
  shippingFee = subtotal > 1000 ? 0 : 99,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const discountAmount = appliedCoupon === 'JSS10' ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal + tax + shippingFee - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'JSS10') {
      setAppliedCoupon('JSS10');
    } else {
      alert('Invalid coupon code. Try JSS10 for 10% Off!');
    }
  };

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
      <h3 className="text-xl font-bold text-foreground pb-4 border-b border-border/40 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </span>
      </h3>

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
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-xs"
          >
            Apply
          </button>
        </div>
        {appliedCoupon && (
          <span className="text-[11px] font-bold text-emerald-600 block">
            ✓ Coupon JSS10 applied (10% Discount)
          </span>
        )}
      </form>

      <div className="space-y-3 pt-4 border-t border-border/40 text-sm">
        <div className="flex justify-between text-foreground/70 font-medium">
          <span>Items Subtotal</span>
          <span className="font-bold text-foreground">₹{subtotal.toLocaleString()}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount</span>
            <span>-₹{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-foreground/70 font-medium">
          <span>Estimated GST Tax (18%)</span>
          <span className="font-bold text-foreground">₹{tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-foreground/70 font-medium">
          <span>Delivery & Shipping</span>
          <span className="font-bold text-foreground">
            {shippingFee === 0 ? <span className="text-emerald-600 uppercase">FREE</span> : `₹${shippingFee}`}
          </span>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-between items-baseline">
          <span className="text-base font-bold text-foreground">Grand Total</span>
          <span className="text-2xl font-black text-primary">₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        onClick={onCheckout}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 text-center"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Proceed to Checkout</span>
      </Link>

      <div className="flex items-center justify-center gap-1.5 text-xs text-foreground/60 font-medium pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Encrypted 256-Bit SSL Checkout</span>
      </div>
    </div>
  );
}
