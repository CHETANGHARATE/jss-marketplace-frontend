'use client';

import React, { useState, useMemo } from 'react';
import { useAdminCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { ApiCategory } from '../../../types/api';
import { Layers, Plus, Pencil, Trash2, Search, ChevronRight, FolderOpen } from 'lucide-react';

const getCategoryName = (name: ApiCategory['name'] | undefined): string => {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    return name.en || name.hi || name.mr || 'Unknown';
  }
  return 'Unknown';
};

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useAdminCategoriesQuery();
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const deleteCategory = useDeleteCategoryMutation();

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
    description: ''
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      getCategoryName(cat.name).toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const parentCategories = useMemo(() => {
    return categories.filter(cat => !cat.parent_id);
  }, [categories]);

  const openModal = (category?: ApiCategory) => {
    setErrorMsg('');
    if (category) {
      setEditingItem(category);
      setFormData({
        name: getCategoryName(category.name),
        parent_id: category.parent_id != null ? String(category.parent_id) : '',
        description: category.description || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', parent_id: '', description: '' });
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
        name: { en: formData.name }, // Wrap in expected structure
        parent_id: formData.parent_id || null,
        description: formData.description
      };

      if (editingItem) {
        await updateCategory.mutateAsync({ id: editingItem.id, data: payload });
      } else {
        await createCategory.mutateAsync(payload);
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
      await deleteCategory.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="space-y-8 max-w-6xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Categories', href: '/admin/categories' }
          ]} />

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="w-6 h-6 text-rose-500" />
              Categories
            </h1>
            <button 
              onClick={() => openModal()}
              className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Name</th>
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Parent</th>
                    <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoading ? (
                    <tr><td colSpan={4} className="py-4 text-center text-foreground/50">Loading...</td></tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr><td colSpan={4} className="py-8 text-center text-foreground/50">No categories found.</td></tr>
                  ) : (
                    filteredCategories.map(cat => (
                      <tr key={cat.id} className="group hover:bg-foreground/5 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            {cat.parent_id ? <ChevronRight className="w-4 h-4 text-foreground/40" /> : <FolderOpen className="w-4 h-4 text-rose-500" />}
                            <span className="font-bold text-sm">{getCategoryName(cat.name)}</span>
                          </div>
                          {cat.description && <div className="text-[10px] text-foreground/50 mt-1 line-clamp-1">{cat.description}</div>}
                        </td>
                        <td className="py-4 px-2 text-foreground/70">
                          {cat.parent_id ? getCategoryName(categories.find(c => c.id === cat.parent_id)?.name) || 'Unknown' : '-'}
                        </td>
                        <td className="py-4 px-2 text-right space-x-2">
                          {deleteConfirmId === cat.id ? (
                            <div className="inline-flex items-center gap-2">
                              <span className="text-rose-500">Sure?</span>
                              <button onClick={() => handleDelete(cat.id)} className="text-rose-500 hover:underline">Yes</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="text-foreground/50 hover:underline">No</button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => openModal(cat)} className="p-2 text-foreground/50 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/10">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteConfirmId(cat.id)} className="p-2 text-foreground/50 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
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
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Category' : 'Create Category'}</h2>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">Name (EN)</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">Parent Category</label>
                <select 
                  value={formData.parent_id}
                  onChange={e => setFormData({...formData, parent_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map(p => (
                    <option key={p.id} value={p.id} disabled={editingItem?.id === p.id}>
                      {getCategoryName(p.name)}
                    </option>
                  ))}
                </select>
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
