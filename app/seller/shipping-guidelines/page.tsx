import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { Package, Truck, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Guidelines for Sellers | JSS Marketplace',
  description: 'Packaging standards, dispatch timelines, and courier pickup procedures for JSS Marketplace vendors.',
};

export default function ShippingGuidelinesPage() {
  return (
    <FooterPageLayout
      title="Seller Shipping Guidelines"
      subtitle="Best practices for packaging, order dispatch, and courier handover."
      categoryName="Seller Portal"
    >
      <div className="space-y-8">
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">1. Packaging Requirements</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            All fragile items (glassware, liquids, electronics) must be packed using protective bubble wrap, sturdy corrugated boxes, and tamper-evident courier bags to prevent transit damage.
          </p>
        </section>

        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">2. Courier Labeling & AWB</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Print and affix the official shipping label and AWB barcode generated via your Seller Dashboard securely on the top outer face of the package.
          </p>
        </section>

        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">3. Handover & Pickup Manifest</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Ensure the logistics agent signs the pickup manifest upon collecting parcels from your warehouse or store location.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
