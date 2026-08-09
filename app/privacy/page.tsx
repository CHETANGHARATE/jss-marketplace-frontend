import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | JSS Marketplace',
  description: 'How JSS Marketplace collects, protects, and handles your personal data.',
};

export default function PrivacyPage() {
  return (
    <FooterPageLayout
      title="Privacy Policy & Data Security"
      subtitle="Your privacy and data protection are fundamental to our marketplace operation."
      categoryName="Legal"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl text-xs text-muted-custom leading-relaxed">
        <h2 className="text-sm font-black text-foreground">1. Data Collection</h2>
        <p>We collect essential information required to process orders, facilitate delivery, and prevent fraudulent transactions.</p>

        <h2 className="text-sm font-black text-foreground">2. Data Security</h2>
        <p>Your data is encrypted using SSL (Secure Sockets Layer) and PCI-DSS compliant payment gateways. We never store credit card or UPI PIN information.</p>
      </div>
    </FooterPageLayout>
  );
}
