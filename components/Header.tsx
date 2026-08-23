'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  ChevronDown,
  User,
  Store,
  Trash2,
  Plus,
  Minus,
  LogIn,
  UserPlus,
  ShieldCheck,
  Tag,
  PhoneCall,
  Sparkles,
  Search,
  Grid,
  LayoutDashboard,
  Boxes,
  Wallet,
  Settings,
  Package,
  ShoppingBag,
  Truck,
  RefreshCw,
  BadgeCheck,
  Smartphone
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { getLocalizedText } from '../utils/translation';
import { SearchBar } from './SearchBar';
import { ProductQuickView } from './ProductQuickView';
import { MegaMenu } from './MegaMenu';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth();
  const {
    cart,
    wishlist,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    addToCart,
    cartTotal,
    cartItemCount
  } = useCartWishlist();

  const { data: categories = [] } = useCategories();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<number | string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      queryClient.clear();
      await logout();
      setUserMenuOpen(false);
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) setLangMenuOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          1. TOP TRUST BAR — Slim premium information strip
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-slate-950 dark:bg-slate-950 text-white border-b border-slate-800/70">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="h-9 flex items-center justify-between gap-4 overflow-hidden">

            {/* Left — India badge */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                <span className="text-base leading-none">🇮🇳</span>
                <span className="text-slate-300">{t('nav.india_platform') || 'India Shops Here'}</span>
              </span>
            </div>

            {/* Center — Scrolling trust pills (desktop: flex, mobile: single) */}
            <div className="flex-1 flex items-center justify-center gap-4 md:gap-6 overflow-hidden">
              {/* Mobile: single animated deal notice */}
              <div className="flex md:hidden items-center gap-2">
                <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <Sparkles size={9} />
                  {t('nav.festive_deals') || 'Hot Deals'}
                </span>
                <span className="text-[11px] font-semibold text-slate-200 truncate">
                  {t('nav.free_shipping_notice') || 'Free delivery on orders above ₹499'}
                </span>
              </div>

              {/* Desktop: full trust pill row */}
              <div className="hidden md:flex items-center gap-5 text-[11px] font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Truck size={12} className="text-emerald-400 shrink-0" />
                  Free Delivery above ₹499
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <ShieldCheck size={12} className="text-blue-400 shrink-0" />
                  100% Secure Payments
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <BadgeCheck size={12} className="text-amber-400 shrink-0" />
                  GST Verified Sellers
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <RefreshCw size={12} className="text-rose-400 shrink-0" />
                  Easy Returns & Refunds
                </span>
              </div>
            </div>

            {/* Right — Contact & app */}
            <div className="hidden lg:flex items-center gap-4 text-slate-300 text-[11px] font-medium shrink-0">
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                <PhoneCall size={11} className="text-emerald-400" />
                <span>{t('nav.helpline') || '1800-XXX-XXXX'}</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                <Smartphone size={11} className="text-blue-400" />
                Download App
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          2. MAIN STICKY HEADER — Logo + Search + Actions
          ═══════════════════════════════════════════════════════════ */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-card/98 backdrop-blur-lg shadow-md border-b border-border-custom/60'
          : 'bg-card border-b border-border-custom/80'
      }`}>
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className={`flex items-center justify-between gap-3 sm:gap-4 md:gap-5 transition-all duration-200 ${scrolled ? 'h-16 sm:h-[68px]' : 'h-[70px] sm:h-20'}`}>

            {/* ─── LEFT: Hamburger + Logo ─── */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80 transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                <Menu size={20} />
              </button>

              <BrandLogo variant="header" size="md" />
            </div>

            {/* ─── CENTER: Categories Button + Premium Search ─── */}
            <div className="hidden lg:flex items-center gap-2.5 flex-1 max-w-[820px] mx-2">
              {/* All Categories Dropdown */}
              <div className="shrink-0">
                <MegaMenu />
              </div>

              {/* Premium Search Bar */}
              <div className="flex-1 relative group">
                <div className="absolute inset-0 rounded-2xl bg-primary/5 group-focus-within:bg-primary/10 transition-colors duration-200 -z-[1]" />
                <SearchBar />
              </div>
            </div>

            {/* ─── RIGHT: All Action Icons ─── */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

              {/* Mobile Search */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Become Seller — shown when not already seller */}
              {!isSeller && (
                <Link
                  href="/seller/register"
                  className="hidden xl:flex items-center gap-1.5 text-[11px] font-bold bg-accent/10 text-accent border border-accent/20 px-3 py-2 rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm whitespace-nowrap"
                >
                  <Store size={13} />
                  <span>{t('nav.sell_products') || 'Sell Products'}</span>
                </Link>
              )}

              {/* Language Selector */}
              <div ref={langMenuRef} className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 sm:px-2.5 py-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80 transition-colors flex items-center gap-1 text-xs font-bold"
                  aria-label="Language Selector"
                >
                  <Globe size={16} className="text-primary" />
                  <span className="uppercase hidden sm:inline text-[11px]">{language}</span>
                  <ChevronDown size={11} className="text-muted-custom hidden sm:inline" />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden py-1.5">
                    {(['en', 'hi', 'mr'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                          language === lang ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-background-secondary'
                        }`}
                      >
                        {lang === 'en' ? 'English (EN)' : lang === 'hi' ? 'हिन्दी (HI)' : 'मराठी (MR)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80 transition-colors hidden sm:flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80 transition-colors relative flex items-center justify-center"
                aria-label="Wishlist"
              >
                <Heart size={17} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-[9px] font-black text-white rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-2.5 sm:px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all shadow-sm text-xs font-bold"
                aria-label="Cart"
              >
                <ShoppingCart size={16} />
                {cartItemCount > 0 ? (
                  <>
                    <span className="font-black">{cartItemCount}</span>
                    <span className="hidden xl:inline text-[11px] font-bold opacity-90">₹{cartTotal.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="hidden sm:inline text-[11px] font-bold opacity-90">Cart</span>
                )}
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-500 text-[9px] font-black text-white rounded-full flex items-center justify-center shadow-sm sm:hidden">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              {isAuthenticated && user ? (
                <div ref={userMenuRef} className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-border-custom/80 bg-background-secondary hover:bg-card transition-colors text-xs font-bold"
                  >
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-black text-[11px] uppercase shadow-sm">
                      {user.name.substring(0, 2)}
                    </div>
                    <span className="max-w-[80px] truncate text-foreground hidden lg:block">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={13} className="text-muted-custom" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-border-custom/80">
                      <div className="px-4 py-3 bg-background-secondary">
                        <p className="text-[10px] text-muted-custom font-semibold uppercase tracking-wider">{t('nav.signed_in_as')}</p>
                        <p className="text-xs font-bold text-foreground truncate mt-0.5">{user.name}</p>
                        <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md capitalize mt-1 inline-block">
                          {user.role || 'customer'}
                        </span>
                      </div>
                      <div className="py-1 text-xs font-medium">
                        {isSeller ? (
                          <>
                            <Link href="/vendor" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <LayoutDashboard size={14} className="text-primary" />
                              <span>{t('nav.vendor_dashboard')}</span>
                            </Link>
                            <Link href="/vendor/products" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Package size={14} className="text-primary" />
                              <span>{t('nav.my_products')}</span>
                            </Link>
                            <Link href="/vendor/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <ShoppingBag size={14} className="text-primary" />
                              <span>{t('nav.my_orders_menu')}</span>
                            </Link>
                            <Link href="/vendor/inventory" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Boxes size={14} className="text-primary" />
                              <span>{t('nav.inventory')}</span>
                            </Link>
                            <Link href="/vendor/wallet" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Wallet size={14} className="text-primary" />
                              <span>{t('nav.earnings')}</span>
                            </Link>
                            <Link href="/vendor/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Settings size={14} className="text-primary" />
                              <span>{t('nav.store_settings')}</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors">
                              <User size={14} className="text-muted-custom" />
                              {t('nav.profile')}
                            </Link>
                            {isAdmin && (
                              <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-rose-500 hover:bg-background-secondary transition-colors font-bold">
                                <ShieldCheck size={14} />
                                {t('nav.admin_dashboard')}
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-background-secondary transition-colors disabled:opacity-50"
                        >
                          {isLoggingOut ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
                              <span>{t('nav.signing_out')}</span>
                            </>
                          ) : (
                            <span>{t('nav.logout')}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card hover:bg-background-secondary text-foreground border border-border-custom/90 text-[11px] font-bold transition-all hover:border-primary shadow-sm"
                  >
                    <User size={14} className="text-primary" />
                    <span>{t('nav.login_btn')}</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition-all shadow-md"
                  >
                    <UserPlus size={13} />
                    <span>{t('nav.sign_up')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar (expanded) */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <SearchBar />
            </div>
          )}
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE MENU DRAWER
          ═══════════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden">
          <div className="w-4/5 max-w-sm bg-card text-card-foreground shadow-2xl flex flex-col h-full animate-slide-in relative border-r border-border-custom/80">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border-custom/80 px-5 py-4">
              <BrandLogo variant="header" size="sm" onClick={() => setMobileMenuOpen(false)} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-xs font-bold">
              {/* Auth Actions */}
              {isSeller ? (
                <div className="space-y-1.5">
                  <Link href="/vendor" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold">
                    <LayoutDashboard size={17} /><span>{t('nav.vendor_dashboard')}</span>
                  </Link>
                  <Link href="/vendor/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-xl font-semibold">
                    <Package size={15} /><span>{t('nav.my_products')}</span>
                  </Link>
                  <Link href="/vendor/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-xl font-semibold">
                    <ShoppingBag size={15} /><span>{t('nav.my_orders_menu')}</span>
                  </Link>
                  <Link href="/vendor/wallet" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-xl font-semibold">
                    <Wallet size={15} /><span>{t('nav.earnings')}</span>
                  </Link>
                </div>
              ) : (
                <Link href="/seller/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3.5 bg-accent/10 border border-accent/20 text-accent rounded-xl">
                  <Store size={17} />
                  <span>{t('nav.become_seller')} / {t('nav.sell_products')}</span>
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="p-3 text-center bg-background-secondary border border-border-custom/80 text-foreground rounded-xl">
                    {t('nav.login_btn')}
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="p-3 text-center bg-primary text-white rounded-xl shadow-sm">
                    {t('nav.sign_up')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3.5 bg-primary/10 text-primary border border-primary/20 rounded-xl">
                    <User size={17} /><span>{t('nav.profile')}</span>
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isLoggingOut ? <><Sparkles className="w-4 h-4 animate-spin" /><span>{t('nav.signing_out')}</span></> : <span>{t('nav.logout')}</span>}
                  </button>
                </div>
              )}

              {/* Mobile Category Navigation */}
              {categories.length > 0 && (
                <div className="pt-3 border-t border-border-custom/80 space-y-2">
                  <div className="pb-1 text-[10px] font-black text-muted-custom uppercase tracking-wider">{t('nav.categories')}</div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const subcats = cat.subcategories || cat.children || [];
                      const catName = getLocalizedText(cat.name, language);
                      const isExpanded = expandedMobileCat === cat.id;
                      return (
                        <div key={cat.id} className="rounded-xl border border-border-custom/60 overflow-hidden bg-background-secondary/50">
                          <button
                            onClick={() => setExpandedMobileCat(isExpanded ? null : cat.id)}
                            className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-foreground hover:bg-card transition-colors"
                          >
                            <span className="truncate">{catName}</span>
                            <ChevronDown size={13} className={`text-muted-custom transition-transform ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="p-2.5 bg-card border-t border-border-custom/60 space-y-1">
                              {subcats.length > 0 ? (
                                subcats.map((sub: any) => (
                                  <Link
                                    key={sub.id || sub.slug}
                                    href={`/category/${sub.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1.5"
                                  >
                                    <span className="text-primary font-black text-xs">•</span>
                                    <span className="truncate">{getLocalizedText(sub.name, language)}</span>
                                  </Link>
                                ))
                              ) : (
                                <span className="text-[11px] text-muted-custom p-1 block">{t('nav.categories')}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trust pills in mobile drawer */}
              <div className="pt-3 border-t border-border-custom/80">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: <Truck size={13} className="text-emerald-500" />, text: 'Free Delivery ₹499+' },
                    { icon: <ShieldCheck size={13} className="text-blue-500" />, text: 'Secure Payments' },
                    { icon: <BadgeCheck size={13} className="text-amber-500" />, text: 'GST Verified Sellers' },
                    { icon: <RefreshCw size={13} className="text-rose-500" />, text: 'Easy Returns' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-background-secondary rounded-xl px-3 py-2.5 border border-border-custom/60">
                      {item.icon}
                      <span className="text-[10px] font-bold text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CART DRAWER
          ═══════════════════════════════════════════════════════════ */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom/80">
            <button onClick={() => setCartOpen(false)} className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80">
              <X size={18} />
            </button>
            <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 border-b border-border-custom/80 pb-4">
              <ShoppingCart className="text-primary" size={20} />
              <span>{t('nav.cart')}</span>
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-xl font-extrabold">
                {cartItemCount} Items
              </span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                  <ShoppingCart size={48} className="text-muted-custom/40" />
                  <p className="text-xs font-semibold text-muted-custom">{t('cart.empty')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3.5 p-3.5 bg-background-secondary rounded-2xl border border-border-custom/80">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-contain bg-card p-1 border border-border-custom/80 shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-foreground truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-muted-custom">{item.product.brand}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-xs text-primary">₹{item.product.offerPrice.toLocaleString()}</span>
                        <div className="flex items-center border border-border-custom/80 bg-card rounded-xl overflow-hidden">
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1 hover:bg-background-secondary text-muted-custom"><Minus size={11} /></button>
                          <span className="px-2 text-xs font-bold text-foreground">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-background-secondary text-muted-custom"><Plus size={11} /></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 self-start text-muted-custom hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-custom/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-custom uppercase">{t('cart.summary')}</span>
                  <span className="text-lg font-black text-foreground">₹{cartTotal.toLocaleString()}</span>
                </div>
                <Link href="/checkout" onClick={() => setCartOpen(false)} className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-all text-center block shadow-sm">
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          WISHLIST DRAWER
          ═══════════════════════════════════════════════════════════ */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom/80">
            <button onClick={() => setWishlistOpen(false)} className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom/80">
              <X size={18} />
            </button>
            <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 border-b border-border-custom/80 pb-4">
              <Heart className="text-rose-500 fill-rose-500" size={20} />
              <span>{t('nav.wishlist')}</span>
              <span className="text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2.5 py-0.5 rounded-xl font-extrabold">{wishlist.length} Items</span>
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {wishlist.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                  <Heart size={48} className="text-muted-custom/40" />
                  <p className="text-xs font-semibold text-muted-custom">{t('wishlist.empty')}</p>
                </div>
              ) : (
                wishlist.map((prod) => (
                  <div key={prod.id} className="flex gap-3.5 p-3.5 bg-background-secondary rounded-2xl border border-border-custom/80">
                    <img src={prod.image} alt={prod.name} className="h-16 w-16 rounded-xl object-contain bg-card p-1 border border-border-custom/80 shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-foreground truncate">{prod.name}</h4>
                        <p className="text-[10px] text-muted-custom">{prod.brand}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-xs text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                        <button onClick={() => { addToCart(prod); toggleWishlist(prod); }} className="text-[10px] font-bold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-xl transition-colors shadow-sm">
                          {t('prod.add_to_cart')}
                        </button>
                      </div>
                    </div>
                    <button onClick={() => toggleWishlist(prod)} className="p-1.5 self-start text-muted-custom hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedProductId && (
        <ProductQuickView productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
      )}
    </>
  );
};
