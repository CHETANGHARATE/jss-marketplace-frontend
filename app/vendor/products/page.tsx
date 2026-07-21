'use client';

import React, { useState } from 'react';
import {
  useVendorProductsQuery,
  useCreateVendorProductMutation,
  useDeleteVendorProductMutation
} from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { Package, Plus, Search, Trash2, X, Sparkles, Star } from 'lucide-react';

export default function VendorProductsPage() {
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useVendorProductsQuery({ search });
  const createMutation = useCreateVendorProductMutation();
  const deleteMutation = useDeleteVendorProductMutation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    original_price: 1000,
    sale_price: 899,
    stock_quantity: 25,
    description: '',
  });

  const products = data?.data || [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({
          name: '',
          sku: '',
          original_price: 1000,
          sale_price: 899,
          stock_quantity: 25,
          description: '',
        });
      },
    });
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
                <span>Vendor Product Catalog</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                List new items, update prices, and manage product status.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product title or SKU..."
              className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3.5" />
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading vendor catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Products Listed</h3>
              <p className="text-xs text-foreground/60">Start adding products to sell on the marketplace.</p>
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
                    <th className="pb-3 px-2">Rating</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
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
                      <td className="py-3.5 px-2 font-black text-primary">
                        ₹{(prod.sale_price || prod.original_price).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            prod.stock_quantity <= 5
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-emerald-500/10 text-emerald-600'
                          }`}
                        >
                          {prod.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{prod.rating ? Number(prod.rating).toFixed(1) : '5.0'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => deleteMutation.mutate(prod.id)}
                          className="p-1.5 text-foreground/40 hover:text-rose-500 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card text-foreground w-full max-w-lg border border-border/40 rounded-3xl p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>List New Vendor Product</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-foreground/70">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wireless Bluetooth Noise-Cancelling Headphones"
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-foreground/70">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-98401"
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground/70">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-foreground/70">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground/70">Sale Offer Price (₹)</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-foreground/70">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product overview and key specifications..."
                  className="w-full bg-muted/30 border border-border/40 rounded-xl p-3.5 text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Publish Product to Marketplace</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
