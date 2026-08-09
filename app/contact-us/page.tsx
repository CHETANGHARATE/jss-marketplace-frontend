'use client';

import React, { useState } from 'react';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Mail, PhoneCall, MapPin, Send } from 'lucide-react';
import { useToast } from '../../components/Toast';

export default function ContactUsPage() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Thank you! Your message has been sent to JSS Support.');
  };

  return (
    <FooterPageLayout
      title="Contact Us & Customer Support"
      subtitle="Have a question or feedback? Our team is available 24/7."
      categoryName="Customer Service"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-card border border-border-custom p-6 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground">Toll-Free Helpline</h4>
              <p className="text-xs text-muted-custom mt-0.5">1800-JSS-MARKET (1800 577 627)</p>
              <p className="text-[11px] text-emerald-500 font-bold mt-1">Available 24/7</p>
            </div>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground">Email Support</h4>
              <p className="text-xs text-muted-custom mt-0.5">support@jsssolutions.com</p>
              <p className="text-[11px] text-muted-custom mt-1">Response time: Within 2 hours</p>
            </div>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground">Corporate Office</h4>
              <p className="text-xs text-muted-custom mt-0.5">JSS Technology Solutions, Tech Park, Mumbai, Maharashtra 400001, India.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border-custom p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-black text-foreground">Send Us a Message</h3>
          
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Your Name</label>
            <input type="text" required placeholder="Enter full name" className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Email Address</label>
            <input type="email" required placeholder="Enter email address" className="w-full bg-background text-foreground text-xs px-4 py-3 rounded-xl border border-border-custom focus:border-primary focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Message</label>
            <textarea required rows={4} placeholder="Describe your query or feedback..." className="w-full bg-background text-foreground text-xs p-4 rounded-xl border border-border-custom focus:border-primary focus:outline-none" />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-black py-3.5 rounded-xl uppercase transition-colors flex items-center justify-center gap-2">
            <Send size={16} />
            <span>Submit Message</span>
          </button>
        </form>
      </div>
    </FooterPageLayout>
  );
}
