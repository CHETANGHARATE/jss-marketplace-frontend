'use client';

import React, { useState } from 'react';
import {
  HelpCircle, Phone, ShieldCheck, Truck, Award, Headphones,
  ChevronUp, ChevronDown, Plus, Minus, Lightbulb
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
  tipKey?: string;
  image?: string;
}

const faqs: FaqItem[] = [
  { id: 'track',   questionKey: 'home.faq_q1', answerKey: 'home.faq_a1', tipKey: 'home.faq_tip1', image: '📦' },
  { id: 'payment', questionKey: 'home.faq_q2', answerKey: 'home.faq_a2' },
  { id: 'seller',  questionKey: 'home.faq_q3', answerKey: 'home.faq_a3' },
  { id: 'ship',    questionKey: 'home.faq_q4', answerKey: 'home.faq_a4' },
];

const trustBadges = [
  {
    icon: ShieldCheck,
    labelKey: 'home.faq_badge_secure',
    iconClass: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30'
  },
  {
    icon: Truck,
    labelKey: 'home.faq_badge_delivery',
    iconClass: 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200/80 dark:border-orange-500/30'
  },
  {
    icon: Award,
    labelKey: 'home.faq_badge_trusted',
    iconClass: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30'
  },
  {
    icon: Headphones,
    labelKey: 'home.faq_badge_support',
    iconClass: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30'
  },
];

export const HomeFaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string>('track');

  const toggle = (id: string) => setOpenId(prev => (prev === id ? '' : id));

  return (
    <section className="relative rounded-3xl overflow-hidden bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">

      {/* Decorative background accents */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-30 dark:opacity-5 pointer-events-none bg-indigo-200" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-30 dark:opacity-5 pointer-events-none bg-purple-200" />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* ── Left Panel ─────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Label pill */}
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
              <HelpCircle size={13} />
              <span>{t('home.faq_center')}</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {t('home.faq_title')}
              </h2>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="h-1 w-8 bg-blue-500 rounded-full" />
                <span className="h-1 w-4 bg-orange-400 rounded-full" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('home.faq_sub')}
            </p>

            {/* B2B Support Card (44px Icon Container, 22px Icon) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/30 flex items-center justify-center shrink-0 shadow-2xs">
                  <Headphones size={22} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{t('home.need_b2b')}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{t('home.reach_helpline')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-black transition-colors shadow-2xs cursor-pointer justify-center uppercase tracking-wider">
                <Phone size={14} />
                <span>1800-JSS-MARKET</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-semibold justify-center">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>{t('home.support_247')}</span>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Accordion ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3.5">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs transition-all duration-200"
                >
                  {/* Question Row */}
                  <button
                    onClick={() => toggle(faq.id)}
                    className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-all ${
                      isOpen
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-900 dark:text-white'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isOpen
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30'
                        }`}
                      >
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                      <span className={`text-sm font-black ${isOpen ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {t(faq.questionKey)}
                      </span>
                    </div>
                    {isOpen
                      ? <ChevronUp size={20} className="shrink-0 text-white" />
                      : <ChevronDown size={20} className="shrink-0 text-slate-400 dark:text-slate-500" />
                    }
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-4 space-y-4 bg-white dark:bg-slate-900">
                      <div className="flex items-start gap-4">
                        {faq.image && (
                          <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-4xl shrink-0">
                            {faq.image}
                          </div>
                        )}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 font-normal">
                          {t(faq.answerKey)}
                        </p>
                      </div>

                      {/* Tip box */}
                      {faq.tipKey && (
                        <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl px-4 py-3">
                          <Lightbulb size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                            <span className="font-bold">{t('home.tip')}:</span> {t(faq.tipKey)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Trust/Benefit Cards Section (42px–50px Container, 24px Icon) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mt-4 shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {trustBadges.map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div key={i} className="flex flex-col items-center text-center gap-2 p-2">
                      <div
                        className={`w-11 sm:w-12 h-11 sm:h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${badge.iconClass}`}
                      >
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                        {t(badge.labelKey)}
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
