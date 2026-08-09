import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog & E-commerce Insights | JSS Marketplace',
  description: 'Articles, seller guides, product trends, and e-commerce news in India.',
};

export default function BlogPage() {
  const posts = [
    {
      title: 'Top Festive Season Selling Tips for Indian Vendors in 2026',
      desc: 'How to optimize inventory, packaging, and flash deals to triple your sales during Diwali.',
      date: 'Aug 02, 2026',
      author: 'JSS Seller Desk',
      category: 'Seller Tips'
    },
    {
      title: 'Direct-from-Source Sourcing: Why Farmers & Artisans Are Winning On Marketplace',
      desc: 'Understanding the shift towards direct manufacturer and artisan sourcing across tier-2 and tier-3 India.',
      date: 'Jul 28, 2026',
      author: 'Marketplace Trends',
      category: 'Industry Insights'
    }
  ];

  return (
    <FooterPageLayout
      title="JSS Marketplace Blog & Insights"
      subtitle="Industry news, seller success stories, and buyer guides."
      categoryName="Company"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <article key={i} className="bg-card border border-border-custom p-6 rounded-3xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-md">{post.category}</span>
              <h3 className="font-extrabold text-base text-foreground leading-snug">{post.title}</h3>
              <p className="text-xs text-muted-custom leading-relaxed">{post.desc}</p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-custom pt-3 border-t border-border-custom">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
                <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </FooterPageLayout>
  );
}
