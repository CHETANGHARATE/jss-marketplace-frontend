'use client';

import React, { useState } from 'react';
import { useAdminFlashSalesQuery, useCreateFlashSaleMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { AdminFlashSale } from '../../../services/adminService';
import { Zap, Plus, Clock, Percent, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

export default function PromotionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    discount_percentage: 10,
    starts_at: '',
    ends_at: '',
    is_active: true
  });

  const { data, isLoading, isError } = useAdminFlashSalesQuery();
  const createMutation = useCreateFlashSaleMutation();

  const flashSales = data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: new Date(formData.ends_at).toISOString()
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        discount_percentage: 10,
        starts_at: '',
        ends_at: '',
        is_active: true
      });
    } catch (error) {
      console.error('Failed to create flash sale', error);
    }
  };

  const getStatus = (sale: AdminFlashSale) => {
    const now = new Date();
    const start = new Date(sale.starts_at);
    const end = new Date(sale.ends_at);

    if (!sale.is_active) return { label: 'Inactive', color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30' };
    if (now < start) return { label: 'Scheduled', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
    if (now > end) return { label: 'Expired', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
    return { label: 'Active', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-8 lg:p-12 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <Breadcrumbs 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Promotions', href: '/admin/promotions' }
            ]} 
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Zap className="w-8 h-8 text-rose-500" />
                Promotions & Flash Sales
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Create and manage time-limited discounts across the platform.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-rose-500/20"
            >
              <Plus className="w-5 h-5" />
              Create Flash Sale
            </button>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 dark:bg-rose-950/10 dark:border-rose-900/20">
            <div className="flex items-start gap-4">
              <div className="bg-rose-100 p-2.5 rounded-xl dark:bg-rose-900/30">
                <Percent className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="font-semibold text-rose-900 dark:text-rose-200">About Flash Sales</h3>
                <p className="text-sm text-rose-700 dark:text-rose-300/80 mt-1 leading-relaxed">
                  Flash sales apply an automatic discount to selected products during a specific timeframe. 
                  When active, products will display a countdown timer and the discounted price to drive urgency and conversions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">All Promotions</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-muted/50 rounded-2xl h-24 w-full"></div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Failed to load promotions.</p>
              </div>
            ) : flashSales.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl">
                <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No promotions yet</h3>
                <p className="text-muted-foreground mt-1 text-sm mb-6">Create your first flash sale to boost sales.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Create Promotion
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {flashSales.map((sale: AdminFlashSale) => {
                  const status = getStatus(sale);
                  return (
                    <div key={sale.id} className="border border-border/40 rounded-2xl p-5 hover:border-rose-500/30 transition-colors flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-foreground truncate pr-2" title={sale.name}>
                          {sale.name}
                        </h3>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-5 flex-1">
                        <div className="flex items-center text-sm">
                          <Percent className="w-4 h-4 text-rose-500 mr-2.5 shrink-0" />
                          <span className="font-medium text-foreground">{sale.discount_percentage}% off</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2.5 shrink-0" />
                          <span className="truncate">
                            {new Date(sale.starts_at).toLocaleDateString()} - {new Date(sale.ends_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2.5 shrink-0" />
                          <span>{sale.products?.length || 0} products</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {sale.is_active ? (
                            <><ToggleRight className="w-4 h-4 text-green-500" /> Enabled</>
                          ) : (
                            <><ToggleLeft className="w-4 h-4 text-muted-foreground" /> Disabled</>
                          )}
                        </div>
                        <button className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors">
                          Manage Products
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-border/40 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-500" />
                Create Flash Sale
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="create-promotion-form" onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Promotion Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    placeholder="e.g. Summer Blowout Sale"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Discount Percentage</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      min="1"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={e => setFormData({...formData, discount_percentage: Number(e.target.value)})}
                      className="w-full bg-background border border-input rounded-xl pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    />
                    <Percent className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Starts At</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={e => setFormData({...formData, starts_at: e.target.value})}
                      className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Ends At</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.ends_at}
                      onChange={e => setFormData({...formData, ends_at: e.target.value})}
                      className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <label className="flex items-center gap-3 p-4 border border-input rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 focus:ring-offset-background bg-background border-input"
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">Active upon creation</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Sale will start automatically at the scheduled time.</div>
                  </div>
                </label>
              </form>
            </div>
            
            <div className="p-6 border-t border-border/40 bg-muted/20 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-promotion-form"
                disabled={createMutation.isPending}
                className="px-5 py-2.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Flash Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
