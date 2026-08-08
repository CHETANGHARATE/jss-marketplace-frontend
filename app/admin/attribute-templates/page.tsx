'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import {
  useAdminAttributeTemplatesQuery,
  useCreateAttributeTemplateMutation,
  useUpdateAttributeTemplateMutation,
  useDeleteAttributeTemplateMutation,
  useAdminCategoriesQuery
} from '../../../hooks/useAdmin';
import { useAttributes } from '../../../hooks/useAttributes';
import { ApiAttributeTemplate } from '../../../types/api';
import { Sliders, Plus, Pencil, Trash2, Search, Layers, CheckCircle } from 'lucide-react';

export default function AdminAttributeTemplatesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);

  const { data: templates = [], isLoading } = useAdminAttributeTemplatesQuery({
    search: search || undefined,
    category_id: selectedCategoryFilter || undefined,
  });

  const { data: categories = [] } = useAdminCategoriesQuery();
  const { data: attributes = [] } = useAttributes();

  const createMutation = useCreateAttributeTemplateMutation();
  const updateMutation = useUpdateAttributeTemplateMutation();
  const deleteMutation = useDeleteAttributeTemplateMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ApiAttributeTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<number | null>(null);
  const [formDescription, setFormDescription] = useState('');
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (template?: ApiAttributeTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormName(template.name);
      setFormCode(template.code);
      setFormCategory(template.category_id || null);
      setFormDescription(template.description || '');
      setSelectedAttributeIds(template.attributes ? template.attributes.map((a) => a.id) : []);
    } else {
      setEditingTemplate(null);
      setFormName('');
      setFormCode('');
      setFormCategory(null);
      setFormDescription('');
      setSelectedAttributeIds([]);
    }
    setIsModalOpen(true);
  };

  const handleToggleAttr = (attrId: number) => {
    if (selectedAttributeIds.includes(attrId)) {
      setSelectedAttributeIds(selectedAttributeIds.filter((id) => id !== attrId));
    } else {
      setSelectedAttributeIds([...selectedAttributeIds, attrId]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formName,
        code: formCode || undefined,
        category_id: formCategory,
        description: formDescription,
        attributes: selectedAttributeIds.map((id, index) => ({
          attribute_id: id,
          is_required: false,
          sort_order: index,
        })),
      };

      if (editingTemplate) {
        await updateMutation.mutateAsync({ id: editingTemplate.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error saving attribute template.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attribute template?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Error deleting template.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Category Attribute Templates & EAV Schema"
        subtitle="Define custom product attribute specifications (Size, Color, Fabric, RAM, Storage, HSN, Expiry) assigned per category."
        badge="Product Attributes"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Attributes' }]}
        actions={
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Plus size={16} />
            <span>Create Template</span>
          </button>
        }
      />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border border-border/40 rounded-3xl p-4 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search attribute templates by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
            />
          </div>

          <select
            value={selectedCategoryFilter || ''}
            onChange={(e) => setSelectedCategoryFilter(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {typeof c.name === 'string' ? c.name : c.name.en || 'Category'}
              </option>
            ))}
          </select>
        </div>

        {/* Templates List Grid */}
        {isLoading ? (
          <div className="p-8 text-center text-xs text-foreground/60">Loading attribute templates...</div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm hover:border-rose-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-foreground">{tmpl.name}</h3>
                      <span className="text-[10px] font-mono text-rose-500 font-bold">#{tmpl.code}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(tmpl)}
                        className="p-2 hover:bg-muted/40 text-foreground/60 hover:text-foreground rounded-xl transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tmpl.id)}
                        className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/60 line-clamp-2">{tmpl.description || 'No description provided.'}</p>

                  <div className="pt-2 border-t border-border/30">
                    <span className="text-[11px] font-bold text-foreground/70 block mb-2">Assigned Attributes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.attributes && tmpl.attributes.length > 0 ? (
                        tmpl.attributes.map((a: any) => (
                          <span
                            key={a.id}
                            className="text-[10px] font-semibold bg-rose-500/10 text-rose-600 px-2.5 py-1 rounded-lg"
                          >
                            {a.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-foreground/40 italic">No attributes assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/30 flex items-center justify-between text-[11px] font-semibold text-foreground/50">
                  <span>Category:</span>
                  <span className="font-bold text-foreground">
                    {tmpl.category ? (typeof tmpl.category.name === 'string' ? tmpl.category.name : tmpl.category.name.en) : 'Global / Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-border/60 rounded-3xl text-center space-y-2 bg-card">
            <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
            <h4 className="font-bold text-sm text-foreground">No Attribute Templates Found</h4>
            <p className="text-xs text-foreground/60">Click "Create Template" to build dynamic attribute presets for categories.</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-xl border border-border/40 space-y-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-extrabold text-foreground">
                {editingTemplate ? 'Edit Attribute Template' : 'Create Attribute Template'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Template Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electronics Template"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Category</label>
                  <select
                    value={formCategory || ''}
                    onChange={(e) => setFormCategory(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-rose-500 outline-none"
                  >
                    <option value="">Global (All Categories)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {typeof c.name === 'string' ? c.name : c.name.en || 'Category'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Select Attributes to Include</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-muted/20 rounded-xl border border-border/40">
                    {attributes.map((attr: any) => {
                      const isSelected = selectedAttributeIds.includes(attr.id);
                      return (
                        <button
                          key={attr.id}
                          type="button"
                          onClick={() => handleToggleAttr(attr.id)}
                          className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all flex items-center justify-between text-left ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-card text-foreground border-border/60 hover:border-rose-500/40'
                          }`}
                        >
                          <span>{attr.name}</span>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Notes on what items use this template..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-rose-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-muted/40 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
