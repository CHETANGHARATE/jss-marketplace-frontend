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
  ShoppingBag
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
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. Top Premium Announcement Bar */}
      <div className="bg-slate-950 text-white text-[11px] font-bold py-2 px-4 border-b border-slate-800/80 transition-colors">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
              🇮🇳 India
            </span>
            <span>{t('nav.india_platform')}</span>
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-2">
            <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
              <Sparkles size={10} />
              <span>{t('nav.festive_deals')}</span>
            </span>
            <span className="font-semibold text-slate-100">{t('nav.free_shipping_notice')}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300 font-medium text-[11px]">
            <Link href="#deals" className="hover:text-primary transition-colors flex items-center gap-1">
              <Tag size={12} className="text-rose-400" />
              <span>{t('nav.deals')}</span>
            </Link>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <PhoneCall size={12} className="text-emerald-400" />
              <span>{t('nav.helpline')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Single-Row Sticky Header Bar (Amazon / Flipkart Style) */}
      <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-md border-b border-border-custom/80 shadow-xs transition-colors duration-200">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex h-18 sm:h-20 items-center justify-between gap-3 sm:gap-4 md:gap-6">
            
            {/* ─── LEFT: Logo & Marketplace Badge ─── */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80 transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                <Menu size={20} />
              </button>

              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-primary flex items-center">
                  JSS<span className="text-accent group-hover:text-primary transition-colors">Solutions</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-2xs">
                  {t('nav.all_categories').includes('All') ? 'Marketplace' : 'मार्केट'}
                </span>
              </Link>
            </div>

            {/* ─── CENTER: All Categories Button + Large Search Bar ─── */}
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-3xl mx-2">
              {/* All Categories Dropdown Trigger */}
              <div className="shrink-0">
                <MegaMenu />
              </div>

              {/* Large Search Bar */}
              <div className="flex-1">
                <SearchBar />
              </div>
            </div>

            {/* ─── RIGHT: Language, Wishlist, Cart, Login & Sign Up ─── */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
              
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Become Vendor Link - Hidden for Sellers */}
              {!isSeller && (
                <Link
                  href="/seller/register"
                  className="hidden xl:flex items-center gap-1.5 text-xs font-bold bg-accent/10 text-accent border border-accent/20 px-3 py-2 rounded-2xl hover:bg-accent hover:text-white transition-all shadow-2xs"
                >
                  <Store size={14} />
                  <span>{t('nav.sell_products')}</span>
                </Link>
              )}

              {/* Language Selector */}
              <div ref={langMenuRef} className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 sm:px-3 py-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  aria-label="Language Selector"
                >
                  <Globe size={17} className="text-primary" />
                  <span className="uppercase hidden sm:inline">{language}</span>
                  <ChevronDown size={12} className="text-muted-custom hidden sm:inline" />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden py-1.5">
                    {(['en', 'hi', 'mr'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                          language === lang
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-background-secondary'
                        }`}
                      >
                        {lang === 'en' ? 'English (EN)' : lang === 'hi' ? 'हिन्दी (HI)' : 'मराठी (MR)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80 transition-colors hidden sm:flex"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="p-2.5 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4.5 w-4.5 bg-rose-500 text-[9px] font-black text-white rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 sm:px-3 py-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80 transition-colors relative flex items-center gap-2"
                aria-label="Cart"
              >
                <ShoppingCart size={18} className="text-primary" />
                {cartItemCount > 0 && (
                  <>
                    <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg shadow-2xs">
                      {cartItemCount}
                    </span>
                    <span className="text-xs font-black text-foreground hidden xl:inline-block">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </>
                )}
              </button>

              {/* Authentication Actions */}
              {isAuthenticated && user ? (
                <div ref={userMenuRef} className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-border-custom/80 bg-background-secondary hover:bg-card transition-colors text-xs font-bold"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs uppercase shadow-2xs">
                      {user.name.substring(0, 2)}
                    </div>
                    <span className="max-w-[90px] truncate text-foreground">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-muted-custom" />
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
                              <LayoutDashboard size={15} className="text-primary" />
                              <span>{t('nav.vendor_dashboard')}</span>
                            </Link>
                            <Link href="/vendor/products" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Package size={15} className="text-primary" />
                              <span>{t('nav.my_products')}</span>
                            </Link>
                            <Link href="/vendor/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <ShoppingBag size={15} className="text-primary" />
                              <span>{t('nav.my_orders_menu')}</span>
                            </Link>
                            <Link href="/vendor/inventory" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Boxes size={15} className="text-primary" />
                              <span>{t('nav.inventory')}</span>
                            </Link>
                            <Link href="/vendor/wallet" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Wallet size={15} className="text-primary" />
                              <span>{t('nav.earnings')}</span>
                            </Link>
                            <Link href="/vendor/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors font-bold">
                              <Settings size={15} className="text-primary" />
                              <span>{t('nav.store_settings')}</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-foreground hover:bg-background-secondary transition-colors">
                              <User size={15} className="text-muted-custom" />
                              {t('nav.profile')}
                            </Link>
                            {isAdmin && (
                              <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-rose-500 hover:bg-background-secondary transition-colors font-bold">
                                <ShieldCheck size={15} />
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
                /* Unauthenticated Guest Login & Sign Up Buttons */
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-card hover:bg-background-secondary text-foreground border border-border-custom/90 text-xs font-bold transition-all hover:border-primary shadow-2xs"
                  >
                    <User size={15} className="text-primary" />
                    <span>{t('nav.login_btn')}</span>
                  </Link>
                  <Link
                    href="/account?tab=register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <UserPlus size={14} />
                    <span>{t('nav.sign_up')}</span>
                  </Link>
                </div>
              )}

            </div>
          </div>

          {/* Mobile Expanded Search Bar */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-4 pt-1">
              <SearchBar />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden">
          <div className="w-4/5 max-w-sm bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-r border-border-custom/80">
            <div className="flex items-center justify-between border-b border-border-custom/80 pb-4 mb-4">
              <span className="text-lg font-black text-primary flex items-center gap-1">
                JSS<span className="text-accent">Solutions</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs font-bold">
              {isSeller ? (
                <div className="space-y-1.5 pt-2">
                  <Link
                    href="/vendor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-bold"
                  >
                    <LayoutDashboard size={18} />
                    <span>{t('nav.vendor_dashboard')}</span>
                  </Link>
                  <Link
                    href="/vendor/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-2xl font-semibold"
                  >
                    <Package size={16} />
                    <span>{t('nav.my_products')}</span>
                  </Link>
                  <Link
                    href="/vendor/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-2xl font-semibold"
                  >
                    <ShoppingBag size={16} />
                    <span>{t('nav.my_orders_menu')}</span>
                  </Link>
                  <Link
                    href="/vendor/inventory"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-2xl font-semibold"
                  >
                    <Boxes size={16} />
                    <span>{t('nav.inventory')}</span>
                  </Link>
                  <Link
                    href="/vendor/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-2xl font-semibold"
                  >
                    <Wallet size={16} />
                    <span>{t('nav.earnings')}</span>
                  </Link>
                  <Link
                    href="/vendor/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 bg-background-secondary text-foreground rounded-2xl font-semibold"
                  >
                    <Settings size={16} />
                    <span>{t('nav.store_settings')}</span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/seller/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3.5 bg-accent/10 border border-accent/20 text-accent rounded-2xl shadow-2xs"
                >
                  <Store size={18} />
                  <span>{t('nav.become_seller')} / {t('nav.sell_products')}</span>
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-center bg-background-secondary border border-border-custom/80 text-foreground rounded-2xl"
                  >
                    {t('nav.login_btn')}
                  </Link>
                  <Link
                    href="/account?tab=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-center bg-primary text-white rounded-2xl shadow-xs"
                  >
                    {t('nav.sign_up')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl"
                  >
                    <User size={18} />
                    <span>{t('nav.profile')}</span>
                  </Link>

                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold transition-all disabled:opacity-50"
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
              )}

              {/* Mobile Categories & Subcategories Navigation */}
              {categories.length > 0 && (
                <div className="pt-4 border-t border-border-custom/80 space-y-2">
                  <div className="pb-1 text-[10px] font-black text-muted-custom uppercase tracking-wider">
                    {t('nav.categories')}
                  </div>
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
                            <ChevronDown size={14} className={`text-muted-custom transition-transform ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
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
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom/80">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 border-b border-border-custom/80 pb-4">
              <ShoppingCart className="text-primary" size={22} />
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
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-xl object-contain bg-card p-1 border border-border-custom/80 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-foreground truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-muted-custom">{item.product.brand}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-xs text-primary">₹{item.product.offerPrice.toLocaleString()}</span>
                        <div className="flex items-center border border-border-custom/80 bg-card rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-background-secondary text-muted-custom"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-xs font-bold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-background-secondary text-muted-custom"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 self-start text-muted-custom hover:text-rose-500 transition-colors"
                    >
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
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-all text-center block shadow-xs"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom/80">
            <button
              onClick={() => setWishlistOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-2xl border border-border-custom/80"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 border-b border-border-custom/80 pb-4">
              <Heart className="text-rose-500 fill-rose-500" size={22} />
              <span>{t('nav.wishlist')}</span>
              <span className="text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2.5 py-0.5 rounded-xl font-extrabold">
                {wishlist.length} Items
              </span>
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
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-16 w-16 rounded-xl object-contain bg-card p-1 border border-border-custom/80 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-foreground truncate">{prod.name}</h4>
                        <p className="text-[10px] text-muted-custom">{prod.brand}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-xs text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                        <button
                          onClick={() => {
                            addToCart(prod);
                            toggleWishlist(prod);
                          }}
                          className="text-[10px] font-bold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                        >
                          {t('prod.add_to_cart')}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="p-1.5 self-start text-muted-custom hover:text-rose-500 transition-colors"
                    >
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
        <ProductQuickView
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </>
  );
};
