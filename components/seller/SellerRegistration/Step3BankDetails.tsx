'use client';

import React, { useState } from 'react';
import { CreditCard, Building, ShieldCheck, ArrowLeft, ArrowRight, Lock } from 'lucide-react';

export interface Step3Data {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
}

interface Step3Props {
  data: Step3Data;
  onChange: (data: Partial<Step3Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3BankDetails: React.FC<Step3Props> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!data.accountHolderName.trim()) errs.accountHolderName = 'Account holder name is required.';
    if (!data.bankName.trim()) errs.bankName = 'Bank name is required.';
    if (!data.accountNumber.trim() || data.accountNumber.length < 8) {
      errs.accountNumber = 'Enter a valid bank account number.';
    }
    if (data.accountNumber !== data.confirmAccountNumber) {
      errs.confirmAccountNumber = 'Account numbers do not match.';
    }
    if (!data.ifscCode.trim() || data.ifscCode.length !== 11) {
      errs.ifscCode = 'Enter a valid 11-character IFSC code (e.g. SBIN0001234).';
    }
    if (!data.accountType) errs.accountType = 'Please select account type.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-foreground">Bank Details</h3>
        <p className="text-xs text-muted-custom font-medium">
          Enter your registered bank account for fast order payout settlements
        </p>
      </div>

      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <ShieldCheck size={20} className="shrink-0" />
        <span>Your banking details are encrypted and securely stored for marketplace payout transfers only.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Holder Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Account Holder Name *</label>
          <div className="relative">
            <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              value={data.accountHolderName}
              onChange={(e) => onChange({ accountHolderName: e.target.value })}
              placeholder="Name as per Bank Passbook / Statement"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.accountHolderName && <p className="text-[11px] font-bold text-rose-500">{errors.accountHolderName}</p>}
        </div>

        {/* Bank Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Bank Name *</label>
          <div className="relative">
            <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              value={data.bankName}
              onChange={(e) => onChange({ bankName: e.target.value })}
              placeholder="e.g. State Bank of India / HDFC Bank"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.bankName && <p className="text-[11px] font-bold text-rose-500">{errors.bankName}</p>}
        </div>

        {/* Account Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Bank Account Number *</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="password"
              value={data.accountNumber}
              onChange={(e) => onChange({ accountNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="Enter Account Number"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
          {errors.accountNumber && <p className="text-[11px] font-bold text-rose-500">{errors.accountNumber}</p>}
        </div>

        {/* Confirm Account Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Confirm Account Number *</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              value={data.confirmAccountNumber}
              onChange={(e) => onChange({ confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="Re-enter Account Number"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
          {errors.confirmAccountNumber && <p className="text-[11px] font-bold text-rose-500">{errors.confirmAccountNumber}</p>}
        </div>

        {/* IFSC Code */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">IFSC Code *</label>
          <input
            type="text"
            maxLength={11}
            value={data.ifscCode}
            onChange={(e) => onChange({ ifscCode: e.target.value.toUpperCase() })}
            placeholder="e.g. SBIN0001234"
            className="w-full px-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold uppercase text-foreground focus:outline-none focus:border-primary font-mono"
          />
          {errors.ifscCode && <p className="text-[11px] font-bold text-rose-500">{errors.ifscCode}</p>}
        </div>

        {/* Account Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Account Type *</label>
          <div className="flex items-center gap-6 py-2.5">
            {[
              { id: 'savings', label: 'Savings Account' },
              { id: 'current', label: 'Current Account' },
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                <input
                  type="radio"
                  name="accountType"
                  checked={data.accountType === type.id}
                  onChange={() => onChange({ accountType: type.id as any })}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-custom"
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
          {errors.accountType && <p className="text-[11px] font-bold text-rose-500">{errors.accountType}</p>}
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border-custom">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2.5 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-xs rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Save & Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};
