'use client';

import React, { useState, useEffect } from 'react';
import { useAdminSettingsQuery, useUpdateAdminSettingsMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Sliders, Save, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAdminSettingsQuery();
  const updateMutation = useUpdateAdminSettingsMutation();

  const [formData, setFormData] = useState({
    marketplace_name: '',
    commission_percentage: 10,
    tax_rate: 18,
    support_email: '',
    maintenance_mode: false,
  });

  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        marketplace_name: settings.marketplace_name || '',
        commission_percentage: settings.commission_percentage || 10,
        tax_rate: settings.tax_rate || 18,
        support_email: settings.support_email || '',
        maintenance_mode: !!settings.maintenance_mode,
      });
    }
  }, [settings]);

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
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Platform Settings' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Sliders className="w-6 h-6 text-rose-500" />
              <span>Global Marketplace Settings</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Configure platform commission fees, global tax rates, and maintenance mode status.
            </p>
          </div>

          {successNotice && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Marketplace platform settings updated successfully!</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading platform configuration...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold max-w-xl">
              <div className="space-y-1.5">
                <label className="text-foreground/70">Marketplace Portal Title *</label>
                <input
                  type="text"
                  required
                  value={formData.marketplace_name}
                  onChange={(e) => setFormData({ ...formData, marketplace_name: e.target.value })}
                  placeholder="JSS Multi-Vendor Marketplace"
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/70">Global Commission (%) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={formData.commission_percentage}
                    onChange={(e) => setFormData({ ...formData, commission_percentage: Number(e.target.value) })}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/70">Default Tax / GST (%) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/70">Global Platform Support Email</label>
                <input
                  type="email"
                  value={formData.support_email}
                  onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                  placeholder="admin@jss.com"
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/40 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-foreground">Maintenance Mode</h4>
                  <p className="text-[11px] text-foreground/50">Temporarily restrict marketplace buyer access</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenance_mode}
                  onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                  className="h-5 w-5 rounded border-border/40 text-rose-500 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="py-3 px-6 bg-rose-500 text-white text-xs font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {updateMutation.isPending ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Platform Configuration</span>
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
