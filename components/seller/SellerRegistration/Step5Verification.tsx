'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  User,
  Building2,
  CreditCard,
  FileCheck,
  Edit2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Step1Data } from './Step1BasicInfo';
import { Step2Data } from './Step2BusinessDetails';
import { Step3Data } from './Step3BankDetails';
import { Step4Data } from './Step4Documents';

interface Step5Props {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  onEditStep: (step: number) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMsg?: string;
}

export const Step5Verification: React.FC<Step5Props> = ({
  step1,
  step2,
  step3,
  step4,
  onEditStep,
  onPrev,
  onSubmit,
  isSubmitting,
  errorMsg,
}) => {
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [termsError, setTermsError] = useState('');

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setTermsError('You must agree to the Seller Terms & Marketplace Policies.');
      return;
    }
    setTermsError('');
    onSubmit();
  };

  const maskAccount = (acc: string) => {
    if (!acc || acc.length < 4) return '••••';
    return '•••• •••• ' + acc.slice(-4);
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-foreground">Verification & Application Review</h3>
        <p className="text-xs text-muted-custom font-medium">
          Please verify your submitted details before final submission to the Admin Control Panel
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 rounded-2xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Step 1 Summary: Basic Info */}
        <div className="bg-card border border-border-custom/80 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border-custom">
            <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-primary" />
              <span>1. Basic Information</span>
            </h4>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
            >
              <Edit2 size={13} />
              <span>Edit Step 1</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-custom font-medium block">Full Name:</span>
              <span className="font-extrabold text-foreground">{step1.fullName}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Mobile:</span>
              <span className="font-bold font-mono text-foreground">+91 {step1.mobile}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Email:</span>
              <span className="font-bold text-foreground truncate">{step1.email}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">PAN Number:</span>
              <span className="font-mono font-extrabold text-foreground uppercase">{step1.panNumber}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Gender:</span>
              <span className="font-bold text-foreground capitalize">{step1.gender}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">City / State:</span>
              <span className="font-bold text-foreground">
                {step1.city}, {step1.state} - {step1.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 Summary: Business Details */}
        <div className="bg-card border border-border-custom/80 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border-custom">
            <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-emerald-500" />
              <span>2. Business Details</span>
            </h4>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
            >
              <Edit2 size={13} />
              <span>Edit Step 2</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-custom font-medium block">Store Name:</span>
              <span className="font-extrabold text-foreground">{step2.storeName}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Business Type:</span>
              <span className="font-bold text-foreground">{step2.businessType}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Category:</span>
              <span className="font-bold text-foreground">{step2.primaryCategory}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">GSTIN:</span>
              <span className="font-mono font-extrabold text-foreground uppercase">{step2.gstin || 'Not Provided (Exempt)'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-custom font-medium block">Operating Address:</span>
              <span className="font-bold text-foreground">
                {step2.businessAddress}, {step2.businessCity}, {step2.businessState} - {step2.businessPincode}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3 Summary: Bank Details */}
        <div className="bg-card border border-border-custom/80 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border-custom">
            <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} className="text-indigo-500" />
              <span>3. Bank Details</span>
            </h4>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
            >
              <Edit2 size={13} />
              <span>Edit Step 3</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-custom font-medium block">Account Holder:</span>
              <span className="font-bold text-foreground">{step3.accountHolderName}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Bank Name:</span>
              <span className="font-bold text-foreground">{step3.bankName}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Account Number:</span>
              <span className="font-mono font-bold text-foreground">{maskAccount(step3.accountNumber)}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">IFSC Code:</span>
              <span className="font-mono font-extrabold text-foreground uppercase">{step3.ifscCode}</span>
            </div>
            <div>
              <span className="text-muted-custom font-medium block">Account Type:</span>
              <span className="font-bold text-foreground capitalize">{step3.accountType} Account</span>
            </div>
          </div>
        </div>

        {/* Step 4 Summary: Documents */}
        <div className="bg-card border border-border-custom/80 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border-custom">
            <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileCheck size={16} className="text-amber-500" />
              <span>4. Uploaded Documents</span>
            </h4>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
            >
              <Edit2 size={13} />
              <span>Edit Step 4</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-background-secondary rounded-xl border border-border-custom text-center">
              <span className="text-[10px] font-bold text-muted-custom block">PAN Card</span>
              <span className="font-bold text-emerald-500 text-[11px] flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 size={12} />
                <span>Uploaded</span>
              </span>
            </div>
            <div className="p-2.5 bg-background-secondary rounded-xl border border-border-custom text-center">
              <span className="text-[10px] font-bold text-muted-custom block">GST / ID Proof</span>
              <span className="font-bold text-emerald-500 text-[11px] flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 size={12} />
                <span>Uploaded</span>
              </span>
            </div>
            <div className="p-2.5 bg-background-secondary rounded-xl border border-border-custom text-center">
              <span className="text-[10px] font-bold text-muted-custom block">Address Proof</span>
              <span className="font-bold text-emerald-500 text-[11px] flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 size={12} />
                <span>Uploaded</span>
              </span>
            </div>
            <div className="p-2.5 bg-background-secondary rounded-xl border border-border-custom text-center">
              <span className="text-[10px] font-bold text-muted-custom block">Bank Proof</span>
              <span className="font-bold text-emerald-500 text-[11px] flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 size={12} />
                <span>Uploaded</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 p-4 bg-background-secondary rounded-2xl border border-border-custom cursor-pointer">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary rounded border-border-custom mt-0.5"
          />
          <div className="text-xs text-foreground font-medium leading-relaxed">
            I confirm that all provided personal, business, bank, and KYC document information is accurate and authentic. I agree to the{' '}
            <span className="font-bold text-primary hover:underline">JSS Marketplace Seller Terms & Conditions</span> and Commission Policy.
          </div>
        </label>
        {termsError && <p className="text-[11px] font-bold text-rose-500">{termsError}</p>}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border-custom">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-xs rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-9 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Sparkles size={18} className="animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Submit Seller Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
