import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Refund Policy | JSS Marketplace',
  description: 'Detailed policy on refund modes, calculation, processing timelines, and resolution of disputed transactions.',
};

export default function RefundPolicyPage() {
  return (
    <FooterPageLayout
      title="Refund Policy"
      subtitle="Transparent guidelines on how and when refunds are processed to your payment method."
      categoryName="Legal"
    >
      <div className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-6">
        <div className="text-xs text-muted-custom border-b border-border-custom pb-4 font-semibold">
          Last Updated: August 01, 2026
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">1. Refund Eligibility</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Refunds are issued for pre-canceled orders prior to seller shipment, returned products that pass seller inspection, or undelivered packages due to logistics failures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-foreground">2. Refund Modes & Timelines</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Prepaid orders (UPI, Paytm, Credit/Debit Cards, Net Banking) are refunded directly back to the original source account. Returns usually take 3 to 5 business days after pickup inspection.
          </p>
        </section>

        <section className="space-y-3 border-t border-border-custom pt-4 text-xs text-muted-custom">
          <p>
            Track your active refund status on your <a href="/account/returns" className="text-primary font-bold hover:underline">Returns Dashboard</a> or contact <strong className="text-foreground">refunds@jssmarketplace.com</strong>.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
