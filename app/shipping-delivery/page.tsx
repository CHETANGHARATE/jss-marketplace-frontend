import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | JSS Marketplace',
  description: 'Learn about shipping timelines, free delivery thresholds, and courier partners on JSS Marketplace.',
};

export default function ShippingDeliveryPage() {
  return (
    <FooterPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Fast, reliable express shipping across 25,000+ PIN codes in India."
      categoryName="Customer Service"
    >
      <div className="space-y-8 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Truck className="text-primary" size={20} />
            <span>Delivery Timelines</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Standard delivery takes 3 to 5 business days depending on your delivery address and seller dispatch location. Express shipping is available for select metro cities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} />
            <span>Free Delivery Threshold</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            All orders with a total cart value above ₹499 qualify for Free Express Shipping. For orders under ₹499, a nominal delivery fee of ₹49 to ₹99 applies depending on location.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <MapPin className="text-purple-500" size={20} />
            <span>Courier Partners</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            We partner with India's leading logistics providers including Delhivery, Blue Dart, Ekart, and India Post to ensure safe handling and real-time tracking.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
