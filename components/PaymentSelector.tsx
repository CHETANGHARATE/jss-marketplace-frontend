'use client';

import React from 'react';
import { CreditCard, ShieldCheck, Building2, Zap } from 'lucide-react';

export interface PaymentProvider {
  id: 'razorpay' | 'stripe' | 'cod' | 'bank_transfer';
  name: string;
  description: string;
  tag?: string;
  icon: any;
}

const PROVIDERS: PaymentProvider[] = [
  {
    id: 'razorpay',
    name: 'Razorpay Gateway',
    description: 'UPI, Credit/Debit Cards, Netbanking & Wallets',
    tag: 'Recommended',
    icon: CreditCard,
  },
  {
    id: 'stripe',
    name: 'Stripe International',
    description: 'Global Cards & Multi-Currency Payments',
    icon: Zap,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay cash or UPI upon receiving delivery',
    icon: ShieldCheck,
  },
  {
    id: 'bank_transfer',
    name: 'Direct Bank Transfer',
    description: 'Offline NEFT / RTGS payment',
    icon: Building2,
  },
];

interface PaymentSelectorProps {
  selectedProvider: 'razorpay' | 'stripe' | 'cod' | 'bank_transfer';
  onSelect: (providerId: 'razorpay' | 'stripe' | 'cod' | 'bank_transfer') => void;
}

export function PaymentSelector({ selectedProvider, onSelect }: PaymentSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PROVIDERS.map((provider) => {
        const Icon = provider.icon;
        const isSelected = selectedProvider === provider.id;

        return (
          <div
            key={provider.id}
            onClick={() => onSelect(provider.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 ${
              isSelected
                ? 'bg-primary/5 border-primary shadow-md ring-2 ring-primary/20'
                : 'bg-card border-border/40 hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-foreground/50'}`} />
              {provider.tag && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {provider.tag}
                </span>
              )}
            </div>

            <span className="font-bold text-sm text-foreground block">{provider.name}</span>
            <span className="text-xs text-foreground/60 leading-tight block">{provider.description}</span>
          </div>
        );
      })}
    </div>
  );
}
