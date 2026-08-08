'use client';

import React, { useState } from 'react';
import { HelpCircle, Phone, ShieldCheck, Truck, Award, Headphones, ChevronUp, ChevronDown, Plus, Minus, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tip?: string;
  image?: string;
}

const faqs: FaqItem[] = [
  {
    id: 'track',
    question: 'How do I track my order delivery?',
    answer: 'Once your order is shipped, you will receive a tracking link via SMS or email. You can also track your order from the "My Orders" section in your account.',
    tip: 'You can also contact our support team for real-time delivery updates.',
    image: '📦',
  },
  {
    id: 'payment',
    question: 'What payment modes are supported?',
    answer: 'We support all major payment methods including UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, Wallets, and Cash on Delivery across most PIN codes.',
  },
  {
    id: 'seller',
    question: 'How can I register as a seller?',
    answer: 'Visit our Seller Registration page and complete the GSTIN verification process. Once approved, you can list your products and start selling within 24 hours.',
  },
  {
    id: 'shipping',
    question: 'Are there any shipping charges?',
    answer: 'Free shipping is available on orders above ₹499. For orders below ₹499, a nominal delivery fee of ₹49–₹99 applies depending on your location and seller.',
  },
];

const trustBadges = [
  { icon: ShieldCheck, labelKey: 'footer.shipping_title', label: 'Secure Transactions', color: '#3b82f6' },
  { icon: Truck, labelKey: 'footer.returns_title', label: 'Fast & Reliable Delivery', color: '#f97316' },
  { icon: Award, labelKey: 'footer.guarantee_title', label: 'Trusted by Thousands', color: '#8b5cf6' },
  { icon: Headphones, labelKey: 'footer.support_title', label: '24/7 Customer Support', color: '#22c55e' },
];

export const HomeFaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string>('track');

  const toggle = (id: string) => setOpenId(prev => prev === id ? '' : id);

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50/70 via-purple-50/50 to-orange-50/50 dark:from-[#0b1329] dark:via-[#131f37] dark:to-[#0b1329] border border-border-custom/40 dark:border-border-custom/80 shadow-xs">
      {/* Decorative blobs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 dark:opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #c7d2fe, transparent)' }} />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-30 dark:opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #e9d5ff, transparent)' }} />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* Left Panel */}
          <div className="space-y-5">
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest">
              <HelpCircle size={12} />
              {t('home.faq_center')}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
                {t('home.faq_title')}
              </h2>
              {/* Decorative lines */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="h-1 w-8 bg-blue-500 dark:bg-blue-400 rounded-full" />
                <span className="h-1 w-4 bg-orange-400 dark:bg-orange-400 rounded-full" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-muted-custom font-medium leading-relaxed">
              {t('home.faq_sub')}
            </p>

            {/* B2B Support Card */}
            <div className="bg-white dark:bg-card border border-border-custom/60 dark:border-border-custom/80 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Headphones size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{t('home.need_b2b')}</p>
                  <p className="text-[11px] text-muted-custom mt-0.5">{t('home.reach_helpline')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-colors shadow-2xs">
                <Phone size={13} />
                1800-JSS-MARKET
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-custom">
                <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                {t('home.support_247')}
              </div>
            </div>
          </div>

          {/* Right Panel: Accordion */}
          <div className="lg:col-span-2 space-y-3">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-card border border-border-custom/60 dark:border-border-custom/80 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
                >
                  {/* Question Row */}
                  <button
                    onClick={() => toggle(faq.id)}
                    className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-all ${
                      isOpen
                        ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white'
                        : 'hover:bg-gray-50 dark:hover:bg-background-secondary/80 text-foreground'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-black ${
                          isOpen ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                      <span className={`text-sm font-bold ${isOpen ? 'text-white' : 'text-foreground'}`}>
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={18} className="shrink-0 text-white" />
                    ) : (
                      <ChevronDown size={18} className="shrink-0 text-muted-custom" />
                    )}
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-4 space-y-4">
                      <div className="flex items-start gap-4">
                        {/* Optional illustration */}
                        {faq.image && (
                          <div className="w-20 h-20 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-4xl shrink-0">
                            {faq.image}
                          </div>
                        )}
                        <p className="text-sm text-muted-custom leading-relaxed flex-1 font-normal">
                          {faq.answer}
                        </p>
                      </div>

                      {/* Tip box */}
                      {faq.tip && (
                        <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3">
                          <Lightbulb size={15} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                            <span className="font-bold">{t('home.tip')}:</span> {faq.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Trust badges strip */}
            <div className="bg-white dark:bg-card border border-border-custom/60 dark:border-border-custom/80 rounded-2xl p-4 mt-4">
              <div className="flex flex-wrap items-center justify-around gap-4">
                {trustBadges.map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5 min-w-[80px]">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `${badge.color}20`, color: badge.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-semibold text-center text-foreground leading-tight">
                        {t(badge.labelKey) || badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
