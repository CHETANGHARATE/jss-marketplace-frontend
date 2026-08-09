import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Ban,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy | JSS Marketplace',
  description: 'Learn when and how to cancel orders on JSS Marketplace before shipment and refund handling procedures.',
};

export default function CancellationPolicyPage() {
  return (
    <FooterPageLayout
      title="Order Cancellation Policy"
      subtitle="Clear guidelines on order cancellation windows, seller dispatch rules, and automated refunds."
      categoryName="Policies"
    >
      <div className="space-y-12">

        {/* 1. Cancellation Window */}
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
            <Clock size={16} />
            <span>Cancellation Window</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">When Can You Cancel an Order?</h2>
          <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
            You can cancel any order free of charge at any time <strong>before the seller dispatches</strong> the package. Once a tracking number is generated and handed over to our courier partner, the order cannot be canceled in transit, but you can initiate a standard return upon delivery.
          </p>
        </section>

        {/* 2. Cancellation Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={18} />
              Cancellation Before Shipment
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Log into your buyer account, visit "My Orders", find the pending order, and click "Cancel Order". Select your cancellation reason to confirm.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <RefreshCw className="text-sky-500" size={18} />
              Refund Processing for Cancellations
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Prepaid orders canceled prior to shipment are refunded 100% automatically to your original payment source (UPI, Paytm, Card, or Net Banking) within 24 to 48 hours.
            </p>
          </div>
        </div>

        {/* 3. Seller-Initiated Cancellations */}
        <section className="bg-amber-500/10 border border-amber-500/30 p-6 sm:p-8 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider">
            <AlertCircle size={16} />
            <span>Seller / Marketplace Cancellations</span>
          </div>
          <h3 className="text-lg font-extrabold text-foreground">What happens if a seller cancels your order?</h3>
          <p className="text-xs text-muted-custom leading-relaxed">
            In rare cases where an item becomes out of stock, fails seller quality audit, or cannot be delivered to your pincode, the seller or system may cancel the order. You will receive an immediate SMS/Email alert and a 100% full refund automatically.
          </p>
        </section>

        {/* Support Link */}
        <div className="text-center pt-2">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Need Assistance With Cancellation? Contact Support</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </FooterPageLayout>
  );
}
