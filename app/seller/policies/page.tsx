import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { ShieldCheck, FileCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Policies & Code of Conduct | JSS Marketplace',
  description: 'Operating guidelines, product listing rules, customer service commitments, and compliance standards for vendors.',
};

export default function SellerPoliciesPage() {
  return (
    <FooterPageLayout
      title="Policies for Sellers"
      subtitle="Operational rules, quality standards, and code of conduct governing vendor listings."
      categoryName="Seller Portal"
    >
      <div className="space-y-8">
        
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">1. Product Listing Accuracy</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Sellers must ensure all listed product titles, descriptions, pricing, specifications, and images accurately represent the physical product shipped. Counterfeit, expired, or misleading products are strictly prohibited.
          </p>
        </section>

        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">2. Order Fulfillment Standards</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Orders must be packed securely in accordance with packaging guidelines and handed over to designated courier partners within 24 to 48 hours of order receipt to ensure timely delivery.
          </p>
        </section>

        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">3. Customer Service & Returns</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Vendors must honor marketplace return decisions for defective, damaged, or incorrect products shipped and maintain professional communication standards.
          </p>
        </section>

      </div>
    </FooterPageLayout>
  );
}
