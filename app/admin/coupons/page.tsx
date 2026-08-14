'use client';

import React, { useState } from 'react';
import {
  useAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useToggleCouponStatusMutation,
  useDeleteCouponMutation
} from '../../../hooks/useAdmin';
import { AdminCoupon } from '../../../services/adminService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  Ticket,
  Plus,
  Trash2,
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  X,
  Edit2,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CouponsPage() {
  const { data: coupons = [], isLoading } = useAdminCouponsQuery();
  const createCouponMutation = useCreateCouponMutation();
  const updateCouponMutation = useUpdateCouponMutation();
  const toggleCouponStatusMutation = useToggleCouponStatusMutation();
  const deleteCouponMutation = useDeleteCouponMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: 10,
    min_order_amount: 0,
    max_discount_amount: 0,
    expires_at: '',
    is_active: true
  });

  const openCreateModal = () => {
    setEditingCoupon(null);
    setValidationError(null);
    setForm({
      code: '',
      name: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 0,
      max_discount_amount: 0,
      expires_at: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: AdminCoupon) => {
    setEditingCoupon(coupon);
    setValidationError(null);
    setForm({
      code: coupon.code,
      name: coupon.name,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      min_order_amount: Number(coupon.min_order_amount || 0),
      max_discount_amount: Number(coupon.max_discount_amount || 0),
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      is_active: coupon.is_active
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanCode = form.code.trim().toUpperCase();
    if (!cleanCode) {
      setValidationError('Coupon code is required.');
      return;
    }
    if (!form.name.trim()) {
      setValidationError('Coupon campaign name is required.');
      return;
    }
    if (form.discount_type === 'percentage' && (form.discount_value <= 0 || form.discount_value > 100)) {
      setValidationError('Percentage discount must be between 1% and 100%.');
      return;
    }
    if (form.discount_type === 'fixed_amount' && form.discount_value <= 0) {
      setValidationError('Flat discount amount must be greater than ₹0.');
      return;
    }

    try {
      if (editingCoupon) {
        await updateCouponMutation.mutateAsync({
          id: editingCoupon.id,
          payload: {
            ...form,
            code: cleanCode,
            min_order_amount: Number(form.min_order_amount) || 0,
            max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : undefined,
            expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : undefined,
          }
        });
      } else {
        await createCouponMutation.mutateAsync({
          ...form,
          code: cleanCode,
          min_order_amount: Number(form.min_order_amount) || 0,
          max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : undefined,
          expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : undefined,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save coupon code.';
      setValidationError(msg);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleCouponStatusMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update coupon status.');
    }
  };

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon code '${code}'?`)) return;
    try {
      await deleteCouponMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coupon Codes & Automatic Discounts"
        subtitle="Manage promotional discount codes, flat INR and percentage discounts, cart value thresholds, and usage limits."
        badge="Promotions & Offers"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Coupons' }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Coupon Code</span>
          </button>
        }
      />

      {isLoading ? (
        <div className="py-20 text-center text-xs font-bold text-muted-custom animate-pulse flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-rose-500 animate-spin" />
          <span>Loading coupon database records...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-card border border-border-custom/80 rounded-3xl p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-foreground">No Coupon Codes Found</h3>
          <p className="text-xs text-muted-custom max-w-md mx-auto">
            Create discount coupon codes (e.g. WELCOME100, FESTIVAL20) to offer instant checkout discounts to buyers.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Create First Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((coupon: any) => {
            const isPercentage = coupon.discount_type === 'percentage';
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();

            return (
              <div
                key={coupon.id}
                className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-rose-500/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xl font-black tracking-wider text-rose-500 uppercase bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                      {coupon.code}
                    </span>
                    <div className="flex items-center gap-1">
                      {isExpired && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          Expired
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          coupon.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}
                      >
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-black text-sm text-foreground truncate">{coupon.name}</h3>

                  <div className="space-y-2 text-xs text-muted-custom pt-2 border-t border-border-custom/60">
                    <div className="flex items-center justify-between">
                      <span className="font-medium flex items-center gap-1.5">
                        <Tag size={13} className="text-primary" />
                        <span>Discount Value:</span>
                      </span>
                      <span className="font-black text-foreground font-mono">
                        {isPercentage ? (
                          `${coupon.discount_value}% OFF`
                        ) : (
                          `₹${Number(coupon.discount_value).toLocaleString('en-IN')} OFF`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium flex items-center gap-1.5">
                        <IndianRupee size={13} className="text-emerald-500" />
                        <span>Min Cart Value:</span>
                      </span>
                      <span className="font-black text-foreground font-mono">
                        {Number(coupon.min_order_amount) > 0
                          ? `₹${Number(coupon.min_order_amount).toLocaleString('en-IN')}`
                          : 'No Minimum'}
                      </span>
                    </div>

                    {coupon.max_discount_amount && isPercentage && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-1.5">
                          <Percent size={13} className="text-amber-500" />
                          <span>Max Discount Cap:</span>
                        </span>
                        <span className="font-black text-foreground font-mono">
                          ₹{Number(coupon.max_discount_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-medium flex items-center gap-1.5">
                        <Calendar size={13} className="text-muted-custom" />
                        <span>Expiry Date:</span>
                      </span>
                      <span className="font-bold text-foreground">
                        {coupon.expires_at
                          ? new Date(coupon.expires_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'No Expiry'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-custom/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        coupon.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500 hover:text-white'
                      }`}
                    >
                      {coupon.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{coupon.is_active ? 'Active' : 'Inactive'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(coupon)}
                      className="p-1.5 text-muted-custom hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors cursor-pointer"
                      title="Edit Coupon"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleFormSubmit}
            className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon Code'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-custom hover:text-foreground text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-bold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-custom">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl uppercase focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-custom">Discount Type *</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
                >
                  <option value="percentage">Percentage (% OFF)</option>
                  <option value="fixed_amount">Flat Discount (₹ INR OFF)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Campaign Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Monsoon Mega Grocery Discount"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-custom">
                  {form.discount_type === 'percentage' ? 'Discount (%):' : 'Discount (₹):'} *
                </label>
                <input
                  type="number"
                  min="1"
                  max={form.discount_type === 'percentage' ? 100 : undefined}
                  required
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-custom">Min Order Amount (₹):</label>
                <input
                  type="number"
                  min="0"
                  value={form.min_order_amount}
                  onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-custom">Max Discount Cap (₹):</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Optional"
                  value={form.max_discount_amount || ''}
                  onChange={(e) => setForm({ ...form, max_discount_amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-custom">Expiration Date:</label>
                <input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="coupon_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-rose-500 rounded border-border-custom focus:ring-rose-500"
                />
                <label htmlFor="coupon_active" className="font-bold text-foreground text-xs cursor-pointer">
                  Activate immediately
                </label>
              </div>
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
                disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
                className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {createCouponMutation.isPending || updateCouponMutation.isPending
                  ? 'Saving...'
                  : editingCoupon
                  ? 'Update Coupon'
                  : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
