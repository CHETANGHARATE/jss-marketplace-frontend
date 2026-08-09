'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Search,
  ShoppingBag,
  Truck,
  CreditCard,
  RefreshCw,
  UserCheck,
  Store,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      title: 'Buying Help',
      icon: ShoppingBag,
      desc: 'Browsing products, checking seller details, and adding to cart.',
      link: '/how-to-buy'
    },
    {
      title: 'Orders & Tracking',
      icon: Truck,
      desc: 'Track active shipments, modify order details, or check delivery timelines.',
      link: '/track-order'
    },
    {
      title: 'Payments & Offers',
      icon: CreditCard,
      desc: 'Accepted payment methods (UPI, Cards, Paytm, Net Banking) & promo codes.',
      link: '/faqs'
    },
    {
      title: 'Returns & Refunds',
      icon: RefreshCw,
      desc: '7-day return policy, eligibility rules, and refund processing timelines.',
      link: '/returns-refunds'
    },
    {
      title: 'Account Settings',
      icon: UserCheck,
      desc: 'Managing your profile, delivery addresses, and saved wishlists.',
      link: '/account/profile'
    },
    {
      title: 'Seller Portal Support',
      icon: Store,
      desc: 'Vendor onboarding, product listing policies, and GST compliance.',
      link: '/seller/support'
    }
  ];

  const quickFaqs = [
    {
      q: 'How do I track my active order?',
      a: 'Go to the "Track Order" link in the footer or navigation header, enter your Order ID or tracking number, and click Track.'
    },
    {
      q: 'What is the return window for products on JSS Marketplace?',
      a: 'Most physical items have a 7-day return policy from the date of delivery provided they are unused and in original packaging.'
    },
    {
      q: 'Which payment options are accepted?',
      a: 'We accept BHIM UPI, Visa, Mastercard, RuPay, Paytm Wallet, and Net Banking across major Indian banks.'
    },
    {
      q: 'How can I become a verified seller on JSS Marketplace?',
      a: 'Click "Become a Seller" in the header or footer, complete the registration form with your GSTIN and bank details, and submit for verification.'
    }
  ];

  const filteredFaqs = searchTerm
    ? quickFaqs.filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase()))
    : quickFaqs;

  return (
    <FooterPageLayout
      title="Help Center & Support Desk"
      subtitle="Find answers to common questions, order guides, and buyer assistance."
      categoryName="Help Center"
    >
      <div className="space-y-12">

        {/* 1. Search Bar */}
        <div className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="max-w-xl mx-auto space-y-2 text-center">
            <h2 className="text-lg sm:text-xl font-black text-foreground">How can we help you today?</h2>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
              <input
                type="text"
                placeholder="Search for help topics (e.g. tracking, returns, UPI)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 2. Category Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-foreground">Browse Help Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.link}
                  className="bg-card border border-border-custom p-6 rounded-3xl space-y-3 hover:border-primary/40 transition-all group block"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <IconComp size={20} />
                  </div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{cat.title}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-muted-custom leading-relaxed">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Quick FAQ Section */}
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-lg font-black text-foreground">Top Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-muted/30 border border-border-custom rounded-2xl space-y-1.5">
                <h4 className="font-extrabold text-sm text-foreground flex items-start gap-2">
                  <HelpCircle size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-muted-custom leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Still Need Help CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-emerald-500/10 border border-primary/20 p-8 sm:p-10 rounded-3xl text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Still need assistance?</h2>
          <p className="text-xs sm:text-sm text-muted-custom max-w-md mx-auto">
            Our customer support desk is available to assist you with active orders, refunds, or general queries.
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Contact Customer Support</span>
            <ArrowRight size={14} />
          </Link>
        </section>

      </div>
    </FooterPageLayout>
  );
}
