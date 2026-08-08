'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Bell, Send, MessageSquare, Mail, Smartphone, Zap } from 'lucide-react';

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notification & Campaign Engine"
        subtitle="Manage Push, SMS, Email, and WhatsApp notification templates, OTP verification messages, abandoned cart reminders, and low-stock alerts."
        badge="Engagement"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]}
        actions={
          <button className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs">
            <Send size={16} />
            <span>Broadcast Campaign</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Order Status Update Templates', desc: 'Automatic SMS & Push when order is Confirmed, Shipped, or Delivered.', icon: Bell },
          { title: 'OTP & Authentication Alerts', desc: 'Verification codes via Email & SMS for login & password resets.', icon: Smartphone },
          { title: 'Abandoned Cart Recovery', desc: 'Trigger WhatsApp & Push reminders after 2 hours of inactivity.', icon: MessageSquare },
          { title: 'Low Stock Admin Alerts', desc: 'Instant admin notifications when inventory drops below safety threshold.', icon: Zap },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-border-custom/60">
                <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black">
                  <Icon size={18} />
                </div>
                <h4 className="font-black text-sm text-foreground">{item.title}</h4>
              </div>
              <p className="text-xs text-muted-custom font-semibold">{item.desc}</p>
              <div className="pt-2 flex justify-end">
                <button className="px-3 py-1.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card">
                  Edit Template
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
