import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GST Information for Sellers | JSS Marketplace',
  description: 'GST compliance, tax invoice generation, and TCS guidelines for marketplace vendors.',
};

export default function GSTInformationPage() {
  return (
    <FooterPageLayout
      title="GST Information for Sellers"
      subtitle="Tax compliance, GSTIN verification, and automatic tax invoice generation."
      categoryName="For Sellers"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-2">
          <h2 className="text-base font-black text-foreground">GST Registration Requirement</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            As per Indian E-commerce tax regulations, a valid GSTIN is mandatory for selling taxable goods across state borders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-foreground">TCS (Tax Collected at Source)</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            1% TCS (0.5% CGST + 0.5% SGST or 1% IGST) is deducted at source and deposited directly against your GSTIN with government tax authorities.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
