'use client';

import React, { useEffect } from 'react';
import { useCategoryAttributesQuery } from '../../hooks/useVendor';
import { Sparkles, Layers, Sliders, CheckCircle, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';

export const SPEC_PRESETS = [
  'Brand',
  'Model',
  'Color',
  'Material',
  'Weight',
  'Size',
  'Dimensions',
  'RAM',
  'Storage',
  'Processor',
  'Battery',
  'Display',
  'Country of Origin',
  'Warranty',
  'Fabric',
  'Pattern',
  'Sleeve',
  'Neck',
  'Crop',
  'Dosage',
  'Pack Size',
  'Composition',
  'Application Method',
  'Expiry Date',
  'Custom...',
];

const CATEGORY_TEMPLATE_PRESETS: Record<string, string[]> = {
  electronics: ['Brand', 'Model', 'RAM', 'Storage', 'Processor', 'Battery', 'Display', 'Warranty'],
  mobiles: ['Brand', 'Model', 'RAM', 'Storage', 'Processor', 'Battery', 'Display', 'Warranty'],
  fashion: ['Fabric', 'Color', 'Pattern', 'Sleeve', 'Neck', 'Size'],
  clothing: ['Fabric', 'Color', 'Pattern', 'Sleeve', 'Neck', 'Size'],
  agriculture: ['Crop', 'Dosage', 'Pack Size', 'Composition', 'Application Method', 'Expiry Date'],
  grocery: ['Pack Size', 'Composition', 'Expiry Date', 'Country of Origin'],
};

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

  // Auto-preload Category Attribute Templates when category is selected if customSpecifications is empty
  useEffect(() => {
    if (categoryId && categoryData && onChangeCustomSpecifications && customSpecifications.length === 0) {
      const catName = typeof categoryData.category_name === 'string'
        ? categoryData.category_name.toLowerCase()
        : (categoryData.category_name?.en || '').toLowerCase();

      let matchedPresets: string[] | null = null;
      for (const [key, presets] of Object.entries(CATEGORY_TEMPLATE_PRESETS)) {
        if (catName.includes(key)) {
          matchedPresets = presets;
          break;
        }
      }

      if (!matchedPresets && categoryData.attributes && categoryData.attributes.length > 0) {
        matchedPresets = categoryData.attributes.map((a: any) => a.name);
      }

      if (matchedPresets && matchedPresets.length > 0) {
        const defaultSpecs = matchedPresets.map((name) => ({ key: name, value: '' }));
        onChangeCustomSpecifications(defaultSpecs);
      }
    }
  }, [categoryId, categoryData]);

  if (!categoryId) {
    return (
      <div className="p-8 border border-dashed border-border/60 rounded-3xl text-center space-y-3 bg-muted/20">
        <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
        <h4 className="font-bold text-sm text-foreground">Select a Category First</h4>
        <p className="text-xs text-foreground/60 max-w-sm mx-auto">
          Category-specific attributes and specification templates will dynamically render here.
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
      onChangeCustomSpecifications([...customSpecifications, { key: 'Brand', value: '' }]);
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

  const handleMoveSpec = (index: number, direction: 'up' | 'down') => {
    if (!onChangeCustomSpecifications) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= customSpecifications.length) return;

    const updated = [...customSpecifications];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChangeCustomSpecifications(updated);
  };

  return (
    <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-extrabold text-base text-foreground">
              Dynamic Attributes & Specifications
            </h3>
            <p className="text-xs text-foreground/60">
              Configured attributes and customizable product specifications for {categoryData?.category_name ? (typeof categoryData.category_name === 'string' ? categoryData.category_name : categoryData.category_name.en || 'Category') : 'Category'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full">
          {attributes.length} Fixed Attributes
        </span>
      </div>

      {/* 1. Presets / DB Configured Attributes */}
      {attributes.length > 0 && (
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
      )}

      {/* 2. Dynamic Specifications Builder */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-foreground">Dynamic Product Specifications</h4>
            <p className="text-[11px] text-foreground/60">Add key-value pairs (e.g. RAM, Storage, Color, Fabric, Warranty). Shown on Product Detail page.</p>
          </div>
          <button
            type="button"
            onClick={handleAddSpec}
            className="px-3 py-1.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Specification</span>
          </button>
        </div>

        {customSpecifications.length > 0 ? (
          <div className="space-y-3">
            {customSpecifications.map((spec, idx) => {
              const isPreset = SPEC_PRESETS.includes(spec.key) && spec.key !== 'Custom...';
              const selectedDropdownVal = isPreset ? spec.key : 'Custom...';

              return (
                <div key={idx} className="flex items-center gap-2 bg-muted/20 p-2.5 rounded-2xl border border-border/40">
                  {/* Preset Dropdown */}
                  <select
                    value={selectedDropdownVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom...') {
                        handleUpdateSpec(idx, '', spec.value);
                      } else {
                        handleUpdateSpec(idx, val, spec.value);
                      }
                    }}
                    className="w-1/3 px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none font-medium"
                  >
                    {SPEC_PRESETS.map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                  </select>

                  {/* Custom Name Input if Custom... is selected */}
                  {!isPreset && (
                    <input
                      type="text"
                      placeholder="Custom Name (e.g. Water Resistance)"
                      value={spec.key}
                      onChange={(e) => handleUpdateSpec(idx, e.target.value, spec.value)}
                      className="w-1/3 px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                    />
                  )}

                  {/* Value Input */}
                  <input
                    type="text"
                    placeholder="Value (e.g. IP68, 8 GB, 1 Year)"
                    value={spec.value}
                    onChange={(e) => handleUpdateSpec(idx, spec.key, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-primary outline-none"
                  />

                  {/* Reorder Up/Down Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveSpec(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-foreground/40 hover:text-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSpec(idx, 'down')}
                      disabled={idx === customSpecifications.length - 1}
                      className="p-1 text-foreground/40 hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 text-foreground/40 hover:text-rose-500 transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-border/60 rounded-2xl space-y-2 bg-muted/10">
            <p className="text-xs font-semibold text-foreground/60">No specifications added yet.</p>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Click "+ Add Specification" to start</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
