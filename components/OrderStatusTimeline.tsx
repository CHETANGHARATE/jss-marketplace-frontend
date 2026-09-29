'use client';

import React from 'react';
import { Check, Clock, Package, Truck, MapPin, ShieldCheck, XCircle } from 'lucide-react';
import { CANONICAL_TRACKING_STAGES, resolveCanonicalTrackingState } from '../utils/trackingMapper';

interface OrderStatusTimelineProps {
  status: string;
  shipmentStatus?: string;
  trackingNumber?: string | null;
  courierName?: string | null;
}

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  confirmed: Clock,
  packed: Package,
  shipped: Truck,
  in_transit: MapPin,
  out_for_delivery: Truck,
  delivered: ShieldCheck,
};

export function OrderStatusTimeline({
  status,
  shipmentStatus,
  trackingNumber,
  courierName,
}: OrderStatusTimelineProps) {
  const trackingState = resolveCanonicalTrackingState(
    status,
    shipmentStatus,
    courierName,
    trackingNumber
  );

  if (trackingState.isCancelled) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-500">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-bold text-sm block">Order Cancelled</span>
          <span className="text-xs opacity-80">
            This order has been cancelled and reserved inventory was restored.
          </span>
        </div>
      </div>
    );
  }

  const { currentIndex, progressPercentage } = trackingState;

  return (
    <div className="py-4 px-1 sm:px-3 overflow-x-auto no-scrollbar">
      <div className="relative min-w-[620px] flex items-center justify-between pb-2">
        {/* Background track line */}
        <div className="absolute left-5 right-5 top-5 -translate-y-1/2 h-1 bg-muted/40 z-0" />

        {/* Dynamic progress fill line */}
        <div
          className="absolute left-5 top-5 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
          style={{ width: `calc((100% - 2.5rem) * ${progressPercentage / 100})` }}
        />

        {CANONICAL_TRACKING_STAGES.map((stage, idx) => {
          const Icon = STAGE_ICONS[stage.key] || Clock;
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isCompleted = idx <= currentIndex;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isPassed
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                    : isCurrent
                    ? 'bg-primary border-primary text-primary-foreground shadow-md ring-4 ring-primary/20 scale-105'
                    : 'bg-card border-border/40 text-foreground/40'
                }`}
              >
                {isPassed ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                )}
              </div>
              <span
                className={`text-[11px] font-bold mt-2 whitespace-nowrap text-center ${
                  isCompleted ? 'text-foreground font-extrabold' : 'text-foreground/50'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
