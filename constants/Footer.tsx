'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Truck, RefreshCw, Headphones, Send, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLinks = {
    shop: [
      { name: 'cat.fashion', href: '/category/fashion' },
      { name: 'cat.electronics', href: '/category/electronics' },
      { name: 'cat.agriculture', href: '/category/agriculture' },
      { name: 'cat.jewellery', href: '/category/jewellery' },
      { name: 'cat.beauty_personal_care', href: '/category/beauty_personal_care' },
      { name: 'cat.gifts_handicrafts', href: '/category/gifts_handicrafts' }
    ],
    seller: [
      { name: 'nav.become_seller', href: '/seller/register' },
      { name: 'Seller Guidelines', href: '/seller/rules' },
      { name: 'Seller Dashboard', href: '/seller/dashboard' },
      { name: 'B2B Wholesale Inquiry', href: '/wholesale' }
    ],
    support: [
      { name: 'Contact Support', href: '/support' },
      { name: 'Return Policy & Center', href: '/returns' },
      { name: 'Track Order Status', href: '/track' },
      { name: 'FAQs', href: '#faq' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Tax Compliance (GSTIN)', href: '/gst' },
      { name: 'Anti-Counterfeiting Policy', href: '/quality' }
    ]
  };

  return (
    <footer className="bg-card text-card-foreground border-t border-border-custom mt-auto">
      
      {/* Trust Badges */}
      <div className="border-b border-border-custom bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Truck size={24} />
              </div>
              <h4 className="font-bold text-sm text-foreground">Free Express Shipping</h4>
              <p className="text-xs text-muted-custom mt-1">On all orders above ₹499</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <RefreshCw size={24} />
              </div>
              <h4 className="font-bold text-sm text-foreground">Hassle-Free Returns</h4>
              <p className="text-xs text-muted-custom mt-1">Easy 10-day replacement policy</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-sm text-foreground">100% Genuine Guarantee</h4>
              <p className="text-xs text-muted-custom mt-1">Directly from certified sellers</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Headphones size={24} />
              </div>
              <h4 className="font-bold text-sm text-foreground">24/7 Dedicated Support</h4>
              <p className="text-xs text-muted-custom mt-1">Instant chat & telephone assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Column 1 - Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-tight text-primary">
              JSS<span className="text-accent">Solutions</span>
            </span>
            <p className="text-sm text-muted-custom leading-relaxed">
              JSS Solutions Marketplace connects millions of local vendors, farmers, and premium brands to retail and wholesale buyers across India. Enjoy fast shipping, secure escrow payments, and certified products.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 bg-background-secondary border border-border-custom px-3 py-1.5 rounded-xl">
                🇮🇳 Proudly Made in India
              </span>
            </div>
          </div>

          {/* Columns 2-5 - Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground tracking-wider uppercase">Shop Categories</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-custom hover:text-primary transition-colors">
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground tracking-wider uppercase">Become Vendor</h4>
            <ul className="space-y-2">
              {footerLinks.seller.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-custom hover:text-primary transition-colors">
                    {t(link.name) === link.name ? link.name : t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground tracking-wider uppercase">Help & Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-custom hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground tracking-wider uppercase">Legal Info</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-custom hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <hr className="border-border-custom my-12" />

        {/* Newsletter & Mobile App Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Newsletter Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-lg">
              <Mail className="text-primary" />
              <span>{t('home.newsletter_title')}</span>
            </div>
            <p className="text-sm text-muted-custom">{t('home.newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder={t('home.newsletter_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background-secondary text-foreground text-sm px-4 py-3 rounded-2xl border border-border-custom focus:border-primary focus:bg-card focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-hover transition-all flex items-center gap-1 shrink-0"
              >
                <span>{t('home.subscribe')}</span>
                <Send size={14} />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-600 font-bold flex items-center gap-1 animate-pulse">
                ✓ Thank you! You have successfully subscribed to weekly deals.
              </p>
            )}
          </div>

          {/* App download section */}
          <div className="lg:text-right space-y-4">
            <div className="flex lg:justify-end items-center gap-2 text-foreground font-bold text-lg">
              <Smartphone className="text-accent" />
              <span>{t('home.download_app')}</span>
            </div>
            <p className="text-sm text-muted-custom">{t('home.download_app_desc')}</p>
            <div className="flex flex-wrap lg:justify-end gap-3">
              {/* Play Store */}
              <button
                onClick={() => alert('Opening Google Play Store to download JSS Marketplace App')}
                className="flex items-center gap-2.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded-xl transition-all border border-border-custom"
              >
                <span className="text-[9px] uppercase font-bold text-left block text-muted-custom">
                  Get it on
                  <span className="text-sm font-black text-white block capitalize tracking-tight mt-0.5">
                    Google Play
                  </span>
                </span>
              </button>
              {/* App Store */}
              <button
                onClick={() => alert('Opening Apple App Store to download JSS Marketplace App')}
                className="flex items-center gap-2.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded-xl transition-all border border-border-custom"
              >
                <span className="text-[9px] uppercase font-bold text-left block text-muted-custom">
                  Download on
                  <span className="text-sm font-black text-white block capitalize tracking-tight mt-0.5">
                    App Store
                  </span>
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* copyright */}
      <div className="border-t border-border-custom bg-background-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-custom">
          <p>© {new Date().getFullYear()} JSS Solutions Ltd. All rights reserved. Designed for elite eCommerce conversion. Powered by Next.js 15 & Laravel REST API.</p>
        </div>
      </div>

    </footer>
  );
};
