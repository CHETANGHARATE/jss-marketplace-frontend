'use client';

import React, { useState } from 'react';
import { Building2, Store, Tag, MapPin, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Category } from '../../../types';

export interface Step2Data {
  storeName: string;
  businessType: string;
  primaryCategory: string;
  gstin?: string;
  businessAddress: string;
  businessState: string;
  businessCity: string;
  businessPincode: string;
  description?: string;
}

interface Step2Props {
  data: Step2Data;
  categories: Category[];
  onChange: (data: Partial<Step2Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BUSINESS_TYPES = [
  'Individual / Proprietorship',
  'Partnership Firm',
  'Private Limited Company (Pvt Ltd)',
  'Limited Liability Partnership (LLP)',
  'Farmers Cooperative / Guild',
  'Self-Help Group (SHG) / NGO',
];

const INDIAN_STATES = [
  'Maharashtra',
  'Gujarat',
  'Karnataka',
  'Goa',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Bihar',
  'Odisha',
  'Assam',
  'Other',
];

export const Step2BusinessDetails: React.FC<Step2Props> = ({
  data,
  categories,
  onChange,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!data.storeName.trim()) errs.storeName = 'Store or Business Name is required.';
    if (!data.businessType) errs.businessType = 'Please select a business entity type.';
    if (!data.primaryCategory) errs.primaryCategory = 'Primary selling category is required.';
    if (!data.businessAddress.trim()) errs.businessAddress = 'Business address is required.';
    if (!data.businessState) errs.businessState = 'Please select state.';
    if (!data.businessCity.trim()) errs.businessCity = 'City is required.';
    if (!data.businessPincode.trim() || data.businessPincode.length !== 6) {
      errs.businessPincode = 'Enter a valid 6-digit Pincode.';
    }

    if (data.gstin && data.gstin.trim() && data.gstin.length !== 15) {
      errs.gstin = 'GSTIN must be 15 characters (e.g. 27AAAAA0000A1Z5).';
    }

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
        <h3 className="text-lg font-black text-foreground">Business Details</h3>
        <p className="text-xs text-muted-custom font-medium">Configure your store identity, category & business address</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Store / Business Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Store / Business Name *</label>
          <div className="relative">
            <Store size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              value={data.storeName}
              onChange={(e) => onChange({ storeName: e.target.value })}
              placeholder="e.g. Sahyadri Organic Producers"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.storeName && <p className="text-[11px] font-bold text-rose-500">{errors.storeName}</p>}
        </div>

        {/* Business Entity Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Business Type *</label>
          <div className="relative">
            <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <select
              value={data.businessType}
              onChange={(e) => onChange({ businessType: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">Select Business Entity Type</option>
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>
          {errors.businessType && <p className="text-[11px] font-bold text-rose-500">{errors.businessType}</p>}
        </div>

        {/* Primary Selling Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Primary Selling Category *</label>
          <div className="relative">
            <Tag size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <select
              value={data.primaryCategory}
              onChange={(e) => onChange({ primaryCategory: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">Select Primary Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {errors.primaryCategory && <p className="text-[11px] font-bold text-rose-500">{errors.primaryCategory}</p>}
        </div>

        {/* GSTIN (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">GSTIN (Optional for small sellers)</label>
          <input
            type="text"
            maxLength={15}
            value={data.gstin || ''}
            onChange={(e) => onChange({ gstin: e.target.value.toUpperCase() })}
            placeholder="27AAAAA0000A1Z5"
            className="w-full px-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold uppercase text-foreground focus:outline-none focus:border-primary font-mono"
          />
          {errors.gstin && <p className="text-[11px] font-bold text-rose-500">{errors.gstin}</p>}
        </div>
      </div>

      {/* Business Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80">Business / Store Operating Address *</label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3.5 top-3 text-muted-custom" />
          <textarea
            rows={2}
            value={data.businessAddress}
            onChange={(e) => onChange({ businessAddress: e.target.value })}
            placeholder="Enter Complete Operating Address"
            className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        {errors.businessAddress && <p className="text-[11px] font-bold text-rose-500">{errors.businessAddress}</p>}
      </div>

      {/* State, City, Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">State *</label>
          <select
            value={data.businessState}
            onChange={(e) => onChange({ businessState: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.businessState && <p className="text-[11px] font-bold text-rose-500">{errors.businessState}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">City *</label>
          <input
            type="text"
            value={data.businessCity}
            onChange={(e) => onChange({ businessCity: e.target.value })}
            placeholder="Enter City"
            className="w-full px-3.5 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          />
          {errors.businessCity && <p className="text-[11px] font-bold text-rose-500">{errors.businessCity}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Pincode *</label>
          <input
            type="text"
            maxLength={6}
            value={data.businessPincode}
            onChange={(e) => onChange({ businessPincode: e.target.value.replace(/\D/g, '') })}
            placeholder="Enter Pincode"
            className="w-full px-3.5 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
          />
          {errors.businessPincode && <p className="text-[11px] font-bold text-rose-500">{errors.businessPincode}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80">Store Description (Optional)</label>
        <div className="relative">
          <FileText size={18} className="absolute left-3.5 top-3 text-muted-custom" />
          <textarea
            rows={2}
            value={data.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Briefly describe your store, product range, or brand history..."
            className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          />
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
