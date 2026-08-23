'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../../components/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await login({ email, password });

      if (loggedUser.role === 'admin') {
        router.replace('/admin');
      } else {
        await logout();
        setErrorMessage(
          `Access Denied: Account '${email}' does not have Administrator permissions.`
        );
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please check your admin credentials.';
      if (msg === 'Network Error' || err?.code === 'ERR_NETWORK') {
        setErrorMessage('Unable to connect to the server. Please check your network connection and try again.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <BrandLogo variant="admin" size="lg" />

          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-500 mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
              Admin Authentication
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Sign in with your administrator credentials to access platform controls.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-md">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block uppercase tracking-wider text-[10px]">
                  Authentication Error
                </span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jsssolutions.in"
                  className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-border/40 rounded-2xl text-xs font-medium text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-muted/20 border border-border/40 rounded-2xl text-xs font-medium text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-rose-600 transition-all duration-200 shadow-md hover:shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-border/40 text-center">
            <p className="text-[11px] text-foreground/50 font-medium">
              JSS Marketplace Multi-Vendor Security Infrastructure v3.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
