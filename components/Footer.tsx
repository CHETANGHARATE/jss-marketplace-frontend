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
      
      {/* 4 Trust Badges Bar */}
      <div className="border-b border-border-custom bg-background-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-2">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 border border-primary/20">
                <Truck size={22} />
              </div>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Free Express Shipping</h4>
              <p className="text-[11px] text-muted-custom mt-0.5">On all orders above ₹499</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 border border-primary/20">
                <RefreshCw size={22} />
              </div>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Hassle-Free Returns</h4>
              <p className="text-[11px] text-muted-custom mt-0.5">Easy 10-day replacement policy</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 border border-primary/20">
                <ShieldCheck size={22} />
              </div>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">100% Genuine Guarantee</h4>
              <p className="text-[11px] text-muted-custom mt-0.5">Directly from certified sellers</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 border border-primary/20">
                <Headphones size={22} />
              </div>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-muted-custom mt-0.5">Instant chat & helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xl font-black tracking-tight text-primary">
              JSS<span className="text-accent">Solutions</span>
            </span>
            <p className="text-xs text-muted-custom leading-relaxed">
              JSS Solutions Marketplace connects verified manufacturers, farmers, and brands directly with buyers across India. Enjoy fast express shipping, secure escrow payments, and authentic quality products.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-foreground inline-flex items-center gap-1.5 bg-background-secondary border border-border-custom px-3 py-1.5 rounded-xl">
                🇮🇳 Proudly Made in India
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground tracking-wider uppercase">Shop Categories</h4>
            <ul className="space-y-1.5 text-xs">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground tracking-wider uppercase">Become Vendor</h4>
            <ul className="space-y-1.5 text-xs">
              {footerLinks.seller.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {t(link.name) === link.name ? link.name : t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground tracking-wider uppercase">Help & Support</h4>
            <ul className="space-y-1.5 text-xs">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-foreground tracking-wider uppercase">Legal Info</h4>
            <ul className="space-y-1.5 text-xs">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <hr className="border-border-custom my-8" />

        {/* Newsletter & App Download Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Newsletter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Mail className="text-primary" size={18} />
              <span>{t('home.newsletter_title')}</span>
            </div>
            <p className="text-xs text-muted-custom">{t('home.newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder={t('home.newsletter_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background-secondary text-foreground text-xs px-3.5 py-2.5 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>{t('home.subscribe')}</span>
                <Send size={12} />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-600 font-bold">
                ✓ Thank you! You have successfully subscribed to weekly deal alerts.
              </p>
            )}
          </div>

          {/* App download links */}
          <div className="lg:text-right space-y-2">
            <div className="flex lg:justify-end items-center gap-2 text-foreground font-bold text-sm">
              <Smartphone className="text-accent" size={18} />
              <span>{t('home.download_app')}</span>
            </div>
            <p className="text-xs text-muted-custom">{t('home.download_app_desc')}</p>
            <div className="flex flex-wrap lg:justify-end gap-2.5">
              <button
                onClick={() => alert('Opening Google Play Store to download JSS Marketplace App')}
                className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl text-left border border-slate-800 transition-colors"
              >
                <span className="text-[9px] uppercase font-semibold text-slate-400 block">Get it on</span>
                <span className="text-xs font-bold text-white block">Google Play</span>
              </button>
              <button
                onClick={() => alert('Opening Apple App Store to download JSS Marketplace App')}
                className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl text-left border border-slate-800 transition-colors"
              >
                <span className="text-[9px] uppercase font-semibold text-slate-400 block">Download on</span>
                <span className="text-xs font-bold text-white block">App Store</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-border-custom bg-background-secondary py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[11px] text-muted-custom">
          <p>© {new Date().getFullYear()} JSS Solutions Ltd. All rights reserved. Powered by Next.js & Laravel REST API.</p>
        </div>
      </div>

    </footer>
  );
};
