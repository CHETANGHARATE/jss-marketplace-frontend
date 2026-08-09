'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  RefreshCw,
  Store,
  ArrowRight
} from 'lucide-react';

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', 'General', 'Products', 'Orders', 'Payments', 'Shipping', 'Returns', 'Sellers'];

  const faqs = [
    {
      cat: 'General',
      q: 'What is JSS Marketplace?',
      a: 'JSS Marketplace is India\'s multi-vendor e-commerce platform connecting buyers directly with verified sellers, manufacturers, artisans, and farmers.'
    },
    {
      cat: 'Products',
      q: 'Are products sold on JSS Marketplace authentic?',
      a: 'Yes! All sellers undergo onboarding verification, product quality audits, and GST verification before listing products on our marketplace.'
    },
    {
      cat: 'Orders',
      q: 'How do I place an order?',
      a: 'Browse products, select your desired items, click "Add to Cart", choose your delivery address at checkout, and pay using UPI, Paytm, Cards, or Net Banking.'
    },
    {
      cat: 'Payments',
      q: 'What payment options are supported?',
      a: 'We accept BHIM UPI, Visa, Mastercard, RuPay, Paytm Wallet, and Net Banking across major Indian banks.'
    },
    {
      cat: 'Shipping',
      q: 'How long does delivery take?',
      a: 'Delivery usually takes 2–4 business days for metro cities, 4–7 days for tier-2/tier-3 cities, and 6–10 days for remote rural pincodes.'
    },
    {
      cat: 'Returns',
      q: 'What is the return policy?',
      a: 'Eligible items can be returned within 7 days of delivery for damaged, defective, or incorrect items shipped.'
    },
    {
      cat: 'Sellers',
      q: 'How can I sell my products on JSS Marketplace?',
      a: 'Visit the "Become a Seller" page, complete the seller registration with your GSTIN and bank details, and submit for verification.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCategory === 'All' || faq.cat === activeCategory;
    const matchesSearch = !searchTerm || faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <FooterPageLayout
      title="Frequently Asked Questions (FAQs)"
      subtitle="Find fast answers to common questions regarding shopping, payments, orders, and seller onboarding."
      categoryName="Help & Support"
    >
      <div className="space-y-12">

        {/* 1. Search & Filter Bar */}
        <div className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              placeholder="Search questions (e.g. shipping time, return policy, payment options)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background text-foreground text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-muted/40 hover:bg-muted text-muted-custom border border-border-custom'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Accordion FAQ List */}
        <div className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-border-custom rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-4"
                  >
                    <span className="font-extrabold text-sm text-foreground flex items-center gap-2">
                      <HelpCircle size={16} className="text-primary shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-muted-custom" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 bg-card border-t border-border-custom text-xs text-muted-custom leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted-custom space-y-2">
              <p className="text-sm font-bold">No questions found matching "{searchTerm}"</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                className="text-xs font-extrabold text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Support Link */}
        <div className="text-center pt-2">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Have a Different Question? Contact Support</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </FooterPageLayout>
  );
}
