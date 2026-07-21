'use client';

import React from 'react';
import { Truck, Zap, Clock } from 'lucide-react';
import { ApiShippingMethod } from '../services/shippingService';

interface ShippingMethodSelectorProps {
  methods?: ApiShippingMethod[];
  selectedMethodId?: number;
  onSelect: (method: ApiShippingMethod) => void;
  subtotal: number;
}

const DEFAULT_METHODS: ApiShippingMethod[] = [
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

export function ShippingMethodSelector({
  methods = DEFAULT_METHODS,
  selectedMethodId = 1,
  onSelect,
  subtotal,
}: ShippingMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const isFree = method.is_free_eligible && subtotal > 1000 && method.code === 'standard';
        const finalCost = isFree ? 0 : method.cost;
        const isSelected = selectedMethodId === method.id;

        return (
          <div
            key={method.id}
            onClick={() => onSelect(method)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              isSelected
                ? 'bg-primary/5 border-primary shadow-sm ring-2 ring-primary/20'
                : 'bg-card border-border/40 hover:border-primary/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/40 text-foreground/60'}`}>
                {method.code === 'express' ? (
                  <Zap className="w-4 h-4" />
                ) : method.code === 'same_day' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Truck className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{method.name}</span>
                  {isFree && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                      FREE SHIPPING
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-foreground/60 leading-tight block">
                  {method.description} • Est. {method.estimated_days}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-black text-sm text-primary block">
                {finalCost === 0 ? <span className="text-emerald-600 uppercase font-extrabold">FREE</span> : `₹${finalCost}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
