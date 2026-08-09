'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useAdminProductDetailsQuery, useUpdateAdminProductMutation } from '@/hooks/useAdmin';
import { DynamicAttributeForm } from '@/components/vendor/DynamicAttributeForm';
import { ProductVariantsManager } from '@/components/vendor/ProductVariantsManager';
import { ImageGalleryUploader } from '@/components/vendor/ImageGalleryUploader';
import { ApiProductVariant } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

import {
  ArrowLeft,
  Save,
  FileText,
  Sliders,
  ImageIcon,
  DollarSign,
  Truck,
  ShieldCheck,
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
  const [highlightsText, setHighlightsText] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  // Pricing & Inventory
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [taxInclusive, setTaxInclusive] = useState<boolean>(true);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
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
  const [metaKeywords, setMetaKeywords] = useState('');

  // Unwrap potential API response nesting
  const realProduct = useMemo(() => {
    if (!product) return null;
    return (product as any)?.data || (product as any)?.product || product;
  }, [product]);

  // Prepopulate form data when product details load
  useEffect(() => {
    if (realProduct) {
      // 1. Basic Information
      const pName = realProduct.name;
      const nameVal = typeof pName === 'string'
        ? pName
        : (pName?.en || pName?.hi || pName?.mr || realProduct.name_translations?.en || '');
      setName(nameVal);

      const catId = realProduct.category_id || realProduct.category?.id || null;
      const subCatId = realProduct.subcategory_id || realProduct.subcategory?.id || null;
      const bId = realProduct.brand_id || realProduct.brand?.id || null;

      setCategoryId(catId ? Number(catId) : null);
      setSubcategoryId(subCatId ? Number(subCatId) : null);
      setBrandId(bId ? Number(bId) : null);
      setSku(realProduct.sku || '');

      const pShort = realProduct.short_description;
      const shortDescVal = typeof pShort === 'string'
        ? pShort
        : (pShort?.en || pShort?.hi || pShort?.mr || '');
      setShortDescription(shortDescVal);

      const pDesc = realProduct.description;
      const descVal = typeof pDesc === 'string'
        ? pDesc
        : (pDesc?.en || pDesc?.hi || pDesc?.mr || '');
      setDescription(descVal);

      if (Array.isArray(realProduct.highlights)) {
        setHighlightsText(realProduct.highlights.join('\n'));
      } else if (typeof realProduct.highlights === 'string') {
        setHighlightsText(realProduct.highlights);
      } else {
        setHighlightsText('');
      }

      setSearchKeywords(realProduct.search_keywords || '');

      // 2. Pricing & Inventory
      setOriginalPrice(Number(realProduct.originalPrice ?? realProduct.original_price ?? realProduct.mrp ?? 0));
      setOfferPrice(Number(realProduct.offerPrice ?? realProduct.offer_price ?? realProduct.price ?? 0));
      setCostPrice(Number(realProduct.cost_price ?? 0));
      setGstPercent(Number(realProduct.gst_percent ?? 18));
      setTaxInclusive(Boolean(realProduct.tax_inclusive ?? true));
      setStockQuantity(Number(realProduct.stockQuantity ?? realProduct.stock_quantity ?? realProduct.quantity ?? 0));
      setStatus(realProduct.status || 'approved');

      // 3. Gallery Images & Cover Selection
      let existingImages: string[] = [];
      if (Array.isArray(realProduct.images) && realProduct.images.length > 0) {
        existingImages = realProduct.images.map((img: any) => {
          if (typeof img === 'string') return img;
          return img.image_url || img.image_path || img.image || img.url || '';
        }).filter(Boolean);
      }
      if (existingImages.length === 0 && (realProduct.image || realProduct.primary_image || realProduct.thumbnail)) {
        const single = realProduct.image || realProduct.primary_image || realProduct.thumbnail;
        if (typeof single === 'string' && single) existingImages = [single];
        else if (single?.image_url) existingImages = [single.image_url];
      }
      setImages(existingImages);

      // 4. Variants
      if (Array.isArray(realProduct.variants) && realProduct.variants.length > 0) {
        setVariants(realProduct.variants);
      } else {
        setVariants([]);
      }

      // 5. Dynamic Attributes & Custom Specifications
      const attrVals = realProduct.attribute_values || realProduct.attributeValues;
      if (Array.isArray(attrVals)) {
        setSelectedAttributeValues(attrVals.map((v: any) => typeof v === 'number' ? v : (v.id || v.attribute_value_id)));
      } else {
        setSelectedAttributeValues([]);
      }

      const specs = realProduct.specifications || realProduct.custom_specifications;
      if (Array.isArray(specs) && specs.length > 0) {
        setCustomSpecifications(specs.map((s: any) => ({
          key: s.spec_key || s.name || s.key || '',
          value: s.spec_value || s.value || ''
        })).filter(s => s.key || s.value));
      } else {
        setCustomSpecifications([]);
      }

      // 6. Shipping & Logistics
      setWeight(Number(realProduct.weight ?? 0.5));
      setLength(Number(realProduct.length ?? 10));
      setWidth(Number(realProduct.width ?? 10));
      setHeight(Number(realProduct.height ?? 10));
      setDispatchDays(Number(realProduct.dispatch_days ?? 1));
      setShippingCharge(Number(realProduct.shipping_charge ?? 0));
      setIsFreeShipping(Boolean(realProduct.is_free_shipping ?? true));
      setIsCodAvailable(Boolean(realProduct.is_cod_available ?? true));

      // 7. Store Policies
      setReturnPolicy(realProduct.return_policy || '7 Days Return & Replacement');
      setReplacementPolicy(realProduct.replacement_policy || '');
      setWarrantySummary(realProduct.warranty_summary || '');
      setGuaranteeSummary(realProduct.guarantee_summary || '');
      setCancellationPolicy(realProduct.cancellation_policy || '');

      // 8. SEO Metadata
      setMetaTitle(realProduct.meta_title || realProduct.seo_title || '');
      setMetaDescription(realProduct.meta_description || realProduct.seo_description || '');
      setMetaKeywords(realProduct.meta_keywords || realProduct.search_keywords || '');
    }
  }, [realProduct]);

  // Guaranteed Category Options list
  const categoryOptions = useMemo(() => {
    const list = [...categories];
    if (categoryId && !list.some((c: any) => Number(c.id) === Number(categoryId))) {
      const catObj = realProduct?.category;
      if (catObj) {
        list.unshift({
          id: categoryId,
          name: typeof catObj.name === 'string' ? catObj.name : (catObj.name?.en || 'Category'),
        });
      }
    }
    return list;
  }, [categories, categoryId, realProduct?.category]);

  // Guaranteed Selected Category Object
  const selectedCategoryObj = useMemo(() => {
    return categories.find((c: any) => Number(c.id) === Number(categoryId))
      || (realProduct?.category?.id === categoryId ? realProduct.category : null);
  }, [categories, categoryId, realProduct?.category]);

  // Guaranteed Subcategories Options list
  const subcategoriesOptions = useMemo(() => {
    let list: any[] = [];
    if (selectedCategoryObj) {
      list = selectedCategoryObj.children || selectedCategoryObj.subcategories || [];
    }
    if (subcategoryId && !list.some((s: any) => Number(s.id) === Number(subcategoryId))) {
      const subObj = realProduct?.subcategory;
      if (subObj) {
        list = [{
          id: subcategoryId,
          name: typeof subObj.name === 'string' ? subObj.name : (subObj.name?.en || 'Subcategory'),
        }, ...list];
      }
    }
    return list;
  }, [selectedCategoryObj, subcategoryId, realProduct?.subcategory]);

  // Guaranteed Brands Options list
  const brandOptions = useMemo(() => {
    const list = [...brands];
    if (brandId && !list.some((b: any) => Number(b.id) === Number(brandId))) {
      const bObj = realProduct?.brand;
      if (bObj) {
        list.unshift({
          id: brandId,
          name: bObj.name || 'Brand',
          slug: bObj.slug || '',
        });
      }
    }
    return list;
  }, [brands, brandId, realProduct?.brand]);

  const handleUpdateProduct = async () => {
    if (!name.trim()) {
      alert('Product title is required.');
      setActiveTab('basic');
      return;
    }

    const highlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      name,
      category_id: categoryId || undefined,
      subcategory_id: subcategoryId || undefined,
      brand_id: brandId || undefined,
      sku: sku || undefined,
      short_description: shortDescription,
      description,
      highlights,
      search_keywords: searchKeywords,
      original_price: originalPrice,
      offer_price: offerPrice,
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
      guarantee_summary: guaranteeSummary,
      cancellation_policy: cancellationPolicy,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
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

  if (isLoadingProduct) {
    return (
      <div className="py-20 text-center text-xs font-bold text-foreground/50 animate-pulse">
        Loading product details for editing...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit Product #${productId}`}
        subtitle="Update product details, pricing, inventory, variants, specifications, SEO, and moderation status. All existing data is fully pre-populated."
        badge="Catalog Editor"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: `Edit #${productId}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="px-4 py-2.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>

            <button
              type="button"
              onClick={handleUpdateProduct}
              disabled={updateProductMutation.isPending}
              className="px-6 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              {updateProductMutation.isPending ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Changes</span>
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
          <span>3. Gallery ({images.length})</span>
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
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat: any) => (
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
                disabled={!categoryId || subcategoriesOptions.length === 0}
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold disabled:opacity-50"
              >
                <option value="">Select Subcategory</option>
                {subcategoriesOptions.map((sub: any) => (
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
                className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold"
              >
                <option value="">Select Brand</option>
                {brandOptions.map((b: any) => (
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
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-mono font-bold"
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

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">Product Highlights (One per line)</label>
            <textarea
              rows={3}
              placeholder="• Active Noise Cancellation&#10;• 30 Hours Battery Life&#10;• Bluetooth 5.3 Quick Connect"
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">Search Keywords (Comma separated)</label>
            <input
              type="text"
              placeholder="wireless, headphones, bluetooth, audio"
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('attributes')}
              className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all shadow-2xs"
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
              className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all shadow-2xs"
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
              className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all shadow-2xs"
            >
              Next: Price & Variants →
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & VARIANTS */}
      {activeTab === 'pricing_variants' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 bg-card rounded-3xl border border-border-custom/80 space-y-4 shadow-2xs">
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
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Selling Offer Price (₹)</label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold text-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Cost Price (Admin confidential)</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold"
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
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold"
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
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none font-bold text-indigo-500"
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
              className="px-6 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all shadow-2xs"
            >
              Next: Logistics & Status →
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: LOGISTICS & STATUS */}
      {activeTab === 'shipping_policies_seo' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-5 bg-card rounded-3xl border border-border-custom/80 space-y-4 shadow-2xs">
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
  );
}
