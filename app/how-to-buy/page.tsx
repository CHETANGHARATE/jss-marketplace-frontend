import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Search,
  CheckCircle2,
  ShoppingCart,
  CreditCard,
  Truck,
  PackageCheck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Buy | JSS Marketplace',
  description: 'Step-by-step guide to finding products, placing orders, making secure payments, and tracking deliveries on JSS Marketplace.',
};

export default function HowToBuyPage() {
  const steps = [
    {
      num: '01',
      title: 'Browse or Search Products',
      desc: 'Use the top search bar or category mega-menu to explore thousands of products across juices, kitchenware, pooja items, fashion, and agriculture.',
      icon: Search
    },
    {
      num: '02',
      title: 'Review Product & Seller Details',
      desc: 'Check specifications, customer reviews, seller ratings, and pricing. Select your desired quantity or product variant.',
      icon: CheckCircle2
    },
    {
      num: '03',
      title: 'Add to Cart or Buy Now',
      desc: 'Click "Add to Cart" to continue shopping or "Buy Now" to proceed directly to checkout.',
      icon: ShoppingCart
    },
    {
      num: '04',
      title: 'Enter Delivery Address & Select Payment',
      desc: 'Provide your shipping address and choose your preferred payment option: UPI, Paytm, Visa/Mastercard, or Net Banking.',
      icon: CreditCard
    },
    {
      num: '05',
      title: 'Confirm Order & Receive Tracking ID',
      desc: 'Once your order is placed, you will receive an instant confirmation and tracking number to monitor your shipment.',
      icon: Truck
    },
    {
      num: '06',
      title: 'Doorstep Delivery & Easy Returns',
      desc: 'Receive your item safely at your doorstep. If you need any assistance, our 7-day return policy is available.',
      icon: PackageCheck
    }
  ];

  return (
    <FooterPageLayout
      title="How to Buy on JSS Marketplace"
      subtitle="A simple 6-step visual guide to shopping safely and securely."
      categoryName="Customer Guide"
    >
      <div className="space-y-12">

        {/* 6 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="bg-card border border-border-custom p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-primary/40 transition-all">
                <span className="text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors absolute right-4 top-4">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <IconComponent size={20} />
                </div>
                <h3 className="font-extrabold text-base text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-custom leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Buyer Protection Banner */}
        <section className="bg-card border border-border-custom p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-sm uppercase">
            <ShieldCheck size={18} />
            <span>JSS Buyer Protection</span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground">Shop With Complete Confidence</h3>
          <p className="text-xs text-muted-custom leading-relaxed max-w-2xl">
            Every transaction on JSS Marketplace is protected by encrypted SSL payments, verified primary sellers, and clear return guidelines. If your item does not arrive or matches an incorrect description, our customer desk is ready to resolve your request promptly.
          </p>
        </section>

        {/* CTA Button */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md"
          >
            <span>Start Shopping Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </FooterPageLayout>
  );
}
