import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { Package, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Shipping Guidelines | JSS Marketplace',
  description: 'Packaging standards and pickup instructions for JSS Marketplace sellers.',
};

export default function SellerShippingGuidelinesPage() {
  return (
    <FooterPageLayout
      title="Seller Shipping Guidelines"
      subtitle="Packaging, labeling, and pickup procedures for hassle-free order fulfillment."
      categoryName="For Sellers"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-2">
          <h2 className="text-base font-black text-foreground">Packaging Requirements</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Use sturdy tamper-evident boxes or poly bags. Attach the generated shipping label flatly on top of the outer box without obscuring the barcode.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-foreground">Pickup Scheduling</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Our logistics partner will collect ready packages from your registered warehouse location between 10am and 6pm daily.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
