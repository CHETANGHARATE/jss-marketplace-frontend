import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import { TrendingUp, ShieldCheck, Truck, Users, Percent, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seller Benefits | JSS Marketplace',
  description: 'Why top Indian manufacturers, farmers, and brands grow with JSS Marketplace.',
};

export default function SellerBenefitsPage() {
  const benefits = [
    {
      title: '0% Commission Initial Period',
      desc: 'Keep 100% of your sale value with zero listing fees for the first 90 days.',
      icon: Percent
    },
    {
      title: 'Direct Pan-India Reach',
      desc: 'Reach over 100,000+ retail and wholesale buyers across 25,000+ PIN codes.',
      icon: Users
    },
    {
      title: 'Escrow Payment Security',
      desc: 'Guaranteed 24-hour payouts directly into your registered bank account after delivery.',
      icon: ShieldCheck
    },
    {
      title: 'Automated Logistics Support',
      desc: 'Discounted shipping rates with doorstep pick-up from your factory or warehouse.',
      icon: Truck
    }
  ];

  return (
    <FooterPageLayout
      title="Why Sell on JSS Marketplace?"
      subtitle="Empowering Indian businesses with direct buyer connectivity and zero hassle."
      categoryName="For Sellers"
    >
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="bg-card border border-border-custom p-6 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <h3 className="font-extrabold text-base text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-custom leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl text-center space-y-4">
          <h3 className="text-xl font-black">Ready to expand your market reach?</h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">Register your GSTIN and start listing products within minutes.</p>
          <Link href="/seller/register" className="inline-block bg-primary text-white text-xs font-black px-6 py-3.5 rounded-xl hover:bg-primary-hover transition-colors uppercase">
            Become a Seller Today &rarr;
          </Link>
        </div>
      </div>
    </FooterPageLayout>
  );
}
