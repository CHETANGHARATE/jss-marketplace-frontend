'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useOrdersQuery } from '../../hooks/useOrders';
import { useNotificationsQuery } from '../../hooks/useNotifications';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AccountSidebar } from '../../components/AccountSidebar';
import {
  ShoppingBag,
  Bell,
  User,
  Heart,
  ShieldCheck,
  Package,
  ArrowRight,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  AlertCircle,
  Sparkles
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, register } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const redirectParam = searchParams.get('redirect');

  const { data: orders = [] } = useOrdersQuery(isAuthenticated);
  const { data: notifications = [] } = useNotificationsQuery(isAuthenticated);

  // Auth Form State for Unauthenticated Users
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    tabParam === 'register' ? 'register' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === 'register') {
      setActiveTab('register');
    } else if (tabParam === 'login' || !tabParam) {
      setActiveTab('login');
    }
  }, [tabParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login({ email, password });
      if (redirectParam) {
        router.replace(redirectParam);
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      await register({ name, email, password, role: 'customer' });
      if (redirectParam) {
        router.replace(redirectParam);
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-foreground/60">Verifying session...</p>
      </div>
    );
  }

  // ─── UNAUTHENTICATED: Render Login / Register Form ─────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-8 max-w-md mx-auto py-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Customer Authentication' }]} />

        <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-1">
              {activeTab === 'login' ? <LogIn className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {activeTab === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
            </h1>
            <p className="text-xs text-muted-custom font-medium">
              {activeTab === 'login'
                ? 'Enter your credentials to access your order history and account profile.'
                : 'Join JSS Marketplace to place orders, track shipments, and save items.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-background-secondary rounded-2xl border border-border-custom/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-custom hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-custom hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Views */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-primary-hover transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-primary-hover transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED: Render Customer Dashboard ──────────────────────────────
  const unreadNotifications = notifications.filter((n) => !n.read_at);

  return (
    <div className="space-y-8 sm:space-y-10">
      <Breadcrumbs items={[{ label: 'Account Dashboard' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 space-y-6 min-w-0 w-full">
          {/* Hero Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95" />
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  <ShieldCheck size={13} />
                  <span>Verified Customer Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome Back, {user.name}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-lg leading-relaxed">
                  Manage your marketplace orders, delivery tracking, account profile, support tickets, and loyalty rewards.
                </p>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-300 block">
                  Escrow Security
                </span>
                <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Protected</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            <Link
              href="/orders"
              className="p-5 bg-card border border-border-custom/80 hover:border-primary/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-2xs group-hover:bg-primary group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">{orders.length}</span>
                <span className="text-xs font-black text-muted-custom block group-hover:text-primary transition-colors">Total Orders</span>
              </div>
            </Link>

            <Link
              href="/account/notifications"
              className="p-5 bg-card border border-border-custom/80 hover:border-amber-500/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-2xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">{unreadNotifications.length}</span>
                <span className="text-xs font-black text-muted-custom block group-hover:text-amber-500 transition-colors">Unread Alerts</span>
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="p-5 bg-card border border-border-custom/80 hover:border-rose-500/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-2xs group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-muted-custom block group-hover:text-rose-500 transition-colors pt-4">Saved Wishlist</span>
              </div>
            </Link>

            <Link
              href="/account/profile"
              className="p-5 bg-card border border-border-custom/80 hover:border-indigo-500/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-2xs group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-muted-custom block group-hover:text-indigo-500 transition-colors pt-4">Edit Profile</span>
              </div>
            </Link>
          </div>

          {/* Recent Orders Showcase */}
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom/80">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span>Recent Orders</span>
              </h3>
              <Link
                href="/orders"
                className="text-xs font-black text-primary hover:underline flex items-center gap-1.5"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <ShoppingBag className="w-10 h-10 text-muted-custom/30 mx-auto" />
                <p className="text-xs font-bold text-muted-custom">
                  You haven't placed any orders yet. Start exploring marketplace categories!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-4 bg-background-secondary/80 rounded-2xl border border-border-custom/80 text-xs"
                  >
                    <div>
                      <span className="font-mono font-black text-primary text-sm">#{ord.order_number}</span>
                      <span className="text-muted-custom block font-semibold mt-0.5">
                        Placed on {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="font-black text-foreground text-sm block">
                        ₹{ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="font-black text-[10px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-foreground/60">Loading account...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
