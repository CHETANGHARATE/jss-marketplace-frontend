'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Truck, Plus, Search, Building2, Phone, Mail } from 'lucide-react';

export default function AdminSuppliersPage() {
  const suppliers = [
    { id: 1, name: 'Royal Agro & Farmers Cooperative', code: 'SUP-AGR-01', contact: '+91 9820011223', email: 'orders@royalagro.in', items: 42 },
    { id: 2, name: 'Goodness Beverages Mfg Ltd', code: 'SUP-BEV-02', contact: '+91 9833344555', email: 'supply@goodness.com', items: 28 },
    { id: 3, name: 'Sahyadri Organic Produce Guild', code: 'SUP-ORG-03', contact: '+91 9844455666', email: 'sales@sahyadriorg.org', items: 35 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Supplier & Purchase Order Directory"
        subtitle="Manage bulk raw suppliers, direct-from-source manufacturers, purchase orders (PO), GRN receipts, and cost history."
        badge="Procurement"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Suppliers' }]}
        actions={
          <button className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs">
            <Plus size={16} />
            <span>Onboard Supplier</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
              <span className="font-mono text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">{s.code}</span>
              <span className="text-xs font-bold text-muted-custom">{s.items} Products</span>
            </div>
            <div>
              <h4 className="font-black text-base text-foreground">{s.name}</h4>
            </div>
            <div className="space-y-1.5 text-xs text-muted-custom font-medium">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span>{s.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-500" />
                <span>{s.email}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border-custom/60 flex justify-end">
              <button className="px-3.5 py-1.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card">
                Create Purchase Order (PO)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
