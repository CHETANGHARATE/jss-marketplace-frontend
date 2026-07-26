'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Bell,
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
  CheckCircle2,
  Info,
  LogIn,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { ProductQuickView } from './ProductQuickView';
import { MegaMenu } from './MegaMenu';

export const Header: React.FC = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
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

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mockNotifications = [
    { id: 1, title: 'Diwali Dhamaka Starts Today!', desc: 'Get up to 80% off on all electronics & fashion apparel.', time: '2 mins ago', read: false },
    { id: 2, title: 'Price drop alert', desc: 'An item in your wishlist has dropped in price by 10%.', time: '1 hour ago', read: false },
    { id: 3, title: 'Become a Seller', desc: 'Register today and get 0% commission on your first 30 days.', time: '1 day ago', read: true }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] font-bold py-1.5 px-4 text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block text-slate-400 font-medium">
            🇮🇳 Verified Multi-Vendor E-Commerce Platform
          </span>
          <div className="mx-auto sm:mx-0 flex items-center gap-2">
            <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
              Festive Deals
            </span>
            <span>Free Express Shipping on all orders above ₹499!</span>
          </div>
          <span className="hidden md:inline-block text-slate-400 font-medium">
            Helpdesk: 1800-JSS-MARKET
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-card border-b border-border-custom shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom"
                aria-label="Toggle Mobile Menu"
              >
                <Menu size={20} />
              </button>

              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-primary flex items-center">
                  JSS<span className="text-accent">Solutions</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Market
                </span>
              </Link>
            </div>

            {/* Middle: Mega Menu Dropdown */}
            <div className="hidden lg:block">
              <MegaMenu />
            </div>

            {/* Middle: Search Bar */}
            <div className="hidden lg:block flex-1 max-w-xl mx-2">
              <SearchBar />
            </div>

            {/* Right: Actions (Language, Theme, Notifications, Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Language Selector */}
              <div ref={langMenuRef} className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom transition-colors flex items-center gap-1 text-xs font-bold"
                  aria-label="Language Selector"
                >
                  <Globe size={18} />
                  <span className="uppercase hidden md:inline">{language}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-card border border-border-custom rounded-2xl shadow-lg z-50 overflow-hidden py-1">
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
                        {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Notifications Dropdown */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifPanelOpen(!notifPanelOpen)}
                  className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full" />
                </button>
                {notifPanelOpen && (
                  <div className="absolute right-[-40px] sm:right-0 mt-2 w-80 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-border-custom">
                    <div className="px-4 py-3 bg-background-secondary flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-wider text-foreground">{t('nav.notifications')}</span>
                      <span className="text-[10px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md font-bold">3 New</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border-custom">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className={`p-3.5 hover:bg-background-secondary transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                          <div className="flex gap-2">
                            {!notif.read ? <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" /> : <Info size={15} className="text-muted-custom shrink-0 mt-0.5" />}
                            <div>
                              <h4 className="font-bold text-xs text-foreground leading-tight">{notif.title}</h4>
                              <p className="text-[11px] text-muted-custom mt-1 leading-snug">{notif.desc}</p>
                              <span className="text-[9px] text-muted-custom block mt-1">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Drawer Trigger */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-[9px] font-black text-white rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 sm:px-3 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom transition-colors relative flex items-center gap-1.5"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <>
                    <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.2 rounded-md">
                      {cartItemCount}
                    </span>
                    <span className="text-xs font-extrabold text-foreground hidden xl:inline-block">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </>
                )}
              </button>

              {/* Account Dropdown or Login Link */}
              <div ref={userMenuRef} className="relative hidden md:block">
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-xl border border-border-custom bg-background-secondary hover:bg-card transition-colors text-xs font-bold"
                    >
                      <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.substring(0, 2)}
                      </div>
                      <span className="max-w-[90px] truncate text-foreground">
                        {user.name}
                      </span>
                      <ChevronDown size={14} className="text-muted-custom" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-border-custom">
                        <div className="px-4 py-3 bg-background-secondary">
                          <p className="text-[10px] text-muted-custom font-semibold uppercase">Signed in as</p>
                          <p className="text-xs font-bold text-foreground truncate mt-0.5">{user.name}</p>
                          <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-1.5 py-0.5 rounded capitalize mt-1 inline-block">
                            {user.role || 'customer'}
                          </span>
                        </div>
                        <div className="py-1 text-xs font-medium">
                          <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-background-secondary transition-colors">
                            <User size={15} className="text-muted-custom" />
                            {t('nav.profile')}
                          </Link>
                          {user.role === 'seller' && (
                            <Link href="/vendor" className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-background-secondary transition-colors">
                              <Store size={15} className="text-muted-custom" />
                              Vendor Portal
                            </Link>
                          )}
                          {user.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-background-secondary transition-colors font-bold">
                              <ShieldCheck size={15} />
                              Admin Dashboard
                            </Link>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => logout()}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-background-secondary transition-colors"
                          >
                            {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all"
                  >
                    <LogIn size={14} />
                    <span>Account</span>
                  </Link>
                )}
              </div>

              {/* Vendor Portal Link */}
              <Link
                href="/vendor"
                className="hidden xl:flex items-center gap-1.5 text-xs font-bold bg-background-secondary text-foreground border border-border-custom px-3.5 py-2 rounded-xl hover:border-primary transition-all"
              >
                <Store size={14} className="text-accent" />
                <span>Seller Hub</span>
              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 border-b border-border-custom pb-4">
              <ShoppingBag className="text-primary" size={20} />
              <span>{t('nav.cart')}</span>
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold">
                {cartItemCount} Items
              </span>
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                  <ShoppingBag size={44} className="text-muted-custom/40" />
                  <p className="text-xs font-semibold text-muted-custom">{t('cart.empty')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-background-secondary rounded-2xl border border-border-custom">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-xl object-contain bg-card p-1 border border-border-custom shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-foreground truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-muted-custom">{item.product.brand}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-xs text-primary">₹{item.product.offerPrice.toLocaleString()}</span>
                        <div className="flex items-center border border-border-custom bg-card rounded-lg overflow-hidden">
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
              <div className="mt-4 pt-4 border-t border-border-custom space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-custom uppercase">Total Amount</span>
                  <span className="text-lg font-black text-foreground">₹{cartTotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-all text-center block shadow-sm"
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
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom">
            <button
              onClick={() => setWishlistOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-xl border border-border-custom"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 border-b border-border-custom pb-4">
              <Heart className="text-rose-500 fill-rose-500" size={20} />
              <span>{t('nav.wishlist')}</span>
              <span className="text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-md font-bold">
                {wishlist.length} Items
              </span>
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {wishlist.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                  <Heart size={44} className="text-muted-custom/40" />
                  <p className="text-xs font-semibold text-muted-custom">{t('wishlist.empty')}</p>
                </div>
              ) : (
                wishlist.map((prod) => (
                  <div key={prod.id} className="flex gap-3 p-3 bg-background-secondary rounded-2xl border border-border-custom">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-16 w-16 rounded-xl object-contain bg-card p-1 border border-border-custom shrink-0"
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
                          className="text-[10px] font-bold text-white bg-primary hover:bg-primary-hover px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Move to Cart
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
