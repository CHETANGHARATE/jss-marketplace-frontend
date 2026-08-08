'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ShieldCheck, Lock, Key, History } from 'lucide-react';

export default function AdminSecurityPage() {
  const auditLogs = [
    { action: 'Admin Login Successful', user: { email: 'admin@jssmarketplace.com' }, ip_address: '192.168.1.1', created_at: new Date().toISOString() },
    { action: 'Vendor Store KYC Approved', user: { email: 'admin@jssmarketplace.com' }, ip_address: '192.168.1.1', created_at: new Date().toISOString() },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Security Controls & Audit Trails"
        subtitle="Review 2FA enforcement, password policies, active admin login sessions, IP restrictions, and audit logs."
        badge="Security & Compliance"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Security Logs' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase">
            <ShieldCheck size={16} />
            <span>Two-Factor Auth (2FA)</span>
          </div>
          <span className="text-xl font-black text-foreground block">Enforced for Admins</span>
        </div>

        <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase">
            <Lock size={16} />
            <span>Session Control</span>
          </div>
          <span className="text-xl font-black text-foreground block">Max 3 Active Sessions</span>
        </div>

        <div className="p-5 bg-card border border-border-custom/80 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase">
            <Key size={16} />
            <span>Password Policy</span>
          </div>
          <span className="text-xl font-black text-foreground block">Strong (12+ chars)</span>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-foreground flex items-center gap-2 pb-3 border-b border-border-custom/60">
          <History className="w-5 h-5 text-primary" />
          <span>Audit & Change Logs</span>
        </h3>

        <div className="divide-y divide-border-custom/60 text-xs">
          {auditLogs.map((log: any, idx: number) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block">{log.action}</span>
                <span className="text-muted-custom text-[11px] font-medium">{log.user.email} • IP: {log.ip_address}</span>
              </div>
              <span className="text-[11px] font-bold text-muted-custom">
                {new Date(log.created_at).toLocaleTimeString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
