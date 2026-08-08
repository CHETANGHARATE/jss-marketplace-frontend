'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Receipt, Plus, Building2, Save } from 'lucide-react';

export default function AdminTaxPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tax & GST Configuration Engine"
        subtitle="Manage company GSTIN, CGST, SGST, IGST tax rules, HSN/SAC codes, and invoice formatting for state-wise compliance."
        badge="Finance & Tax"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tax & GST' }]}
        actions={
          <button className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs">
            <Save size={16} />
            <span>Save Tax Settings</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-foreground flex items-center gap-2 pb-3 border-b border-border-custom/60">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Company GSTIN & Registered Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-muted-custom">Company Legal Name</label>
              <input
                type="text"
                defaultValue="JSS Solutions Private Limited"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-muted-custom">Company GSTIN Number</label>
              <input
                type="text"
                defaultValue="27AAAAA0000A1Z5"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold rounded-xl uppercase"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-muted-custom">Registered Billing Address</label>
              <textarea
                rows={2}
                defaultValue="Plot No. 12, Industrial Area, Andheri East, Mumbai, Maharashtra - 400069"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-foreground flex items-center gap-2 pb-3 border-b border-border-custom/60">
            <Receipt className="w-5 h-5 text-emerald-500" />
            <span>Standard GST Slabs</span>
          </h3>

          <div className="space-y-2 text-xs">
            {[0, 5, 12, 18, 28].map((rate) => (
              <div key={rate} className="flex items-center justify-between p-3 bg-background-secondary rounded-2xl border border-border-custom/80">
                <span className="font-bold text-foreground">GST Rate Slabs</span>
                <span className="font-black text-primary">{rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
