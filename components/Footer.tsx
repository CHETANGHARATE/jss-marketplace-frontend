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
  ChevronRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';

// ── Social Media SVG Icons ─────────────────────────────────────────
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

// ── Official Brand Vector SVG Logos ─────────────────────────────────

// 1. Google Play Official Badge Logo
const GooglePlayLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M99.617 11.229C91.802 15.539 86 23.639 86 33.363V478.637C86 488.361 91.802 496.461 99.617 500.771L301.764 256L99.617 11.229Z" fill="#00D2FF"/>
    <path d="M301.764 256L99.617 500.771C104.977 503.729 111.464 504.667 117.892 503.013L363.361 361.341L301.764 256Z" fill="#00F076"/>
    <path d="M363.361 361.341L420.732 328.216C436.425 319.155 446 302.721 446 284.58C446 266.439 436.425 250.005 420.732 240.944L363.361 207.819L301.764 256L363.361 361.341Z" fill="#FFC107"/>
    <path d="M301.764 256L363.361 150.659L117.892 8.987C111.464 7.333 104.977 8.271 99.617 11.229L301.764 256Z" fill="#FF3D00"/>
  </svg>
);

// 2. Apple App Store Official Logo
const AppleLogo = () => (
  <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.89-14.12-6.05-3.19-2.62-7.14-7.3-11.86-14.04-5.87-8.39-10.45-17.57-13.75-27.53-3.3-9.97-4.95-19.67-4.95-29.11 0-14.48 3.73-26.4 11.19-35.75 7.46-9.35 16.73-14.1 27.81-14.24 4.58 0 9.77 1.25 15.57 3.75 5.8 2.5 9.77 3.75 11.9 3.75 1.79 0 5.92-1.31 12.39-3.93 6.47-2.62 11.75-3.8 15.84-3.55 12.19.98 21.84 5.76 28.94 14.34-10.86 6.56-16.14 15.71-15.84 27.46.29 9.17 3.99 16.8 11.1 22.88 4.14 3.56 8.86 6 14.15 7.33-2.62 7.74-6.17 15.35-10.66 22.83zm-27.18-106.8c0 7.05-2.58 13.84-7.75 20.37-5.17 6.53-11.75 10.45-19.74 11.75-.41-1.37-.62-2.74-.62-4.11 0-7.33 2.76-14.39 8.28-21.18 5.52-6.79 12.17-10.87 19.95-12.24.1 1.83.15 3.63.15 5.41z"/>
  </svg>
);

// 3. Official Visa SVG Logo
const VisaLogo = () => (
  <svg className="h-3.5 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.86 3.12L25.42 30.88H16.89L10.3 7.03C9.9 5.48 9.53 4.96 8.28 4.29C6.27 3.2 2.92 2.22 0 1.58L0.16 0.88H14.16C15.95 0.88 17.51 2.07 17.89 4.16L21.36 21.6L29.74 0.88H38.86M73.18 21.25C73.22 13.11 61.85 12.66 61.94 9.04C61.97 7.94 63.02 6.74 65.37 6.43C66.54 6.28 69.75 6.16 73.34 7.82L74.77 1.14C72.8 0.43 70.28 0 67.09 0C58.91 0 53.13 4.35 53.07 10.53C52.98 15.13 57.1 17.7 60.23 19.23C63.45 20.81 64.53 21.82 64.51 23.23C64.48 25.38 61.93 26.33 59.58 26.37C55.43 26.44 53.03 25.26 51.13 24.38L49.65 31.28C51.58 32.17 55.15 32.93 58.87 32.97C67.62 32.97 73.14 28.64 73.18 21.25M94.61 30.88H102L95.55 0.88H88.88C87.35 0.88 86.07 1.76 85.51 3.12L73.08 30.88H81.71L83.43 26.15H93.88L94.61 30.88ZM85.8 19.64L90.06 7.94L92.51 19.64H85.8ZM50.6 0.88L43.83 30.88H35.49L42.26 0.88H50.6Z" fill="#1A1F71"/>
  </svg>
);

