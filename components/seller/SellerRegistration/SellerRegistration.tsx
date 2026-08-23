'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Store,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Headphones,
  Users,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/Toast';
import { getCategories } from '../../../services/category';
import { vendorService } from '../../../services/vendorService';
import { Category } from '../../../types';

import { Stepper } from './Stepper';
import { Step1BasicInfo, Step1Data } from './Step1BasicInfo';
import { Step2BusinessDetails, Step2Data } from './Step2BusinessDetails';
import { Step3BankDetails, Step3Data } from './Step3BankDetails';
import { Step4Documents, Step4Data } from './Step4Documents';
import { Step5Verification } from './Step5Verification';

export const SellerRegistration: React.FC = () => {
  const { isAuthenticated, user, setAuthSession } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 5-step in-memory temporary form state (resets on refresh/navigation/logout)
  const [step1, setStep1] = useState<Step1Data>({
    fullName: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    panNumber: '',
    dob: '',
    gender: 'male',
    address: '',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400001',
  });

  const [step2, setStep2] = useState<Step2Data>({
    storeName: '',
    businessType: 'Individual / Proprietorship',
    primaryCategory: '',
    gstin: '',
    businessAddress: '',
    businessState: 'Maharashtra',
    businessCity: 'Mumbai',
    businessPincode: '400001',
    description: '',
  });

  const [step3, setStep3] = useState<Step3Data>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
  });

  const [step4, setStep4] = useState<Step4Data>({
    panCardDoc: '',
    idProofDoc: '',
    addressProofDoc: '',
    bankProofDoc: '',
  });

  // Centralized form reset function
  const resetSellerRegistrationForm = () => {
    setCurrentStep(1);
    setSubmitted(false);
    setErrorMsg('');
    setStep1({
      fullName: user?.name || '',
      mobile: user?.phone || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      panNumber: '',
      dob: '',
      gender: 'male',
      address: '',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
    });
    setStep2({
      storeName: '',
      businessType: 'Individual / Proprietorship',
      primaryCategory: categories.length > 0 ? categories[0].name : '',
      gstin: '',
      businessAddress: '',
      businessState: 'Maharashtra',
      businessCity: 'Mumbai',
      businessPincode: '400001',
      description: '',
    });
    setStep3({
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountType: 'savings',
    });
    setStep4({
      panCardDoc: '',
      idProofDoc: '',
      addressProofDoc: '',
      bankProofDoc: '',
    });
  };

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      setStep1((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        mobile: prev.mobile || user.phone || '',
      }));
    }
  }, [user]);

  // Load categories and ensure no legacy unsaved drafts persist
  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !step2.primaryCategory) {
        setStep2((prev) => ({ ...prev, primaryCategory: cats[0].name }));
      }
    });

    // Explicitly wipe any legacy drafts from browser storage
    try {
      localStorage.removeItem('jss_seller_registration_draft_v2');
      localStorage.removeItem('jss_seller_registration_draft');
      sessionStorage.removeItem('jss_seller_registration_draft_v2');
      sessionStorage.removeItem('jss_seller_registration_draft');
    } catch (e) {}
  }, []);

  // Listen for logout event to immediately reset form state
  useEffect(() => {
    const handleLogout = () => {
      resetSellerRegistrationForm();
    };
    window.addEventListener('jss-logout', handleLogout);
    return () => window.removeEventListener('jss-logout', handleLogout);
  }, []);

  const handleFinalSubmission = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      owner_name: step1.fullName,
      password: step1.password,
      store_name: step2.storeName,
      store_email: step1.email,
      store_phone: step1.mobile,
      description: step2.description || `Category: ${step2.primaryCategory} | Business: ${step2.businessType}`,
      address: step2.businessAddress || step1.address,
      city: step2.businessCity || step1.city,
      state: step2.businessState || step1.state,
      pincode: step2.businessPincode || step1.pincode,
      kyc_documents: {
        pan_number: step1.panNumber,
        dob: step1.dob,
        gender: step1.gender,
        personal_address: {
          address: step1.address,
          state: step1.state,
          city: step1.city,
          pincode: step1.pincode,
        },
        business_details: {
          business_type: step2.businessType,
          primary_category: step2.primaryCategory,
          gstin: step2.gstin || null,
        },
        bank_details: {
          account_holder_name: step3.accountHolderName,
          bank_name: step3.bankName,
          account_number: step3.accountNumber,
          ifsc_code: step3.ifscCode,
          account_type: step3.accountType,
        },
        documents: {
          pan_card: step4.panCardDoc || null,
          id_proof: step4.idProofDoc || null,
          address_proof: step4.addressProofDoc || null,
          bank_proof: step4.bankProofDoc || null,
        },
      },
    };

    try {
      const response: any = await vendorService.registerVendorStore(payload);

      // If response includes token (guest registration), authenticate automatically!
      if (response?.access_token && response?.user) {
        await setAuthSession(response.user, response.access_token);
      }

      setSubmitted(true);
      toastSuccess('Vendor store application submitted into system for admin verification!', 'Application Submitted');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit seller application.';
      setErrorMsg(msg);
      toastError(msg, 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto bg-card border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-lg my-8">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Application Submitted & Pending Approval!</h2>
        <p className="text-sm text-muted-custom leading-relaxed font-medium">
          Thank you <strong>{step1.fullName}</strong>! Your seller store application for <strong>{step2.storeName}</strong> has been received into our system with status <span className="font-bold text-amber-600 uppercase">Pending KYC Approval</span>.
        </p>

        <div className="p-4 bg-background-secondary rounded-2xl border border-border-custom text-left space-y-2 text-xs font-semibold text-foreground/80">
          <div className="flex justify-between">
            <span className="text-muted-custom">Store Name:</span>
            <span className="font-black text-foreground">{step2.storeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-custom">Owner Email:</span>
            <span className="font-bold">{step1.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-custom">Primary Category:</span>
            <span className="font-bold">{step2.primaryCategory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-custom">KYC Documents:</span>
            <span className="font-extrabold text-emerald-600">4 / 4 Uploaded</span>
          </div>
        </div>

        <p className="text-xs text-muted-custom font-medium">
          Our Admin Moderation Team will review your application and document scan copies in the Admin Control Panel. You will receive an update at <strong>{step1.email}</strong> once your store is activated.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <a
            href="/vendor/dashboard"
            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Go to Seller Dashboard
          </a>
        </div>
      </div>
    );
  }

  const leftPerks = [
    {
      icon: Users,
      title: 'Reach Millions of Customers',
      subtitle: 'Expand your reach across India.',
      bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure Transactions',
      subtitle: 'Safe & secure payments for you.',
      bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      subtitle: 'Powerful tools to increase your sales.',
      bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      icon: Headphones,
      title: '24/7 Seller Support',
      subtitle: "We're here to help you anytime.",
      bgColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div id="seller-registration-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-6">
      {/* Left Sidebar matching Reference Image 2 */}
      <div className="lg:col-span-4 bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase">
            <Store size={14} />
            <span>Seller Onboarding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Become a <span className="text-primary block">Trusted Seller</span>
          </h2>
          <p className="text-xs text-muted-custom font-medium leading-relaxed">
            Join thousands of successful sellers and grow your business with JSS Marketplace across India.
          </p>
        </div>

        {/* 4 Feature Badges matching Reference Image 2 */}
        <div className="space-y-3">
          {leftPerks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-background-secondary/60 border border-border-custom/60 rounded-2xl">
                <div className={`w-10 h-10 rounded-xl ${perk.bgColor} flex items-center justify-center shrink-0 border border-current/10 font-bold`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">{perk.title}</h4>
                  <p className="text-[11px] font-medium text-muted-custom">{perk.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Graphic / Trust Banner */}
        <div className="relative p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl space-y-2 overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <ShoppingBag className="w-8 h-8 text-white/90" />
          <h4 className="font-black text-sm">Start Selling in Minutes</h4>
          <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
            Complete your 5-step registration now to activate your seller catalog and receive orders nationwide.
          </p>
        </div>
      </div>

      {/* Right Column: Multi-Step Registration Form matching Reference Image 2 */}
      <div className="lg:col-span-8 bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Seller Registration</h2>
          <p className="text-xs text-muted-custom font-medium mt-1">
            Fill in the details to get started with your selling journey
          </p>
        </div>

        {/* 5-Step Stepper */}
        <Stepper currentStep={currentStep} onStepClick={(st) => setCurrentStep(st)} />

        {/* Step Views */}
        <div className="pt-2">
          {currentStep === 1 && (
            <Step1BasicInfo
              data={step1}
              onChange={(d) => setStep1((prev) => ({ ...prev, ...d }))}
              onNext={() => setCurrentStep(2)}
              isLoggedIn={isAuthenticated}
            />
          )}

          {currentStep === 2 && (
            <Step2BusinessDetails
              data={step2}
              categories={categories}
              onChange={(d) => setStep2((prev) => ({ ...prev, ...d }))}
              onNext={() => setCurrentStep(3)}
              onPrev={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3BankDetails
              data={step3}
              onChange={(d) => setStep3((prev) => ({ ...prev, ...d }))}
              onNext={() => setCurrentStep(4)}
              onPrev={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Documents
              data={step4}
              onChange={(d) => setStep4((prev) => ({ ...prev, ...d }))}
              onNext={() => setCurrentStep(5)}
              onPrev={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <Step5Verification
              step1={step1}
              step2={step2}
              step3={step3}
              step4={step4}
              onEditStep={(st) => setCurrentStep(st)}
              onPrev={() => setCurrentStep(4)}
              onSubmit={handleFinalSubmission}
              isSubmitting={isSubmitting}
              errorMsg={errorMsg}
            />
          )}
        </div>
      </div>
    </div>
  );
};
