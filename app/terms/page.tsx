import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | JSS Marketplace',
  description: 'Terms of service, user agreements, marketplace usage rules, and legal conditions for JSS Marketplace.',
};

export default function TermsPage() {
  return (
    <FooterPageLayout
      title="Terms & Conditions"
      subtitle="Official terms of service governing the use of JSS Marketplace website and mobile applications."
      categoryName="Legal"
    >
      <div className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-6">
        <div className="text-xs text-muted-custom border-b border-border-custom pb-4 font-semibold">
          Last Updated: August 01, 2026
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">1. Introduction & Agreement</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Welcome to JSS Marketplace (operated by JSS Solutions Ltd.). By accessing or using our platform, placing orders, or registering as a seller, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the marketplace services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">2. Marketplace Platform Scope</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            JSS Marketplace serves as an online multi-vendor intermediary platform connecting independent sellers, manufacturers, and buyers. Unless explicitly stated, products are listed, sold, and dispatched directly by registered third-party sellers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">3. Account & Security</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Users are responsible for maintaining the confidentiality of their account credentials, OTPs, and passwords. You agree to accept responsibility for all activities occurring under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">4. Pricing & Payment</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Prices for products are determined by sellers and displayed in Indian Rupees (INR), inclusive of applicable taxes unless specified otherwise. Payments processed via UPI, Paytm, Cards, or Net Banking are secured through encrypted payment gateways.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">5. Intellectual Property</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            All content, brand trademarks, website UI designs, vector assets, logos, and software code are the property of JSS Solutions Ltd. or its licensors and are protected under Indian intellectual property laws.
          </p>
        </section>

        <section className="space-y-3 border-t border-border-custom pt-4 text-xs text-muted-custom">
          <p>
            For legal inquiries or policy clarifications, please contact <strong className="text-foreground">legal@jssmarketplace.com</strong>.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
