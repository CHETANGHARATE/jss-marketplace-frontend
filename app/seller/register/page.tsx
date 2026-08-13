'use client';

import React from 'react';
import { SellerHeroBanner } from '../../../components/seller/SellerHeroBanner';
import { SellerRegistration } from '../../../components/seller/SellerRegistration/SellerRegistration';

export default function SellerRegisterPage() {
  const scrollToRegistrationForm = () => {
    const el = document.getElementById('seller-registration-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Promotional Top Banner inspired by Reference Image 1 */}
      <SellerHeroBanner onStartSellingClick={scrollToRegistrationForm} />

      {/* Multi-Step Seller Registration Form inspired by Reference Image 2 */}
      <SellerRegistration />
    </div>
  );
}
