import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Search, ShoppingCart, CreditCard, PackageCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Buy | JSS Marketplace',
  description: 'Step-by-step guide to browsing, selecting, and placing orders on JSS Marketplace.',
};

export default function HowToBuyPage() {
  const steps = [
    {
      step: '01',
      title: 'Search & Explore Catalog',
      desc: 'Use the top search bar or browse categories to find verified products from authentic sellers across India.',
      icon: Search
    },
    {
      step: '02',
      title: 'Add Items to Cart',
      desc: 'Review product descriptions, seller credentials, and wholesale price breaks before adding items to your cart.',
      icon: ShoppingCart
    },
    {
      step: '03',
      title: 'Secure Payment',
      desc: 'Choose your preferred payment method (UPI, Cards, NetBanking, COD). Payments are held in escrow for your safety.',
      icon: CreditCard
    },
    {
      step: '04',
      title: 'Express Delivery to Doorstep',
      desc: 'Track your order in real-time until it is verified and delivered directly to your address.',
      icon: PackageCheck
    }
  ];

  return (
    <FooterPageLayout
      title="How to Buy on JSS Marketplace"
      subtitle="A simple 4-step guide for retail customers and bulk wholesale buyers."
      categoryName="Customer Service"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="bg-card border border-border-custom p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-primary">{item.step}</span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={20} />
                </div>
              </div>
              <h3 className="font-extrabold text-base text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-custom leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </FooterPageLayout>
  );
}