// 4. Official Mastercard Overlapping Circles SVG Logo
const MastercardLogo = () => (
  <svg className="h-5.5 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#EB001B"/>
    <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
    <path d="M18 4.7a9.96 9.96 0 0 0-3.8 7.3A9.96 9.96 0 0 0 18 19.3a9.96 9.96 0 0 0 3.8-7.3A9.96 9.96 0 0 0 18 4.7Z" fill="#FF5F00"/>
  </svg>
);

// 5. Official RuPay Vector SVG Logo
const RuPayLogo = () => (
  <svg className="h-4 w-auto" viewBox="0 0 135 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.8 3.5H2.5V28.5H8.8V18.8H13.8C18.5 18.8 21.8 15.5 21.8 11.1C21.8 6.7 18.5 3.5 13.8 3.5ZM13.5 13.8H8.8V8.5H13.5C15.8 8.5 16.8 9.6 16.8 11.1C16.8 12.6 15.8 13.8 13.5 13.8Z" fill="#0F75BD"/>
    <path d="M24.2 28.5V11.2H30.2V13.8C31.3 12.1 33.5 11 36 11C40.8 11 43.3 14 43.3 19.2V28.5H37.1V19.9C37.1 17.2 35.7 15.9 33.5 15.9C31.3 15.9 30.2 17.4 30.2 20.3V28.5H24.2Z" fill="#0F75BD"/>
    <path d="M56.5 3.5V19.1C56.5 26.3 51 30.3 43.7 30.3V24.8C47.8 24.8 50.3 22.3 50.3 18.6V3.5H56.5Z" fill="#0F75BD"/>
    <path d="M70.2 3.5C75.2 3.5 78.5 6.5 78.5 11.1C78.5 15.7 75.2 18.8 70.2 18.8H65.3V28.5H59.1V3.5H70.2ZM69.6 13.6C71.5 13.6 72.6 12.5 72.6 11.1C72.6 9.7 71.5 8.6 69.6 8.6H65.3V13.6H69.6Z" fill="#0F75BD"/>
    <polygon points="83.5,3.5 90.1,18.8 96.7,3.5 103.3,3.5 93.4,28.5 86.8,28.5 76.9,3.5" fill="#F7941E"/>
    <polygon points="101.1,3.5 107.7,18.8 114.3,3.5 120.9,3.5 111,28.5 104.4,28.5 94.5,3.5" fill="#109E49"/>
  </svg>
);

// 6. Official BHIM UPI Vector SVG Logo
const UpiLogo = () => (
  <svg className="h-4.5 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2 3.5H4.8V28.5H14.2C20.3 28.5 24.8 24.2 24.8 16C24.8 7.8 20.3 3.5 14.2 3.5ZM13.5 22.5H10.5V9.5H13.5C16.9 9.5 19.1 12 19.1 16C19.1 20 16.9 22.5 13.5 22.5Z" fill="#7B2CBF"/>
    <path d="M28 3.5H33.6V28.5H28V3.5Z" fill="#7B2CBF"/>
    <polygon points="38,3.5 47,16 38,28.5 44.2,28.5 53.2,16 44.2,3.5" fill="#0077B6"/>
    <polygon points="51.5,3.5 60.5,16 51.5,28.5 57.7,28.5 66.7,16 57.7,3.5" fill="#0096C7"/>
    <polygon points="66,3.5 75,16 66,28.5 72.2,28.5 81.2,16 72.2,3.5" fill="#03045E"/>
    <polygon points="81.5,3.5 87.1,3.5 95,16 87.1,28.5 81.5,28.5 89.4,16" fill="#F77F00"/>
  </svg>
);

