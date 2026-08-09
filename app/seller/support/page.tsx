import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { Headphones, Mail, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Support & Desk | JSS Marketplace',
  description: 'Dedicated helpline and support desk for registered sellers on JSS Marketplace.',
};

export default function SellerSupportPage() {
  return (
    <FooterPageLayout
      title="Dedicated Seller Support"
      subtitle="Priority resolution for cataloging, shipping, payments, and account inquiries."
      categoryName="For Sellers"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border-custom p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Headphones size={20} />
          </div>
          <h3 className="font-extrabold text-sm text-foreground">Seller Desk Helpline</h3>
          <p className="text-xs text-muted-custom">1800-JSS-SELLER (Mon-Sat, 9am - 8pm)</p>
        </div>

        <div className="bg-card border border-border-custom p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Mail size={20} />
          </div>
          <h3 className="font-extrabold text-sm text-foreground">Seller Email Desk</h3>
          <p className="text-xs text-muted-custom">sellersupport@jsssolutions.com</p>
        </div>

        <div className="bg-card border border-border-custom p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <h3 className="font-extrabold text-sm text-foreground">Seller Knowledge Base</h3>
          <p className="text-xs text-muted-custom">Guides for bulk uploads, API integration & shipping</p>
        </div>
      </div>
    </FooterPageLayout>
  );
}
