import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';

export const metadata: Metadata = {
  title: 'Marketplace Sitemap | JSS Marketplace',
  description: 'Complete directory of pages, categories, and services on JSS Marketplace.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Marketplace Categories',
      links: [
        { name: 'Juices & Syrups', href: '/category/juices-syrups' },
        { name: 'Home & Kitchen', href: '/category/home-kitchen' },
        { name: 'Religious & Pooja Items', href: '/category/religious-pooja-items' },
        { name: 'Agriculture & Seeds', href: '/category/agriculture-seeds' },
        { name: 'Cosmetics & Beauty', href: '/category/cosmetics' },
        { name: 'Footwear', href: '/category/footwear' },
        { name: 'Masale (Spices)', href: '/category/masale-spices' },
        { name: 'Fashion & Clothing', href: '/category/fashion' },
        { name: 'Jewellery', href: '/category/jewellery' },
        { name: 'Electronics', href: '/category/electronics' }
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { name: 'Help Center', href: '/help-center' },
        { name: 'How to Buy', href: '/how-to-buy' },
        { name: 'Shipping & Delivery', href: '/shipping-delivery' },
        { name: 'Returns & Refunds', href: '/returns-refunds' },
        { name: 'Cancellation Policy', href: '/cancellation-policy' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Contact Us', href: '/contact-us' }
      ]
    },
    {
      title: 'Seller Portal',
      links: [
        { name: 'Become a Seller', href: '/seller/register' },
        { name: 'Seller Login', href: '/seller/login' },
        { name: 'Seller Benefits', href: '/seller/benefits' },
        { name: 'Seller Support', href: '/seller/support' },
        { name: 'Policies for Sellers', href: '/seller/policies' },
        { name: 'Shipping Guidelines', href: '/seller/shipping-guidelines' },
        { name: 'GST Information', href: '/seller/gst-information' }
      ]
    },
    {
      title: 'Company & Legal',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Mission', href: '/mission' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' }
      ]
    }
  ];

  return (
    <FooterPageLayout
      title="JSS Marketplace Directory & Sitemap"
      subtitle="Quick access to all public pages, seller services, and catalog categories."
      categoryName="Directory"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-card border border-border-custom p-6 rounded-2xl space-y-3">
            <h3 className="font-black text-sm text-foreground border-b border-border-custom pb-2">{sec.title}</h3>
            <ul className="space-y-2 text-xs font-medium text-muted-custom">
              {sec.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </FooterPageLayout>
  );
}
