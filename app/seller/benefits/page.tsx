import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../../components/FooterPageLayout';
import {
  TrendingUp,
  Eye,
  LayoutDashboard,
  Package,
  Headphones,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Benefits | JSS Marketplace',
  description: 'Discover the advantages of selling on JSS Marketplace including marketplace visibility, seller tools, and low commission fees.',
};

export default function SellerBenefitsPage() {
  const benefits = [
    {
      title: 'Wider Customer Reach',
      desc: 'Showcase your items to millions of shoppers across India without investing in independent e-commerce infrastructure.',
      icon: TrendingUp
    },
    {
      title: 'Enhanced Visibility',
      desc: 'Benefit from category promotion, search indexing, and promotional campaigns on our homepage.',
      icon: Eye
    },
    {
      title: 'Powerful Seller Dashboard',
      desc: 'Track sales performance, manage product stock, process pending orders, and download financial reports in one place.',
      icon: LayoutDashboard
    },
    {
      title: 'Bulk Product Management',
      desc: 'Seamlessly upload and manage catalog items using structured Excel templates or intuitive web forms.',
      icon: Package
    },
    {
      title: 'Fair Commission & Settlements',
      desc: 'Transparent category commission rates with predictable bank payouts according to agreed schedules.',
      icon: ShieldCheck
    },
    {
      title: 'Dedicated Seller Helpdesk',
      desc: 'Get technical and operational assistance from our seller support team whenever you need help.',
      icon: Headphones
    }
  ];

  return (
    <FooterPageLayout
      title="Why Sell on JSS Marketplace?"
      subtitle="Comprehensive benefits designed to help manufacturers, artisans, and vendors grow online."
      categoryName="Seller Portal"
    >
      <div className="space-y-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const IconComp = b.icon;
            return (
              <div key={idx} className="bg-card border border-border-custom p-6 rounded-3xl space-y-3 hover:border-primary/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <IconComp size={20} />
                </div>
                <h3 className="font-extrabold text-base text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-custom leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/seller/register"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Register as a Seller</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </FooterPageLayout>
  );
}
