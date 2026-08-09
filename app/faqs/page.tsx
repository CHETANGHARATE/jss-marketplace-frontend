import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) | JSS Marketplace',
  description: 'Common questions and answers regarding orders, delivery, returns, and payments.',
};

export default function FAQsPage() {
  const faqs = [
    {
      q: 'How do I place an order on JSS Marketplace?',
      a: 'Select your items, click "Add to Cart", choose your delivery address, and pay securely via UPI, Card, or NetBanking.'
    },
    {
      q: 'What is Escrow Payment Protection?',
      a: 'Your payment is safely held in escrow until your order is delivered and verified, protecting you from fraud.'
    },
    {
      q: 'How can I sell products on JSS Marketplace?',
      a: 'Visit the Become a Seller page, upload your GSTIN and business credentials, and start listing products within 24 hours.'
    },
    {
      q: 'What are the shipping charges?',
      a: 'Free express shipping is available on all orders above ₹499 across India.'
    }
  ];

  return (
    <FooterPageLayout
      title="Frequently Asked Questions"
      subtitle="Find quick answers to common questions about buying, selling, and orders."
      categoryName="Customer Service"
    >
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-card border border-border-custom p-6 rounded-2xl space-y-2">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <HelpCircle size={16} className="text-primary shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </FooterPageLayout>
  );
}
