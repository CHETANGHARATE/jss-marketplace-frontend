'use client';

import React, { useState } from 'react';
import { useAdminCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { AdminCoupon } from '../../../services/adminService';
import { Ticket, Plus, Trash2, Tag, Percent, DollarSign, Calendar, X } from 'lucide-react';

export default function CouponsPage() {
  const { data: coupons, isLoading } = useAdminCouponsQuery();
  const createCouponMutation = useCreateCouponMutation();
  const deleteCouponMutation = useDeleteCouponMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    expires_at: '',
    is_active: true
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCouponMutation.mutateAsync({
      ...form,
      code: form.code.toUpperCase(),
      max_discount_amount: form.max_discount_amount || undefined
    });
    setIsModalOpen(false);
    setForm({
      code: '',
      name: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_discount_amount: 0,
      expires_at: '',
      is_active: true
    });
  };

  const handleDelete = async (id: number) => {
    await deleteCouponMutation.mutateAsync(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col p-6 sm:p-10 lg:p-12 overflow-auto">
        <div className="max-w-7xl w-full mx-auto space-y-8">
          <Breadcrumbs items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Coupons', href: '/admin/coupons' }
          ]} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Coupons & Discounts</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Coupon
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-foreground/50">Loading coupons...</div>
          ) : coupons?.length === 0 ? (
            <div className="bg-card border border-border/40 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">No coupons found</h3>
              <p className="text-foreground/60 mb-6 max-w-md">Create your first coupon to offer discounts and promotions to your customers.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
              >
                Create Coupon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons?.map((coupon: AdminCoupon) => (
                <div key={coupon.id} className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col relative group hover:border-rose-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-2xl font-bold tracking-wider text-rose-500 uppercase">{coupon.code}</span>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${coupon.is_active ? 'bg-green-500/10 text-green-500' : 'bg-foreground/10 text-foreground/50'}`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-4">{coupon.name}</h3>
                  
                  <div className="space-y-3 flex-1 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-foreground/40" />
                      <span className="flex items-center gap-1.5">
                        Discount: 
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${coupon.discount_type === 'percentage' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                          {coupon.discount_type === 'percentage' ? <Percent className="w-3 h-3 mr-1" /> : <DollarSign className="w-3 h-3 mr-1" />}
                          {coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : ' off'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-foreground/40" />
                      <span>Min Order: ${coupon.min_order_amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-foreground/40" />
                      <span>Expires: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-foreground/40" />
                      <span>Used {coupon.usage_count} times</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                    {deleteConfirmId === coupon.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-500 mr-2">Sure?</span>
                        <button onClick={() => handleDelete(coupon.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full transition-colors">Yes</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="text-xs bg-border/50 hover:bg-border px-3 py-1.5 rounded-full transition-colors">No</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeleteConfirmId(coupon.id)}
                        className="text-foreground/40 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-xl w-full max-w-lg my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create New Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Coupon Code</label>
                  <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER2024" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 uppercase font-mono" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Campaign Name</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Summer Sale" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value as any})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Value</label>
                  <input required type="number" min="0" step="0.01" value={form.discount_value} onChange={e => setForm({...form, discount_value: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Min Order Amount ($)</label>
                  <input type="number" min="0" step="0.01" value={form.min_order_amount} onChange={e => setForm({...form, min_order_amount: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Discount ($)</label>
                  <input type="number" min="0" step="0.01" value={form.max_discount_amount || ''} onChange={e => setForm({...form, max_discount_amount: parseFloat(e.target.value)})} placeholder="Optional limit" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Expiration Date</label>
                  <input type="date" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>

                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500 accent-rose-500" />
                  <label htmlFor="isActive" className="text-sm font-medium">Coupon is active immediately</label>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-border/50 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-full font-medium hover:bg-border/30 transition-colors">Cancel</button>
                <button type="submit" disabled={createCouponMutation.isPending} className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50">
                  {createCouponMutation.isPending ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
