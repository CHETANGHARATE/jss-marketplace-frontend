'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { HelpCircle, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSupportPage() {
  const tickets = [
    { id: 'TCK-1092', customer: 'Rahul Sharma', subject: 'Delayed Delivery inquiry for Order #10042', priority: 'High', status: 'Pending', time: '10 mins ago' },
    { id: 'TCK-1091', customer: 'Priya Patel', subject: 'GST Tax Invoice copy request', priority: 'Medium', status: 'Resolved', time: '1 hour ago' },
    { id: 'TCK-1090', customer: 'Anish Deshmukh', subject: 'Return request for damaged item', priority: 'High', status: 'In Progress', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Support & Complaint Desk"
        subtitle="Manage customer support tickets, return & refund queries, priority escalations, internal notes, and resolution history."
        badge="Support Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Support Tickets' }]}
      />

      <div className="space-y-4">
        {tickets.map((t) => (
          <div key={t.id} className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-primary text-xs">{t.id}</span>
                <span className="text-muted-custom font-semibold text-xs">• {t.customer}</span>
                <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{t.priority} Priority</span>
              </div>
              <h4 className="font-black text-sm text-foreground">{t.subject}</h4>
              <span className="text-[11px] text-muted-custom font-medium block">{t.time}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-600'}`}>
                {t.status}
              </span>
              <button className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-2xs">
                Reply / View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
