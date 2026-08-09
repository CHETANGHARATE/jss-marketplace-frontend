'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useAdminFlashSalesQuery, useCreateFlashSaleMutation } from '@/hooks/useAdmin';
import { Percent, Plus, Calendar, Clock, Sparkles } from 'lucide-react';

export default function AdminFlashSalesPage() {
  const { data: flashSales = [], isLoading } = useAdminFlashSalesQuery();
  const createFlashSale = useCreateFlashSaleMutation();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;
    try {
      await createFlashSale.mutateAsync({
        name: title,
        starts_at: startTime,
        ends_at: endTime,
        discount_percentage: 20,
        is_active: true,
      } as any);
      setIsModalOpen(false);
      setTitle('');
    } catch (err: any) {
      alert(err.message || 'Failed to create flash sale event.');
    }
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
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Plus size={16} />
            <span>Create Flash Sale Event</span>
          </button>
        }
      />

      {isLoading ? (
        <div className="py-12 text-center text-xs font-bold text-muted-custom animate-pulse">
          Loading flash sale campaigns...
        </div>
      ) : flashSales.length === 0 ? (
        <div className="bg-card border border-border-custom/80 rounded-3xl p-10 text-center space-y-3">
          <Percent className="w-12 h-12 text-muted-custom mx-auto" />
          <h3 className="text-base font-black text-foreground">No Flash Sales Configured</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            Schedule flash sales to display countdown timers on homepage product cards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flashSales.map((fs: any) => (
            <div key={fs.id} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase rounded-full">
                  Flash Sale Live
                </span>
                <span className="text-xs font-bold text-muted-custom">
                  {fs.products?.length || 0} Products
                </span>
              </div>
              <h4 className="font-black text-base text-foreground">{fs.name || fs.title}</h4>
              <div className="flex items-center justify-between text-xs text-muted-custom font-medium">
                <span>Starts: {new Date(fs.starts_at || fs.start_time || Date.now()).toLocaleString('en-IN')}</span>
                <span>Ends: {new Date(fs.ends_at || fs.end_time || Date.now()).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form onSubmit={handleCreate} className="bg-card border border-border-custom/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-foreground">Schedule Flash Sale Event</h3>
            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2-Hour Midnight Flash Sale"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold rounded-xl"
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Start Time</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold rounded-xl"
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">End Time</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-background-secondary text-foreground text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl">
                Save Flash Sale
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
