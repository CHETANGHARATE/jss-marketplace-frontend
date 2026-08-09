import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Truck,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Package,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | JSS Marketplace',
  description: 'Learn about delivery timelines, shipping coverage, order dispatch, and parcel tracking on JSS Marketplace.',
};

export default function ShippingDeliveryPage() {
  const deliveryTimelines = [
    {
      region: 'Metro & Tier-1 Cities',
      timeline: '2 – 4 Business Days',
      desc: 'Major urban centers including Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune.'
    },
    {
      region: 'Tier-2 & Tier-3 Cities',
      timeline: '4 – 7 Business Days',
      desc: 'Regional hubs, district headquarters, and towns across all Indian states.'
    },
    {
      region: 'Remote & Rural Pincodes',
      timeline: '6 – 10 Business Days',
      desc: 'Specialized logistics routes serving deep rural and interior pin codes.'
    }
  ];

  return (
    <FooterPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Comprehensive information on logistics, dispatch timelines, and delivery tracking."
      categoryName="Policies"
    >
      <div className="space-y-12">

        {/* 1. Overview */}
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
            <Truck size={16} />
            <span>Nationwide Coverage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Logistics & Dispatch Overview</h2>
          <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
            JSS Marketplace partners with verified courier networks and regional logistics providers to deliver orders across India. Sellers dispatch orders directly from their warehouses, hubs, or primary farms upon order confirmation.
          </p>
        </section>

        {/* 2. Timelines */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-foreground">Estimated Delivery Timelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryTimelines.map((item, idx) => (
              <div key={idx} className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Clock size={14} />
                  {item.timeline}
                </span>
                <h3 className="font-extrabold text-base text-foreground">{item.region}</h3>
                <p className="text-xs text-muted-custom leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Detailed Policy Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Package className="text-emerald-500" size={18} />
              Shipping Charges
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Shipping fees are calculated based on package weight, dimensions, and destination pincode at checkout. Free shipping promotional offers may apply on select items or cart totals as specified by sellers.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <MapPin className="text-sky-500" size={18} />
              Order Tracking & Dispatch
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Once your parcel is dispatched by the seller, an AWB tracking number is assigned. You can monitor real-time shipment milestones on our <Link href="/track-order" className="text-primary font-bold hover:underline">Track Order</Link> page.
            </p>
          </div>
        </div>

        {/* 4. Delays & Support */}
        <section className="bg-amber-500/10 border border-amber-500/30 p-6 sm:p-8 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider">
            <AlertTriangle size={16} />
            <span>Unforeseen Delays</span>
          </div>
          <h3 className="text-lg font-extrabold text-foreground">Weather, Festivals & Remote Locations</h3>
          <p className="text-xs text-muted-custom leading-relaxed">
            Delays may occasionally occur due to severe weather, regional holidays, festive peak seasons, or transport disruptions. If your package is delayed beyond the estimated timeframe, please contact our support desk for assistance.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Track Your Order Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </FooterPageLayout>
  );
}
