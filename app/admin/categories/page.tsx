'use client';

import React, { useState, useMemo } from 'react';
import {
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAdminSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryStatusMutation,
} from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { ApiCategory } from '../../../types/api';
import { useToast } from '../../../components/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronRight,
  FolderOpen,
  ListTree,
  Tag,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Filter,
  Sparkles,
} from 'lucide-react';

const getCategoryName = (name: ApiCategory['name'] | undefined): string => {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    return name.en || name.hi || name.mr || 'Unknown';
  }
  return 'Unknown';
};

export default function CategoriesPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const { data: categories = [], isLoading: isCategoriesLoading } = useAdminCategoriesQuery();
  const { data: subcategoriesList = [], isLoading: isSubcategoriesLoading } = useAdminSubcategoriesQuery();

  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const deleteCategory = useDeleteCategoryMutation();

  const createSubcategory = useCreateSubcategoryMutation();
  const updateSubcategory = useUpdateSubcategoryMutation();
  const deleteSubcategory = useDeleteCategoryMutation();
  const updateSubcategoryStatus = useUpdateSubcategoryStatusMutation();

  // Active View Tab: 'categories' | 'subcategories'
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [selectedParentId, setSelectedParentId] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  // Parent Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '', icon: '' });

  // Subcategory Modal State
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<ApiCategory | null>(null);
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    parent_id: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Filtered Top-Level Categories
  const topLevelCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parent_id);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return topLevelCategories.filter((cat) =>
      getCategoryName(cat.name).toLowerCase().includes(search.toLowerCase())
    );
  }, [topLevelCategories, search]);

  // Derived Subcategories (either from tree children or flat subcategories endpoint)
  const allSubcategories = useMemo(() => {
    if (subcategoriesList.length > 0) return subcategoriesList;
    const items: ApiCategory[] = [];
    topLevelCategories.forEach((parent) => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach((child) => {
          items.push({ ...child, parent });
        });
      }
    });
    return items;
  }, [subcategoriesList, topLevelCategories]);

  const filteredSubcategories = useMemo(() => {
    return allSubcategories.filter((sub) => {
      const matchesSearch = getCategoryName(sub.name).toLowerCase().includes(search.toLowerCase()) ||
        sub.slug?.toLowerCase().includes(search.toLowerCase());
      const matchesParent = selectedParentId === 'all' || sub.parent_id === selectedParentId;
      return matchesSearch && matchesParent;
    });
  }, [allSubcategories, search, selectedParentId]);

  // Modal Handlers — Category
  const openCategoryModal = (category?: ApiCategory) => {
    setErrorMsg('');
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: getCategoryName(category.name),
        description: typeof category.description === 'string' ? category.description : category.description?.en || '',
        icon: category.icon || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: '', description: '', icon: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        name: { en: categoryFormData.name },
        description: { en: categoryFormData.description },
        icon: categoryFormData.icon,
      };

      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data: payload });
      } else {
        await createCategory.mutateAsync(payload);
      }
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal Handlers — Subcategory
  const openSubcategoryModal = (subcategory?: ApiCategory, defaultParentId?: number) => {
    setErrorMsg('');
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setSubcategoryFormData({
        name: getCategoryName(subcategory.name),
        parent_id: subcategory.parent_id ? String(subcategory.parent_id) : '',
        slug: subcategory.slug || '',
        description: typeof subcategory.description === 'string' ? subcategory.description : subcategory.description?.en || '',
        sort_order: subcategory.sort_order || 0,
        is_active: subcategory.is_active ?? true,
      });
    } else {
      setEditingSubcategory(null);
      setSubcategoryFormData({
        name: '',
        parent_id: defaultParentId ? String(defaultParentId) : (topLevelCategories[0]?.id ? String(topLevelCategories[0].id) : ''),
        slug: '',
        description: '',
        sort_order: 0,
        is_active: true,
      });
    }
    setIsSubcategoryModalOpen(true);
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const generatedSlug = subcategoryFormData.slug ||
        subcategoryFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const payload = {
        name: { en: subcategoryFormData.name },
        parent_id: Number(subcategoryFormData.parent_id),
        slug: generatedSlug,
        description: { en: subcategoryFormData.description },
        sort_order: Number(subcategoryFormData.sort_order),
        is_active: subcategoryFormData.is_active,
      };

      if (editingSubcategory) {
        await updateSubcategory.mutateAsync({ id: editingSubcategory.id, data: payload });
      } else {
        await createSubcategory.mutateAsync(payload);
      }
      setIsSubcategoryModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save subcategory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    try {
      await deleteSubcategory.mutateAsync(id);
      setDeleteConfirmId(null);
      toastSuccess('Subcategory deleted successfully.');
    } catch (err: any) {
      toastError(err.message || 'Failed to delete subcategory.');
    }
  };

  const handleToggleSubcategoryStatus = async (sub: ApiCategory) => {
    try {
      await updateSubcategoryStatus.mutateAsync({
        id: sub.id,
        payload: { is_active: !sub.is_active },
      });
      toastSuccess(`Subcategory ${!sub.is_active ? 'activated' : 'deactivated'}.`);
    } catch (err: any) {
      toastError(err.message || 'Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Marketplace Categories & Subcategories"
        subtitle="Manage top-level categories, subcategories, sort ordering, icons, and duplicate category protection."
        badge="Taxonomy Management"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Categories' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => openSubcategoryModal()}
              className="px-4 py-2.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card transition-all flex items-center gap-2 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Subcategory</span>
            </button>

            <button
              onClick={() => openCategoryModal()}
              className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        }
      />

          {/* View Tab Switcher */}
          <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'categories'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-card text-foreground/70 hover:bg-foreground/5 border border-border/40'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Parent Categories ({topLevelCategories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('subcategories')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'subcategories'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-card text-foreground/70 hover:bg-foreground/5 border border-border/40'
                }`}
              >
                <ListTree className="w-4 h-4" />
                <span>Subcategories ({allSubcategories.length})</span>
              </button>
            </div>

            {/* Subcategory Filter Dropdown (visible in Subcategories tab) */}
            {activeTab === 'subcategories' && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-custom" />
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-border/40 bg-background text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  <option value="all">All Parent Categories</option>
                  {topLevelCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryName(cat.name)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Main Card */}
          <div className="bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input
                type="text"
                placeholder={activeTab === 'categories' ? 'Search categories...' : 'Search subcategories...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-medium"
              />
            </div>

            {/* TAB 1: PARENT CATEGORIES TABLE */}
            {activeTab === 'categories' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Category Name</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Slug</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Subcategories</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {isCategoriesLoading ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-foreground/50">
                          <Sparkles className="w-6 h-6 animate-spin mx-auto text-rose-500 mb-2" />
                          <span>Loading Marketplace Categories...</span>
                        </td>
                      </tr>
                    ) : filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-foreground/50">
                          No categories found.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((cat) => {
                        const subCount = cat.children?.length ||
                          allSubcategories.filter((s) => s.parent_id === cat.id).length;

                        return (
                          <tr key={cat.id} className="group hover:bg-foreground/5 transition-colors">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center font-bold">
                                  <FolderOpen className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-bold text-sm text-foreground block">{getCategoryName(cat.name)}</span>
                                  {cat.description && (
                                    <span className="text-[10px] text-foreground/50 line-clamp-1">
                                      {typeof cat.description === 'string' ? cat.description : cat.description?.en}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-2 font-mono text-xs text-foreground/60">
                              {cat.slug}
                            </td>

                            <td className="py-4 px-2">
                              <button
                                onClick={() => {
                                  setSelectedParentId(cat.id);
                                  setActiveTab('subcategories');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all"
                              >
                                <ListTree className="w-3.5 h-3.5" />
                                <span>{subCount} Subcategories</span>
                              </button>
                            </td>

                            <td className="py-4 px-2 text-right space-x-2">
                              <button
                                onClick={() => openSubcategoryModal(undefined, cat.id)}
                                title="Add Subcategory under this Category"
                                className="p-2 text-foreground/50 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openCategoryModal(cat)}
                                className="p-2 text-foreground/50 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/10"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: SUBCATEGORIES TABLE */}
            {activeTab === 'subcategories' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Subcategory Name</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Parent Category</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Sort Order</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px]">Status</th>
                      <th className="pb-3 px-2 text-foreground/50 uppercase text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {isSubcategoriesLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-foreground/50">
                          <Sparkles className="w-6 h-6 animate-spin mx-auto text-rose-500 mb-2" />
                          <span>Loading Subcategories...</span>
                        </td>
                      </tr>
                    ) : filteredSubcategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-foreground/50">
                          No subcategories found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubcategories.map((sub) => {
                        const parentCat = topLevelCategories.find((c) => c.id === sub.parent_id) || sub.parent;
                        return (
                          <tr key={sub.id} className="group hover:bg-foreground/5 transition-colors">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-rose-500 shrink-0" />
                                <div>
                                  <span className="font-bold text-sm text-foreground block">{getCategoryName(sub.name)}</span>
                                  <span className="font-mono text-[10px] text-foreground/50 block">{sub.slug}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-2">
                              <span className="px-2.5 py-1 bg-background-secondary border border-border/60 rounded-xl text-xs font-bold text-foreground/80">
                                {parentCat ? getCategoryName(parentCat.name) : 'Category #' + sub.parent_id}
                              </span>
                            </td>

                            <td className="py-4 px-2 font-mono text-xs text-foreground/70">
                              {sub.sort_order ?? 0}
                            </td>

                            <td className="py-4 px-2">
                              <button
                                onClick={() => handleToggleSubcategoryStatus(sub)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                                  sub.is_active !== false
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                }`}
                              >
                                {sub.is_active !== false ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    <span>Inactive</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="py-4 px-2 text-right space-x-2">
                              {deleteConfirmId === sub.id ? (
                                <div className="inline-flex items-center gap-2">
                                  <span className="text-rose-500 text-xs font-bold">Delete?</span>
                                  <button
                                    onClick={() => handleDeleteSubcategory(sub.id)}
                                    className="px-2 py-0.5 bg-rose-500 text-white rounded-lg text-xs font-bold"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-0.5 bg-background border border-border/40 text-foreground/70 rounded-lg text-xs font-bold"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => openSubcategoryModal(sub)}
                                    className="p-2 text-foreground/50 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/10"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(sub.id)}
                                    className="p-2 text-foreground/50 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

      {/* MODAL: CREATE / EDIT SUBCATEGORY */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl border border-border/40 space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-500" />
                <span>{editingSubcategory ? 'Edit Subcategory' : 'Create New Subcategory'}</span>
              </h2>
              <button
                onClick={() => setIsSubcategoryModalOpen(false)}
                className="text-foreground/50 hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubcategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  Parent Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={subcategoryFormData.parent_id}
                  onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, parent_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  <option value="" disabled>
                    Select Parent Category
                  </option>
                  {topLevelCategories.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getCategoryName(p.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  Subcategory Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Smart Watches, Organic Seeds"
                  value={subcategoryFormData.name}
                  onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="smart-watches"
                  value={subcategoryFormData.slug}
                  onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={subcategoryFormData.sort_order}
                    onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, sort_order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                    Active Status
                  </label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subcategoryFormData.is_active}
                      onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                    />
                    <span className="text-xs font-bold text-foreground">Is Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={subcategoryFormData.description}
                  onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsSubcategoryModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-xs rounded-xl hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PARENT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl border border-border/40 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-rose-500" />
              <span>{editingCategory ? 'Edit Parent Category' : 'Create Parent Category'}</span>
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 font-bold text-xs rounded-xl hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
