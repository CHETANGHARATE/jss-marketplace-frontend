'use client';

import React, { useState, useEffect } from 'react';
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation
} from '../../../hooks/useNotifications';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AccountSidebar } from '../../../components/AccountSidebar';
import { notificationService, UserNotificationPreference } from '../../../services/notificationService';
import { alertService, PriceDropAlertItem, BackInStockSubscriptionItem, ProductLaunchSubscriptionItem } from '../../../services/alertService';
import {
  Bell,
  CheckCheck,
  Check,
  Sliders,
  Mail,
  Smartphone,
  MessageSquare,
  Globe,
  Tag,
  Package,
  Store,
  Sparkles,
  ShoppingBag,
  Trash2,
  Lock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences' | 'subscriptions'>('inbox');
  
  // Inbox data
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Preferences data
  const [preferences, setPreferences] = useState<UserNotificationPreference | null>(null);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsSuccessMsg, setPrefsSuccessMsg] = useState('');

  // Subscriptions data
  const [priceAlerts, setPriceAlerts] = useState<PriceDropAlertItem[]>([]);
  const [stockAlerts, setStockAlerts] = useState<BackInStockSubscriptionItem[]>([]);
  const [launchAlerts, setLaunchAlerts] = useState<ProductLaunchSubscriptionItem[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);

  useEffect(() => {
    loadPreferences();
    loadSubscriptions();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (e) {
      console.error('Failed to load preferences', e);
    }
  };

  const loadSubscriptions = async () => {
    setIsLoadingSubs(true);
    try {
      const [priceData, stockData, launchData] = await Promise.all([
        alertService.getPriceDropAlerts(),
        alertService.getBackInStockSubscriptions(),
        alertService.getLaunchSubscriptions(),
      ]);
      setPriceAlerts(priceData);
      setStockAlerts(stockData);
      setLaunchAlerts(launchData);
    } catch (e) {
      console.error('Failed to load subscriptions', e);
    } finally {
      setIsLoadingSubs(false);
    }
  };

  const handleTogglePref = async (key: keyof UserNotificationPreference) => {
    if (!preferences) return;
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);

    setIsSavingPrefs(true);
    try {
      await notificationService.updatePreferences(updated);
      setPrefsSuccessMsg('Preferences saved automatically.');
      setTimeout(() => setPrefsSuccessMsg(''), 3000);
    } catch (e) {
      console.error('Failed to save preference', e);
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    if (!preferences) return;
    const updated = { ...preferences, preferred_language: lang };
    setPreferences(updated);

    setIsSavingPrefs(true);
    try {
      await notificationService.updatePreferences(updated);
      setPrefsSuccessMsg('Preferred notification language updated.');
      setTimeout(() => setPrefsSuccessMsg(''), 3000);
    } catch (e) {
      console.error('Failed to save language', e);
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleCancelPriceAlert = async (productId: number) => {
    try {
      await alertService.cancelPriceDrop(productId);
      setPriceAlerts((prev) => prev.filter((p) => p.product_id !== productId));
    } catch (e) {
      console.error('Failed to cancel price alert', e);
    }
  };

  const handleCancelStockAlert = async (productId: number) => {
    try {
      await alertService.cancelBackInStock(productId);
      setStockAlerts((prev) => prev.filter((s) => s.product_id !== productId));
    } catch (e) {
      console.error('Failed to cancel stock alert', e);
    }
  };

  const handleCancelLaunchAlert = async (productId: number) => {
    try {
      await alertService.cancelLaunch(productId);
      setLaunchAlerts((prev) => prev.filter((l) => l.product_id !== productId));
    } catch (e) {
      console.error('Failed to cancel launch alert', e);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Account Dashboard', href: '/account' }, { label: 'Notifications & Alerts' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Bell className="w-6 h-6 text-primary" />
                <span>Notification Center</span>
              </h1>
              <p className="text-xs text-muted-custom font-medium mt-1">
                Stay updated with orders, price drops, restock alerts, and configure multi-channel delivery.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-background-secondary rounded-2xl border border-border/40">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'inbox'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Inbox</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'preferences'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Preferences</span>
              </button>

              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'subscriptions'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>My Alerts</span>
                {priceAlerts.length + stockAlerts.length + launchAlerts.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-background text-foreground/80 rounded-full text-[10px] border border-border/50">
                    {priceAlerts.length + stockAlerts.length + launchAlerts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-custom">
                  Showing {notifications.length} message{notifications.length === 1 ? '' : 's'}
                </span>

                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllReadMutation.mutate()}
                    disabled={markAllReadMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark All as Read</span>
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-xs text-muted-custom animate-pulse">
                  Loading inbox notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Bell className="w-10 h-10 text-foreground/20 mx-auto" />
                  <h3 className="text-base font-bold text-foreground">Your Inbox is Clear</h3>
                  <p className="text-xs text-muted-custom">
                    You have no new notifications right now.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        n.read_at
                          ? 'bg-card border-border/40 opacity-75'
                          : 'bg-primary/5 border-primary/30 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-foreground">{n.title}</span>
                          {!n.read_at && (
                            <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                          )}
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] font-semibold text-muted-custom block">
                          {new Date(n.created_at).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {!n.read_at && (
                        <button
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="p-1.5 text-muted-custom hover:text-primary transition-colors shrink-0"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && preferences && (
            <div className="space-y-6">
              {prefsSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{prefsSuccessMsg}</span>
                </div>
              )}

              {/* Delivery Channels */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                  1. Delivery Channels
                </h3>
                <p className="text-xs text-muted-custom font-medium">
                  Choose where you wish to receive transactional and promotional updates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { key: 'in_app_enabled' as const, label: 'In-App Notification Center', desc: 'Alerts in top navbar inbox', icon: Bell },
                    { key: 'email_enabled' as const, label: 'Email Notifications', desc: 'Order receipts & digest emails', icon: Mail },
                    { key: 'sms_enabled' as const, label: 'SMS Gateway (MSG91)', desc: 'Real-time OTP & order dispatch alerts', icon: Smartphone },
                    { key: 'whatsapp_enabled' as const, label: 'WhatsApp Business Alerts', desc: 'Instant WhatsApp messages & tracking', icon: MessageSquare },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isChecked = Boolean(preferences[ch.key]);
                    return (
                      <div
                        key={ch.key}
                        onClick={() => handleTogglePref(ch.key)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-card border-primary/50 shadow-xs'
                            : 'bg-background-secondary border-border/40 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                            isChecked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-custom'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground block">{ch.label}</span>
                            <span className="text-[10px] text-muted-custom font-medium block">{ch.desc}</span>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notification Topics */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                  2. Notification Topics & Subscriptions
                </h3>

                <div className="space-y-2.5">
                  {/* Order updates (Mandatory) */}
                  <div className="p-3.5 bg-card border border-border/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">Order, Shipping & Return Updates</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Mandatory
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-custom">
                          Critical transactional updates regarding your purchases, invoices, and refunds.
                        </span>
                      </div>
                    </div>
                    <input type="checkbox" checked disabled className="h-4 w-4 rounded text-primary opacity-60" />
                  </div>

                  {/* Optional Topics */}
                  {[
                    { key: 'price_alerts' as const, label: 'Price Drop Alerts', desc: 'When products in your watchlist drop in price', icon: Tag },
                    { key: 'stock_alerts' as const, label: 'Back in Stock & Launch Alerts', desc: 'Instant restock and coming-soon launch notices', icon: Package },
                    { key: 'store_updates' as const, label: 'Followed Store Updates', desc: 'New arrivals and announcements from your followed sellers', icon: Store },
                    { key: 'promotions' as const, label: 'Promotional Offers & Flash Sales', desc: 'Exclusive coupons, discount codes, and festive campaigns', icon: Sparkles },
                    { key: 'abandoned_cart' as const, label: 'Cart Recovery Reminders', desc: 'Reminders when you leave items in your cart', icon: ShoppingBag },
                  ].map((top) => {
                    const Icon = top.icon;
                    const isChecked = Boolean(preferences[top.key]);
                    return (
                      <div
                        key={top.key}
                        onClick={() => handleTogglePref(top.key)}
                        className="p-3.5 bg-card border border-border/40 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary" />
                          <div>
                            <span className="text-xs font-bold text-foreground block">{top.label}</span>
                            <span className="text-[10px] text-muted-custom font-medium block">{top.desc}</span>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    3. Preferred Notification Language
                  </h3>
                </div>
                <p className="text-xs text-muted-custom font-medium">
                  We will deliver your SMS, WhatsApp, and In-App messages in your chosen language.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  {[
                    { code: 'en', label: 'English (EN)' },
                    { code: 'hi', label: 'Hindi (हिन्दी)' },
                    { code: 'mr', label: 'Marathi (मराठी)' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                        preferences.preferred_language === lang.code
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-card border-border/50 text-foreground hover:border-primary/40'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MY SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {isLoadingSubs ? (
                <div className="py-12 text-center text-xs text-muted-custom animate-pulse">
                  Loading active alerts...
                </div>
              ) : (
                <>
                  {/* Price Drop Alerts */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Tag className="w-4 h-4 text-orange-500" />
                        <span>Price Drop Watchlist ({priceAlerts.length})</span>
                      </h3>
                      <button onClick={loadSubscriptions} className="p-1 text-muted-custom hover:text-foreground">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {priceAlerts.length === 0 ? (
                      <div className="p-4 bg-background-secondary rounded-2xl text-center text-xs text-muted-custom">
                        No active price drop alerts. Click "Price Drop Alert" on any product page to watch prices.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {priceAlerts.map((a) => (
                          <div key={a.id} className="p-3.5 bg-card border border-border/40 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={a.product_image} alt={a.product_name} className="w-10 h-10 object-contain rounded-xl bg-background p-1 border border-border/40 shrink-0" />
                              <div className="min-w-0">
                                <Link href={`/product/${a.product_slug}`} className="text-xs font-bold text-foreground hover:text-primary truncate block">
                                  {a.product_name}
                                </Link>
                                <span className="text-[10px] text-muted-custom block">
                                  Current: ₹{a.current_price.toLocaleString('en-IN')} {a.target_price && `(Target: ₹${a.target_price})`}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCancelPriceAlert(a.product_id)}
                              className="p-1.5 text-muted-custom hover:text-rose-500 rounded-lg transition-colors shrink-0"
                              title="Cancel Alert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Back in Stock Alerts */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span>Back-in-Stock Watchlist ({stockAlerts.length})</span>
                    </h3>

                    {stockAlerts.length === 0 ? (
                      <div className="p-4 bg-background-secondary rounded-2xl text-center text-xs text-muted-custom">
                        No restock alerts active. Click "Notify When Available" on sold-out products.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stockAlerts.map((s) => (
                          <div key={s.id} className="p-3.5 bg-card border border-border/40 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={s.product_image} alt={s.product_name} className="w-10 h-10 object-contain rounded-xl bg-background p-1 border border-border/40 shrink-0" />
                              <div className="min-w-0">
                                <Link href={`/product/${s.product_slug}`} className="text-xs font-bold text-foreground hover:text-primary truncate block">
                                  {s.product_name}
                                </Link>
                                <span className="text-[10px] text-muted-custom block">
                                  Status: {s.in_stock ? 'In Stock Now!' : 'Awaiting Restock'}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCancelStockAlert(s.product_id)}
                              className="p-1.5 text-muted-custom hover:text-rose-500 rounded-lg transition-colors shrink-0"
                              title="Cancel Alert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Coming Soon Product Launch Alerts */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Product Launch Subscriptions ({launchAlerts.length})</span>
                    </h3>

                    {launchAlerts.length === 0 ? (
                      <div className="p-4 bg-background-secondary rounded-2xl text-center text-xs text-muted-custom">
                        No coming-soon launch subscriptions active.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {launchAlerts.map((l) => (
                          <div key={l.id} className="p-3.5 bg-card border border-border/40 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={l.product_image} alt={l.product_name} className="w-10 h-10 object-contain rounded-xl bg-background p-1 border border-border/40 shrink-0" />
                              <div className="min-w-0">
                                <Link href={`/product/${l.product_slug}`} className="text-xs font-bold text-foreground hover:text-primary truncate block">
                                  {l.product_name}
                                </Link>
                                <span className="text-[10px] text-amber-600 block font-bold">
                                  Coming Soon Launch Watcher
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCancelLaunchAlert(l.product_id)}
                              className="p-1.5 text-muted-custom hover:text-rose-500 rounded-lg transition-colors shrink-0"
                              title="Cancel Alert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
