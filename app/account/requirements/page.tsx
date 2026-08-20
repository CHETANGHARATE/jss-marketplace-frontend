'use client';

import React, { useEffect, useState } from 'react';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, BuyerRequirement } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  Megaphone,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export default function BuyerRequirementsPage() {
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [targetPrice, setTargetPrice] = useState('');
  const [pincode, setPincode] = useState('');
  const [requiredDate, setRequiredDate] = useState('');

  const { success, error: toastError, info } = useToast();

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await b2bService.getRequirements();
      setRequirements(data || []);
    } catch (err) {
      console.error('Failed to load requirements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      await b2bService.postRequirement({
        title,
        description,
        quantity: Number(quantity),
        target_price: targetPrice ? parseFloat(targetPrice) : undefined,
        delivery_pincode: pincode,
        required_date: requiredDate || undefined,
      });

      success('Requirement posted to the B2B marketplace! Suppliers can now place competitive bids.', 'Requirement Published');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchRequirements();
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Failed to post requirement', 'Error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Buyer Requirements & Supplier Bids' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">Buyer Requirements & Bids</h1>
                  <p className="text-xs text-muted-foreground">
                    Publish your customized product specifications and receive reverse-auction bids from manufacturers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-2xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Post Requirement</span>
              </button>
            </div>

            {/* List */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading requirements...</p>
              </div>
            ) : requirements.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h3 className="font-bold text-base text-foreground">No Requirements Posted</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Post what you need and let verified manufacturers and distributors compete with their best prices.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 border border-border/60 rounded-2xl bg-background-secondary space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-primary">#{req.requirement_number}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {req.status}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          {req.bids_count || req.bids?.length || 0} Supplier Bids
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Posted: {new Date(req.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-foreground">{req.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{req.description}</p>

                    <div className="flex items-center gap-6 text-xs text-muted-foreground pt-1 flex-wrap">
                      <span>
                        Quantity: <strong className="text-foreground">{req.quantity.toLocaleString('en-IN')} units</strong>
                      </span>
                      {req.target_price && (
                        <span>
                          Target: <strong className="text-foreground">₹{Number(req.target_price).toLocaleString('en-IN')}</strong>
                        </span>
                      )}
                      {req.delivery_pincode && <span>PIN: <strong>{req.delivery_pincode}</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2 text-foreground font-black text-base">
                <Megaphone className="w-5 h-5 text-primary" />
                <span>Post Public Buyer Requirement</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Need 1000 Pcs Stainless Steel Hex Bolts M10"
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Target Unit Price (₹ Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 25.00"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Specifications & Commercial Terms *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete technical drawings or specs, required grade, packaging details, and testing standard..."
                  className="w-full bg-background border border-border p-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Delivery PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 411018"
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Required By Date</label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {creating ? <Sparkles className="w-4 h-4 animate-spin" /> : <span>Publish Requirement</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
