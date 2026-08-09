import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | JSS Marketplace',
  description: 'Learn how JSS Marketplace collects, protects, uses, and respects user and seller personal data.',
};

export default function PrivacyPage() {
  return (
    <FooterPageLayout
      title="Privacy Policy"
      subtitle="Our commitment to safeguarding customer and seller personal information."
      categoryName="Legal"
    >
      <div className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-6">
        <div className="text-xs text-muted-custom border-b border-border-custom pb-4 font-semibold">
          Last Updated: August 01, 2026
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">1. Information We Collect</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            We collect information provided directly by users when creating an account, placing an order, or registering as a seller. This includes name, mobile number, email address, shipping address, GSTIN (for vendors), and payment transaction references.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">2. How We Use Your Data</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Your data is used solely to process orders, facilitate shipment delivery with courier partners, send transaction alerts, verify vendor identity, and improve platform security. We do not sell your personal data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">3. Data Security & Encryption</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            We utilize industry-standard 256-bit SSL encryption, secure API protocols, and restricted server access to prevent unauthorized access, disclosure, or alteration of your information.
          </p>
        </section>

        <section className="space-y-3 border-t border-border-custom pt-4 text-xs text-muted-custom">
          <p>
            Questions regarding data privacy? Reach out to our Data Protection Officer at <strong className="text-foreground">privacy@jssmarketplace.com</strong>.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
