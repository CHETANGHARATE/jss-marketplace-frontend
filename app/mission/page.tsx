import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Target, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission & Vision | JSS Marketplace',
  description: 'Our commitment to empowering Indian commerce and direct-to-consumer trade.',
};

export default function MissionPage() {
  return (
    <FooterPageLayout
      title="Our Mission & Core Values"
      subtitle="Empowering 1,000,000+ local sellers and making authentic products accessible across every corner of India."
      categoryName="Company"
    >
      <div className="space-y-6 bg-card border border-border-custom p-8 rounded-3xl">
        <section className="space-y-2">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Target className="text-primary" size={20} />
            <span>Our Mission</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            To build India's most transparent, accessible, and efficient multi-vendor marketplace where every authentic seller can reach customers nationwide without intermediary overhead.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Heart className="text-rose-500" size={20} />
            <span>Our Values</span>
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed">
            Authenticity, transparency, buyer protection, seller empowerment, and continuous technological innovation.
          </p>
        </section>
      </div>
    </FooterPageLayout>
  );
}
