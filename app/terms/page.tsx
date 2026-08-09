import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | JSS Marketplace',
  description: 'Legal terms governing your use of JSS Marketplace website and services.',
};

export default function TermsPage() {
  return (
    <FooterPageLayout
      title="Terms & Conditions of Use"
      subtitle="Please read these terms carefully before accessing or using JSS Marketplace."
      categoryName="Legal"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl text-xs text-muted-custom leading-relaxed">
        <h2 className="text-sm font-black text-foreground">1. User Agreement</h2>
        <p>By accessing JSS Marketplace, you agree to comply with all applicable Indian e-commerce laws and regulations.</p>

        <h2 className="text-sm font-black text-foreground">2. Account Responsibility</h2>
        <p>Users are responsible for maintaining the confidentiality of their login credentials and all activities occurring under their account.</p>

        <h2 className="text-sm font-black text-foreground">3. Payments & Escrow</h2>
        <p>Payments made for orders are safely managed under escrow guidelines until delivery fulfillment is confirmed.</p>
      </div>
    </FooterPageLayout>
  );
}
