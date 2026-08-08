'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { LayoutGrid, Plus, Image as ImageIcon, FileText, HelpCircle, Megaphone, Trash2, Eye } from 'lucide-react';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'popup' | 'pages' | 'faq' | 'announcements'>('banners');

  const bannerList = [
    { id: 1, title: 'Monsoon Big Grocery Sale', location: 'Home Hero Slider', image: '/placeholder-product.png', active: true },
    { id: 2, title: 'Electronics Super Saver Week', location: 'Category Top Banner', image: '/placeholder-product.png', active: true },
    { id: 3, title: 'Festival Sharbat Special 20%', location: 'Homepage Strip', image: '/placeholder-product.png', active: false },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Content Management System (CMS)"
        subtitle="Manage homepage sliders, promotional banners, popup banners, static policy pages, FAQs, and platform announcements."
        badge="Content Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'CMS & Banners' }]}
        actions={
          <button className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs">
            <Plus size={16} />
            <span>Add New Banner / Content</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-custom/60 pb-1">
        {[
          { id: 'banners', label: 'Homepage Banners', icon: ImageIcon },
          { id: 'popup', label: 'Popup Banners', icon: Megaphone },
          { id: 'pages', label: 'Static Pages & Policies', icon: FileText },
          { id: 'faq', label: 'FAQ Center', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bannerList.map((b) => (
            <div key={b.id} className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs space-y-3">
              <div className="aspect-video rounded-2xl bg-background-secondary border border-border-custom/80 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-muted-custom">Banner Preview: {b.title}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-primary block">{b.location}</span>
                <h4 className="font-black text-sm text-foreground">{b.title}</h4>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-custom/60 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${b.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {b.active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg bg-background-secondary text-muted-custom hover:text-foreground">
                    <Eye size={15} />
                  </button>
                  <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab !== 'banners' && (
        <div className="bg-card border border-border-custom/80 rounded-3xl p-8 text-center space-y-3">
          <LayoutGrid className="w-12 h-12 text-muted-custom mx-auto" />
          <h3 className="text-base font-black text-foreground">Content Editor Ready</h3>
          <p className="text-xs text-muted-custom font-medium max-w-md mx-auto">
            Manage About Us, Privacy Policy, Terms & Conditions, and FAQ categories without code changes.
          </p>
        </div>
      )}
    </div>
  );
}
