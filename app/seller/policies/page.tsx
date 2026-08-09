import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Policies & Code of Conduct | JSS Marketplace',
  description: 'Standards, compliance, and policies governing seller conduct on JSS Marketplace.',
};

export default function SellerPoliciesPage() {
  return (
    <FooterPageLayout
      title="Policies for Sellers"
      subtitle="Ensuring fairness, product authenticity, and customer trust across the platform."
      categoryName="For Sellers"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-2">
          <h2 className="text-base font-black text-foreground">1. Product Authenticity & Quality</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            All listed items must be 100% genuine and compliant with Indian regulatory standards. Counterfeit or duplicate goods will result in immediate seller suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-foreground">2. Dispatch Timelines</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Sellers are required to pack and dispatch orders within 24 to 48 hours of order confirmation to maintain high seller ratings.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
