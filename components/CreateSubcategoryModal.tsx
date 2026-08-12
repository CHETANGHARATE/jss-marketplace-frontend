'use client';

import React, { useState } from 'react';
import { Plus, X, FolderPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface CreateSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategoryId: number | null;
  parentCategoryName: string;
  onSuccess: (newSubcat: { id: number; name: string }) => void;
  isVendor?: boolean;
}

export function CreateSubcategoryModal({
  isOpen,
  onClose,
  parentCategoryId,
  parentCategoryName,
  onSuccess,
  isVendor = false,
}: CreateSubcategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentCategoryId) {
      setError('Please select a parent category first.');
      return;
    }
    if (!name.trim()) {
      setError('Subcategory name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = isVendor ? '/vendor/subcategories' : '/admin/subcategories';
      const payload = {
        parent_id: parentCategoryId,
        category_id: parentCategoryId,
        name: name.trim(),
        description: description.trim() || undefined,
      };

      const response = await apiClient.post(endpoint, payload);
      const resData = response.data;

      if (resData?.success && resData?.data) {
        const createdId = Number(resData.data.id);
        const createdName = typeof resData.data.name === 'string'
          ? resData.data.name
          : (resData.data.name?.en || name.trim());

        onSuccess({ id: createdId, name: createdName });
        setName('');
        setDescription('');
        onClose();
      } else {
        setError(resData?.message || 'Failed to create subcategory.');
      }
    } catch (err: any) {
      console.error('Error creating subcategory:', err);
      const msg = err.response?.data?.message || err.message || 'An error occurred while creating the subcategory.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">Create New Subcategory</h3>
              <p className="text-[11px] text-muted-custom font-medium">Add a new subcategory directly into database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">Parent Category</label>
            <input
              type="text"
              readOnly
              value={parentCategoryName || 'Parent Category Selected'}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-muted/60 text-foreground/70 font-semibold border border-border/60 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Subcategory Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Yellow Sapphire (Pushkaraj)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Description <span className="text-muted-custom font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Brief description for this subcategory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none resize-none font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold rounded-2xl border border-border/80 text-foreground/80 hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2 text-xs font-bold rounded-2xl bg-primary text-white hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Create Subcategory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
