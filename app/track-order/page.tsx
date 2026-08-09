'use client';

import React, { useState } from 'react';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Search, Package, Truck, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/Toast';

export default function TrackOrderPage() {
  const { info } = useToast();
  const [orderId, setOrderId] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      info(`Fetching shipment tracking details for order #${orderId}...`, 'Order Tracking');
    }
  };

  return (
    <FooterPageLayout
      title="Track Your Order Shipment"
      subtitle="Enter your Order ID and registered phone or email to view real-time delivery status."
      categoryName="Customer Service"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <form onSubmit={handleTrack} className="bg-card border border-border-custom p-8 rounded-3xl space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Order ID / Tracking Number</label>
            <input
              type="text"
              required
              placeholder="e.g. ORD-109283"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Registered Phone or Email</label>
            <input
              type="text"
              required
              placeholder="Enter your phone number or email"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-black py-3.5 rounded-xl uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} />
            <span>Track Order Status</span>
          </button>
        </form>
      </div>
    </FooterPageLayout>
  );
}
