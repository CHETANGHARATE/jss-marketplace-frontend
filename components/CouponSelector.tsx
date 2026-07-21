'use client';

import React, { useState } from 'react';
import { useCouponsQuery, useApplyCouponMutation, useRemoveCouponMutation } from '../hooks/useCoupons';
import { Tag, Check, X, Sparkles, AlertCircle } from 'lucide-react';

interface CouponSelectorProps {
  subtotal: number;
  appliedCoupon?: string;
  onCouponApplied?: (discountAmount: number, code: string) => void;
  onCouponRemoved?: () => void;
}

export function CouponSelector({
  subtotal,
  appliedCoupon,
  onCouponApplied,
  onCouponRemoved,
}: CouponSelectorProps) {
  const { data: coupons = [] } = useCouponsQuery();
  const applyMutation = useApplyCouponMutation();
  const removeMutation = useRemoveCouponMutation();

  const [inputCode, setInputCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApply = (codeToApply: string) => {
    setErrorMessage(null);
    applyMutation.mutate(
      { code: codeToApply, subtotal },
      {
        onSuccess: (result) => {
          if (onCouponApplied) {
            onCouponApplied(result.discount_amount, result.code);
          }
          setInputCode('');
        },
        onError: (err: any) => {
          setErrorMessage(err.message || 'Invalid or expired promo code.');
        },
      }
    );
  };

  const handleRemove = () => {
    removeMutation.mutate(undefined, {
      onSuccess: () => {
        if (onCouponRemoved) {
          onCouponRemoved();
        }
      },
    });
  };

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase text-foreground flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-primary" />
          <span>Apply Promo Coupon</span>
        </h4>
        {appliedCoupon && (
          <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            Coupon Applied
          </span>
        )}
      </div>

      {appliedCoupon ? (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-mono font-bold text-emerald-600">{appliedCoupon}</span>
          </div>
          <button
            onClick={handleRemove}
            disabled={removeMutation.isPending}
            className="p-1 text-foreground/40 hover:text-rose-500 transition-colors"
            title="Remove Coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code (e.g. SAVE20)"
              className="flex-1 bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary uppercase"
            />
            <button
              onClick={() => handleApply(inputCode)}
              disabled={!inputCode.trim() || applyMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {applyMutation.isPending ? <Sparkles className="w-4 h-4 animate-spin" /> : 'Apply'}
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {coupons.length > 0 && (
            <div className="pt-2 border-t border-border/40 space-y-1.5">
              <span className="text-[10px] font-bold text-foreground/50 uppercase block">Available Offers:</span>
              <div className="flex flex-wrap gap-2">
                {coupons.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleApply(c.code)}
                    className="px-2.5 py-1 bg-muted/40 hover:bg-primary/10 hover:text-primary rounded-lg text-[10px] font-mono font-bold border border-border/40 transition-colors"
                  >
                    {c.code} ({c.type === 'percentage' ? `${c.discount_amount}% OFF` : `₹${c.discount_amount} OFF`})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
