'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { vendorService } from '../../../services/vendorService';
import { ApiVendorStore } from '../../../types/api';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Store,
  FileText,
  Phone,
  Mail,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function SellerApplicationStatusPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [store, setStore] = useState<ApiVendorStore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchStatus = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMsg('');
    try {
      const data = await vendorService.getStoreSettings();
      setStore(data);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.status === 404) {
        setStore(null);
      } else {
        setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to retrieve application status.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/account?redirect=/seller/application-status');
      } else {
        fetchStatus();
      }
    }
  }, [authLoading, isAuthenticated, router, fetchStatus]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-foreground/70 p-6">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-black uppercase tracking-wider">Checking Application Status...</p>
      </div>
    );
  }

  // 1. Case: No application found
  if (!store && !errorMsg) {
    return (
      <div className="min-h-[70vh] py-12 px-4 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-3">No Seller Application Found</h1>
        <p className="text-sm text-muted-custom leading-relaxed mb-8">
          You have not submitted a seller registration application with this account yet. Register your store to start selling on JSS Marketplace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/seller/register"
            className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
          >
            Apply to Become a Seller <ArrowRight size={14} />
          </Link>
          <Link
            href="/account"
            className="px-6 py-3.5 bg-background-secondary hover:bg-border-custom/50 text-foreground font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs border border-border-custom inline-flex items-center justify-center"
          >
            Customer Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Determine normalized statuses
  const isApproved = store?.status === 'active' && store?.kyc_status === 'verified';
  const isRejected = store?.kyc_status === 'rejected' || store?.status === 'rejected';
  const isSuspended = store?.status === 'suspended';
  const isPending = !isApproved && !isRejected && !isSuspended;

  return (
    <div className="min-h-[75vh] py-10 px-4 max-w-3xl mx-auto space-y-8">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Vendor Moderation</span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Seller Application Status</h1>
        </div>
        <button
          onClick={fetchStatus}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-border-custom bg-background-secondary hover:bg-border-custom/40 text-foreground transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          {isRefreshing ? 'Updating...' : 'Refresh Status'}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-3">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Status Hero Card */}
      <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Status Header Badge & Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-custom font-semibold">Store Application</span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">{store?.store_name}</h2>
            <p className="text-xs text-muted-custom">{store?.store_email || user?.email}</p>
          </div>

          <div>
            {isApproved && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 size={14} /> Approved & Active
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Clock size={14} /> Pending Admin Approval
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                <XCircle size={14} /> Application Not Approved
              </span>
            )}
            {isSuspended && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                <AlertCircle size={14} /> Store Suspended
              </span>
            )}
          </div>
        </div>

        {/* Timeline / Progress Milestones */}
        <div className="pt-2 pb-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-muted-custom mb-4">Application Progress</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Step 1: Submission */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-[11px] font-black uppercase tracking-wider">Step 1</span>
                <CheckCircle2 size={16} />
              </div>
              <div className="text-xs font-bold text-foreground">Application Submitted</div>
              <div className="text-[11px] text-muted-custom">Details & KYC received</div>
            </div>

            {/* Step 2: KYC & Compliance */}
            <div
              className={`p-4 rounded-2xl border space-y-1.5 ${
                isApproved
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : isRejected
                  ? 'bg-rose-500/5 border-rose-500/20'
                  : 'bg-amber-500/5 border-amber-500/20'
              }`}
            >
              <div
                className={`flex items-center justify-between ${
                  isApproved ? 'text-emerald-600' : isRejected ? 'text-rose-600' : 'text-amber-600'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">Step 2</span>
                {isApproved ? <CheckCircle2 size={16} /> : isRejected ? <XCircle size={16} /> : <Clock size={16} />}
              </div>
              <div className="text-xs font-bold text-foreground">KYC Verification</div>
              <div className="text-[11px] text-muted-custom">
                {isApproved ? 'Documents verified' : isRejected ? 'Verification declined' : 'Admin review in progress'}
              </div>
            </div>

            {/* Step 3: Activation */}
            <div
              className={`p-4 rounded-2xl border space-y-1.5 ${
                isApproved
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : isSuspended
                  ? 'bg-orange-500/5 border-orange-500/20'
                  : 'bg-background-secondary border-border-custom opacity-75'
              }`}
            >
              <div
                className={`flex items-center justify-between ${
                  isApproved ? 'text-emerald-600' : isSuspended ? 'text-orange-600' : 'text-muted-custom'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">Step 3</span>
                {isApproved ? <CheckCircle2 size={16} /> : isSuspended ? <AlertCircle size={16} /> : <Clock size={16} />}
              </div>
              <div className="text-xs font-bold text-foreground">Portal Activation</div>
              <div className="text-[11px] text-muted-custom">
                {isApproved ? 'Dashboard unlocked' : isSuspended ? 'Access suspended' : 'Pending KYC approval'}
              </div>
            </div>
          </div>
        </div>

        {/* State-Specific Guidance Box */}
        {isPending && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300">
              <Clock size={16} /> Under Super Admin Review
            </div>
            <p className="leading-relaxed">
              Your application has been received and is queued for verification by the marketplace administrative team. Reviews typically complete within <strong>24 to 48 business hours</strong>.
            </p>
            <p className="leading-relaxed text-[11px] text-amber-800/80 dark:text-amber-300/80">
              Full access to the Vendor Dashboard, product catalog management, and payout wallet will be activated immediately once approved.
            </p>
          </div>
        )}

        {isApproved && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={16} /> Congratulations! Your Store is Approved
            </div>
            <p className="leading-relaxed">
              Your seller application has been approved by the platform administration. You now have full access to the Vendor Portal.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-rose-800 dark:text-rose-300">
              <XCircle size={16} /> Application Review Notice
            </div>
            <p className="leading-relaxed">
              Your seller store application was not approved. This usually occurs if submitted KYC documents (GSTIN certificate, PAN card, or bank passbook) are unclear or invalid.
            </p>
            <p className="leading-relaxed text-[11px]">
              Please contact Customer Care at <strong className="font-mono">9996669884</strong> or submit updated documents to reapply.
            </p>
          </div>
        )}

        {isSuspended && (
          <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-900 dark:text-orange-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-orange-800 dark:text-orange-300">
              <AlertCircle size={16} /> Store Account Suspended
            </div>
            <p className="leading-relaxed">
              Your seller account has been temporarily suspended by platform administration. Please contact support to resolve outstanding issues.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {isApproved ? (
            <Link
              href="/vendor"
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              Open Vendor Dashboard <ArrowRight size={14} />
            </Link>
          ) : isRejected ? (
            <Link
              href="/seller/register"
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              Re-Apply / Update Details <ArrowRight size={14} />
            </Link>
          ) : null}

          <Link
            href="/account"
            className="px-6 py-3.5 bg-background-secondary hover:bg-border-custom/50 text-foreground font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs border border-border-custom inline-flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> Customer Dashboard
          </Link>
        </div>
      </div>

      {/* Support / Help Card */}
      <div className="bg-background-secondary border border-border-custom rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Phone size={15} className="text-primary" /> Need Assistance with your Application?
          </h3>
          <p className="text-xs text-muted-custom">
            Our onboarding team is ready to assist you Monday through Saturday, 9 AM – 7 PM.
          </p>
        </div>
        <a
          href="tel:9996669884"
          className="px-4 py-2.5 bg-card hover:bg-border-custom/40 border border-border-custom rounded-xl text-xs font-black text-primary transition-all whitespace-nowrap inline-flex items-center gap-2 shadow-xs"
        >
          <Phone size={13} /> Call 9996669884
        </a>
      </div>
    </div>
  );
}
