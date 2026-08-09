import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | JSS Marketplace',
  description: 'Understand return eligibility, refund processing timelines, replacement terms, and non-returnable items on JSS Marketplace.',
};

export default function ReturnsRefundsPage() {
  const returnSteps = [
    {
      step: 'Step 1',
      title: 'Submit Return Request',
      desc: 'Go to your My Orders dashboard, select the order item, and click "Request Return" within 7 days of delivery.'
    },
    {
      step: 'Step 2',
      title: 'Pickup & Verification',
      desc: 'Our logistics partner will collect the item from your doorstep. Ensure product tags, seal, and packaging are intact.'
    },
    {
      step: 'Step 3',
      title: 'Quality Check & Refund',
      desc: 'Once inspected at the seller hub, your refund will be credited back to your original payment method or bank account within 3–5 business days.'
    }
  ];

  return (
    <FooterPageLayout
      title="Returns & Refunds Policy"
      subtitle="Hassle-free 7-day return policy and transparent refund terms for buyers."
      categoryName="Policies"
    >
      <div className="space-y-12">

        {/* 1. Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
            <span className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1">
              <Clock size={14} />
              7-Day Window
            </span>
            <h3 className="font-extrabold text-base text-foreground">Standard Return Period</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Items can be returned or replaced within 7 days of doorstep delivery for eligible categories.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
            <span className="text-xs font-black text-emerald-500 uppercase tracking-wider flex items-center gap-1">
              <CreditCard size={14} />
              Fast Refunds
            </span>
            <h3 className="font-extrabold text-base text-foreground">Direct Bank / UPI Refund</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Refunds are initiated immediately after quality inspection approval (3–5 working days).
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
            <span className="text-xs font-black text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} />
              Free Pickups
            </span>
            <h3 className="font-extrabold text-base text-foreground">Doorstep Reverse Logistics</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Doorstep return pickup provided for damaged, defective, or incorrect products shipped.
            </p>
          </div>
        </div>

        {/* 2. 3-Step Return Process */}
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-lg font-black text-foreground">How the Return Process Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {returnSteps.map((s, idx) => (
              <div key={idx} className="p-5 bg-muted/30 border border-border-custom rounded-2xl space-y-2">
                <span className="text-xs font-extrabold text-primary uppercase">{s.step}</span>
                <h4 className="font-extrabold text-sm text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-custom leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Eligible vs Non-Returnable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-4">
            <h3 className="font-black text-base text-foreground flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              Eligible for Return / Replacement
            </h3>
            <ul className="space-y-2 text-xs text-muted-custom font-medium">
              <li className="flex items-start gap-2"><span>•</span> Damaged, broken, or defective item received</li>
              <li className="flex items-start gap-2"><span>•</span> Incorrect product, size, or variant shipped</li>
              <li className="flex items-start gap-2"><span>•</span> Missing parts or accessories from package</li>
              <li className="flex items-start gap-2"><span>•</span> Product differs significantly from listing details</li>
            </ul>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-4">
            <h3 className="font-black text-base text-foreground flex items-center gap-2">
              <XCircle className="text-rose-500" size={20} />
              Non-Returnable Categories
            </h3>
            <ul className="space-y-2 text-xs text-muted-custom font-medium">
              <li className="flex items-start gap-2"><span>•</span> Perishable food items, opened juices & edible syrups</li>
              <li className="flex items-start gap-2"><span>•</span> Used cosmetics, innerwear, or personal hygiene products</li>
              <li className="flex items-start gap-2"><span>•</span> Items returned without original seals, tags, or boxes</li>
              <li className="flex items-start gap-2"><span>•</span> Custom or personalized items crafted on order</li>
            </ul>
          </div>

        </div>

        {/* Support CTA */}
        <div className="text-center pt-2">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Need Help With a Return? Contact Support</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </FooterPageLayout>
  );
}
