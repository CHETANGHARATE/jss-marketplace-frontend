'use client';

import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  status: string;
}

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'processing', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const currentStatusIndex = STEPS.findIndex((s) => s.key === status.toLowerCase());
  const isCancelled = status.toLowerCase() === 'cancelled';

  if (isCancelled) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-500">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-bold text-sm block">Order Cancelled</span>
          <span className="text-xs opacity-80">This order has been cancelled and stock was restored.</span>
        </div>
      </div>
    );
  }

  const activeIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted/40 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
          style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isPassed
                    ? 'bg-primary border-primary text-primary-foreground shadow-md'
                    : 'bg-card border-border/40 text-foreground/40'
                } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                  isPassed ? 'text-foreground font-extrabold' : 'text-foreground/50'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
