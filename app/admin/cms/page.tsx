'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  useAdminCmsBannersQuery,
  useCreateBannerMutation,
  useToggleBannerStatusMutation,
  useDeleteBannerMutation,
  useAdminCmsPopupsQuery,
  useUpdatePopupMutation,
  useAdminCmsPagesQuery,
  useUpdateCmsPageMutation,
  useAdminCmsFaqsQuery,
  useCreateFaqMutation,
  useDeleteFaqMutation
} from '../../../hooks/useAdmin';
import {
  LayoutGrid,
  Plus,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Megaphone,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Edit2,
  Sparkles,
  Save,
  ExternalLink
} from 'lucide-react';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'popup' | 'pages' | 'faq'>('banners');

  // Queries
  const { data: banners = [], isLoading: isBannersLoading } = useAdminCmsBannersQuery();
  const { data: popups = [], isLoading: isPopupsLoading } = useAdminCmsPopupsQuery();
  const { data: pages = [], isLoading: isPagesLoading } = useAdminCmsPagesQuery();
  const { data: faqs = [], isLoading: isFaqsLoading } = useAdminCmsFaqsQuery();

  // Mutations
  const createBannerMutation = useCreateBannerMutation();
  const toggleBannerMutation = useToggleBannerStatusMutation();
  const deleteBannerMutation = useDeleteBannerMutation();
  const updatePopupMutation = useUpdatePopupMutation();
  const updatePageMutation = useUpdateCmsPageMutation();
  const createFaqMutation = useCreateFaqMutation();
  const deleteFaqMutation = useDeleteFaqMutation();

  // Modals & States
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    location: 'home_hero',
    image_url: '',
    target_url: '',
    is_active: true
  });

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General'
  });

  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [pageContent, setPageContent] = useState({ title: '', content: '' });

  // Popup Form State
  const activePopup = popups[0] || {
    title: '',
    content: '',
    cta_text: 'Get App',
    cta_url: '/app',
    is_active: false
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBannerMutation.mutateAsync(bannerForm);
      setIsBannerModalOpen(false);
      setBannerForm({
        title: '',
        location: 'home_hero',
        image_url: '',
        target_url: '',
        is_active: true
      });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create banner.');
    }
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFaqMutation.mutateAsync(faqForm);
      setIsFaqModalOpen(false);
      setFaqForm({ question: '', answer: '', category: 'General' });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add FAQ.');
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    try {
      await updatePageMutation.mutateAsync({
        id: editingPage.id,
        payload: {
          title: pageContent.title,
          content: pageContent.content,
        }
      });
      setEditingPage(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save page.');
    }
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    try {
      await updatePopupMutation.mutateAsync({
        title: target.popup_title.value,
        content: target.popup_content.value,
        cta_text: target.popup_cta_text.value,
        cta_url: target.popup_cta_url.value,
        is_active: target.popup_active.checked,
      });
      alert('Popup announcement updated successfully!');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update popup.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Content Management System (CMS)"
        subtitle="Manage homepage sliders, promotional hero strips, modal popups, policy pages, and customer FAQ articles."
        badge="Content Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'CMS & Content' }]}
        actions={
          activeTab === 'banners' ? (
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(true)}
              className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Promotional Banner</span>
            </button>
          ) : activeTab === 'faq' ? (
            <button
              type="button"
              onClick={() => setIsFaqModalOpen(true)}
              className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Add FAQ Item</span>
            </button>
          ) : null
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-custom/60 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'banners', label: 'Homepage Banners', icon: ImageIcon },
          { id: 'popup', label: 'Popup Announcements', icon: Megaphone },
          { id: 'pages', label: 'Static Pages & Policies', icon: FileText },
          { id: 'faq', label: 'FAQ Center', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          {isBannersLoading ? (
            <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
              Loading banner assets...
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-card border border-border-custom/80 rounded-3xl p-10 text-center space-y-3">
              <ImageIcon className="w-12 h-12 text-muted-custom/40 mx-auto" />
              <h3 className="text-base font-black text-foreground">No Banners Configured</h3>
              <p className="text-xs text-muted-custom max-w-sm mx-auto">
                Add homepage hero sliders or promotional category strips to highlight campaigns.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((b: any) => (
                <div key={b.id} className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="aspect-video rounded-2xl bg-background-secondary border border-border-custom/80 flex items-center justify-center overflow-hidden relative">
                      {b.image_url ? (
                        <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-muted-custom">No Image Preview</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-primary block">{b.location}</span>
                      <h4 className="font-black text-sm text-foreground">{b.title}</h4>
                      {b.target_url && (
                        <span className="text-[11px] text-muted-custom flex items-center gap-1 font-mono mt-0.5">
                          <ExternalLink size={11} />
                          <span className="truncate">{b.target_url}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border-custom/60 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleBannerMutation.mutate(b.id)}
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border cursor-pointer ${
                        b.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}
                    >
                      {b.is_active ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete banner '${b.title}'?`)) {
                          deleteBannerMutation.mutate(b.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Popups Tab */}
      {activeTab === 'popup' && (
        <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-2xs max-w-2xl">
          <form onSubmit={handleSavePopup} className="space-y-4">
            <h3 className="font-black text-base text-foreground">Marketing & App Download Popup</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Show an interactive overlay dialog when new users land on the storefront.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Popup Headline *</label>
              <input
                type="text"
                name="popup_title"
                defaultValue={activePopup.title}
                required
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Popup Body Content *</label>
              <textarea
                name="popup_content"
                rows={3}
                defaultValue={activePopup.content}
                required
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-medium rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-custom">CTA Button Text</label>
                <input
                  type="text"
                  name="popup_cta_text"
                  defaultValue={activePopup.cta_text}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-custom">CTA Destination URL</label>
                <input
                  type="text"
                  name="popup_cta_url"
                  defaultValue={activePopup.cta_url}
                  className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="popup_active"
                name="popup_active"
                defaultChecked={activePopup.is_active}
                className="w-4 h-4 text-rose-500 rounded border-border-custom focus:ring-rose-500"
              />
              <label htmlFor="popup_active" className="font-bold text-foreground text-xs cursor-pointer">
                Enable popup on homepage
              </label>
            </div>

            <div className="pt-3 border-t border-border-custom flex justify-end">
              <button
                type="submit"
                disabled={updatePopupMutation.isPending}
                className="px-5 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>{updatePopupMutation.isPending ? 'Saving...' : 'Save Popup Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Static Pages Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((p: any) => (
              <div key={p.id} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border-custom/60">
                    <span className="font-mono text-[10px] text-primary font-black uppercase">/{p.slug}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Published
                    </span>
                  </div>
                  <h4 className="font-black text-base text-foreground mt-2">{p.title}</h4>
                  <p className="text-xs text-muted-custom line-clamp-3 mt-1 leading-relaxed">{p.content}</p>
                </div>

                <div className="pt-3 border-t border-border-custom/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPage(p);
                      setPageContent({ title: p.title, content: p.content });
                    }}
                    className="px-3.5 py-1.5 bg-background-secondary border border-border-custom text-foreground font-bold text-xs rounded-xl hover:bg-card flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit Content</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <div className="bg-card border border-border-custom/80 rounded-3xl p-10 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-muted-custom/40 mx-auto" />
              <h3 className="text-base font-black text-foreground">No FAQs Created</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((f: any) => (
                <div key={f.id} className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary">
                      {f.category}
                    </span>
                    <h4 className="font-black text-sm text-foreground">{f.question}</h4>
                    <p className="text-xs text-muted-custom leading-relaxed">{f.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete FAQ '${f.question}'?`)) {
                        deleteFaqMutation.mutate(f.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleBannerSubmit} className="bg-card border border-border-custom rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">Add Promotional Banner</h3>
              <button type="button" onClick={() => setIsBannerModalOpen(false)} className="text-muted-custom hover:text-foreground text-xs font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Banner Title *</label>
              <input
                type="text"
                required
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="e.g. Organic Farm Spices Festival"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Display Placement *</label>
              <select
                value={bannerForm.location}
                onChange={(e) => setBannerForm({ ...bannerForm, location: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              >
                <option value="home_hero">Homepage Hero Slider</option>
                <option value="home_strip">Homepage Promotional Strip</option>
                <option value="category_top">Category Top Banner</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Image URL / Path *</label>
              <input
                type="text"
                required
                value={bannerForm.image_url}
                onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                placeholder="/images/banners/banner1.jpg"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Click Target URL</label>
              <input
                type="text"
                value={bannerForm.target_url}
                onChange={(e) => setBannerForm({ ...bannerForm, target_url: e.target.value })}
                placeholder="/products?category=spices"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-mono font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-custom">
              <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 bg-background-secondary text-foreground text-xs font-bold rounded-xl cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={createBannerMutation.isPending} className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 cursor-pointer">
                Save Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleSavePage} className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">Edit Page: /{editingPage.slug}</h3>
              <button type="button" onClick={() => setEditingPage(null)} className="text-muted-custom hover:text-foreground text-xs font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Page Title *</label>
              <input
                type="text"
                required
                value={pageContent.title}
                onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Page Content (Markdown / HTML) *</label>
              <textarea
                rows={8}
                required
                value={pageContent.content}
                onChange={(e) => setPageContent({ ...pageContent, content: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-medium rounded-xl focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-custom">
              <button type="button" onClick={() => setEditingPage(null)} className="px-4 py-2 bg-background-secondary text-foreground text-xs font-bold rounded-xl cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={updatePageMutation.isPending} className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 cursor-pointer">
                Save Page Content
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleFaqSubmit} className="bg-card border border-border-custom rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">Add FAQ Question</h3>
              <button type="button" onClick={() => setIsFaqModalOpen(false)} className="text-muted-custom hover:text-foreground text-xs font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Category *</label>
              <select
                value={faqForm.category}
                onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              >
                <option value="General">General</option>
                <option value="Orders & Shipping">Orders & Shipping</option>
                <option value="Payments">Payments</option>
                <option value="Vendor Selling">Vendor Selling</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Question *</label>
              <input
                type="text"
                required
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="e.g. How do I initiate a return?"
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-bold rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Answer *</label>
              <textarea
                rows={3}
                required
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                className="w-full px-3 py-2 bg-background-secondary border border-border-custom text-foreground font-medium rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-custom">
              <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 bg-background-secondary text-foreground text-xs font-bold rounded-xl cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={createFaqMutation.isPending} className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 cursor-pointer">
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
