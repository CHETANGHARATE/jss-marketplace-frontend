import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Search, HelpCircle, Package, Truck, RefreshCw, ShieldCheck, MessageSquare, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center | JSS Marketplace',
  description: 'Find answers, track your orders, and learn how to buy or sell on JSS Marketplace.',
};

export default function HelpCenterPage() {
  return (
    <FooterPageLayout
      title="Help Center & Support Portal"
      subtitle="How can we help you today? Search our knowledge base or select a topic below."
      categoryName="Customer Service"
    >
      <div className="space-y-10">
        {/* Quick Topics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-2xl shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package size={24} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Order & Tracking</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Track real-time shipment status, manage delivery addresses, or request order cancellation.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-2xl shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Returns & Refunds</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Learn about our 7-day easy return policy, escrow protection, and instant refund options.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-2xl shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Payments & Safety</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Information on supported payment modes, UPI transactions, invoice downloading, and security.
            </p>
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-foreground">Still need help?</h3>
            <p className="text-xs text-muted-custom mt-1">Our customer helpline is available 24/7 to assist you with your queries.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:1800577627" className="bg-primary text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2">
              <PhoneCall size={16} />
              <span>Call 1800-JSS-MARKET</span>
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}
