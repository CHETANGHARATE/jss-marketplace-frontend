'use client';

import React, { useState } from 'react';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  Store,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../components/Toast';

export default function ContactUsPage() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Customer Support',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Please complete all required fields (Name, Email, Message).');
      return;
    }

    setIsSubmitting(true);
    // Simulate frontend form submission handling for integration
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      success('Thank you! Your query has been logged. Our support desk will reach out to you.');
    }, 1000);
  };

  return (
    <FooterPageLayout
      title="Contact Us"
      subtitle="Have questions about an order, product, or seller onboarding? We're here to help."
      categoryName="Support"
    >
      <div className="space-y-12">

        {/* 1. Support Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Customer Support</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Assistance with orders, delivery, tracking, and product queries.
            </p>
            <div className="pt-2 text-xs font-semibold text-foreground space-y-1">
              <p className="flex items-center gap-2"><Mail size={14} className="text-primary" /> support@jssmarketplace.com</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-primary" /> 1800-123-4567 (Toll Free)</p>
            </div>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
              <Store size={20} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Seller Desk</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Vendor onboarding, product listing help, and settlement queries.
            </p>
            <div className="pt-2 text-xs font-semibold text-foreground space-y-1">
              <p className="flex items-center gap-2"><Mail size={14} className="text-emerald-500" /> seller@jssmarketplace.com</p>
              <p className="flex items-center gap-2"><Clock size={14} className="text-emerald-500" /> Mon - Sat: 9:30 AM - 6:30 PM</p>
            </div>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Corporate Office</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              JSS Solutions Ltd., Commercial Tower, Business District, Maharashtra, India.
            </p>
            <div className="pt-2 text-xs font-semibold text-foreground space-y-1">
              <p className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500" /> Mumbai / Pune Regional Offices</p>
            </div>
          </div>

        </div>

        {/* 2. Interactive Contact Form */}
        <div className="bg-card border border-border-custom p-6 sm:p-10 rounded-3xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Send Us a Message</h2>
            <p className="text-xs text-muted-custom">
              Fill out the form below and our dedicated support team will get back to you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
              <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
              <h3 className="text-lg font-extrabold text-foreground">Request Submitted Successfully</h3>
              <p className="text-xs text-muted-custom max-w-md mx-auto">
                Thank you for contacting JSS Marketplace. Your query has been logged and assigned to our support representative.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-foreground">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-foreground">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-foreground">Query Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
                  >
                    <option>Customer Support</option>
                    <option>Order & Delivery Status</option>
                    <option>Returns & Refunds</option>
                    <option>Seller Onboarding</option>
                    <option>Corporate Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-foreground">Subject</label>
                <input
                  type="text"
                  placeholder="Brief summary of your inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-foreground">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide details about your query..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-background text-foreground text-xs p-4 rounded-xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Request'}</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>

      </div>
    </FooterPageLayout>
  );
}
