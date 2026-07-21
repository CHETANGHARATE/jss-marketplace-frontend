'use client';

import React, { useState, useEffect } from 'react';
import { useVendorStoreSettingsQuery, useUpdateVendorStoreSettingsMutation } from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { Store, Save, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function VendorSettingsPage() {
  const { data: store, isLoading } = useVendorStoreSettingsQuery();
  const updateMutation = useUpdateVendorStoreSettingsMutation();

  const [formData, setFormData] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    description: '',
    logo: '',
    banner: '',
  });

  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    if (store) {
      setFormData({
        store_name: store.store_name || '',
        store_email: store.store_email || '',
        store_phone: store.store_phone || '',
        description: store.description || '',
        logo: store.logo || '',
        banner: store.banner || '',
      });
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 3000);
      },
    });
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal', href: '/vendor' }, { label: 'Storefront Settings' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Store className="w-6 h-6 text-primary" />
                <span>Storefront Profile Settings</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Customize your vendor store banner, branding, and customer contact information.
              </p>
            </div>

            {store && (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span>KYC Verified Seller</span>
              </div>
            )}
          </div>

          {successNotice && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Store settings updated successfully!</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading store profile...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold max-w-xl">
              <div className="space-y-1.5">
                <label className="text-foreground/70">Store Name *</label>
                <input
                  type="text"
                  required
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                  placeholder="e.g. Apex Electronics Official Store"
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/70">Store Support Email</label>
                  <input
                    type="email"
                    value={formData.store_email}
                    onChange={(e) => setFormData({ ...formData, store_email: e.target.value })}
                    placeholder="support@apexstore.com"
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/70">Store Support Phone</label>
                  <input
                    type="text"
                    value={formData.store_phone}
                    onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/70">Store Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/70">Store Banner Image URL</label>
                <input
                  type="text"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="https://example.com/banner.png"
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/70">Store Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of your store products, brand vision, and delivery commitments..."
                  className="w-full bg-muted/30 border border-border/40 rounded-xl p-3.5 text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="py-3 px-6 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {updateMutation.isPending ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
