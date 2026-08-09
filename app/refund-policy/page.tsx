import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Refund Policy | JSS Marketplace',
  description: 'Detailed conditions, timelines, and payment modes for customer refunds.',
};

export default function RefundPolicyPage() {
  return (
    <FooterPageLayout
      title="Refund Policy & Guidelines"
      subtitle="Transparent refund rules for cancellations, returned goods, and lost shipments."
      categoryName="Legal"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl text-xs text-muted-custom leading-relaxed">
        <h2 className="text-sm font-black text-foreground">1. Refund Eligibility</h2>
        <p>Refunds are granted for orders cancelled prior to shipping, or returned within the 7-day return window due to damage or defect.</p>

        <h2 className="text-sm font-black text-foreground">2. Refund Timelines</h2>
        <p>UPI and Card refunds take 24–48 hours to reflect in your source account after inspection approval.</p>
      </div>
    </FooterPageLayout>
  );
}
