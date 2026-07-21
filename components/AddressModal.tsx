'use client';

import React, { useState } from 'react';
import { useCreateAddressMutation } from '../hooks/useAddress';
import { X, Plus, Sparkles } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddressModal({ isOpen, onClose, onSuccess }: AddressModalProps) {
  const createMutation = useCreateAddressMutation();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card text-foreground w-full max-w-lg border border-border/40 rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-foreground/50 hover:text-foreground hover:bg-muted rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <span>Add Shipping Address</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-foreground/70">Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="e.g. Chetan Gharate"
              className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-foreground/70">Phone Number *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-foreground/70">Address Line 1 *</label>
            <input
              type="text"
              required
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              placeholder="Flat/House No., Building Name, Street"
              className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-foreground/70">Address Line 2 (Optional)</label>
            <input
              type="text"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              placeholder="Landmark, Area, Sector"
              className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-foreground/70">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground/70">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
                className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-foreground/70">PIN Code *</label>
            <input
              type="text"
              required
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="400001"
              className="w-full bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="is_default" className="text-xs text-foreground/80 cursor-pointer">
              Set as default delivery address
            </label>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-3.5 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {createMutation.isPending ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <span>Save & Select Address</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
