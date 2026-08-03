'use client';

import React from 'react';
import { useCategoryAttributesQuery } from '../../hooks/useVendor';
import { Sparkles, Layers, Sliders, CheckCircle } from 'lucide-react';

interface DynamicAttributeFormProps {
  categoryId: number | null;
  selectedAttributeValues: number[];
  onChangeAttributeValues: (values: number[]) => void;
  customSpecifications?: { key: string; value: string }[];
  onChangeCustomSpecifications?: (specs: { key: string; value: string }[]) => void;
}

export function DynamicAttributeForm({
  categoryId,
  selectedAttributeValues,
  onChangeAttributeValues,
  customSpecifications = [],
  onChangeCustomSpecifications,
}: DynamicAttributeFormProps) {
  const { data: categoryData, isLoading } = useCategoryAttributesQuery(categoryId);

  if (!categoryId) {
    return (
      <div className="p-8 border border-dashed border-border/60 rounded-3xl text-center space-y-3 bg-muted/20">
        <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
        <h4 className="font-bold text-sm text-foreground">Select a Category First</h4>
        <p className="text-xs text-foreground/60 max-w-sm mx-auto">
          Category-specific attributes (RAM, Size, Color, Weight, Expiry, FSSAI, Material, etc.) will dynamically render here based on your selection.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 border border-border/40 rounded-3xl text-center space-y-3 bg-card animate-pulse">
        <Sliders className="w-8 h-8 text-primary mx-auto animate-spin" />
        <p className="text-xs font-semibold text-foreground/60">Loading category specifications & dynamic attributes...</p>
      </div>
    );
  }

  const attributes = categoryData?.attributes || [];

  const handleToggleValue = (valId: number) => {
    if (selectedAttributeValues.includes(valId)) {
      onChangeAttributeValues(selectedAttributeValues.filter((id) => id !== valId));
    } else {
      onChangeAttributeValues([...selectedAttributeValues, valId]);
    }
  };

  const handleAddSpec = () => {
    if (onChangeCustomSpecifications) {
      onChangeCustomSpecifications([...customSpecifications, { key: '', value: '' }]);
    }
  };

  const handleUpdateSpec = (index: number, key: string, value: string) => {
    if (onChangeCustomSpecifications) {
      const updated = [...customSpecifications];
      updated[index] = { key, value };
      onChangeCustomSpecifications(updated);
    }
  };

  const handleRemoveSpec = (index: number) => {
    if (onChangeCustomSpecifications) {
      onChangeCustomSpecifications(customSpecifications.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-extrabold text-base text-foreground">
              Dynamic Attributes for {categoryData?.category_name ? (typeof categoryData.category_name === 'string' ? categoryData.category_name : categoryData.category_name.en || 'Category') : 'Selected Category'}
            </h3>
            <p className="text-xs text-foreground/60">Select attributes configured for this category</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full">
          {attributes.length} Configured Attributes
        </span>
      </div>

      {attributes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attributes.map((attr) => (
            <div key={attr.id} className="space-y-2 bg-muted/20 p-4 rounded-2xl border border-border/30">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>{attr.name}</span>
                {attr.code && <span className="text-[10px] font-mono text-foreground/40">({attr.code})</span>}
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {attr.values && attr.values.length > 0 ? (
                  attr.values.map((val: any) => {
                    const isSelected = selectedAttributeValues.includes(val.id);
                    return (
                      <button
                        key={val.id}
                        type="button"
                        onClick={() => handleToggleValue(val.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-card text-foreground border-border/60 hover:border-primary/40'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{val.value}</span>
                      </button>
                    );
                  })
                ) : (
                  <span className="text-xs text-foreground/40 italic">No preset options available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-muted/20 rounded-2xl border border-border/30 text-xs text-foreground/60">
          No fixed attribute templates defined yet for this category. You can add custom key-value specifications below!
        </div>
      )}

      {/* Key-Value Custom Specifications */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground">Custom Specifications (Key-Value)</label>
          <button
            type="button"
            onClick={handleAddSpec}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            + Add Specification
          </button>
        </div>

        {customSpecifications.length > 0 ? (
          <div className="space-y-3">
            {customSpecifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Specification Name (e.g. Warranty, Fabric)"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpec(idx, e.target.value, spec.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. 1 Year, 100% Cotton)"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpec(idx, spec.key, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="text-xs text-rose-500 font-bold hover:underline px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-foreground/40 italic">No custom specifications added.</p>
        )}
      </div>
    </div>
  );
}
