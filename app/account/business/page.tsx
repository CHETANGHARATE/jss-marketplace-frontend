'use client';

import React, { useEffect, useState } from 'react';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, BusinessAccount } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  Building2,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Percent,
  CreditCard,
  Truck,
  ArrowRight,
} from 'lucide-react';

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited',
  'Public Limited',
  'MSME',
  'Trust',
  'Society',
  'Other',
];

export default function BusinessAccountPage() {
  const [account, setAccount] = useState<BusinessAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[3]);
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [registeredAddress, setRegisteredAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [annualTurnover, setAnnualTurnover] = useState('₹50 Lakhs - ₹1 Crore');

  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    b2bService
      .getBusinessAccount()
      .then((res) => {
        if (res.data) {
          setAccount(res.data);
          setLegalName(res.data.legal_business_name || '');
          setTradeName(res.data.trade_name || '');
          setBusinessType(res.data.business_type || BUSINESS_TYPES[3]);
          setGstin(res.data.gstin || '');
          setPan(res.data.pan || '');
          setRegisteredAddress(res.data.registered_address || '');
          setCity(res.data.city || '');
          setState(res.data.state || '');
          setPincode(res.data.pincode || '');
          setContactPerson(res.data.contact_person || '');
          setBusinessEmail(res.data.business_email || '');
          setBusinessPhone(res.data.business_phone || '');
          setWebsite(res.data.website || '');
          setAnnualTurnover(res.data.annual_turnover || '₹50 Lakhs - ₹1 Crore');
        }
      })
      .catch((err) => console.error('Failed to load business profile', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: Partial<BusinessAccount> = {
        legal_business_name: legalName,
        trade_name: tradeName,
        business_type: businessType,
        gstin: gstin.toUpperCase(),
        pan: pan.toUpperCase(),
        registered_address: registeredAddress,
        city,
        state,
        pincode,
        contact_person: contactPerson,
        business_email: businessEmail,
        business_phone: businessPhone,
        website,
        annual_turnover: annualTurnover,
        documents: {
          gst_certificate: 'https://jsssolutions.in/docs/sample_gst.pdf',
          pan_card: 'https://jsssolutions.in/docs/sample_pan.pdf',
        },
      };

      const updated = await b2bService.saveBusinessAccount(payload);
      setAccount(updated);
      success('Your business verification application has been submitted for review!', 'Application Submitted');
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Failed to submit application. Please check your inputs.', 'Submission Error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBanner = () => {
    if (!account) return null;

    switch (account.status) {
      case 'verified':
        return (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Verified Business Buyer</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Your business account is verified. You have instant access to wholesale tier pricing, RFQs, and commercial credit.
              </p>
            </div>
          </div>
        );
      case 'under_review':
      case 'submitted':
        return (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3.5 text-amber-700 dark:text-amber-400">
            <Clock className="w-6 h-6 shrink-0 animate-pulse" />
            <div>
              <h4 className="font-bold text-sm">Application Under Review</h4>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                Our KYC compliance team is verifying your GSTIN and business credentials. Review is typically completed within 24-48 hours.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3.5 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Application Not Approved</h4>
              <p className="text-xs text-red-600 dark:text-red-500">
                Reason: {account.rejection_reason || 'Document verification could not be completed.'} Please update your details and resubmit.
              </p>
            </div>
          </div>
        );
      case 'changes_required':
        return (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-3.5 text-blue-700 dark:text-blue-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Changes Required</h4>
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Action needed: {account.rejection_reason || 'Please re-verify your GSTIN or business address.'}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'JSS Business Account' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl border border-slate-700 shadow-md space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[11px] font-extrabold rounded-full uppercase tracking-wider">
                <Building2 size={13} />
                <span>JSS Business Engine</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold rounded-full">
                <ShieldCheck size={13} />
                <span>B2B Commercial Suite</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {account?.status === 'verified' ? 'Your Business Buyer Account' : 'Become a Verified Business Buyer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unlock direct manufacturer pricing, automated volume tiers, custom RFQ bidding, Purchase Orders, and JSS Trade Pay-Later credit limits.
            </p>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <Percent className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold block">Tier Pricing</span>
                <span className="text-[10px] text-slate-400 block">Up to 40% bulk discount</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold block">GST Invoicing</span>
                <span className="text-[10px] text-slate-400 block">Claim 100% input credit</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold block">Trade Credit</span>
                <span className="text-[10px] text-slate-400 block">Net-30 pay-later limits</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <Truck className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold block">Direct RFQ</span>
                <span className="text-[10px] text-slate-400 block">Multi-supplier bidding</span>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {getStatusBanner()}

          {/* Application / Edit Form */}
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h2 className="text-lg font-extrabold text-foreground">Business & Tax Details</h2>
              <p className="text-xs text-muted-foreground">
                Enter your registered commercial entity information for verification.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Legal Business Name *</label>
                  <input
                    type="text"
                    required
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Acme Industrial Technologies Pvt Ltd"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Trade / Brand Name (Optional)</label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    placeholder="e.g. Acme Tools"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Business Entity Type *</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  >
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">GSTIN (15-Digit GST Number) *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Company PAN *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Annual Turnover Range</label>
                  <select
                    value={annualTurnover}
                    onChange={(e) => setAnnualTurnover(e.target.value)}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Under ₹25 Lakhs">Under ₹25 Lakhs</option>
                    <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                    <option value="₹1 Crore - ₹5 Crores">₹1 Crore - ₹5 Crores</option>
                    <option value="₹5 Crores+">₹5 Crores+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Registered Business Address *</label>
                <textarea
                  rows={2}
                  required
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  placeholder="Plot/Shop No., Industrial Area, Street, Landmark..."
                  className="w-full bg-background border border-border p-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 400001"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="border-t border-border/40 pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Authorized Representative Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-foreground/80 block">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-foreground/80 block">Official Business Email *</label>
                    <input
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="e.g. procurement@acme.com"
                      className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-foreground/80 block">Business Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      placeholder="e.g. 9820012345"
                      className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{account ? 'Update Business Application' : 'Submit Application for KYC'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
