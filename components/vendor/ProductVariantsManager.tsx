'use client';

import React from 'react';
import { ApiProductVariant } from '../../types/api';
import { Layers, Plus, Trash2, Tag, Barcode, DollarSign, Package } from 'lucide-react';

interface ProductVariantsManagerProps {
  variants: ApiProductVariant[];
  onChangeVariants: (variants: ApiProductVariant[]) => void;
  basePrice: number;
}

export function ProductVariantsManager({ variants, onChangeVariants, basePrice }: ProductVariantsManagerProps) {
  const handleAddVariant = () => {
    const newVariant: ApiProductVariant = {
      title: `Variant ${variants.length + 1}`,
      sku: `VAR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      barcode: '',
      price: basePrice || 0,
      offer_price: basePrice || 0,
      stock_quantity: 10,
      is_default: variants.length === 0,
    };
    onChangeVariants([...variants, newVariant]);
  };

  const handleUpdateVariant = (index: number, key: keyof ApiProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [key]: value };
    onChangeVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const filtered = variants.filter((_, i) => i !== index);
    if (filtered.length > 0 && !filtered.some((v) => v.is_default)) {
      filtered[0].is_default = true;
    }
    onChangeVariants(filtered);
  };

  return (
    <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-extrabold text-base text-foreground">Product Variants (Module 7)</h3>
            <p className="text-xs text-foreground/60">Manage unlimited variants (Size, Color, Weight, Pack, Volume)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Variant
        </button>
      </div>

      {variants.length > 0 ? (
        <div className="space-y-4">
          {variants.map((varItem, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                varItem.is_default ? 'bg-primary/5 border-primary/40' : 'bg-muted/20 border-border/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">Variant #{idx + 1}</span>
                  {varItem.is_default && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">
                      Default Variant
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Variant Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Red / XL or 500g"
                    value={varItem.title}
                    onChange={(e) => handleUpdateVariant(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Variant SKU</label>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={varItem.sku}
                    onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={varItem.price}
                    onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground/70 mb-1 block">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={varItem.stock_quantity}
                    onChange={(e) => handleUpdateVariant(idx, 'stock_quantity', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed border-border/60 rounded-2xl text-center space-y-2 bg-muted/10">
          <p className="text-xs text-foreground/60">No variants added yet. Click "+ Add Variant" to create variants like Size, Color, or Weight.</p>
        </div>
      )}
    </div>
  );
}