// 7. Official Paytm Vector SVG Logo
const PaytmLogo = () => (
  <svg className="h-4.5 w-auto" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.2 3.5H4.8V28.5H10.4V18.9H13.2C17.4 18.9 20.4 16.1 20.4 11.2C20.4 6.3 17.4 3.5 13.2 3.5ZM12.7 13.9H10.4V8.5H12.7C14.6 8.5 15.5 9.6 15.5 11.2C15.5 12.8 14.6 13.9 12.7 13.9Z" fill="#002E6E"/>
    <path d="M23.1 11.2V28.5H28.1V19.1C28.1 16.3 29.5 14.6 32 14.6C34.5 14.6 35.9 16.3 35.9 19.1V28.5H40.9V18C40.9 13 37.8 11.2 33.1 11.2C30.3 11.2 28.4 12.3 27.3 14V11.2H23.1Z" fill="#002E6E"/>
    <path d="M46.4 3.5L41.4 28.5H46.4L49.2 13.5L53.7 28.5H58.7L63.2 13.5L66 28.5H71L66 3.5H60.4L55.9 18.5L51.4 3.5H46.4Z" fill="#00BAF2"/>
    <path d="M80 3.5H72.2V8.5H76.1V28.5H81.7V8.5H85.6V3.5H80Z" fill="#00BAF2"/>
    <path d="M87.8 11.2L92.8 28.5H98.4L103.4 11.2H98.4L95.6 22.3L92.8 11.2H87.8Z" fill="#00BAF2"/>
  </svg>
);

// 8. Official Net Banking SVG Logo
const NetBankingLogo = () => (
  <svg className="h-4.5 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3.5L2 10.5V12.5H22V10.5L12 3.5ZM4 25.5H7V14.5H4V25.5ZM9.5 25.5H12.5V14.5H9.5V25.5ZM15 25.5H18V14.5H15V25.5ZM2 27.5V29.5H22V27.5H2Z" fill="#3B82F6"/>
    <text x="26" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="900" fill="#E2E8F0" letterSpacing="0.5">NETBANKING</text>
  </svg>
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

            {/* Official App Store Badges */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider mb-2.5">Download Our App</h5>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => info('App Store link will open once published on Google Play Store', 'Google Play')}
                  className="bg-black hover:bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all shadow-md flex items-center gap-3 group"
                >
                  <GooglePlayLogo />
                  <div className="text-left">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none tracking-wider">GET IT ON</span>
                    <span className="text-xs font-extrabold text-white block mt-0.5 tracking-tight group-hover:text-emerald-400 transition-colors">Google Play</span>
                  </div>
                </button>

                <button
                  onClick={() => info('App Store link will open once published on Apple App Store', 'App Store')}
                  className="bg-black hover:bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all shadow-md flex items-center gap-3 group"
                >
                  <AppleLogo />
                  <div className="text-left">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none tracking-wider">Download on the</span>
                    <span className="text-xs font-extrabold text-white block mt-0.5 tracking-tight group-hover:text-sky-400 transition-colors">App Store</span>
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

        {/* ─── 3. OFFICIAL PAYMENT & SECURITY LOGOS SECTION ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Payment Methods */}
          <div className="space-y-2.5">
            <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider">We Accept</h5>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3 py-2 bg-white/95 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105" title="Visa">
                <VisaLogo />
              </div>
              <div className="px-3 py-2 bg-white/95 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105" title="Mastercard">
                <MastercardLogo />
              </div>
              <div className="px-3 py-2 bg-white/95 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105" title="RuPay">
                <RuPayLogo />
              </div>
              <div className="px-3 py-2 bg-white/95 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105" title="BHIM UPI">
                <UpiLogo />
              </div>
              <div className="px-3 py-2 bg-white/95 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105" title="Paytm">
                <PaytmLogo />
              </div>
              <div className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105" title="Net Banking">
                <NetBankingLogo />
              </div>
            </div>
          </div>

          {/* Security & Verified */}
          <div className="md:text-right space-y-2.5">
            <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider">Secure & Verified</h5>
            <div className="flex flex-wrap md:justify-end items-center gap-3 text-xs font-semibold text-emerald-400">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <Lock size={14} />
                SSL Secured
              </span>
              <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-xl">
                <ShieldCheck size={14} />
                Secure Payments
              </span>
              <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={14} />
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
