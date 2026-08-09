'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Store, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/Toast';

export default function SellerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      success('Logged in successfully as Seller');
      router.push('/seller/dashboard');
    } catch (err: any) {
      error(err?.response?.data?.message || 'Invalid seller credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Header />
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-card border border-border-custom p-8 rounded-3xl space-y-6 shadow-md">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto border border-accent/20">
              <Store size={24} />
            </div>
            <h1 className="text-xl font-black text-foreground">Seller Portal Login</h1>
            <p className="text-xs text-muted-custom">Access your products, orders, inventory & earnings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Seller Email</label>
              <input
                type="email"
                required
                placeholder="seller@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-black py-3.5 rounded-xl uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{loading ? 'Authenticating...' : 'Login to Seller Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-custom">
            Not a seller yet?{' '}
            <Link href="/seller/register" className="text-primary font-bold hover:underline">
              Register as Seller &rarr;
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
