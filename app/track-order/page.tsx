'use client';

import React, { useState } from 'react';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Search,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../components/Toast';

export default function TrackOrderPage() {
  const { info } = useToast();
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setSearched(true);
    }
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Seller accepted order', done: true },
    { title: 'Processing & Packed', desc: 'Quality checked & packed', done: true },
    { title: 'Shipped & In Transit', desc: 'Handed to courier partner', done: searched },
    { title: 'Out for Delivery', desc: 'Delivery agent assigned', done: false },
    { title: 'Delivered', desc: 'Package handed over', done: false }
  ];

  return (
    <FooterPageLayout
      title="Track Your Order"
      subtitle="Check real-time shipment status, dispatch progress, and estimated delivery dates."
      categoryName="Orders"
    >
      <div className="space-y-12">

        {/* 1. Track Order Form */}
        <div className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
              <Truck size={24} />
            </div>
            <h2 className="text-xl font-black text-foreground">Enter Shipment Details</h2>
            <p className="text-xs text-muted-custom">
              Enter your Order ID (e.g. ORD-10928) or Courier AWB Tracking Number.
            </p>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
              <input
                type="text"
                required
                placeholder="Enter Order ID or AWB Tracking Number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-background text-foreground text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search size={15} />
              <span>Track Order Status</span>
            </button>
          </form>
        </div>

        {/* 2. Order Tracking Status Stepper */}
        {searched ? (
          <div className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-custom pb-4">
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md">
                  Active Shipment
                </span>
                <h3 className="text-lg font-black text-foreground mt-1">Order #{orderId.toUpperCase()}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-foreground">Estimated Delivery</p>
                <p className="text-xs text-emerald-500 font-extrabold flex items-center gap-1 justify-end">
                  <Clock size={12} />
                  Within 2 – 3 Business Days
                </p>
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.done
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-muted/40 text-muted-custom border-border-custom'
                  }`}>
                    {step.done ? <CheckCircle2 size={20} /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground">{step.title}</h4>
                    <p className="text-[10px] text-muted-custom mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-muted/20 border border-border-custom rounded-3xl text-center space-y-2 max-w-2xl mx-auto">
            <HelpCircle size={28} className="text-muted-custom mx-auto" />
            <h4 className="text-xs font-bold text-foreground">Where do I find my Order ID?</h4>
            <p className="text-xs text-muted-custom">
              Check your order confirmation email/SMS or log into your account under "My Orders" to find your Order ID.
            </p>
          </div>
        )}

      </div>
    </FooterPageLayout>
  );
}
