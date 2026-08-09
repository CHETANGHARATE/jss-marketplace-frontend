import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Users,
  Globe,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission & Core Values | JSS Marketplace',
  description: 'Discover the mission, vision, and core values driving JSS Marketplace to empower businesses and customers across India.',
};

export default function MissionPage() {
  const values = [
    {
      title: 'Transparency',
      desc: 'Clear pricing, authentic product descriptions, and open seller relationships with zero hidden fees.',
      icon: Eye,
      color: 'text-primary bg-primary/10 border-primary/20'
    },
    {
      title: 'Authenticity',
      desc: 'Guaranteed genuine products direct from verified suppliers, manufacturers, and primary artisans.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Customer First',
      desc: 'Designing every feature around buyer convenience, secure checkout, and responsive multi-channel support.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Seller Empowerment',
      desc: 'Equipping micro, small, and medium enterprises with enterprise-grade selling tools and national market access.',
      icon: Users,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Accessibility',
      desc: 'Multilingual support in English, Hindi, and Marathi to serve buyers and sellers across all regions.',
      icon: Globe,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
    },
    {
      title: 'Innovation & Trust',
      desc: 'Leveraging secure digital technology, real-time inventory management, and trusted logistics partners.',
      icon: Lock,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    }
  ];

  return (
    <FooterPageLayout
      title="Our Mission & Core Values"
      subtitle="Guiding principles driving JSS Marketplace towards transparent, empowered, and accessible trade."
      categoryName="Company"
    >
      <div className="space-y-12">

        {/* 1. Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border-custom p-8 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <Target size={24} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Our Mission</h2>
            <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
              To democratize e-commerce across India by building a transparent, direct-from-source marketplace that connects verified regional sellers, manufacturers, and producers with millions of customers.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-8 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
              <Eye size={24} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Our Vision</h2>
            <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
              To become India's most trusted multi-vendor ecosystem, known for authentic products, fair trade practices, regional language accessibility, and seamless digital commerce.
            </p>
          </div>
        </div>

        {/* 2. Core Values Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Our Core Values</h2>
            <p className="text-xs text-muted-custom max-w-lg mx-auto">
              The foundational beliefs that govern how we operate, build tools, and serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const IconComponent = v.icon;
              return (
                <div key={idx} className="bg-card border border-border-custom p-6 rounded-3xl space-y-3 hover:border-primary/40 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${v.color}`}>
                    <IconComponent size={20} />
                  </div>
                  <h3 className="font-extrabold text-base text-foreground">{v.title}</h3>
                  <p className="text-xs text-muted-custom leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Building a Better Marketplace */}
        <section className="bg-card border border-border-custom p-8 sm:p-10 rounded-3xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} />
              Platform Philosophy
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Building a Better Marketplace</h2>
            <p className="text-xs sm:text-sm text-muted-custom leading-relaxed max-w-3xl">
              We believe e-commerce should benefit everyone in the supply chain — from small business owners in tier-3 towns to buyers looking for high-quality everyday staples. By eliminating opaque layers, providing clear dashboards, and ensuring verified listings, we build long-term trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-muted/40 rounded-2xl border border-border-custom space-y-1">
              <h4 className="font-extrabold text-foreground text-sm">Direct Sourcing</h4>
              <p className="text-[11px] text-muted-custom">Empowering primary sellers & producers</p>
            </div>
            <div className="p-4 bg-muted/40 rounded-2xl border border-border-custom space-y-1">
              <h4 className="font-extrabold text-foreground text-sm">Quality Standards</h4>
              <p className="text-[11px] text-muted-custom">Strict catalog review & vendor checks</p>
            </div>
            <div className="p-4 bg-muted/40 rounded-2xl border border-border-custom space-y-1">
              <h4 className="font-extrabold text-foreground text-sm">Customer Security</h4>
              <p className="text-[11px] text-muted-custom">Encrypted checkout & order tracking</p>
            </div>
          </div>
        </section>

        {/* 4. CTAs */}
        <section className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl text-center space-y-5">
          <h2 className="text-xl sm:text-3xl font-black">Join Us On Our Journey</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Discover thousands of products or grow your business online with JSS Marketplace.
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
              className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase px-6 py-3 rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>Become a Seller</span>
            </Link>
          </div>
        </section>

      </div>
    </FooterPageLayout>
  );
}
