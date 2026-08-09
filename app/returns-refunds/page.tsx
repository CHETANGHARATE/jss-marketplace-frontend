import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { RefreshCw, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | JSS Marketplace',
  description: 'Understand our 7-day hassle-free return and replacement policy.',
};

export default function ReturnsRefundsPage() {
  return (
    <FooterPageLayout
      title="Returns & Refunds Policy"
      subtitle="7-day easy return window with escrow payment protection."
      categoryName="Customer Service"
    >
      <div className="space-y-8 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <RefreshCw className="text-primary" size={20} />
            <span>7-Day Return Guarantee</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            If you receive a damaged, defective, or incorrect product, you can initiate a return or replacement request within 7 days of delivery through your order account page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={20} />
            <span>Refund Processing</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Once returned items are inspected and approved by the seller, refunds are credited back to your original payment account (UPI/Bank/Card) within 24 to 48 hours.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
