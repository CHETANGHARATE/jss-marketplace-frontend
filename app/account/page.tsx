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

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-foreground/60">Verifying session...</p>
      </div>
    );
  }

  // ─── UNAUTHENTICATED: Render Authentication Forms ─────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-8 max-w-md mx-auto py-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Customer Authentication' }]} />

        <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-1">
              {authView === 'login' && <LogIn className="w-7 h-7" />}
              {authView === 'register' && <UserPlus className="w-7 h-7" />}
              {authView === 'forgot_password' && <KeyRound className="w-7 h-7" />}
              {authView === 'verify_reset_otp' && <ShieldCheck className="w-7 h-7" />}
              {authView === 'new_password' && <Lock className="w-7 h-7" />}
              {authView === 'verify_email_otp' && <Mail className="w-7 h-7" />}
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {authView === 'login' && 'Customer Sign In'}
              {authView === 'register' && 'Create Customer Account'}
              {authView === 'forgot_password' && 'Forgot Password'}
              {authView === 'verify_reset_otp' && 'Enter Verification Code'}
              {authView === 'new_password' && 'Set New Password'}
              {authView === 'verify_email_otp' && 'Verify Your Email'}
            </h1>
            <p className="text-xs text-muted-custom font-medium">
              {authView === 'login' && 'Enter your credentials to access your order history and account profile.'}
              {authView === 'register' && 'Join JSS Marketplace to place orders, track shipments, and save items.'}
              {authView === 'forgot_password' && 'Enter your registered email address to receive a 6-digit OTP code.'}
              {authView === 'verify_reset_otp' && `Enter the 6-digit OTP sent to ${email}.`}
              {authView === 'new_password' && 'Choose a strong new password for your account.'}
              {authView === 'verify_email_otp' && `Enter the 6-digit activation code sent to ${email}.`}
            </p>
          </div>

          {/* Toggle Tabs for Login / Register */}
          {(authView === 'login' || authView === 'register') && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-background-secondary rounded-2xl border border-border-custom/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthView('login'); setStatusMessage(null); }}
                className={`py-2.5 rounded-xl transition-all ${
                  authView === 'login'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthView('register'); setStatusMessage(null); }}
                className={`py-2.5 rounded-xl transition-all ${
                  authView === 'register'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Feedback Status Alert */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-start gap-3 border ${
                statusMessage.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span>{statusMessage.text}</span>
                {process.env.NODE_ENV === 'development' && demoOtp && (
                  <div className="pt-1 text-[11px] font-mono font-bold text-primary">
                    [Development Demo Code: {demoOtp}]
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 1: SIGN IN */}
          {authView === 'login' && (
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
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthView('forgot_password'); setStatusMessage(null); }}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border-custom text-primary focus:ring-primary"
                />
                <label htmlFor="rememberMe" className="text-xs font-semibold text-foreground/70 cursor-pointer">
                  Remember me on this browser
                </label>
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
          )}

          {/* VIEW 2: REGISTER */}
          {authView === 'register' && (
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
                  Password (Min 8 characters)
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

          {/* VIEW 3: FORGOT PASSWORD */}
          {authView === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-primary-hover transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setAuthView('login'); setStatusMessage(null); }}
                className="w-full py-2.5 text-xs font-bold text-muted-custom hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* VIEW 4: VERIFY RESET OTP */}
          {authView === 'verify_reset_otp' && (
            <form onSubmit={handleVerifyResetOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full tracking-[0.5em] text-center font-mono font-black text-xl py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full py-3.5 px-4 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-primary-hover transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthView('forgot_password'); setStatusMessage(null); }}
                  className="font-bold text-muted-custom hover:text-foreground"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {/* VIEW 5: NEW PASSWORD */}
          {authView === 'new_password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  New Password (Min 8 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-xs font-medium text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-custom absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save New Password</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 6: VERIFY EMAIL OTP (SIGNUP ACTIVATION) */}
          {authView === 'verify_email_otp' && (
            <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block text-center">
                  Enter 6-Digit Email Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full tracking-[0.5em] text-center font-mono font-black text-xl py-3 bg-background-secondary border border-border-custom/80 rounded-2xl text-foreground placeholder:text-muted-custom focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full py-3.5 px-4 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-primary-hover transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Activate Account & Log In</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthView('login'); setStatusMessage(null); }}
                  className="font-bold text-muted-custom hover:text-foreground"
                >
                  Back to Sign In
                </button>
              </div>
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
