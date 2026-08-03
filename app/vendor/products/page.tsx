'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useVendorProductsQuery,
  useSubmitVendorProductMutation,
  useDuplicateVendorProductMutation,
  useDeleteVendorProductMutation
} from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { Package, Plus, Search, Trash2, Copy, Send, Star, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function VendorProductsPage() {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { data, isLoading } = useVendorProductsQuery({ search, status: statusFilter || undefined });

  const submitMutation = useSubmitVendorProductMutation();
  const duplicateMutation = useDuplicateVendorProductMutation();
  const deleteMutation = useDeleteVendorProductMutation();

  const products = data?.data || [];

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error duplicating product.');
    }
  };

  const handleSubmitReview = async (id: number) => {
    try {
      await submitMutation.mutateAsync(id);
      alert('Product submitted for Admin approval.');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error submitting product.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error deleting product.');
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal', href: '/vendor' }, { label: 'Products Catalog' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                <span>Vendor Product Catalog (Module 14)</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Manage your product listings, drafts, review status, and variants.
              </p>
            </div>

            <Link
              href="/vendor/products/create"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </Link>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product title or SKU..."
                className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              />
              <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-muted/30 border border-border/40 rounded-2xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary w-full sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="pending_approval">Pending Review</option>
              <option value="approved">Approved & Live</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading vendor catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Products Listed</h3>
              <p className="text-xs text-foreground/60">Click "+ Add New Product" to launch the dynamic creation wizard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                    <th className="pb-3 px-2">Item</th>
                    <th className="pb-3 px-2">SKU</th>
                    <th className="pb-3 px-2">Price</th>
                    <th className="pb-3 px-2">Stock</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((prod) => {
                    const displayImage = prod.image || prod.images?.[0] || '/placeholder-product.png';
                    const displayPrice = prod.offerPrice ?? prod.originalPrice ?? prod.sale_price ?? prod.original_price ?? 0;
                    const stockQty = prod.stockQuantity ?? prod.stock_quantity ?? 0;

                    return (
                      <tr key={prod.id} className="hover:bg-muted/20">
                        <td className="py-3.5 px-2 flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 bg-muted/30 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                            <img src={displayImage} alt={prod.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground line-clamp-1">{prod.name}</span>
                            {prod.rejection_reason && (
                              <span className="text-[10px] text-rose-500 font-medium block">
                                Rejection Note: {prod.rejection_reason}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-foreground/60">{prod.sku || 'N/A'}</td>
                        <td className="py-3.5 px-2 font-black text-primary">
                          ₹{displayPrice.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                              stockQty <= 5
                                ? 'bg-rose-500/10 text-rose-500'
                                : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                          >
                            {stockQty} in stock
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              prod.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : prod.status === 'pending_approval' || prod.status === 'pending_review'
                                ? 'bg-amber-500/10 text-amber-600'
                                : prod.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-600'
                                : 'bg-slate-500/10 text-slate-600'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right space-x-1">
                          {(prod.status === 'draft' || prod.status === 'rejected') && (
                            <button
                              onClick={() => handleSubmitReview(prod.id)}
                              className="px-2 py-1 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-1 shadow-xs"
                              title="Submit for Admin Approval"
                            >
                              <Send className="w-3 h-3" />
                              <span>Submit</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(prod.id)}
                            className="p-1.5 text-foreground/60 hover:text-primary transition-colors"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-1.5 text-foreground/40 hover:text-rose-500 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
