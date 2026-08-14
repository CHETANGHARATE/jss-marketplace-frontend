'use client';

import React, { useState } from 'react';
import {
  useAdminFlashSalesQuery,
  useCreateFlashSaleMutation,
  useToggleFlashSaleStatusMutation,
  useDeleteFlashSaleMutation
} from '../../../hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminFlashSale } from '../../../services/adminService';
import { Zap, Plus, Clock, Percent, Calendar, Trash2, Eye, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export default function PromotionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    discount_percentage: 15,
    starts_at: '',
    ends_at: '',
    is_active: true
  });

  const { data, isLoading } = useAdminFlashSalesQuery();
  const createMutation = useCreateFlashSaleMutation();
  const toggleMutation = useToggleFlashSaleStatusMutation();
  const deleteMutation = useDeleteFlashSaleMutation();

  const flashSales: AdminFlashSale[] = data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Please enter a promotion / event title.');
      return;
    }
    if (!formData.starts_at || !formData.ends_at) {
      setErrorMessage('Please specify both start and end date/time.');
      return;
    }
    if (new Date(formData.ends_at) <= new Date(formData.starts_at)) {
      setErrorMessage('End time must be after start time.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title.trim(),
        name: formData.title.trim(),
        discount_percentage: Number(formData.discount_percentage),
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: new Date(formData.ends_at).toISOString(),
        is_active: formData.is_active,
      } as any);

      setIsModalOpen(false);
      setFormData({
        title: '',
        discount_percentage: 15,
        starts_at: '',
        ends_at: '',
        is_active: true
      });
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message || error?.message || 'Failed to create promotion campaign.';
      setErrorMessage(serverMsg);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete promotion '${title}'?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete promotion.');
    }
  };

  const getStatus = (sale: any) => {
    const now = new Date();
    const start = new Date(sale.starts_at);
    const end = new Date(sale.ends_at);

    if (!sale.is_active) return { label: 'Inactive', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    if (now < start) return { label: 'Scheduled', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
    if (now > end) return { label: 'Expired', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
    return { label: 'Active Now', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promotions & Campaign Discounts"
        subtitle="Create and manage limited-time discount campaigns, festival promotional banners, and sitewide flash offers."
        badge="Promotions & Offers"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Promotions' }]}
        actions={
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Promotion</span>
          </button>
        }
      />

      {/* Info Card */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-5 flex items-start gap-4">
        <div className="p-2.5 bg-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 shrink-0">
          <Percent size={20} />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-black text-sm text-foreground">About Automated Promotions & Flash Deals</h4>
          <p className="text-muted-custom leading-relaxed">
            Active promotions automatically apply discount percentages to products during the scheduled timeframe.
            Countdown badges and offer prices are displayed across the storefront to boost buyer conversions.
          </p>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-foreground">All Configured Campaigns</h3>
          <span className="text-xs font-bold text-muted-custom">
            Total: {flashSales.length}
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-rose-500 animate-spin" />
            <span>Loading promotion records...</span>
          </div>
        ) : flashSales.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-2 border-dashed border-border-custom/80 rounded-2xl">
            <Zap className="w-10 h-10 text-muted-custom/40 mx-auto" />
            <h4 className="font-bold text-sm text-foreground">No promotions created yet</h4>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              Click &quot;Create Promotion&quot; above to launch your first promotional discount campaign.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashSales.map((sale: any) => {
              const status = getStatus(sale);
              return (
                <div
                  key={sale.id}
                  className="bg-background-secondary border border-border-custom/80 rounded-2xl p-5 space-y-4 shadow-2xs relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-black text-sm text-foreground truncate">
                        {sale.title || sale.name}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-lg">
                      <Percent size={18} />
                      <span>{sale.discount_percentage}% OFF</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-muted-custom pt-2 border-t border-border-custom/60">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={12} className="shrink-0" />
                        <span>
                          Start: {new Date(sale.starts_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={12} className="shrink-0" />
                        <span>
                          End: {new Date(sale.ends_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-custom/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggle(sale.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        sale.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500 hover:text-white'
                      }`}
                    >
                      {sale.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{sale.is_active ? 'Active' : 'Paused'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(sale.id, sale.title || sale.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreate}
            className="bg-card border border-border-custom rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">Launch Promotional Campaign</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-custom hover:text-foreground text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-bold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Event Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Independence Day Super Sale"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Discount Percentage (%) *</label>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Start Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">End Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-custom">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-background-secondary text-foreground text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Promotion'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
