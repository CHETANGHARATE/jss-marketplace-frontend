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
  LogIn
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
      <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-md border-b border-border-custom shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-foreground hover:bg-background-secondary rounded-xl"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-primary flex items-center">
                  JSS<span className="text-accent">Solutions</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Market
                </span>
              </Link>
            </div>

            <div className="hidden lg:block">
              <MegaMenu />
            </div>

            <div className="hidden lg:block flex-1 max-w-xl mx-2">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              
              <div ref={langMenuRef} className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2.5 text-foreground hover:bg-background-secondary hover:text-primary rounded-2xl transition-all flex items-center gap-1"
                  aria-label="Language Selector"
                >
                  <Globe size={20} />
                  <span className="text-xs font-bold uppercase hidden md:inline">{language}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                    {(['en', 'hi', 'mr'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          language === lang
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-foreground hover:bg-background-secondary'
                        }`}
                      >
                        {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2.5 text-foreground hover:bg-background-secondary hover:text-primary rounded-2xl transition-all"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifPanelOpen(!notifPanelOpen)}
                  className="p-2.5 text-foreground hover:bg-background-secondary hover:text-primary rounded-2xl transition-all relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-accent rounded-full border border-card" />
                </button>
                {notifPanelOpen && (
                  <div className="absolute right-[-60px] sm:right-0 mt-2 w-80 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-border-custom">
                    <div className="px-4 py-3 bg-background-secondary flex justify-between items-center">
                      <span className="font-bold text-sm text-foreground">{t('nav.notifications')}</span>
                      <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-bold">3 New</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border-custom">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className={`p-4 hover:bg-background-secondary transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                          <div className="flex gap-2">
                            {!notif.read ? <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" /> : <Info size={16} className="text-muted-custom shrink-0 mt-0.5" />}
                            <div>
                              <h4 className="font-semibold text-xs text-foreground leading-tight">{notif.title}</h4>
                              <p className="text-[11px] text-muted-custom mt-1 leading-snug">{notif.desc}</p>
                              <span className="text-[9px] text-muted-custom block mt-1.5">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setWishlistOpen(true)}
                className="p-2.5 text-foreground hover:bg-background-secondary hover:text-primary rounded-2xl transition-all relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-[10px] font-bold text-white rounded-full flex items-center justify-center border border-card animate-bounce">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2.5 text-foreground hover:bg-background-secondary hover:text-primary rounded-2xl transition-all relative flex items-center gap-1.5 pr-3.5 pl-2.5"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 ? (
                  <>
                    <span className="absolute -top-1 left-7 h-5 w-5 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center border border-card">
                      {cartItemCount}
                    </span>
                    <span className="text-xs font-bold text-foreground hidden lg:inline-block ml-3">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </>
                ) : null}
              </button>

              <div ref={userMenuRef} className="relative hidden md:block">
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 p-1.5 pr-3 rounded-full border border-border-custom hover:border-primary bg-background-secondary hover:bg-card transition-all"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.substring(0, 2)}
                      </div>
                      <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown size={14} className="text-muted-custom" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border-custom rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-border-custom">
                        <div className="px-4 py-3">
                          <p className="text-xs text-muted-custom leading-none">Signed in as</p>
                          <p className="text-sm font-semibold text-foreground mt-1 truncate">{user.name}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background-secondary transition-colors">
                            <User size={16} className="text-muted-custom" />
                            {t('nav.profile')}
                          </Link>
                          {user.role === 'seller' && (
                            <Link href="/vendor" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background-secondary transition-colors">
                              <Store size={16} className="text-muted-custom" />
                              Vendor Portal
                            </Link>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => logout()}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-background-secondary transition-colors"
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
                  >
                    <LogIn size={14} />
                    <span>Account</span>
                  </Link>
                )}
              </div>

              <Link
                href="/vendor"
                className="hidden xl:flex items-center gap-1.5 text-xs font-bold bg-accent text-white px-4 py-2.5 rounded-2xl hover:bg-accent-hover transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <Store size={14} />
                <span>Vendor Hub</span>
              </Link>

            </div>
          </div>
        </div>
      </header>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-xl"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
              <ShoppingBag className="text-primary" />
              <span>{t('nav.cart')}</span>
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                {cartItemCount} Items
              </span>
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-muted-custom/40 mb-3" />
                  <p className="text-muted-custom font-medium">{t('cart.empty')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-background-secondary rounded-2xl border border-border-custom hover:border-primary/20 transition-all">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-xl object-cover border border-border-custom"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-custom mt-0.5">{item.product.brand}</p>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="font-bold text-sm text-primary">₹{item.product.offerPrice.toLocaleString()}</span>
                        <div className="flex items-center border border-border-custom bg-card rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-background-secondary text-muted-custom"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-background-secondary text-muted-custom"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 self-start text-muted-custom hover:text-accent hover:bg-background rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border-custom space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-custom">Total Amount</span>
                  <span className="text-xl font-black text-foreground">₹{cartTotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary-hover transition-all text-center block shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-card text-card-foreground p-6 shadow-2xl flex flex-col h-full animate-slide-in relative border-l border-border-custom">
            <button
              onClick={() => setWishlistOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground hover:bg-background-secondary rounded-xl"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
              <Heart className="text-accent fill-accent" />
              <span>{t('nav.wishlist')}</span>
              <span className="text-xs bg-accent/10 text-accent px-2.5 py-0.5 rounded-full font-bold">
                {wishlist.length} Items
              </span>
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {wishlist.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <Heart size={48} className="text-muted-custom/40 mb-3" />
                  <p className="text-muted-custom font-medium">{t('wishlist.empty')}</p>
                </div>
              ) : (
                wishlist.map((prod) => (
                  <div key={prod.id} className="flex gap-4 p-3 bg-background-secondary rounded-2xl border border-border-custom hover:border-accent/20 transition-all">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-16 w-16 rounded-xl object-cover border border-border-custom"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">{prod.name}</h4>
                      <p className="text-xs text-muted-custom mt-0.5">{prod.brand}</p>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="font-bold text-sm text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                        <button
                          onClick={() => {
                            addToCart(prod);
                            toggleWishlist(prod);
                          }}
                          className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Move to Cart
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="p-1.5 self-start text-muted-custom hover:text-accent hover:bg-background rounded-lg transition-colors"
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
