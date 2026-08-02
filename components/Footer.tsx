'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Truck, RefreshCw, Headphones, Send, Smartphone, Lock, Award, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { info } = useToast();
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
      { name: 'cat.beauty_personal_care', href: '/category/beauty-personal-care' },
      { name: 'cat.gifts_handicrafts', href: '/category/gifts-handicrafts' }
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
    <footer className="bg-card text-card-foreground border-t border-border-custom/80 mt-auto transition-colors">
      
      {/* 1. 4 Trust Badges Bar */}
      <div className="border-b border-border-custom/80 bg-background-secondary/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center p-4 bg-card border border-border-custom/60 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 border border-primary/20 shadow-2xs">
                <Truck size={24} />
              </div>
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">Free Express Shipping</h4>
              <p className="text-xs text-muted-custom mt-1 font-medium">On all orders above ₹499 across India</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-card border border-border-custom/60 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-500/20 shadow-2xs">
                <RefreshCw size={24} />
              </div>
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">Hassle-Free Returns</h4>
              <p className="text-xs text-muted-custom mt-1 font-medium">Easy 10-day replacement policy</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-card border border-border-custom/60 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 border border-amber-500/20 shadow-2xs">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">100% Genuine Guarantee</h4>
              <p className="text-xs text-muted-custom mt-1 font-medium">Directly from certified sellers</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-card border border-border-custom/60 rounded-3xl shadow-2xs hover:shadow-xs transition-all">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3 border border-indigo-500/20 shadow-2xs">
                <Headphones size={24} />
              </div>
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">24/7 Dedicated Support</h4>
              <p className="text-xs text-muted-custom mt-1 font-medium">Instant chat & helpline: 1800-JSS</p>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Brand Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-primary">
                JSS<span className="text-accent">Solutions</span>
              </span>
              <span className="text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                Marketplace
              </span>
            </Link>
            <p className="text-xs text-muted-custom leading-relaxed font-medium">
              JSS Solutions Marketplace connects verified manufacturers, farmers, and brands directly with retail & wholesale buyers across India. Enjoy fast express shipping, secure escrow payments, and authentic quality products.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs font-bold text-foreground inline-flex items-center gap-1.5 bg-background-secondary border border-border-custom/80 px-3.5 py-1.5 rounded-2xl shadow-2xs">
                🇮🇳 Proudly Made in India
              </span>
              <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-2xl">
                <Lock size={12} />
                Escrow Protected
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-3.5">
            <h4 className="font-extrabold text-xs text-foreground tracking-wider uppercase">Shop Categories</h4>
            <ul className="space-y-2 text-xs font-medium">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="font-extrabold text-xs text-foreground tracking-wider uppercase">Become Vendor</h4>
            <ul className="space-y-2 text-xs font-medium">
              {footerLinks.seller.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {t(link.name) === link.name ? link.name : t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="font-extrabold text-xs text-foreground tracking-wider uppercase">Help & Support</h4>
            <ul className="space-y-2 text-xs font-medium">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-custom hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="font-extrabold text-xs text-foreground tracking-wider uppercase">Legal Info</h4>
            <ul className="space-y-2 text-xs font-medium">
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

        <hr className="border-border-custom/80 my-10" />

        {/* Newsletter & App Download Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Newsletter */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-extrabold text-sm">
              <Mail className="text-primary" size={18} />
              <span>{t('home.newsletter_title')}</span>
            </div>
            <p className="text-xs text-muted-custom font-medium">{t('home.newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2.5 max-w-md pt-1">
              <input
                type="email"
                required
                placeholder={t('home.newsletter_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background-secondary text-foreground text-xs px-4 py-3 rounded-2xl border border-border-custom/80 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold text-xs uppercase px-5 py-3 rounded-2xl hover:bg-primary-hover transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>{t('home.subscribe')}</span>
                <Send size={13} />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-600 font-bold">
                ✓ Thank you! You have successfully subscribed to weekly deal alerts.
              </p>
            )}
          </div>

          {/* App download links */}
          <div className="lg:text-right space-y-2.5">
            <div className="flex lg:justify-end items-center gap-2 text-foreground font-extrabold text-sm">
              <Smartphone className="text-accent" size={18} />
              <span>{t('home.download_app')}</span>
            </div>
            <p className="text-xs text-muted-custom font-medium">{t('home.download_app_desc')}</p>
            <div className="flex flex-wrap lg:justify-end gap-3 pt-1">
              <button
                onClick={() => info('Opening Google Play Store to download JSS Marketplace App', 'Google Play')}
                className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2.5 rounded-2xl text-left border border-slate-800 transition-colors shadow-2xs"
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Get it on</span>
                <span className="text-xs font-black text-white block">Google Play</span>
              </button>
              <button
                onClick={() => info('Opening Apple App Store to download JSS Marketplace App', 'App Store')}
                className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2.5 rounded-2xl text-left border border-slate-800 transition-colors shadow-2xs"
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Download on</span>
                <span className="text-xs font-black text-white block">App Store</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Copyright & Security Note */}
      <div className="border-t border-border-custom/80 bg-background-secondary/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-custom font-medium">
          <p>© {new Date().getFullYear()} JSS Solutions Ltd. All rights reserved. Enterprise Multi-Vendor Platform.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>UPI</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>NetBanking</span>
            <span>•</span>
            <span>Escrow Protected</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
