'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  useAdminFlashSalesQuery,
  useCreateFlashSaleMutation,
  useToggleFlashSaleStatusMutation,
  useDeleteFlashSaleMutation
} from '@/hooks/useAdmin';
import { Percent, Plus, Calendar, Clock, Sparkles, Trash2, CheckCircle2, XCircle, Tag, Zap } from 'lucide-react';

export default function AdminFlashSalesPage() {
  const { data: flashSales = [], isLoading } = useAdminFlashSalesQuery();
  const createFlashSale = useCreateFlashSaleMutation();
  const toggleStatus = useToggleFlashSaleStatusMutation();
  const deleteFlashSale = useDeleteFlashSaleMutation();

  const [title, setTitle] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(20);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Please enter a valid flash sale title.');
      return;
    }
    if (!startTime || !endTime) {
      setValidationError('Please specify both start and end times.');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setValidationError('End time must be after the start time.');
      return;
    }

    try {
      await createFlashSale.mutateAsync({
        title: title.trim(),
        name: title.trim(),
        starts_at: new Date(startTime).toISOString(),
        ends_at: new Date(endTime).toISOString(),
        discount_percentage: Number(discountPercentage),
        is_active: true,
        products: [],
      } as any);

      setIsModalOpen(false);
      setTitle('');
      setStartTime('');
      setEndTime('');
      setDiscountPercentage(20);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create flash sale event.';
      setValidationError(msg);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleStatus.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to toggle flash sale status.');
    }
  };

  const handleDelete = async (id: number, saleTitle: string) => {
    if (!confirm(`Are you sure you want to delete flash sale '${saleTitle}'?`)) return;
    try {
      await deleteFlashSale.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete flash sale.');
    }
  };

  const getStatusBadge = (sale: any) => {
    const now = new Date();
    const start = new Date(sale.starts_at);
    const end = new Date(sale.ends_at);

    if (!sale.is_active) {
      return { label: 'Inactive', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    }
    if (now < start) {
      return { label: 'Scheduled', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    }
    if (now > end) {
      return { label: 'Expired', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    }
    return { label: 'Active Now', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Flash Sales & Limited Time Events"
        subtitle="Schedule hourly or daily flash sales with countdown timers, maximum discount caps, and product campaign highlights."
        badge="Flash Sales"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Flash Sales' }]}
        actions={
          <button
            type="button"
            onClick={() => {
              setValidationError(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Flash Sale Event</span>
          </button>
        }
      />

      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-rose-500 animate-spin" />
          <span>Loading flash sale campaigns...</span>
        </div>
      ) : flashSales.length === 0 ? (
        <div className="bg-card border border-border-custom/80 rounded-3xl p-10 text-center space-y-3">
          <Percent className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Flash Sales Configured</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            Schedule hourly or weekend flash sales to drive immediate promotional purchases.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashSales.map((sale: any) => {
            const status = getStatusBadge(sale);
            return (
              <div
                key={sale.id}
                className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold text-sm flex items-center gap-1">
                      <Zap size={14} />
                      <span>{sale.discount_percentage}% OFF</span>
                    </span>
                  </div>

                  <h4 className="font-black text-base text-foreground truncate">{sale.title || sale.name}</h4>

                  <div className="space-y-1 text-xs text-muted-custom pt-2 border-t border-border-custom/60">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar size={13} className="shrink-0" />
                      <span>
                        Start: {new Date(sale.starts_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={13} className="shrink-0" />
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
                    title="Delete Flash Sale"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Flash Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreate}
            className="bg-card border border-border-custom rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">Schedule Flash Sale Event</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-custom hover:text-foreground text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-bold">
                {validationError}
              </div>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2-Hour Midnight Flash Sale"
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
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Start Time *</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">End Time *</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
                disabled={createFlashSale.isPending}
                className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {createFlashSale.isPending ? 'Saving...' : 'Save Flash Sale'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
