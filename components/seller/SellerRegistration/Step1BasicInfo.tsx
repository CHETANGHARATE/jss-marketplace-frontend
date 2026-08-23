'use client';

import React, { useState } from 'react';
import { User, Phone, Mail, Lock, CreditCard, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';

export interface Step1Data {
  fullName: string;
  mobile: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  panNumber: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  state: string;
  city: string;
  pincode: string;
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Partial<Step1Data>) => void;
  onNext: () => void;
  isLoggedIn?: boolean;
}

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

export const Step1BasicInfo: React.FC<Step1Props> = ({ data, onChange, onNext, isLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!data.fullName.trim()) errs.fullName = 'Full Name as per ID Proof is required.';
    if (!data.mobile.trim() || data.mobile.length < 10) errs.mobile = 'Enter a valid 10-digit mobile number.';
    if (!data.email.trim() || !data.email.includes('@')) errs.email = 'Enter a valid email address.';

    if (!isLoggedIn) {
      if (!data.password || data.password.length < 6) errs.password = 'Password must be at least 6 characters.';
      if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    }

    if (!data.panNumber.trim() || data.panNumber.length !== 10) {
      errs.panNumber = 'Enter a valid 10-character PAN number (e.g. ABCDE1234F).';
    }
    if (!data.dob) errs.dob = 'Date of birth is required.';
    if (!data.address.trim()) errs.address = 'Complete address is required.';
    if (!data.state) errs.state = 'Please select your state.';
    if (!data.city.trim()) errs.city = 'City is required.';
    if (!data.pincode.trim() || data.pincode.length !== 6) errs.pincode = 'Enter a valid 6-digit Pincode.';

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
        <h3 className="text-lg font-black text-foreground">Basic Information</h3>
        <p className="text-xs text-muted-custom font-medium">Fill your personal and contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Full Name (As per ID Proof) *</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="Enter Full Name"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.fullName && <p className="text-[11px] font-bold text-rose-500">{errors.fullName}</p>}
        </div>

        {/* Mobile Number matching Reference Image 2 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Mobile Number *</label>
          <div className="flex gap-2">
            <div className="px-3 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-extrabold text-foreground flex items-center shrink-0">
              <span>+91</span>
            </div>
            <div className="relative flex-1">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
              <input
                type="tel"
                maxLength={10}
                value={data.mobile}
                onChange={(e) => onChange({ mobile: e.target.value.replace(/\D/g, '') })}
                placeholder="Enter Mobile Number"
                className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {errors.mobile && <p className="text-[11px] font-bold text-rose-500">{errors.mobile}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Email Address *</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Enter Email Address"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.email && <p className="text-[11px] font-bold text-rose-500">{errors.email}</p>}
        </div>

        {/* PAN Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">PAN Number *</label>
          <div className="relative">
            <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="text"
              maxLength={10}
              value={data.panNumber}
              onChange={(e) => onChange({ panNumber: e.target.value.toUpperCase() })}
              placeholder="Enter PAN Number (e.g. ABCDE1234F)"
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold uppercase text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.panNumber && <p className="text-[11px] font-bold text-rose-500">{errors.panNumber}</p>}
        </div>

        {/* Password Fields (if not logged in) */}
        {!isLoggedIn && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/80">Create Password *</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password || ''}
                  onChange={(e) => onChange({ password: e.target.value })}
                  placeholder="Create Password"
                  className="w-full pl-10 pr-10 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-custom hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-bold text-rose-500">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/80">Confirm Password *</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword || ''}
                  onChange={(e) => onChange({ confirmPassword: e.target.value })}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-custom hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] font-bold text-rose-500">{errors.confirmPassword}</p>}
            </div>
          </>
        )}

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Date of Birth *</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" />
            <input
              type="date"
              value={data.dob}
              onChange={(e) => onChange({ dob: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {errors.dob && <p className="text-[11px] font-bold text-rose-500">{errors.dob}</p>}
        </div>

        {/* Gender matching Reference Image 2 radio options */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Gender *</label>
          <div className="flex items-center gap-6 py-2.5">
            {[
              { id: 'male', label: 'Male' },
              { id: 'female', label: 'Female' },
              { id: 'other', label: 'Other' },
            ].map((g) => (
              <label key={g.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                <input
                  type="radio"
                  name="gender"
                  checked={data.gender === g.id}
                  onChange={() => onChange({ gender: g.id as any })}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-custom"
                />
                <span>{g.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80">Address *</label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3.5 top-3 text-muted-custom" />
          <textarea
            rows={2}
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Enter Complete Address"
            className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        {errors.address && <p className="text-[11px] font-bold text-rose-500">{errors.address}</p>}
      </div>

      {/* State, City, Pincode matching Reference Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">State *</label>
          <select
            value={data.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-[11px] font-bold text-rose-500">{errors.state}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">City *</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Select City"
            className="w-full px-3.5 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          />
          {errors.city && <p className="text-[11px] font-bold text-rose-500">{errors.city}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Pincode *</label>
          <input
            type="text"
            maxLength={6}
            value={data.pincode}
            onChange={(e) => onChange({ pincode: e.target.value.replace(/\D/g, '') })}
            placeholder="Enter Pincode"
            className="w-full px-3.5 py-2.5 bg-background-secondary border border-border-custom rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
          />
          {errors.pincode && <p className="text-[11px] font-bold text-rose-500">{errors.pincode}</p>}
        </div>
      </div>

      {/* Footer bar matching Reference Image 2 */}
      <div className="flex items-center justify-between pt-4 border-t border-border-custom">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-custom">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            ✓
          </div>
          <span>Your information is safe with us. We never share your data with anyone.</span>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Save & Continue</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
