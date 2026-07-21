'use client';

import React from 'react';
import { ApiShipmentTracking } from '../services/shippingService';
import { Truck, Check, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface ShipmentTrackingCardProps {
  tracking?: ApiShipmentTracking;
}

const STAGES = [
  { key: 'order_confirmed', label: 'Order Confirmed', icon: Clock },
  { key: 'packed', label: 'Packed & Ready', icon: Package },
  { key: 'picked_up', label: 'Picked Up', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: MapPin },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: ShieldCheck },
];

export function ShipmentTrackingCard({ tracking }: ShipmentTrackingCardProps) {
  const currentStatus = tracking?.status || 'order_confirmed';
  const activeIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider block">
            Shipment Courier Partner
          </span>
          <span className="text-base font-extrabold text-foreground">
            {tracking?.courier_name || 'BlueDart Express Logistics'}
          </span>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider block">
            Tracking AWB Number
          </span>
          <span className="font-mono font-bold text-sm text-primary">
            {tracking?.tracking_number || 'AWB-8492049182'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/50">
          Delivery Status Journey
        </h4>

        <div className="relative pl-6 space-y-6 border-l-2 border-border/40 ml-2">
          {STAGES.map((stage, idx) => {
            const isPassed = idx <= resolvedIndex;
            const isCurrent = idx === resolvedIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative flex items-center gap-3">
                <div
                  className={`absolute -left-[33px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isPassed
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : 'bg-card border-border/40 text-foreground/40'
                  } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                >
                  {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3 h-3" />}
                </div>

                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isPassed ? 'text-foreground font-extrabold' : 'text-foreground/50'
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[11px] text-primary font-semibold block animate-pulse">
                      Active status update...
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
