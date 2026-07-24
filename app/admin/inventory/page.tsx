'use client';

import React, { useState } from 'react';
import { useAdminInventoriesQuery, useAdminLowStockQuery, useAddStockMutation, useAdjustStockMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { InventoryRecord } from '../../../services/adminService';
import { Warehouse, AlertTriangle, Plus, ArrowUpDown, Search, X } from 'lucide-react';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: allInventoryRes, isLoading: isLoadingAll } = useAdminInventoriesQuery();
  const { data: lowStockRes, isLoading: isLoadingLow } = useAdminLowStockQuery();
  
  const allInventory = allInventoryRes?.data || [];
  const lowStock = lowStockRes || [];
  
  const addStockMutation = useAddStockMutation();
  const adjustStockMutation = useAdjustStockMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryRecord | null>(null);

  const [addForm, setAddForm] = useState({ product_id: '', quantity: 0, notes: '' });
  const [adjustForm, setAdjustForm] = useState({ quantity: 0, type: 'add' as 'add' | 'remove', reason: '' });

  const currentData = activeTab === 'all' ? allInventory : lowStock;
  const filteredData = currentData?.filter(item => 
    (item.product?.name || 'Product #' + item.product_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (item: InventoryRecord): { label: string; cls: string } => {
    if (item.quantity <= 0) return { label: 'Out of Stock', cls: 'bg-red-500/10 text-red-500' };
    if (item.reorder_level && item.quantity <= item.reorder_level) return { label: 'Low Stock', cls: 'bg-amber-500/10 text-amber-500' };
    return { label: 'In Stock', cls: 'bg-green-500/10 text-green-500' };
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStockMutation.mutateAsync({ ...addForm, product_id: Number(addForm.product_id) });
    setIsAddModalOpen(false);
    setAddForm({ product_id: '', quantity: 0, notes: '' });
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory) return;
    await adjustStockMutation.mutateAsync({
      product_id: selectedInventory.product_id,
      ...adjustForm
    });
    setIsAdjustModalOpen(false);
    setSelectedInventory(null);
    setAdjustForm({ quantity: 0, type: 'add', reason: '' });
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col p-6 sm:p-10 lg:p-12 overflow-auto">
        <div className="max-w-7xl w-full mx-auto space-y-8">
          <Breadcrumbs items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Inventory', href: '/admin/inventory' }
          ]} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Stock
            </button>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-2 p-1 bg-border/20 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'all' ? 'bg-card shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  <Warehouse className="w-4 h-4" />
                  All Inventory
                </button>
                <button
                  onClick={() => setActiveTab('low')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'low' ? 'bg-card shadow-sm text-amber-500' : 'text-foreground/70 hover:text-amber-500'}`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Low Stock Alert
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-foreground/70 text-sm">
                    <th className="pb-4 font-medium">Product Name</th>
                    <th className="pb-4 font-medium">SKU</th>
                    <th className="pb-4 font-medium">Quantity</th>
                    <th className="pb-4 font-medium">Reserved</th>
                    <th className="pb-4 font-medium">Reorder Level</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoadingAll || isLoadingLow ? (
                    <tr><td colSpan={7} className="text-center py-8 text-foreground/50">Loading inventory...</td></tr>
                  ) : filteredData?.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-foreground/50">No inventory records found.</td></tr>
                  ) : (
                    filteredData?.map((item) => (
                      <tr key={item.id} className="border-b border-border/30 hover:bg-border/10 transition-colors">
                        <td className="py-4 font-medium">{item.product?.name || 'Product #' + item.product_id}</td>
                        <td className="py-4 text-foreground/70">{item.product?.['sku'] || 'N/A'}</td>
                        <td className="py-4">{item.quantity}</td>
                        <td className="py-4 text-foreground/70">{item.reserved_quantity || 0}</td>
                        <td className="py-4 text-foreground/70">{item.reorder_level}</td>
                        <td className="py-4">
                          {(() => { const s = getStockStatus(item); return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>; })()}
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => { setSelectedInventory(item); setIsAdjustModalOpen(true); }}
                            className="p-2 text-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors inline-flex"
                            title="Adjust Stock"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Stock</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product ID</label>
                <input required type="text" value={addForm.product_id} onChange={e => setAddForm({...addForm, product_id: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input required type="number" min="1" value={addForm.quantity} onChange={e => setAddForm({...addForm, quantity: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea value={addForm.notes} onChange={e => setAddForm({...addForm, notes: e.target.value})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none h-24" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-full font-medium hover:bg-border/30 transition-colors">Cancel</button>
                <button type="submit" disabled={addStockMutation.isPending} className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50">
                  {addStockMutation.isPending ? 'Adding...' : 'Add Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedInventory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Adjust Stock</h2>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4 p-3 bg-background rounded-xl border border-border/50 text-sm">
              <p><span className="text-foreground/60">Product:</span> {selectedInventory.product?.name || 'Product #' + selectedInventory.product_id}</p>
              <p><span className="text-foreground/60">Current Quantity:</span> {selectedInventory.quantity}</p>
            </div>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="adjustType" checked={adjustForm.type === 'add'} onChange={() => setAdjustForm({...adjustForm, type: 'add'})} className="text-rose-500 focus:ring-rose-500" />
                    <span>Add</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="adjustType" checked={adjustForm.type === 'remove'} onChange={() => setAdjustForm({...adjustForm, type: 'remove'})} className="text-rose-500 focus:ring-rose-500" />
                    <span>Remove</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input required type="number" min="1" value={adjustForm.quantity} onChange={e => setAdjustForm({...adjustForm, quantity: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input required type="text" value={adjustForm.reason} onChange={e => setAdjustForm({...adjustForm, reason: e.target.value})} placeholder="e.g. damaged goods, recount" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-5 py-2.5 rounded-full font-medium hover:bg-border/30 transition-colors">Cancel</button>
                <button type="submit" disabled={adjustStockMutation.isPending} className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50">
                  {adjustStockMutation.isPending ? 'Saving...' : 'Save Adjustments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
