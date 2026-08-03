'use client';

import React, { useState } from 'react';
import {
  useAdminProductsQuery,
  useAdminPendingProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useRequestProductChangesMutation,
  useToggleFeatureProductMutation
} from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Package, Search, CheckCircle2, XCircle, Sparkles, Clock, AlertTriangle, Eye } from 'lucide-react';
import { ApiProduct } from '../../../types/api';

export default function AdminProductsPage() {
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');

  const { data: allProductsData, isLoading: isLoadingAll } = useAdminProductsQuery({ search });
  const { data: pendingProductsData, isLoading: isLoadingPending } = useAdminPendingProductsQuery();

  const approveMutation = useApproveProductMutation();
  const rejectMutation = useRejectProductMutation();
  const requestChangesMutation = useRequestProductChangesMutation();
  const featureMutation = useToggleFeatureProductMutation();

  const [rejectingProduct, setRejectingProduct] = useState<ApiProduct | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [inspectingProduct, setInspectingProduct] = useState<ApiProduct | null>(null);

  const products = activeTab === 'pending'
    ? (pendingProductsData?.data || [])
    : (allProductsData?.data || []);

  const isLoading = activeTab === 'pending' ? isLoadingPending : isLoadingAll;

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error approving product.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingProduct || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectingProduct.id, reason: rejectReason });
      setRejectingProduct(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error rejecting product.');
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Product Catalog' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Package className="w-6 h-6 text-rose-500" />
                <span>Catalog Moderation & Approvals (Module 15)</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Vendor products must be approved by Admin before becoming live on the marketplace.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-2xl border border-border/40 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'pending'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Moderation</span>
                {pendingProductsData?.data?.length ? (
                  <span className="bg-white text-rose-500 px-1.5 py-0.2 text-[10px] font-black rounded-full">
                    {pendingProductsData.data.length}
                  </span>
                ) : null}
              </button>
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
            </div>
          </div>

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
              Loading catalog for moderation...
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">
                {activeTab === 'pending' ? 'No Pending Approvals' : 'No Products Found'}
              </h3>
              <p className="text-xs text-foreground/60">
                {activeTab === 'pending'
                  ? 'All vendor product submissions have been reviewed and moderated.'
                  : 'No product catalog items matching your query.'}
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
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((prod) => {
                    const displayImage = prod.image || prod.images?.[0] || '/placeholder-product.png';
                    const displayPrice = prod.offerPrice ?? prod.originalPrice ?? prod.sale_price ?? prod.original_price ?? 0;

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
                          {prod.seller?.name || 'JSS Merchant'}
                        </td>
                        <td className="py-3.5 px-2 font-black text-rose-500">
                          ₹{displayPrice.toLocaleString()}
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
                        <td className="py-3.5 px-2 text-right space-x-2">
                          <button
                            onClick={() => setInspectingProduct(prod)}
                            className="px-2.5 py-1 bg-muted/60 text-foreground rounded-xl text-[10px] font-bold hover:bg-muted transition-all inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                          <button
                            onClick={() => handleApprove(prod.id)}
                            disabled={approveMutation.isPending}
                            className="px-2.5 py-1 bg-emerald-500 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-600 transition-all inline-flex items-center gap-1 shadow-xs disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingProduct(prod)}
                            className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-bold hover:bg-rose-500/20 transition-all inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
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

      {/* Product Detail Inspector Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-xl border border-border/40 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-foreground">{inspectingProduct.name}</h3>
                <span className="text-xs text-foreground/60">Submitted by: {inspectingProduct.seller?.name || 'Vendor'}</span>
              </div>
              <button onClick={() => setInspectingProduct(null)} className="text-xs font-bold text-foreground/50 hover:text-foreground">
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="aspect-square bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-border/40">
                <img src={inspectingProduct.image || inspectingProduct.images?.[0] || '/placeholder-product.png'} alt={inspectingProduct.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-bold text-foreground/50 block">MRP / Offer Price:</span>
                  <span className="font-black text-sm text-rose-500">₹{(inspectingProduct.offerPrice ?? inspectingProduct.originalPrice ?? 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground/50 block">SKU:</span>
                  <span className="font-mono text-foreground">{inspectingProduct.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground/50 block">Stock Quantity:</span>
                  <span className="font-bold text-foreground">{inspectingProduct.stockQuantity ?? inspectingProduct.stock_quantity ?? 0} units</span>
                </div>
                <div>
                  <span className="font-bold text-foreground/50 block">Description:</span>
                  <p className="text-foreground/80 line-clamp-4">{inspectingProduct.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
              <button
                onClick={() => {
                  handleApprove(inspectingProduct.id);
                  setInspectingProduct(null);
                }}
                className="px-5 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Approve Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

