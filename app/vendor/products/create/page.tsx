'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useCreateVendorProductMutation } from '@/hooks/useVendor';
import { DynamicAttributeForm } from '@/components/vendor/DynamicAttributeForm';
import { ProductVariantsManager } from '@/components/vendor/ProductVariantsManager';
import { ImageGalleryUploader } from '@/components/vendor/ImageGalleryUploader';
import { ApiProductVariant } from '@/types/api';

import {
  ArrowLeft,
  Save,
  Send,
  Layers,
  Sparkles,
  FileText,
  Sliders,
  ImageIcon,
  DollarSign,
  Truck,
  ShieldCheck,
  Globe,
  Bot
} from 'lucide-react';

export default function CreateVendorProductPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: brandsData } = useBrands();

  const createProductMutation = useCreateVendorProductMutation();

  const brands = brandsData || [];

  // Active Wizard Tab
  const [activeTab, setActiveTab] = useState<'basic' | 'attributes' | 'images' | 'pricing_variants' | 'shipping_policies_seo'>('basic');

  // Form State (Modules 1-13)
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  // Attributes
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<number[]>([]);
  const [customSpecifications, setCustomSpecifications] = useState<{ key: string; value: string }[]>([]);

  // Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  ]);

  // Pricing & Inventory
  const [originalPrice, setOriginalPrice] = useState<number>(1999);
  const [offerPrice, setOfferPrice] = useState<number>(1499);
  const [costPrice, setCostPrice] = useState<number>(999);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [taxInclusive, setTaxInclusive] = useState<boolean>(true);
  const [stockQuantity, setStockQuantity] = useState<number>(50);

  // Variants
  const [variants, setVariants] = useState<ApiProductVariant[]>([]);

  // Shipping
  const [weight, setWeight] = useState<number>(0.5);
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(15);
  const [height, setHeight] = useState<number>(10);
  const [dispatchDays, setDispatchDays] = useState<number>(1);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(true);
  const [isCodAvailable, setIsCodAvailable] = useState<boolean>(true);

  // Policies
  const [returnPolicy, setReturnPolicy] = useState('7 Days Easy Returns & Replacement');
  const [replacementPolicy, setReplacementPolicy] = useState('7 Days Free Replacement for Damaged Items');
  const [warrantySummary, setWarrantySummary] = useState('1 Year Brand Warranty');
  const [cancellationPolicy, setCancellationPolicy] = useState('Free Cancellation before Dispatch');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (targetStatus: 'draft' | 'pending_approval') => {
    if (!name.trim()) {
      setFormError('Product Name is required.');
      setActiveTab('basic');
      return;
    }

    if (originalPrice <= 0) {
      setFormError('Original Price must be greater than 0.');
      setActiveTab('pricing_variants');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const highlights = highlightsText
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      await createProductMutation.mutateAsync({
        name,
        category_id: categoryId || undefined,
        subcategory_id: subcategoryId || undefined,
        brand_id: brandId || undefined,
        sku: sku || undefined,
        short_description: shortDescription,
        description,
        original_price: originalPrice,
        offer_price: offerPrice || originalPrice,
        cost_price: costPrice,
        gst_percent: gstPercent,
        tax_inclusive: taxInclusive,
        stock_quantity: stockQuantity,
        images,
        attribute_values: selectedAttributeValues,
        specifications: customSpecifications,
        custom_specifications: customSpecifications,
        variants,
        weight,
        length,
        width,
        height,
        dispatch_days: dispatchDays,
        shipping_charge: shippingCharge,
        is_free_shipping: isFreeShipping,
        is_cod_available: isCodAvailable,
        return_policy: returnPolicy,
        replacement_policy: replacementPolicy,
        warranty_summary: warrantySummary,
        cancellation_policy: cancellationPolicy,
        meta_title: metaTitle || name,
        meta_description: metaDescription || shortDescription,
        meta_keywords: metaKeywords,
        highlights,
        search_keywords: searchKeywords,
        status: targetStatus,
      });

      const successMsg = targetStatus === 'pending_approval'
        ? 'Product successfully submitted for Admin Review!'
        : 'Product draft saved successfully.';
      
      alert(successMsg);
      router.push('/vendor/products');
    } catch (err: any) {
      const responseData = err?.response?.data;
      if (responseData?.errors && typeof responseData.errors === 'object') {
        const errorList = Object.entries(responseData.errors)
          .map(([field, msgs]: [string, any]) => `• ${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        setFormError(`${responseData.message || 'Validation Error'}:\n${errorList}`);
      } else {
        setFormError(responseData?.message || err.message || 'Failed to submit product.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find((c: any) => c.id === categoryId);
  const subcategories = selectedCategoryObj?.children || selectedCategoryObj?.subcategories || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/vendor/products"
            className="p-2 bg-muted/40 hover:bg-muted rounded-2xl transition-colors text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Create New Product</h1>
            <p className="text-xs text-foreground/60">Module 1-13 Production-Ready Product Creation Wizard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="px-4 py-2 bg-muted/60 hover:bg-muted text-foreground font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-border/60 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('pending_approval')}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Submit for Review
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-2xl">
          {formError}
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex overflow-x-auto gap-2 border-b border-border/40 pb-2">
        {[
          { id: 'basic', label: '1. Basic Info', icon: FileText },
          { id: 'attributes', label: '2. Category Attributes', icon: Sliders },
          { id: 'images', label: '3. Product Gallery', icon: ImageIcon },
          { id: 'pricing_variants', label: '4. Pricing & Variants', icon: DollarSign },
          { id: 'shipping_policies_seo', label: '5. Logistics & SEO', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-card text-foreground/70 hover:bg-muted/40 border border-border/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-extrabold text-base text-foreground border-b border-border/40 pb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Basic Information (Module 3)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-foreground mb-1 block">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Category</label>
              <select
                value={categoryId || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  setCategoryId(val);
                  setSubcategoryId(null);
                }}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {typeof cat.name === 'string' ? cat.name : cat.name.en || 'Category'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Subcategory</label>
              <select
                value={subcategoryId || ''}
                onChange={(e) => setSubcategoryId(e.target.value ? Number(e.target.value) : null)}
                disabled={!categoryId || subcategories.length === 0}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none disabled:opacity-50"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {typeof sub.name === 'string' ? sub.name : sub.name.en || 'Subcategory'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Brand</label>
              <select
                value={brandId || ''}
                onChange={(e) => setBrandId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
              >
                <option value="">Select Brand</option>
                {brands.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Product SKU</label>
              <input
                type="text"
                placeholder="Auto-generated if left empty"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-foreground mb-1 block">Short Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary of key features..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-foreground mb-1 block">Full Description</label>
              <textarea
                rows={4}
                placeholder="Comprehensive details, usage, specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-foreground mb-1 block">Product Highlights (One per line)</label>
              <textarea
                rows={3}
                placeholder="• Active Noise Cancellation&#10;• 30 Hours Battery Life&#10;• Bluetooth 5.3 Quick Connect"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC ATTRIBUTES */}
      {activeTab === 'attributes' && (
        <DynamicAttributeForm
          categoryId={categoryId}
          selectedAttributeValues={selectedAttributeValues}
          onChangeAttributeValues={setSelectedAttributeValues}
          customSpecifications={customSpecifications}
          onChangeCustomSpecifications={setCustomSpecifications}
        />
      )}

      {/* TAB 3: IMAGES */}
      {activeTab === 'images' && (
        <ImageGalleryUploader images={images} onChangeImages={setImages} maxImages={10} />
      )}

      {/* TAB 4: PRICING & VARIANTS */}
      {activeTab === 'pricing_variants' && (
        <div className="space-y-6">
          <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-base text-foreground border-b border-border/40 pb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Pricing & Inventory (Module 8 & 9)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  MRP / Original Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Selling / Offer Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Cost Price (Vendor Confidential)</label>
                <input
                  type="number"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">GST Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="taxInclusive"
                  checked={taxInclusive}
                  onChange={(e) => setTaxInclusive(e.target.checked)}
                  className="rounded border-border/60 text-primary focus:ring-primary w-4 h-4"
                />
                <label htmlFor="taxInclusive" className="text-xs font-bold text-foreground cursor-pointer">
                  Price is GST Inclusive
                </label>
              </div>
            </div>
          </div>

          <ProductVariantsManager variants={variants} onChangeVariants={setVariants} basePrice={offerPrice || originalPrice} />
        </div>
      )}

      {/* TAB 5: SHIPPING, POLICIES & SEO */}
      {activeTab === 'shipping_policies_seo' && (
        <div className="space-y-6">
          {/* Shipping & Logistics */}
          <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-base text-foreground border-b border-border/40 pb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping & Logistics (Module 10)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Length (cm)</label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Width (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/30">
                <input
                  type="checkbox"
                  id="isFreeShipping"
                  checked={isFreeShipping}
                  onChange={(e) => setIsFreeShipping(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="isFreeShipping" className="text-xs font-bold text-foreground cursor-pointer">
                  Offer Free Shipping to Customers
                </label>
              </div>

              <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/30">
                <input
                  type="checkbox"
                  id="isCodAvailable"
                  checked={isCodAvailable}
                  onChange={(e) => setIsCodAvailable(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="isCodAvailable" className="text-xs font-bold text-foreground cursor-pointer">
                  Cash on Delivery (COD) Available
                </label>
              </div>
            </div>
          </div>

          {/* Customer Policies */}
          <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-base text-foreground border-b border-border/40 pb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Store Policies (Module 11)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Return Policy</label>
                <input
                  type="text"
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Warranty Summary</label>
                <input
                  type="text"
                  value={warrantySummary}
                  onChange={(e) => setWarrantySummary(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEO & AI Ready */}
          <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-base text-foreground border-b border-border/40 pb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> SEO & Search Keywords (Module 12 & 13)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Meta Title</label>
                <input
                  type="text"
                  placeholder="SEO title..."
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Meta Keywords</label>
                <input
                  type="text"
                  placeholder="keyword1, keyword2..."
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-foreground mb-1 block">Meta Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description for Google Search results..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
