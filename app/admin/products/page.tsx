'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useAdminProductsQuery,
  useAdminPendingProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useRequestProductChangesMutation,
  useUnpublishProductMutation,
  usePublishProductMutation,
  useDeleteAdminProductMutation,
  useDuplicateAdminProductMutation,
} from '@/hooks/useAdmin';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  Package,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  EyeOff,
  Globe,
  Copy,
  Trash2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Building2,
  Tag,
  Layers,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { ApiProduct } from '@/types/api';

export default function AdminProductsPage() {
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data: allProductsData, isLoading: isLoadingAll } = useAdminProductsQuery({ search });
  const { data: pendingProductsData, isLoading: isLoadingPending } = useAdminPendingProductsQuery();

  const approveMutation = useApproveProductMutation();
  const rejectMutation = useRejectProductMutation();
  const requestChangesMutation = useRequestProductChangesMutation();
  const unpublishMutation = useUnpublishProductMutation();
  const publishMutation = usePublishProductMutation();
  const deleteMutation = useDeleteAdminProductMutation();
  const duplicateMutation = useDuplicateAdminProductMutation();

  const [rejectingProduct, setRejectingProduct] = useState<ApiProduct | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [requestingChangesProduct, setRequestingChangesProduct] = useState<ApiProduct | null>(null);
  const [changeInstructions, setChangeInstructions] = useState('');

  const [deletingProduct, setDeletingProduct] = useState<ApiProduct | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<ApiProduct | null>(null);

  const extractProductsArray = (resData: any): ApiProduct[] => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  };

  const products = activeTab === 'pending'
    ? extractProductsArray(pendingProductsData)
    : extractProductsArray(allProductsData);

  const isLoading = activeTab === 'pending' ? isLoadingPending : isLoadingAll;

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error approving product.');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error unpublishing product.');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishMutation.mutateAsync(id);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error publishing product.');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateMutation.mutateAsync(id);
      setOpenMenuId(null);
      alert('Product duplicated as a Draft copy.');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error cloning product.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error deleting product.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingProduct || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectingProduct.id, reason: rejectReason });
      setRejectingProduct(null);
      setRejectReason('');
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error rejecting product.');
    }
  };

  const handleConfirmRequestChanges = async () => {
    if (!requestingChangesProduct || !changeInstructions.trim()) return;
    try {
      await requestChangesMutation.mutateAsync({ id: requestingChangesProduct.id, instructions: changeInstructions });
      setRequestingChangesProduct(null);
      setChangeInstructions('');
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error requesting changes.');
    }
  };

  return (
    <div className="space-y-8" onClick={() => setOpenMenuId(null)}>
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Product Catalog' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          {/* Header */}
          <div className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Package className="w-6 h-6 text-rose-500" />
                <span>Admin Catalog & Product Management</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Full lifecycle management: Add, Edit, Delete, Clone, Publish, Unpublish, and Moderate vendor submissions.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Link
                href="/admin/products/create"
                className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-2xl hover:bg-rose-600 transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product</span>
              </Link>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-2xl border border-border/40">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'pending'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                  {pendingProductsData?.data?.length ? (
                    <span className="bg-white text-rose-500 px-1.5 py-0.2 text-[10px] font-black rounded-full">
                      {pendingProductsData.data.length}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product title or SKU..."
              className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3.5" />
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading marketplace product catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">
                {activeTab === 'pending' ? 'No Pending Moderations' : 'No Products Listed'}
              </h3>
              <p className="text-xs text-foreground/60">
                {activeTab === 'pending'
                  ? 'All vendor product submissions have been reviewed.'
                  : 'Click "+ Add Product" to list a new marketplace item.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                    <th className="pb-3 px-2">Item</th>
                    <th className="pb-3 px-2">Vendor / Seller</th>
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
                    const isPending = prod.status === 'pending_approval' || prod.status === 'pending_review';

                    return (
                      <tr key={prod.id} className="hover:bg-muted/20">
                        <td className="py-3.5 px-2 flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 bg-muted/30 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                            <img src={displayImage} alt={prod.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] font-mono text-foreground/50">SKU: {prod.sku || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-bold text-foreground/70">
                          {prod.seller?.name || 'Admin Official'}
                        </td>
                        <td className="py-3.5 px-2 font-black text-rose-500">
                          ₹{displayPrice.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-2 font-bold text-foreground/80">
                          {stockQty} units
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              prod.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : isPending
                                ? 'bg-amber-500/10 text-amber-600'
                                : prod.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-600'
                                : prod.status === 'hidden'
                                ? 'bg-slate-500/10 text-slate-600'
                                : 'bg-muted text-foreground/60'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>

                        {/* Modern Dropdown Action Menu (⋮ Kebab) */}
                        <td className="py-3.5 px-2 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === prod.id ? null : prod.id);
                            }}
                            className="p-1.5 text-foreground/60 hover:text-foreground hover:bg-muted/40 rounded-xl transition-all"
                            title="Product Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenuId === prod.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-2 top-10 z-40 bg-card border border-border/60 rounded-2xl shadow-xl w-44 py-1.5 text-left text-xs font-semibold space-y-0.5 backdrop-blur-md"
                            >
                              <button
                                onClick={() => {
                                  setInspectingProduct(prod);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-foreground/80"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                <span>Inspect</span>
                              </button>

                              <Link
                                href={`/admin/products/${prod.id}/edit`}
                                className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-foreground/80"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                                <span>Edit Product</span>
                              </Link>

                              {/* Status-specific actions */}
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleApprove(prod.id)}
                                    className="w-full px-3 py-1.5 hover:bg-emerald-500/10 flex items-center gap-2 text-emerald-600"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setRequestingChangesProduct(prod);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-amber-500/10 flex items-center gap-2 text-amber-600"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Request Changes</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setRejectingProduct(prod);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-rose-500/10 flex items-center gap-2 text-rose-500"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              {prod.status === 'approved' && (
                                <button
                                  onClick={() => handleUnpublish(prod.id)}
                                  className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-slate-600 dark:text-slate-300"
                                >
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Unpublish</span>
                                </button>
                              )}

                              {(prod.status === 'hidden' || prod.status === 'rejected') && (
                                <button
                                  onClick={() => handlePublish(prod.id)}
                                  className="w-full px-3 py-1.5 hover:bg-emerald-500/10 flex items-center gap-2 text-emerald-600"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>Publish</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDuplicate(prod.id)}
                                className="w-full px-3 py-1.5 hover:bg-muted/40 flex items-center gap-2 text-foreground/80"
                              >
                                <Copy className="w-3.5 h-3.5 text-purple-500" />
                                <span>Clone Product</span>
                              </button>

                              <div className="border-t border-border/40 my-1" />

                              <button
                                onClick={() => {
                                  setDeletingProduct(prod);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-rose-500/10 flex items-center gap-2 text-rose-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Product</span>
                              </button>
                            </div>
                          )}
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

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-border/40 space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Delete Product Permanently
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to delete <strong>"{deletingProduct.name}"</strong>?
              <br />
              <span className="text-rose-500 font-bold block mt-1">This action cannot be undone.</span>
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-border/40 space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Reject Product Submission
            </h3>
            <p className="text-xs text-foreground/60">
              Please enter rejection remarks/feedback for vendor <strong>{rejectingProduct.seller?.name || 'Seller'}</strong> regarding "{rejectingProduct.name}".
            </p>
            <textarea
              rows={3}
              placeholder="Provide reason (e.g. Missing high-res image, incorrect pricing, incomplete specifications)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-5 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {requestingChangesProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-border/40 space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" /> Request Changes from Vendor
            </h3>
            <p className="text-xs text-foreground/60">
              Enter instructions for vendor <strong>{requestingChangesProduct.seller?.name || 'Seller'}</strong>. The product status will revert to Draft for edits.
            </p>
            <textarea
              rows={3}
              placeholder="Specify required changes (e.g. Please update product dimensions, clarify warranty period)..."
              value={changeInstructions}
              onChange={(e) => setChangeInstructions(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-amber-500 outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRequestingChangesProduct(null)}
                className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequestChanges}
                disabled={!changeInstructions.trim()}
                className="px-5 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                Send Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Product Detail Inspector Drawer */}
      {inspectingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-xl border border-border/40 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  <span>{inspectingProduct.name}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                    {inspectingProduct.status}
                  </span>
                </h3>
                <span className="text-xs text-foreground/60">SKU: {inspectingProduct.sku || 'N/A'}</span>
              </div>
              <button onClick={() => setInspectingProduct(null)} className="text-xs font-bold text-foreground/50 hover:text-foreground">
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="aspect-square bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-border/40">
                  <img src={inspectingProduct.image || inspectingProduct.images?.[0] || '/placeholder-product.png'} alt={inspectingProduct.name} className="max-h-full max-w-full object-contain" />
                </div>

                {inspectingProduct.images && inspectingProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {inspectingProduct.images.map((img: any, idx: number) => (
                      <div key={idx} className="h-12 w-12 shrink-0 bg-muted/40 rounded-xl p-1 border border-border/40 overflow-hidden">
                        <img src={typeof img === 'string' ? img : (img.image_path || img.image)} alt="Gallery" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-rose-500" /> Vendor Store:</span>
                    <span className="font-black text-foreground">{inspectingProduct.seller?.name || 'Admin Official'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-rose-500" /> Category:</span>
                    <span className="font-bold text-foreground">{typeof inspectingProduct.category?.name === 'string' ? inspectingProduct.category.name : inspectingProduct.category?.name?.en || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-rose-500" /> Brand:</span>
                    <span className="font-bold text-foreground">{inspectingProduct.brand?.name || 'Generic'}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60">Selling Offer Price:</span>
                    <span className="font-black text-sm text-rose-500">₹{(inspectingProduct.offerPrice ?? inspectingProduct.originalPrice ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60">MRP Original:</span>
                    <span className="font-bold text-foreground/70 line-through">₹{(inspectingProduct.originalPrice ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground/60">Stock Available:</span>
                    <span className="font-extrabold text-emerald-600">{inspectingProduct.stockQuantity ?? inspectingProduct.stock_quantity ?? 0} units</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <span className="font-bold text-foreground/60 block flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-rose-500" /> Shipping & Logistics:</span>
                  <p className="text-foreground/80">
                    Dispatch: {inspectingProduct.dispatch_days ?? 1} day(s) | Shipping: ₹{inspectingProduct.shipping_charge ?? 0} | COD: {inspectingProduct.is_cod_available ? 'Yes' : 'No'}
                  </p>
                </div>

                <div className="p-4 bg-muted/20 rounded-2xl space-y-2 border border-border/40">
                  <span className="font-bold text-foreground/60 block flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Warranty & Policies:</span>
                  <p className="text-foreground/80">
                    {inspectingProduct.return_policy || 'Standard marketplace return policy applies.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Link
                href={`/admin/products/${inspectingProduct.id}/edit`}
                className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Full Specifications</span>
              </Link>

              <div className="flex items-center gap-2">
                {(inspectingProduct.status === 'pending_approval' || inspectingProduct.status === 'pending_review' || inspectingProduct.status === 'rejected') && (
                  <button
                    onClick={() => {
                      handleApprove(inspectingProduct.id);
                      setInspectingProduct(null);
                    }}
                    className="px-5 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    Approve Product
                  </button>
                )}
                {inspectingProduct.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleUnpublish(inspectingProduct.id);
                      setInspectingProduct(null);
                    }}
                    className="px-5 py-2 bg-slate-500/10 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-500/20 transition-colors"
                  >
                    Unpublish Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
