'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, CheckCircle2, TrendingUp, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/Toast';
import { getCategories } from '../../../services/category';
import { vendorService } from '../../../services/vendorService';
import { Category } from '../../../types';

const perks = [
  { icon: TrendingUp, title: 'Reach more buyers', desc: 'Get your products in front of thousands of active shoppers across India.' },
  { icon: ShieldCheck, title: 'Secure payouts', desc: 'Fast, reliable settlements straight to your bank account via Razorpay.' },
  { icon: Zap, title: 'Zero setup fee', desc: 'Start selling for free — pay only a small commission per order.' }
];

export default function SellerRegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    ownerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    category: '',
    gstin: ''
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        ownerName: prev.ownerName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      toastError('Please log in or create an account to register as a seller.', 'Authentication Required');
      router.push('/account?tab=login&redirect=/seller/register');
      return;
    }

    setIsSubmitting(true);

    try {
      await vendorService.registerVendorStore({
        store_name: form.businessName,
        store_email: form.email,
        store_phone: form.phone,
        description: `Category: ${form.category} | GSTIN: ${form.gstin || 'N/A'}`,
      });

      setSubmitted(true);
      toastSuccess('Vendor store application submitted successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application.';
      setErrorMsg(msg);
      toastError(msg, 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <div className="h-16 w-16 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-black text-foreground">Application Received & Pending Approval!</h1>
        <p className="text-xs text-muted-custom leading-relaxed font-medium">
          Thank you <strong>{form.ownerName || 'Merchant'}</strong>! Your store application for <strong>{form.businessName}</strong> has been submitted into our system with status <span className="font-bold text-amber-600 uppercase">Pending Approval</span>.
        </p>
        <p className="text-xs text-muted-custom font-medium">
          Our Admin team will review your application details in the Admin Control Panel. You will receive an update at <strong>{form.email}</strong> once your store is activated.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Left: pitch */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <div className="h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
            <Store size={26} />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Become a Seller</h1>
          <p className="text-sm text-muted-custom mt-2 font-medium">
            Join JSS Solutions Marketplace and start selling to customers across India.
          </p>
        </div>

        <div className="space-y-5">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.title} className="flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{perk.title}</h3>
                  <p className="text-xs text-muted-custom mt-1 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: form */}
      <div className="lg:col-span-3">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
        >
          <h2 className="font-bold text-foreground text-lg">Seller details</h2>

          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-custom">Business / Store Name *</label>
              <input
                required
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="e.g. Bright Touch Technologies"
                className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-custom">Owner Name *</label>
              <input
                required
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-custom">Store Email *</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@business.com"
                className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-custom">Store Phone *</label>
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-custom">Primary Category *</label>
              <select
                required
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-medium"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {t(cat.name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-custom">GSTIN (optional)</label>
              <input
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                placeholder="22AAAAA0000A1Z5"
                className="w-full mt-1 bg-background-secondary border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold hover:bg-accent-hover transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
          <p className="text-[11px] text-muted-custom text-center">
            By submitting, you agree to our seller terms and conditions.
          </p>
        </form>
      </div>
    </div>
  );
}
