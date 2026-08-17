'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ShieldCheck,
  Send,
  Lock,
  ChevronRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';

// ── Social Media SVG Icons (Official Brand Vectors) ─────────────────
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

// ── App Store Badges SVGs ──────────────────────────────────────────

const GooglePlayLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M99.617 11.229C91.802 15.539 86 23.639 86 33.363V478.637C86 488.361 91.802 496.461 99.617 500.771L301.764 256L99.617 11.229Z" fill="#00D2FF"/>
    <path d="M301.764 256L99.617 500.771C104.977 503.729 111.464 504.667 117.892 503.013L363.361 361.341L301.764 256Z" fill="#00F076"/>
    <path d="M363.361 361.341L420.732 328.216C436.425 319.155 446 302.721 446 284.58C446 266.439 436.425 250.005 420.732 240.944L363.361 207.819L301.764 256L363.361 361.341Z" fill="#FFC107"/>
    <path d="M301.764 256L363.361 150.659L117.892 8.987C111.464 7.333 104.977 8.271 99.617 11.229L301.764 256Z" fill="#FF3D00"/>
  </svg>
);

const AppleLogo = () => (
  <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.89-14.12-6.05-3.19-2.62-7.14-7.3-11.86-14.04-5.87-8.39-10.45-17.57-13.75-27.53-3.3-9.97-4.95-19.67-4.95-29.11 0-14.48 3.73-26.4 11.19-35.75 7.46-9.35 16.73-14.1 27.81-14.24 4.58 0 9.77 1.25 15.57 3.75 5.8 2.5 9.77 3.75 11.9 3.75 1.79 0 5.92-1.31 12.39-3.93 6.47-2.62 11.75-3.8 15.84-3.55 12.19.98 21.84 5.76 28.94 14.34-10.86 6.56-16.14 15.71-15.84 27.46.29 9.17 3.99 16.8 11.1 22.88 4.14 3.56 8.86 6 14.15 7.33-2.62 7.74-6.17 15.35-10.66 22.83zm-27.18-106.8c0 7.05-2.58 13.84-7.75 20.37-5.17 6.53-11.75 10.45-19.74 11.75-.41-1.37-.62-2.74-.62-4.11 0-7.33 2.76-14.39 8.28-21.18 5.52-6.79 12.17-10.87 19.95-12.24.1 1.83.15 3.63.15 5.41z"/>
  </svg>
);

// ── Official Payment Brand Vector SVG Logos (Strictly Matching Image 2) ──

// 1. VISA Wordmark with Gold Slash
const VisaLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.86 3.12L25.42 30.88H16.89L10.3 7.03C9.9 5.48 9.53 4.96 8.28 4.29C6.27 3.2 2.92 2.22 0 1.58L0.16 0.88H14.16C15.95 0.88 17.51 2.07 17.89 4.16L21.36 21.6L29.74 0.88H38.86M73.18 21.25C73.22 13.11 61.85 12.66 61.94 9.04C61.97 7.94 63.02 6.74 65.37 6.43C66.54 6.28 69.75 6.16 73.34 7.82L74.77 1.14C72.8 0.43 70.28 0 67.09 0C58.91 0 53.13 4.35 53.07 10.53C52.98 15.13 57.1 17.7 60.23 19.23C63.45 20.81 64.53 21.82 64.51 23.23C64.48 25.38 61.93 26.33 59.58 26.37C55.43 26.44 53.03 25.26 51.13 24.38L49.65 31.28C51.58 32.17 55.15 32.93 58.87 32.97C67.62 32.97 73.14 28.64 73.18 21.25M94.61 30.88H102L95.55 0.88H88.88C87.35 0.88 86.07 1.76 85.51 3.12L73.08 30.88H81.71L83.43 26.15H93.88L94.61 30.88ZM85.8 19.64L90.06 7.94L92.51 19.64H85.8ZM50.6 0.88L43.83 30.88H35.49L42.26 0.88H50.6Z" fill="#FFFFFF"/>
    <path d="M14.16 0.88H0.16L0 1.58C2.92 2.22 6.27 3.2 8.28 4.29C9.53 4.96 9.9 5.48 10.3 7.03L16.89 30.88H25.42L38.86 3.12H29.74L21.36 21.6L17.89 4.16C17.51 2.07 15.95 0.88 14.16 0.88Z" fill="#F7A600"/>
  </svg>
);

// 2. Mastercard Overlapping Circles Logo
const MastercardLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#EB001B"/>
    <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
    <path d="M18 4.7a9.96 9.96 0 0 0-3.8 7.3A9.96 9.96 0 0 0 18 19.3a9.96 9.96 0 0 0 3.8-7.3A9.96 9.96 0 0 0 18 4.7Z" fill="#FF5F00"/>
  </svg>
);

// 3. RuPay Italicized Logo with Orange & Green Triangles
const RuPayLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" fontWeight="900" fontStyle="italic" fill="#FFFFFF">RuPay</text>
    <polygon points="105,6 115,16 105,26 113,26 123,16 113,6" fill="#F7941E"/>
    <polygon points="118,6 128,16 118,26 126,26 136,16 126,6" fill="#109E49"/>
  </svg>
);

