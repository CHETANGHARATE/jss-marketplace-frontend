import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { XCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy | JSS Marketplace',
  description: 'Guidelines for order cancellation before and after dispatch.',
};

export default function CancellationPolicyPage() {
  return (
    <FooterPageLayout
      title="Cancellation Policy"
      subtitle="Easy one-click order cancellation prior to seller shipment."
      categoryName="Customer Service"
    >
      <div className="space-y-8 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            <span>Cancellation Before Shipment</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            You can cancel any order free of charge from your "My Orders" tab before the seller dispatches the package. Instant refunds will be initiated immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <XCircle className="text-rose-500" size={20} />
            <span>Cancellation After Shipment</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            If the package is already in transit, you can decline delivery when contacted by the courier partner. Your refund will be processed once the package returns to the seller.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
