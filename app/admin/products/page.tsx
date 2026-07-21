'use client';

import React, { useState } from 'react';
import {
  useAdminProductsQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useToggleFeatureProductMutation
} from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Package, Search, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useAdminProductsQuery({ search });
  const approveMutation = useApproveProductMutation();
  const rejectMutation = useRejectProductMutation();
  const featureMutation = useToggleFeatureProductMutation();

  const products = data?.data || [];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Product Catalog' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Package className="w-6 h-6 text-rose-500" />
              <span>Catalog Moderation & Approvals</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Review vendor product submissions, approve active listings, or mark items as featured homepage banners.
            </p>
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
              <h3 className="text-base font-bold text-foreground">No Products Found</h3>
              <p className="text-xs text-foreground/60">No product catalog items matching your query.</p>
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
                    <th className="pb-3 px-2 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-muted/20">
                      <td className="py-3.5 px-2 flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 bg-muted/30 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                          <img src={prod.images?.[0] || '/placeholder-product.png'} alt={prod.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="font-bold text-foreground line-clamp-1">{prod.name}</span>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-foreground/60">{prod.sku || 'N/A'}</td>
                      <td className="py-3.5 px-2 font-black text-rose-500">
                        ₹{(prod.sale_price || prod.original_price).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 font-bold text-foreground/70">{prod.stock_quantity}</td>
                      <td className="py-3.5 px-2 text-right space-x-2">
                        <button
                          onClick={() => approveMutation.mutate(prod.id)}
                          disabled={approveMutation.isPending}
                          className="px-2.5 py-1 bg-emerald-500 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-600 transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => featureMutation.mutate(prod.id)}
                          disabled={featureMutation.isPending}
                          className="px-2.5 py-1 bg-amber-500 text-white rounded-xl text-[10px] font-bold hover:bg-amber-600 transition-all inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Feature</span>
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate(prod.id)}
                          disabled={rejectMutation.isPending}
                          className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-bold hover:bg-rose-500/20 transition-all inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
