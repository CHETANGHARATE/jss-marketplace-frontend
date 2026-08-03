'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useAdminProductDetailsQuery, useUpdateAdminProductMutation } from '@/hooks/useAdmin';
import { DynamicAttributeForm } from '@/components/vendor/DynamicAttributeForm';
import { ProductVariantsManager } from '@/components/vendor/ProductVariantsManager';
import { ImageGalleryUploader } from '@/components/vendor/ImageGalleryUploader';
import { ApiProductVariant } from '@/types/api';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Sliders,
  ImageIcon,
  DollarSign,
  Truck,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';

export default function EditAdminProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params?.id);

  const { data: product, isLoading: isLoadingProduct } = useAdminProductDetailsQuery(productId);
  const { data: categories = [] } = useCategories();
  const { data: brandsData } = useBrands();

  const updateProductMutation = useUpdateAdminProductMutation();

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
  const [status, setStatus] = useState<string>('approved');

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
  const [returnPolicy, setReturnPolicy] = useState('');
  const [replacementPolicy, setReplacementPolicy] = useState('');
  const [warrantySummary, setWarrantySummary] = useState('');
  const [guaranteeSummary, setGuaranteeSummary] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Prepopulate form data when product details load
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategoryId(product.category_id || product.category?.id || null);
      setSubcategoryId(product.subcategory_id || null);
      setBrandId(product.brand_id || product.brand?.id || null);
      setSku(product.sku || '');
      setShortDescription(product.short_description || '');
      setDescription(product.description || '');

      setOriginalPrice(product.originalPrice ?? product.original_price ?? 999);
      setOfferPrice(product.offerPrice ?? product.offer_price ?? product.sale_price ?? 899);
      setCostPrice(product.cost_price ?? 0);
      setGstPercent(product.gst_percent ?? 18);
      setTaxInclusive(product.tax_inclusive ?? true);
      setStockQuantity(product.stockQuantity ?? product.stock_quantity ?? 50);
      setStatus(product.status || 'approved');

      const existingImages = product.images?.map((img: any) => img.image_path || img.image) || (product.image ? [product.image] : []);
      setImages(existingImages);

      if (product.variants) {
        setVariants(product.variants);
      }

      const attrVals = (product as any).attributeValues || (product as any).attribute_values;
      if (attrVals && Array.isArray(attrVals)) {
        setSelectedAttributeValues(attrVals.map((v: any) => typeof v === 'number' ? v : v.id));
      }

      setWeight(product.weight ?? 0.5);
      setLength(product.length ?? 10);
      setWidth(product.width ?? 10);
      setHeight(product.height ?? 10);
      setDispatchDays(product.dispatch_days ?? 1);
      setShippingCharge(product.shipping_charge ?? 0);
      setIsFreeShipping(product.is_free_shipping ?? true);
      setIsCodAvailable(product.is_cod_available ?? true);

      setReturnPolicy(product.return_policy || '7 Days Return');
      setReplacementPolicy(product.replacement_policy || '');
      setWarrantySummary(product.warranty_summary || '');
      setGuaranteeSummary(product.guarantee_summary || '');
      setCancellationPolicy(product.cancellation_policy || '');

      setMetaTitle(product.meta_title || '');
      setMetaDescription(product.meta_description || '');
    }
  }, [product]);

  const handleUpdateProduct = async () => {
    if (!name.trim()) {
      alert('Product title is required.');
      setActiveTab('basic');
      return;
    }

    const payload = {
      name,
      category_id: categoryId || undefined,
      subcategory_id: subcategoryId || undefined,
      brand_id: brandId || undefined,
      sku: sku || undefined,
      short_description: shortDescription,
      description,
      original_price: originalPrice,
      offer_price: offerPrice,
      cost_price: costPrice,
      gst_percent: gstPercent,
      tax_inclusive: taxInclusive,
      stock_quantity: stockQuantity,
      images,
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
      status,
    };

    try {
      await updateProductMutation.mutateAsync({ id: productId, payload });
      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error updating product.');
    }
  };

  const selectedCategoryObj = categories.find((c: any) => c.id === categoryId);
  const subcategories = selectedCategoryObj?.children || selectedCategoryObj?.subcategories || [];

  if (isLoadingProduct) {
    return (
      <div className="py-20 text-center text-xs font-bold text-foreground/50 animate-pulse">
        Loading product details for editing...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Products', href: '/admin/products' }, { label: `Edit Product #${productId}` }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/products"
                className="p-2 bg-muted/40 rounded-2xl text-foreground/70 hover:text-foreground hover:bg-muted transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
                  <span>Edit Product #{productId}</span>
                </h1>
                <p className="text-xs text-foreground/60">
                  Update product details, pricing, inventory, variants, and moderation status.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdateProduct}
              disabled={updateProductMutation.isPending}
              className="px-6 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-2xl hover:bg-rose-600 transition-all inline-flex items-center gap-1.5 shadow-md self-end sm:self-auto"
            >
              {updateProductMutation.isPending ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>

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
              <span>5. Logistics & Status</span>
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
                <label className="text-xs font-bold text-foreground mb-1 block">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Full Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveTab('attributes')}
                  className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Next: Attributes →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DYNAMIC ATTRIBUTES */}
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
                  Next: Gallery →
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
                    <label className="text-xs font-bold text-foreground mb-1 block">Stock Quantity *</label>
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
                      <span>Price includes GST</span>
                    </label>
                  </div>
                </div>
              </div>

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
                  Next: Logistics & Status →
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LOGISTICS & STATUS */}
          {activeTab === 'shipping_policies_seo' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-muted/20 rounded-3xl border border-border/40 space-y-4">
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" /> Moderation Lifecycle Status
                </h3>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Catalog Product Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold uppercase"
                  >
                    <option value="approved">Approved & Live</option>
                    <option value="pending_review">Pending Moderation</option>
                    <option value="draft">Draft</option>
                    <option value="hidden">Hidden / Unpublished</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
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
                  onClick={handleUpdateProduct}
                  disabled={updateProductMutation.isPending}
                  className="px-8 py-3 bg-rose-500 text-white font-extrabold text-xs rounded-2xl hover:bg-rose-600 transition-all shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Product Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
