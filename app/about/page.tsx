import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Building2, Target, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | JSS Marketplace',
  description: 'Learn about JSS Solutions Marketplace, our vision, and direct seller connectivity across India.',
};

export default function AboutPage() {
  return (
    <FooterPageLayout
      title="About JSS Marketplace"
      subtitle="Connecting verified Indian manufacturers, farmers, and distributors directly with retail and wholesale buyers."
      categoryName="Company"
    >
      <div className="space-y-10">
        <div className="bg-card border border-border-custom p-8 rounded-3xl space-y-4">
          <h2 className="text-xl font-black text-foreground">Who We Are</h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            JSS Marketplace is a premier Indian multi-vendor e-commerce platform designed to streamline trade between verified suppliers and customers. By removing unnecessary middlemen, we ensure authentic product quality, fair pricing for buyers, and higher profit margins for sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-2xl space-y-2">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              <span>Direct Sourcing</span>
            </h3>
            <p className="text-xs text-muted-custom">Products listed directly from source factories and farms.</p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-2xl space-y-2">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Award size={18} className="text-emerald-500" />
              <span>Quality Inspection</span>
            </h3>
            <p className="text-xs text-muted-custom">Every supplier is GSTIN verified and quality screened.</p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-2xl space-y-2">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              <span>Customer First</span>
            </h3>
            <p className="text-xs text-muted-custom">Escrow protection and 24/7 helpline for complete peace of mind.</p>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}
