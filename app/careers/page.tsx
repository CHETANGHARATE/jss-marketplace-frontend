import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Briefcase, Users, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | JSS Marketplace',
  description: 'Join the team building India\'s next-generation e-commerce marketplace.',
};

export default function CareersPage() {
  return (
    <FooterPageLayout
      title="Careers at JSS Marketplace"
      subtitle="Build technology and services empowering millions of buyers and sellers across India."
      categoryName="Company"
    >
      <div className="space-y-12">

        {/* 1. Culture */}
        <section className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
            <Users size={16} />
            <span>Work Culture</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-foreground">Innovate & Grow With Us</h2>
          <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
            At JSS Marketplace, we foster a collaborative, fast-paced environment focused on solving real-world supply chain challenges, building scalable web systems, and empowering regional businesses across India.
          </p>
        </section>

        {/* 2. Openings Notice */}
        <section className="bg-card border border-border-custom p-8 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
            <Briefcase size={24} />
          </div>
          <h3 className="text-lg font-black text-foreground">Current Openings</h3>
          <p className="text-xs text-muted-custom max-w-md mx-auto">
            There are currently no active job vacancies. We are always interested in connecting with passionate software engineers, product designers, and seller growth managers.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-6 py-3 rounded-2xl transition-all shadow-md"
            >
              <span>Submit General Resume</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </div>
    </FooterPageLayout>
  );
}
