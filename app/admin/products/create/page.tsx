'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useCreateAdminProductMutation } from '@/hooks/useAdmin';
import { DynamicAttributeForm } from '@/components/vendor/DynamicAttributeForm';
import { ProductVariantsManager } from '@/components/vendor/ProductVariantsManager';
import { ImageGalleryUploader } from '@/components/vendor/ImageGalleryUploader';
import { ApiProductVariant } from '@/types/api';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

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

export default function CreateAdminProductPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: brandsData } = useBrands();

  const createProductMutation = useCreateAdminProductMutation();

  const brands = brandsData || [];

  // Active Wizard Tab
  const [activeTab, setActiveTab] = useState<'basic' | 'attributes' | 'images' | 'pricing_variants' | 'shipping_policies_seo'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Pricing & Inventory
  const [originalPrice, setOriginalPrice] = useState<number>(999);
  const [offerPrice, setOfferPrice] = useState<number>(899);
  const [costPrice, setCostPrice] = useState<number>(500);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [taxInclusive, setTaxInclusive] = useState<boolean>(true);
  const [stockQuantity, setStockQuantity] = useState<number>(50);

  // Dynamic Attributes & Images & Variants
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<number[]>([]);
  const [customSpecifications, setCustomSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<ApiProductVariant[]>([]);

  // Shipping & Logistics
  const [weight, setWeight] = useState<number>(0.5);
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [dispatchDays, setDispatchDays] = useState<number>(1);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(true);
  const [isCodAvailable, setIsCodAvailable] = useState<boolean>(true);

  // Policies & SEO
  const [returnPolicy, setReturnPolicy] = useState('7 Days Return & Replacement Policy');
  const [replacementPolicy, setReplacementPolicy] = useState('Free replacement for damaged or defective items');
  const [warrantySummary, setWarrantySummary] = useState('1 Year Brand Warranty');
  const [guaranteeSummary, setGuaranteeSummary] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('Cancellation allowed before dispatch');

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImage, setOgImage] = useState('');

  const handleSaveProduct = async (statusOverride: 'draft' | 'approved') => {
    if (!name.trim()) {
      alert('Product title is required.');
      setActiveTab('basic');
      return;
    }
    if (!originalPrice || originalPrice <= 0) {
      alert('Original price must be greater than 0.');
      setActiveTab('pricing_variants');
      return;
    }

    const generatedSlug = (name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const multilingualName = {
      en: name,
      hi: name,
      mr: name,
    };

    const multilingualShortDesc = {
      en: shortDescription || '',
      hi: shortDescription || '',
      mr: shortDescription || '',
    };

    const multilingualDesc = {
      en: description || '',
      hi: description || '',
      mr: description || '',
    };

    const cleanImages = (images || []).filter((img) => typeof img === 'string' && img.trim().length > 0 && !img.startsWith('data:image'));

    const payload = {
      name: multilingualName as any,
      slug: generatedSlug,
      category_id: categoryId || undefined,
      subcategory_id: subcategoryId || undefined,
      brand_id: brandId || undefined,
      sku: sku || undefined,
      short_description: multilingualShortDesc as any,
      description: multilingualDesc as any,
      original_price: originalPrice,
      offer_price: offerPrice,
      cost_price: costPrice,
      gst_percent: gstPercent,
      tax_inclusive: taxInclusive,
      stock_quantity: stockQuantity,
      images: cleanImages,
      attribute_values: selectedAttributeValues,
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
      guarantee_summary: guaranteeSummary,
      cancellation_policy: cancellationPolicy,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
      canonical_url: canonicalUrl,
      og_image: ogImage,
      status: statusOverride,
      specifications: customSpecifications,
      custom_specifications: customSpecifications,
    };

    try {
      await createProductMutation.mutateAsync(payload);
      alert(
        statusOverride === 'approved'
          ? 'Product created and published directly to marketplace!'
          : 'Product draft saved successfully.'
      );
      router.push('/admin/products');
    } catch (err: any) {
      const responseData = err?.response?.data;
      if (responseData?.errors && typeof responseData.errors === 'object') {
        const errorList = Object.entries(responseData.errors)
          .map(([field, msgs]: [string, any]) => `• ${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        alert(`${responseData.message || 'Validation Error'}:\n${errorList}`);
      } else {
        alert(responseData?.message || err.message || 'Error saving product.');
      }
    }
  };

  const selectedCategoryObj = categories.find((c: any) => c.id === categoryId);
  const subcategories = selectedCategoryObj?.children || selectedCategoryObj?.subcategories || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Create New Catalog Product"
        subtitle="Add a new marketplace product with multi-lingual details, dynamic category attributes, gallery images, variants, SEO, and tax rates. Admin products are auto-approved."
        badge="Catalog Creation"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: 'Add Product' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveProduct('draft')}
              disabled={createProductMutation.isPending}
              className="px-4 py-2.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card transition-all inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-muted-custom" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveProduct('approved')}
              disabled={createProductMutation.isPending}
              className="px-5 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              {createProductMutation.isPending ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Publish Product</span>
            </button>
          </div>
        }
      />



          {/* Wizard Tabs Header */}
          <div className="flex items-center gap-2 border-b border-border/40 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'basic' ? 'bg-rose-500 text-white shadow-xs' : 'text-foreground/70 hover:bg-muted/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Basic Info</span>
            </button>

            <button
              onClick={() => setActiveTab('attributes')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'attributes' ? 'bg-rose-500 text-white shadow-xs' : 'text-foreground/70 hover:bg-muted/30'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>2. Attributes</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'images' ? 'bg-rose-500 text-white shadow-xs' : 'text-foreground/70 hover:bg-muted/30'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>3. Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing_variants')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'pricing_variants' ? 'bg-rose-500 text-white shadow-xs' : 'text-foreground/70 hover:bg-muted/30'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>4. Price & Variants</span>
            </button>

            <button
              onClick={() => setActiveTab('shipping_policies_seo')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'shipping_policies_seo' ? 'bg-rose-500 text-white shadow-xs' : 'text-foreground/70 hover:bg-muted/30'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>5. Logistics & SEO</span>
            </button>
          </div>

          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Noise Canceling Headphones"
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Category</label>
                  <select
                    value={categoryId || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : null;
                      setCategoryId(val);
                      setSubcategoryId(null);
                    }}
                    className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
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
                    className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none disabled:opacity-50"
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
                    className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">SKU Code (Auto-generated if left blank)</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-ADM-10023"
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Short Highlights Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Key summary for product cards and quick views..."
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Full Detailed Description</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed specifications, features, usage guidelines, and warranty information..."
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveTab('attributes')}
                  className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Next: Category Attributes →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DYNAMIC CATEGORY ATTRIBUTES */}
          {activeTab === 'attributes' && (
            <div className="space-y-6 max-w-3xl">
              <DynamicAttributeForm
                categoryId={categoryId}
                selectedAttributeValues={selectedAttributeValues}
                onChangeAttributeValues={setSelectedAttributeValues}
                customSpecifications={customSpecifications}
                onChangeCustomSpecifications={setCustomSpecifications}
              />

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab('basic')}
                  className="px-6 py-2.5 bg-muted text-foreground font-bold text-xs rounded-2xl hover:bg-muted/80 transition-all"
                >
                  ← Back to Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Next: Product Gallery →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE GALLERY UPLOADER */}
          {activeTab === 'images' && (
            <div className="space-y-6 max-w-3xl">
              <ImageGalleryUploader images={images} onChangeImages={setImages} />

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab('attributes')}
                  className="px-6 py-2.5 bg-muted text-foreground font-bold text-xs rounded-2xl hover:bg-muted/80 transition-all"
                >
                  ← Back to Attributes
                </button>
                <button
                  onClick={() => setActiveTab('pricing_variants')}
                  className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Next: Price & Variants →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & VARIANTS */}
          {activeTab === 'pricing_variants' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-muted/20 rounded-3xl border border-border/40 space-y-4">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-rose-500" /> Standard Base Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Original Price / MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Selling Offer Price (₹)</label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Cost Price (Admin confidential)</label>
                    <input
                      type="number"
                      value={costPrice}
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">GST Rate (%)</label>
                    <input
                      type="number"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Inventory Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={taxInclusive}
                        onChange={(e) => setTaxInclusive(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
                      />
                      <span>Price includes GST tax</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <ProductVariantsManager variants={variants} onChangeVariants={setVariants} basePrice={originalPrice} />

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveTab('images')}
                  className="px-6 py-2.5 bg-muted text-foreground font-bold text-xs rounded-2xl hover:bg-muted/80 transition-all"
                >
                  ← Back to Gallery
                </button>
                <button
                  onClick={() => setActiveTab('shipping_policies_seo')}
                  className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Next: Logistics & SEO →
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LOGISTICS, POLICIES & SEO */}
          {activeTab === 'shipping_policies_seo' && (
            <div className="space-y-6 max-w-3xl">
              {/* Shipping & Package Specs */}
              <div className="p-5 bg-muted/20 rounded-3xl border border-border/40 space-y-4">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4 text-rose-500" /> Package Logistics & Shipping
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Length (cm)</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Width (cm)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Dispatch Time (Days)</label>
                    <input
                      type="number"
                      value={dispatchDays}
                      onChange={(e) => setDispatchDays(Number(e.target.value))}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={isFreeShipping}
                        onChange={(e) => setIsFreeShipping(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500"
                      />
                      <span>Free Shipping Available</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={isCodAvailable}
                        onChange={(e) => setIsCodAvailable(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500"
                      />
                      <span>Cash On Delivery</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Return Policies & Guarantees */}
              <div className="p-5 bg-muted/20 rounded-3xl border border-border/40 space-y-4">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" /> Customer Policies & Guarantees
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Return Policy</label>
                    <input
                      type="text"
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Replacement Policy</label>
                    <input
                      type="text"
                      value={replacementPolicy}
                      onChange={(e) => setReplacementPolicy(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Warranty Summary</label>
                    <input
                      type="text"
                      value={warrantySummary}
                      onChange={(e) => setWarrantySummary(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Cancellation Policy</label>
                    <input
                      type="text"
                      value={cancellationPolicy}
                      onChange={(e) => setCancellationPolicy(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Engine */}
              <div className="p-5 bg-muted/20 rounded-3xl border border-border/40 space-y-4">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-500" /> Search Engine Optimization (SEO)
                </h3>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Search snippet title..."
                    className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Meta Description</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search snippet meta description..."
                    className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border/40">
                <button
                  onClick={() => setActiveTab('pricing_variants')}
                  className="px-6 py-2.5 bg-muted text-foreground font-bold text-xs rounded-2xl hover:bg-muted/80 transition-all"
                >
                  ← Back to Price & Variants
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProduct('approved')}
                  disabled={createProductMutation.isPending}
                  className="px-8 py-3 bg-rose-500 text-white font-extrabold text-xs rounded-2xl hover:bg-rose-600 transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Product Directly</span>
                </button>
              </div>
            </div>
          )}
    </div>
  );
}
