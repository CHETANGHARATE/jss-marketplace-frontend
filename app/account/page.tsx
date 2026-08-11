'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useOrdersQuery } from '../../hooks/useOrders';
import { useNotificationsQuery } from '../../hooks/useNotifications';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AccountSidebar } from '../../components/AccountSidebar';
import { authService } from '../../services/authService';
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
  Sparkles,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Check
} from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot_password' | 'verify_reset_otp' | 'new_password' | 'verify_email_otp';

function AccountContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, register, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const redirectParam = searchParams.get('redirect');

  const { data: orders = [] } = useOrdersQuery(isAuthenticated);
  const { data: notifications = [] } = useNotificationsQuery(isAuthenticated);

  // Auth Form View State
  const [authView, setAuthView] = useState<AuthView>('login');

  // Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP & Reset States
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  // Feedback & Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (tabParam === 'register') {
      setAuthView('register');
    } else if (tabParam === 'forgot-password' || tabParam === 'forgot_password') {
      setAuthView('forgot_password');
    } else if (tabParam === 'login' || !tabParam) {
      setAuthView('login');
    }
  }, [tabParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!email || !password) {
      setStatusMessage({ type: 'error', text: 'Please fill in both email and password.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const loggedUser = await login({ email, password, rememberMe });
      const userRole = String(loggedUser?.role || '').toLowerCase();
      if (redirectParam) {
        router.replace(redirectParam);
      } else if (userRole === 'seller' || userRole === 'vendor') {
        router.replace('/vendor');
      } else if (userRole === 'admin') {
        router.replace('/admin');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Authentication failed. Please check credentials.';
      if (err?.response?.data?.requires_verification || msg.includes('verified')) {
        setAuthView('verify_email_otp');
        setStatusMessage({ type: 'error', text: 'Email verification required. Please enter the 6-digit code sent to your email.' });
        if (err?.response?.data?.data?.otp) {
          setDemoOtp(err.response.data.data.otp);
        }
      } else {
        setStatusMessage({ type: 'error', text: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!name || !email || !password) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    if (password.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authService.register({ name, email, password, role: 'customer' });
      if (res.demo_otp) {
        setDemoOtp(res.demo_otp);
      }
      setAuthView('verify_email_otp');
      setStatusMessage({ type: 'success', text: 'Account created! Enter the 6-digit code sent to your email.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!otp || otp.length !== 6) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP code.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authService.verifyEmailOtp(email, otp);
      if (res.token) {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('user_profile', JSON.stringify(res.user));
        await refreshUser();
      }
      const role = String(res.user?.role || '').toLowerCase();
      setStatusMessage({ type: 'success', text: 'Email verified successfully!' });
      if (redirectParam) {
        router.replace(redirectParam);
      } else if (role === 'seller' || role === 'vendor') {
        router.replace('/vendor');
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Invalid or expired OTP code.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.demo_otp) {
        setDemoOtp(res.demo_otp);
      }
      setAuthView('verify_reset_otp');
      setStatusMessage({ type: 'success', text: res.message });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Failed to send OTP.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!otp || otp.length !== 6) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit verification code.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.verifyOtp(email, otp, 'password_reset');
      setAuthView('new_password');
      setStatusMessage({ type: 'success', text: 'Code verified! Enter your new password below.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Invalid or expired OTP code.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!newPassword || !confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter and confirm your new password.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const msg = await authService.resetPassword({
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setAuthView('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage({ type: 'success', text: msg });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Failed to reset password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setIsSubmitting(true);
    try {
      const type = authView === 'verify_email_otp' ? 'email_verification' : 'password_reset';
      const res = await authService.resendOtp(email, type);
      if (res.demo_otp) {
        setDemoOtp(res.demo_otp);
      }
      setStatusMessage({ type: 'success', text: 'A new 6-digit verification code has been sent!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to resend code.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectParam || '/account')}`);
    }
  }, [isLoading, isAuthenticated, user, router, redirectParam]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="py-24 text-center space-y-3 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-foreground/60">Verifying session & redirecting...</p>
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