// 4. BHIM UPI Logo with Diagonal Arrows & Tagline
const UpiLogo = () => (
  <svg className="h-5.5 w-auto" viewBox="0 0 120 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="900" fontStyle="italic" fill="#FFFFFF">UPI</text>
    <polygon points="60,4 70,16 60,26 66,26 76,16 66,4" fill="#0077B6"/>
    <polygon points="72,4 82,16 72,26 78,26 88,16 78,4" fill="#109E49"/>
    <polygon points="84,4 94,16 84,26 90,26 100,16 90,4" fill="#F7941E"/>
    <text x="0" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="5.5" fontWeight="700" fill="#94A3B8" letterSpacing="0.4">UNIFIED PAYMENTS INTERFACE</text>
  </svg>
);

// 5. Paytm Logo with White "pay" + Cyan "tm"
const PaytmLogo = () => (
  <svg className="h-5.5 w-auto" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" fontWeight="900" fill="#FFFFFF">pay</text>
    <text x="46" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" fontWeight="900" fill="#00BAF2">tm</text>
  </svg>
);

// 6. NET BANKING Two-Line Stacked Text Logo
const NetBankingLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="40" y="11" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="800" fill="#FFFFFF" letterSpacing="0.8">NET</text>
    <text x="40" y="24" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="800" fill="#FFFFFF" letterSpacing="0.8">BANKING</text>
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
      {/* ─── MAIN 5-COLUMN NAVIGATION FOOTER ─── */}
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

            {/* Social Media Links with Official Brand Colors & Smooth Black Hover State */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black uppercase text-slate-300 tracking-wider mb-2.5">Follow Us</h5>
              <div className="flex items-center gap-2.5">
                {/* Facebook - Official Blue (#1877F2) */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-[#1877F2] hover:bg-white hover:border-white hover:text-black focus:bg-white focus:border-white focus:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <FacebookIcon size={18} />
                </a>

                {/* Instagram - Official Rose/Pink (#E4405F) */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-[#E4405F] hover:bg-white hover:border-white hover:text-black focus:bg-white focus:border-white focus:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <InstagramIcon size={18} />
                </a>

                {/* YouTube - Official Red (#FF0000) */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on YouTube"
                  className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-[#FF0000] hover:bg-white hover:border-white hover:text-black focus:bg-white focus:border-white focus:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <YoutubeIcon size={18} />
                </a>

                {/* X / Twitter - Official Cyan/Blue (#1DA1F2) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X (Twitter)"
                  className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-[#1DA1F2] hover:bg-white hover:border-white hover:text-black focus:bg-white focus:border-white focus:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <TwitterIcon size={18} />
                </a>

                {/* LinkedIn - Official Blue (#0A66C2) */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on LinkedIn"
                  className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-[#0A66C2] hover:bg-white hover:border-white hover:text-black focus:bg-white focus:border-white focus:text-black focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <LinkedinIcon size={18} />
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

        {/* ─── 3. OFFICIAL PAYMENT & SECURITY LOGOS SECTION (MATCHING IMAGE 2) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Payment Methods */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-slate-200">We Accept</h5>
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 bg-[#0A1633]/80 border border-blue-500/40 hover:border-blue-400/80 hover:bg-[#0E1E45] rounded-xl flex items-center justify-center min-w-[95px] h-[46px] shadow-sm transition-all" title="Visa">
                <VisaLogo />
              </div>
              <div className="px-4 py-2.5 bg-[#0A1633]/80 border border-blue-500/40 hover:border-blue-400/80 hover:bg-[#0E1E45] rounded-xl flex items-center justify-center min-w-[95px] h-[46px] shadow-sm transition-all" title="Mastercard">
                <MastercardLogo />
              </div>
              <div className="px-4 py-2.5 bg-[#0A1633]/80 border border-blue-500/40 hover:border-blue-400/80 hover:bg-[#0E1E45] rounded-xl flex items-center justify-center min-w-[95px] h-[46px] shadow-sm transition-all" title="RuPay">
                <RuPayLogo />
              </div>
              <div className="px-4 py-2.5 bg-[#0A1633]/80 border border-blue-500/40 hover:border-blue-400/80 hover:bg-[#0E1E45] rounded-xl flex items-center justify-center min-w-[95px] h-[46px] shadow-sm transition-all" title="BHIM UPI">
                <UpiLogo />
              </div>
              <div className="px-4 py-2.5 bg-[#0A1633]/80 border border-blue-500/40 hover:border-blue-400/80 hover:bg-[#0E1E45] rounded-xl flex items-center justify-center min-w-[95px] h-[46px] shadow-sm transition-all" title="Paytm">
                <PaytmLogo />
              </div>
              <div className="px-4 py-2.5 bg-[#0A1633]/80 border border-blue-500/40 hover:border-blue-400/80 hover:bg-[#0E1E45] rounded-xl flex items-center justify-center min-w-[95px] h-[46px] shadow-sm transition-all" title="Net Banking">
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
