'use client';

import React from 'react';
import { ApiShipmentTracking } from '../services/shippingService';
import { Truck, Check, Package, Clock, ShieldCheck, MapPin, XCircle } from 'lucide-react';
import { CANONICAL_TRACKING_STAGES, resolveCanonicalTrackingState } from '../utils/trackingMapper';

interface ShipmentTrackingCardProps {
  tracking?: ApiShipmentTracking;
  orderStatus?: string;
  orderTrackingNumber?: string | null;
  orderCourierName?: string | null;
}

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  confirmed: Clock,
  packed: Package,
  shipped: Truck,
  in_transit: MapPin,
  out_for_delivery: Truck,
  delivered: ShieldCheck,
};

export function ShipmentTrackingCard({
  tracking,
  orderStatus,
  orderTrackingNumber,
  orderCourierName,
}: ShipmentTrackingCardProps) {
  const trackingState = resolveCanonicalTrackingState(
    orderStatus,
    tracking?.status,
    tracking?.courier_name || orderCourierName,
    tracking?.tracking_number || orderTrackingNumber
  );

  const { currentIndex, courierName, trackingNumber, hasAwb, isCancelled } = trackingState;

  if (isCancelled) {
    return null; // Handled prominently in OrderStatusTimeline
  }

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider block">
            Shipment Courier Partner
          </span>
          <span className="text-base font-extrabold text-foreground">
            {courierName}
          </span>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider block">
            Tracking AWB Number
          </span>
          <span
            className={`font-mono text-sm font-bold ${
              hasAwb ? 'text-primary' : 'text-foreground/50 italic text-xs'
            }`}
          >
            {trackingNumber}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50">
          Delivery Status Journey
        </h4>

        <div className="relative pl-6 space-y-6 border-l-2 border-border/40 ml-2">
          {CANONICAL_TRACKING_STAGES.map((stage, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = STAGE_ICONS[stage.key] || Clock;

            return (
              <div key={stage.key} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-[33px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isPassed
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : isCurrent
                      ? 'bg-primary border-primary text-primary-foreground shadow-md ring-4 ring-primary/20 scale-110'
                      : 'bg-card border-border/40 text-foreground/40'
                  }`}
                >
                  {isPassed ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <Icon className={`w-3 h-3 ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span
                    className={`text-xs block ${
                      isCurrent
                        ? 'text-primary font-black text-sm'
                        : isPassed
                        ? 'text-foreground font-extrabold'
                        : 'text-foreground/50 font-medium'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <p className="text-[11px] text-foreground/60 leading-tight">
                    {stage.description}
                  </p>
                  {isCurrent && (
                    <span className="text-[11px] text-primary font-bold flex items-center gap-1.5 pt-1 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      Current Active Stage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
