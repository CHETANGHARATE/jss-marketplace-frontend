'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  Send,
  Lock,
  Award,
  Sparkles,
  ChevronRight,
  Globe,
  Smartphone,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3v6z"/></svg>
);
const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { info, success } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      success('Thank you for subscribing to JSS Marketplace deals!');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B132B] text-slate-200 border-t border-slate-800/80 mt-auto transition-colors">
      
      {/* ─── 1. TRUST BADGES STRIP ─── */}
      <div className="border-b border-slate-800/80 bg-[#070D1E] py-8">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex flex-col items-center p-4 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-primary/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 border border-primary/20">
                <Award size={22} />
              </div>
              <h4 className="font-black text-xs text-white uppercase tracking-wider">100% Authentic</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Verified products from trusted sellers</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
                <Truck size={22} />
              </div>
              <h4 className="font-black text-xs text-white uppercase tracking-wider">Best Prices</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Competitive marketplace pricing</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-amber-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/20">
                <RefreshCw size={22} />
              </div>
              <h4 className="font-black text-xs text-white uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Simple return & replacement process</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
                <Headphones size={22} />
              </div>
              <h4 className="font-black text-xs text-white uppercase tracking-wider">24x7 Support</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Dedicated customer assistance</p>
            </div>

          </div>
        </div>
      </div>

      {/* ─── 2. MAIN 5-COLUMN NAVIGATION FOOTER ─── */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* COLUMN 1 — JSS MARKETPLACE BRAND (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-primary">
                JSS<span className="text-accent group-hover:text-primary transition-colors">Solutions</span>
              </span>
              <span className="text-[9px] font-extrabold bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                Marketplace
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm">
              India's trusted multi-vendor marketplace connecting verified sellers, manufacturers, and farmers directly with customers across India.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider mb-2.5">Follow Us</h5>
              <div className="flex items-center gap-2 text-slate-400">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-primary hover:text-white rounded-xl border border-slate-800 transition-colors">
                  <FacebookIcon size={16} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-rose-500 hover:text-white rounded-xl border border-slate-800 transition-colors">
                  <InstagramIcon size={16} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-red-600 hover:text-white rounded-xl border border-slate-800 transition-colors">
                  <YoutubeIcon size={16} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-sky-500 hover:text-white rounded-xl border border-slate-800 transition-colors">
                  <TwitterIcon size={16} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-xl border border-slate-800 transition-colors">
                  <LinkedinIcon size={16} />
                </a>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider mb-2.5">Download Our App</h5>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => info('App Store link will open once published on Google Play Store', 'Google Play')}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-left border border-slate-800 transition-colors flex items-center gap-2.5"
                >
                  <Smartphone size={18} className="text-emerald-400" />
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">GET IT ON</span>
                    <span className="text-xs font-black text-white block mt-0.5">Google Play</span>
                  </div>
                </button>

                <button
                  onClick={() => info('App Store link will open once published on Apple App Store', 'App Store')}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-left border border-slate-800 transition-colors flex items-center gap-2.5"
                >
                  <Smartphone size={18} className="text-sky-400" />
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">DOWNLOAD ON THE</span>
                    <span className="text-xs font-black text-white block mt-0.5">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2 — CUSTOMER SERVICE (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-extrabold text-xs text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/help-center" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Help Center</Link></li>
              <li><Link href="/how-to-buy" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />How to Buy</Link></li>
              <li><Link href="/shipping-delivery" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Shipping & Delivery</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Returns & Refunds</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Cancellation Policy</Link></li>
              <li><Link href="/track-order" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Track Order</Link></li>
              <li><Link href="/faqs" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />FAQs</Link></li>
              <li><Link href="/contact-us" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 3 — FOR SELLERS (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-extrabold text-xs text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              For Sellers
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/seller/register" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Become a Seller</Link></li>
              <li><Link href="/seller/login" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Seller Login</Link></li>
              <li><Link href="/seller/benefits" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Seller Benefits</Link></li>
              <li><Link href="/seller/support" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Seller Support</Link></li>
              <li><Link href="/seller/policies" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Policies for Sellers</Link></li>
              <li><Link href="/seller/shipping-guidelines" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Shipping Guidelines</Link></li>
              <li><Link href="/seller/gst-information" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />GST Information</Link></li>
            </ul>
          </div>

          {/* COLUMN 4 — ABOUT JSS (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-extrabold text-xs text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              About JSS
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />About Us</Link></li>
              <li><Link href="/mission" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Our Mission</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Refund Policy</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Blog</Link></li>
              <li><Link href="/contact-us" className="hover:text-primary transition-colors flex items-center gap-1 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />Contact Support</Link></li>
            </ul>
          </div>

          {/* COLUMN 5 — NEWSLETTER (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              Subscribe to Newsletter
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              Get the latest updates on new products, deals and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-primary focus:outline-none transition-colors placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Subscribe</span>
                <Send size={13} />
              </button>
            </form>

            {/* Trusted Customer Stack */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-black text-white">Trusted Across India</p>
                <p className="text-[10px] text-slate-400">Verified buyers & sellers</p>
              </div>
            </div>

          </div>

        </div>

        <hr className="border-slate-800/80 my-10" />

        {/* ─── 3. PAYMENT & SECURITY SECTION ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Payment Methods */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider">We Accept</h5>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">Visa</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">Mastercard</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">RuPay</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">UPI</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-sky-400">Paytm</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">Net Banking</span>
            </div>
          </div>

          {/* Security & Verified */}
          <div className="md:text-right space-y-2">
            <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider">Secure & Verified</h5>
            <div className="flex flex-wrap md:justify-end items-center gap-3 text-xs font-semibold text-emerald-400">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                <Lock size={13} />
                SSL Secured
              </span>
              <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1 rounded-lg">
                <ShieldCheck size={13} />
                Secure Payments
              </span>
              <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg">
                <CheckCircle2 size={13} />
                Protected Checkout
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ─── 4. BOTTOM LEGAL BAR ─── */}
      <div className="border-t border-slate-800/80 bg-[#070D1E] py-4 text-xs text-slate-400">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} JSS Solutions Ltd. All rights reserved.</p>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};
