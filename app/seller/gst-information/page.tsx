import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { FileText, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GST Information for Sellers | JSS Marketplace',
  description: 'Informational overview on GST registration, Tax Collection at Source (TCS), and tax reports for e-commerce vendors.',
};

export default function GSTInformationPage() {
  return (
    <FooterPageLayout
      title="GST Information for Sellers"
      subtitle="Overview of tax compliance, GSTIN registration, and e-commerce Tax Collection at Source (TCS)."
      categoryName="Seller Portal"
    >
      <div className="space-y-8">
        
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">1. GSTIN Registration Requirement</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Under Indian Goods and Services Tax (GST) laws, selling products online across state boundaries generally requires a active GSTIN registration. Sellers must upload a valid GST certificate during onboarding.
          </p>
        </section>

        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-3">
          <h2 className="text-lg font-black text-foreground">2. Tax Collection at Source (TCS)</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            As an e-commerce operator, JSS Marketplace deducts applicable TCS on net taxable sales as mandated by GST guidelines and deposits it directly with the tax department under your GSTIN.
          </p>
        </section>

        <section className="bg-amber-500/10 border border-amber-500/30 p-6 sm:p-8 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase">
            <AlertCircle size={16} />
            <span>Tax Disclaimer</span>
          </div>
          <p className="text-xs text-muted-custom leading-relaxed">
            This page provides general information for marketplace onboarding. Sellers are strongly advised to consult a qualified Chartered Accountant (CA) or tax professional for advice specific to their business structure.
          </p>
        </section>

      </div>
    </FooterPageLayout>
  );
}
