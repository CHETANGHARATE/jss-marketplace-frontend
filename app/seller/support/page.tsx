import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import {
  Headphones,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Support | JSS Marketplace',
  description: 'Dedicated seller support desk for vendor onboarding, catalog upload, order fulfillment, and settlement assistance.',
};

export default function SellerSupportPage() {
  const topics = [
    { title: 'Vendor Onboarding & Account Verification', desc: 'Assistance with GSTIN submission, bank account verification, and seller profile setup.' },
    { title: 'Product Listing & Cataloging', desc: 'Guidance on bulk Excel upload, category selection, specifications, and primary images.' },
    { title: 'Order Dispatch & Logistics', desc: 'Support with packaging standards, courier pickup scheduling, and AWB tracking.' },
    { title: 'Payments & Settlement Statements', desc: 'Clarifications on commission breakdown, TCS certificates, and bank transfer dates.' }
  ];

  return (
    <FooterPageLayout
      title="Seller Support Desk"
      subtitle="Dedicated assistance for onboarded vendors and new business applicants."
      categoryName="Seller Portal"
    >
      <div className="space-y-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((t, idx) => (
            <div key={idx} className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
              <span className="text-xs font-black text-primary uppercase">Topic {idx + 1}</span>
              <h3 className="font-extrabold text-base text-foreground">{t.title}</h3>
              <p className="text-xs text-muted-custom leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-4 text-center">
          <Headphones size={32} className="text-primary mx-auto" />
          <h3 className="text-lg font-black text-foreground">Contact Seller Desk</h3>
          <p className="text-xs text-muted-custom max-w-md mx-auto">
            Email us at <strong className="text-foreground">seller@jssmarketplace.com</strong> or call our dedicated vendor helpline.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
            >
              <span>Contact Seller Support</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </div>
    </FooterPageLayout>
  );
}
