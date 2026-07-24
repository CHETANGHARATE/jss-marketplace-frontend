'use client';

import React, { useState, useMemo } from 'react';
import { useAdminBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { ApiBrand } from '../../../types/api';
import { Award, Plus, Pencil, Trash2, Search, ImageOff } from 'lucide-react';

export default function BrandsPage() {
  const { data: brandsRes, isLoading } = useAdminBrandsQuery();
  const brands = brandsRes?.data || [];
  const createBrand = useCreateBrandMutation();
  const updateBrand = useUpdateBrandMutation();
  const deleteBrand = useDeleteBrandMutation();

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiBrand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: ''
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filteredBrands = useMemo(() => {
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(search.toLowerCase()) || 
      (brand.slug && brand.slug.toLowerCase().includes(search.toLowerCase()))
    );
  }, [brands, search]);

  const openModal = (brand?: ApiBrand) => {
    setErrorMsg('');
    if (brand) {
      setEditingItem(brand);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logo_url: brand.logo || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', logo_url: '' });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingItem(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        logo_url: formData.logo_url
      };

      if (editingItem) {
        await updateBrand.mutateAsync({ id: editingItem.id, data: payload });
      } else {
        await createBrand.mutateAsync(payload);
      }
      closeModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete brand');
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="space-y-8 max-w-6xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Brands', href: '/admin/brands' }
          ]} />

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-rose-500" />
              Brands
            </h1>
            <button 
              onClick={() => openModal()}
              className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Brand
            </button>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input 
                type="text" 
                placeholder="Search brands..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Logo</th>
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Name</th>
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Slug</th>
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Description</th>
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoading ? (
                    <tr><td colSpan={5} className="py-4 text-center text-foreground/50">Loading...</td></tr>
                  ) : filteredBrands.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-foreground/50">No brands found.</td></tr>
                  ) : (
                    filteredBrands.map(brand => (
                      <tr key={brand.id} className="group hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-2">
                          <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/40 flex items-center justify-center overflow-hidden">
                            {brand.logo ? (
                              <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-foreground/40 font-bold uppercase">{brand.name.substring(0, 2)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-bold text-sm">{brand.name}</span>
                        </td>
                        <td className="py-4 px-2 text-foreground/70">
                          {brand.slug || '-'}
                        </td>
                        <td className="py-4 px-2 text-foreground/70">
                          <div className="max-w-xs line-clamp-1">{brand.description || '-'}</div>
                        </td>
                        <td className="py-4 px-2 text-right space-x-2">
                          {deleteConfirmId === brand.id ? (
                            <div className="inline-flex items-center gap-2">
                              <span className="text-rose-500">Sure?</span>
                              <button onClick={() => handleDelete(brand.id)} className="text-rose-500 hover:underline">Yes</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="text-foreground/50 hover:underline">No</button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => openModal(brand)} className="p-2 text-foreground/50 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/10">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteConfirmId(brand.id)} className="p-2 text-foreground/50 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 w-full max-w-lg shadow-xl border border-border/40">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Brand' : 'Create Brand'}</h2>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">Logo URL</label>
                <div className="flex gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-foreground/5 border border-border/40 flex items-center justify-center overflow-hidden">
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <ImageOff className="w-4 h-4 text-foreground/40" />
                    )}
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={formData.logo_url}
                    onChange={e => setFormData({...formData, logo_url: e.target.value})}
                    className="flex-1 px-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-xs rounded-xl hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
