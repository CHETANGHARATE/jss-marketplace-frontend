import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Store,
  ShieldCheck,
  Package,
  BadgePercent,
  Truck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  Target,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | JSS Marketplace',
  description: 'Learn about JSS Marketplace — India\'s trusted multi-vendor platform connecting verified sellers, manufacturers, and farmers directly with customers.',
};

export default function AboutPage() {
  const whyUsCards = [
    {
      icon: Store,
      title: 'Direct From Source',
      desc: 'Connecting buyers directly with verified manufacturers, artisans, and agricultural producers across India.',
      color: 'text-primary bg-primary/10 border-primary/20'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Sellers',
      desc: 'Strict onboarding and quality checks for every vendor on our platform to guarantee authenticity.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Package,
      title: 'Wide Product Selection',
      desc: 'Explore thousands of products spanning spices, kitchenware, pooja essentials, fashion, and electronics.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: BadgePercent,
      title: 'Competitive Pricing',
      desc: 'Transparent, fair pricing without unnecessary middleman markups direct from primary sellers.',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Reliable doorstep shipping and order tracking across metro cities, tier-2, tier-3, and rural pin codes.',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      desc: 'Responsive customer care and seller assistance available in English, Hindi, and Marathi.',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    }
  ];

  const differentiators = [
    {
      feature: 'Sourcing Model',
      jss: 'Direct from Verified Vendors & Primary Producers',
      others: 'Multi-layer Distributors with Markup'
    },
    {
      feature: 'Quality Assurance',
      jss: 'Multi-step Vendor Verification & Buyer Protection',
      others: 'Unverified Open Marketplace Listings'
    },
    {
      feature: 'Support Languages',
      jss: 'Multilingual (English, Hindi, Marathi)',
      others: 'English Only Support'
    },
    {
      feature: 'Seller Empowerment',
      jss: 'Dedicated Seller Portal, GST Guidance & Analytics',
      others: 'High Commission & Rigid Terms'
    }
  ];

  return (
    <FooterPageLayout
      title="About JSS Marketplace"
      subtitle="Connecting customers with trusted sellers, manufacturers, farmers and businesses across India."
      categoryName="Company"
    >
      <div className="space-y-12">

        {/* 1. Who We Are */}
        <section className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
            <Building2 size={16} />
            <span>Who We Are</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-foreground leading-snug">
            India's Next-Generation Multi-Vendor Marketplace
          </h2>
          <p className="text-sm text-muted-custom leading-relaxed">
            JSS Marketplace (operated by JSS Solutions Ltd.) is a comprehensive e-commerce platform built to digitize and empower trade across India. We bring together micro-entrepreneurs, regional manufacturers, agricultural producers, and established brands into a single transparent online ecosystem.
          </p>
          <p className="text-sm text-muted-custom leading-relaxed">
            Whether you are looking for fresh regional syrups and spices, authentic pooja items, kitchen appliances, or modern fashion, JSS Marketplace offers an accessible and reliable shopping experience for every customer.
          </p>
        </section>

        {/* 2. What We Do */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Store className="text-primary" size={20} />
              For Customers
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              We provide a seamless multi-category catalog, transparent customer reviews, secure payment options (UPI, Net Banking, Cards, Paytm), and doorstep delivery with order tracking.
            </p>
          </div>
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Users className="text-emerald-500" size={20} />
              For Sellers & Producers
            </h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              We offer a dedicated Seller Portal with inventory management, order processing tools, transparent settlement reports, and shipping guidelines to help businesses scale online.
            </p>
          </div>
        </section>

        {/* 3. Why Choose JSS Marketplace */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Why JSS Marketplace?</h2>
            <p className="text-xs text-muted-custom max-w-xl mx-auto">
              Our core pillars designed to deliver value for buyers and vendors alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUsCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div key={idx} className="bg-card border border-border-custom p-6 rounded-3xl space-y-3 hover:border-primary/40 transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                    <IconComp size={22} />
                  </div>
                  <h3 className="font-extrabold text-base text-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-custom leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. What Makes Us Different Table */}
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-foreground">What Makes Us Different</h3>
            <p className="text-xs text-muted-custom">How JSS Marketplace compares to traditional e-commerce models.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-custom text-muted-custom uppercase font-black tracking-wider">
                  <th className="pb-3 pr-4">Feature</th>
                  <th className="pb-3 px-4 text-primary">JSS Marketplace</th>
                  <th className="pb-3 pl-4">Traditional E-Commerce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom">
                {differentiators.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pr-4 font-bold text-foreground">{row.feature}</td>
                    <td className="py-3.5 px-4 font-bold text-primary flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{row.jss}</span>
                    </td>
                    <td className="py-3.5 pl-4 text-muted-custom">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-8 sm:p-10 rounded-3xl text-center space-y-5">
          <h2 className="text-xl sm:text-3xl font-black text-foreground">Ready to Get Started?</h2>
          <p className="text-xs sm:text-sm text-muted-custom max-w-lg mx-auto">
            Join thousands of happy buyers and thriving sellers on India's premier multi-vendor platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-6 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-md"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/seller/register"
              className="bg-card hover:bg-muted text-foreground border border-border-custom font-extrabold text-xs uppercase px-6 py-3 rounded-2xl transition-all flex items-center gap-2"
            >
              <span>Become a Seller</span>
            </Link>
          </div>
        </section>

      </div>
    </FooterPageLayout>
  );
}
