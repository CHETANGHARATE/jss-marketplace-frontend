'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  notificationService,
  NotificationLogItem,
  NotificationTemplateItem,
  NotificationStats,
} from '@/services/notificationService';
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  Save,
  X,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'templates' | 'gateways'>('logs');
  
  // Stats
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Delivery Logs
  const [logs, setLogs] = useState<NotificationLogItem[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [retryingLogId, setRetryingLogId] = useState<number | null>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<NotificationLogItem | null>(null);

  // Templates
  const [templates, setTemplates] = useState<NotificationTemplateItem[]>([]);
  const [templateChannelFilter, setTemplateChannelFilter] = useState<string>('');
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplateItem | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  useEffect(() => {
    loadStats();
    loadLogs(1);
    loadTemplates();
  }, []);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await notificationService.getAdminStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load notification stats', e);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadLogs = async (page: number = 1) => {
    setIsLoadingLogs(true);
    try {
      const res = await notificationService.getAdminLogs({
        page,
        channel: selectedChannel || undefined,
        status: selectedStatus || undefined,
        search: searchQuery || undefined,
      });
      setLogs(res.data || []);
      setLogsTotal(res.total || 0);
      setLogsPage(res.current_page || 1);
    } catch (e) {
      console.error('Failed to load notification logs', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const data = await notificationService.getAdminTemplates({
        channel: templateChannelFilter || undefined,
      });
      setTemplates(data || []);
    } catch (e) {
      console.error('Failed to load templates', e);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleRetry = async (logId: number) => {
    setRetryingLogId(logId);
    try {
      await notificationService.retryFailedLog(logId);
      await loadLogs(logsPage);
      await loadStats();
    } catch (e) {
      console.error('Failed to retry notification', e);
    } finally {
      setRetryingLogId(null);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setIsSavingTemplate(true);
    try {
      await notificationService.updateAdminTemplate(editingTemplate.id, {
        subject: editingTemplate.subject,
        body: editingTemplate.body,
        dlt_template_id: editingTemplate.dlt_template_id,
        whatsapp_template_name: editingTemplate.whatsapp_template_name,
        is_active: editingTemplate.is_active,
      });
      setEditingTemplate(null);
      await loadTemplates();
    } catch (e) {
      console.error('Failed to update template', e);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notification & Automation Engine"
        subtitle="Manage centralized multi-channel messaging (In-App, Email, SMS via MSG91, WhatsApp Cloud API), monitor live delivery logs, and configure event templates."
        badge="Automation"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications Engine' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadStats();
                loadLogs(logsPage);
                loadTemplates();
              }}
              className="px-3.5 py-2 bg-card border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-background-secondary flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw size={14} className={isLoadingLogs ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      {/* 1. Metrics & Live Delivery Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border-custom/80 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-custom">Total Dispatched</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">
              {stats?.total?.toLocaleString() ?? '—'}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {stats?.success_rate ?? 100}% Success
            </span>
          </div>
        </div>

        <div className="bg-card border border-border-custom/80 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-custom">Successfully Delivered</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats?.sent?.toLocaleString() ?? '—'}
            </span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-card border border-border-custom/80 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-custom">Delivery Failures</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {stats?.failed?.toLocaleString() ?? '—'}
            </span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
        </div>

        <div className="bg-card border border-border-custom/80 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-custom">Queued in Pipeline</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-primary">
              {stats?.queued?.toLocaleString() ?? '—'}
            </span>
            <Clock size={16} className="text-primary" />
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-custom/80 pb-3">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-card border border-border-custom/80 text-muted-custom hover:text-foreground'
          }`}
        >
          <Clock size={15} />
          <span>Live Delivery Logs</span>
          <span className="px-1.5 py-0.2 bg-black/20 text-white rounded-full text-[10px]">
            {logsTotal}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-card border border-border-custom/80 text-muted-custom hover:text-foreground'
          }`}
        >
          <Sliders size={15} />
          <span>Notification Templates</span>
          <span className="px-1.5 py-0.2 bg-black/20 text-white rounded-full text-[10px]">
            {templates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'gateways'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-card border border-border-custom/80 text-muted-custom hover:text-foreground'
          }`}
        >
          <Zap size={15} />
          <span>Channel Gateways</span>
        </button>
      </div>

      {/* TAB 1: LIVE DELIVERY LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-card border border-border-custom/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadLogs(1)}
                  placeholder="Search recipient, subject, or message content..."
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border-custom/80 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <select
                value={selectedChannel}
                onChange={(e) => {
                  setSelectedChannel(e.target.value);
                  setTimeout(() => loadLogs(1), 50);
                }}
                className="px-3 py-2 bg-background border border-border-custom/80 rounded-xl text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="">All Channels</option>
                <option value="in_app">In-App</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setTimeout(() => loadLogs(1), 50);
                }}
                className="px-3 py-2 bg-background border border-border-custom/80 rounded-xl text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="sent">Sent / Delivered</option>
                <option value="failed">Failed</option>
                <option value="queued">Queued</option>
              </select>
            </div>

            <button
              onClick={() => loadLogs(1)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl shadow-2xs"
            >
              Filter Logs
            </button>
          </div>

          {/* Logs Table */}
          <div className="bg-card border border-border-custom/80 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background-secondary border-b border-border-custom/60 text-muted-custom font-black uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Event Key</th>
                    <th className="py-3 px-4">Message / Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Dispatched At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/40">
                  {isLoadingLogs ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-custom animate-pulse">
                        Loading delivery logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-custom">
                        No delivery logs matching the current filters.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-background-secondary/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-foreground block">
                            {log.user?.name || log.recipient_target}
                          </span>
                          <span className="text-[10px] text-muted-custom block font-mono">
                            {log.recipient_target}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-background border border-border-custom/80 rounded-md font-black text-[10px] uppercase inline-flex items-center gap-1">
                            {log.channel === 'email' && <Mail size={12} className="text-sky-500" />}
                            {log.channel === 'sms' && <Smartphone size={12} className="text-orange-500" />}
                            {log.channel === 'whatsapp' && <MessageSquare size={12} className="text-emerald-500" />}
                            {log.channel === 'in_app' && <Bell size={12} className="text-primary" />}
                            <span>{log.channel.replace('_', '-')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[11px] text-foreground">
                          {log.event_key}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          <span className="font-bold text-foreground block truncate">
                            {log.subject || log.message_content}
                          </span>
                          <span className="text-[10px] text-muted-custom truncate block">
                            {log.message_content}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {log.status === 'sent' || log.status === 'delivered' ? (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black rounded-md text-[10px] flex items-center gap-1 w-fit">
                              <CheckCircle2 size={12} /> Delivered
                            </span>
                          ) : log.status === 'failed' ? (
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black rounded-md text-[10px] flex items-center gap-1 w-fit" title={log.error_message}>
                              <AlertTriangle size={12} /> Failed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary font-black rounded-md text-[10px] flex items-center gap-1 w-fit">
                              <Clock size={12} /> Queued
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-muted-custom font-semibold">
                          {new Date(log.created_at).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLogDetail(log)}
                              className="p-1.5 text-muted-custom hover:text-foreground hover:bg-background rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>

                            {log.status === 'failed' && (
                              <button
                                onClick={() => handleRetry(log.id)}
                                disabled={retryingLogId === log.id}
                                className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all"
                                title="Retry Delivery"
                              >
                                <RotateCcw size={11} className={retryingLogId === log.id ? 'animate-spin' : ''} />
                                <span>Retry</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATE MANAGEMENT */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="bg-card border border-border-custom/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-custom">Filter Channel:</span>
              <select
                value={templateChannelFilter}
                onChange={(e) => {
                  setTemplateChannelFilter(e.target.value);
                  setTimeout(() => loadTemplates(), 50);
                }}
                className="px-3 py-1.5 bg-background border border-border-custom/80 rounded-xl text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="">All Channels</option>
                <option value="in_app">In-App</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <span className="text-xs text-muted-custom font-semibold">
              Total {templates.length} templates configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingTemplates ? (
              <div className="col-span-2 py-12 text-center text-muted-custom animate-pulse">
                Loading templates...
              </div>
            ) : (
              templates.map((tpl) => (
                <div key={tpl.id} className="bg-card border border-border-custom/80 rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-border-custom/40 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-foreground">{tpl.event_name}</h4>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-md uppercase">
                          {tpl.channel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-custom block">
                        Key: {tpl.template_key} ({tpl.language.toUpperCase()})
                      </span>
                    </div>

                    <button
                      onClick={() => setEditingTemplate(tpl)}
                      className="px-3 py-1.5 bg-background border border-border-custom/80 text-foreground hover:bg-background-secondary rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>
                  </div>

                  {tpl.subject && (
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-muted-custom block uppercase">Subject</span>
                      <p className="font-bold text-foreground">{tpl.subject}</p>
                    </div>
                  )}

                  <div className="text-xs">
                    <span className="text-[10px] font-bold text-muted-custom block uppercase">Message Body</span>
                    <p className="text-foreground/80 font-mono text-[11px] bg-background p-2.5 rounded-xl border border-border-custom/60 whitespace-pre-wrap">
                      {tpl.body}
                    </p>
                  </div>

                  {tpl.dlt_template_id && (
                    <div className="text-[10px] text-muted-custom font-mono">
                      MSG91 DLT ID: <strong className="text-foreground">{tpl.dlt_template_id}</strong>
                    </div>
                  )}
                  {tpl.whatsapp_template_name && (
                    <div className="text-[10px] text-muted-custom font-mono">
                      WhatsApp Template: <strong className="text-foreground">{tpl.whatsapp_template_name}</strong>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CHANNEL GATEWAYS */}
      {activeTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'MSG91 SMS Gateway (Transactional Flow)',
              status: 'Configured & Active',
              desc: 'Dispatches Indian domestic OTPs, order shipping updates, and DLT compliant SMS messages.',
              icon: Smartphone,
              color: 'text-orange-500',
              envKeys: ['MSG91_AUTH_KEY', 'MSG91_TEMPLATE_ID'],
            },
            {
              title: 'Meta WhatsApp Business Cloud API',
              status: 'Active (Simulated Fallback)',
              desc: 'High-engagement interactive order updates, delivery tracking links, and customer support alerts.',
              icon: MessageSquare,
              color: 'text-emerald-500',
              envKeys: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'],
            },
            {
              title: 'SMTP Transactional Mail Server',
              status: 'Configured (Laravel Mail)',
              desc: 'Delivers full HTML GST invoices, order receipts, refund vouchers, and price drop notifications.',
              icon: Mail,
              color: 'text-sky-500',
              envKeys: ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USERNAME'],
            },
            {
              title: 'In-App Notification Inbox',
              status: 'Native Database Engine',
              desc: 'Real-time badge counter and in-app message feed across customer account and seller dashboards.',
              icon: Bell,
              color: 'text-primary',
              envKeys: ['DB_DATABASE', 'user_notifications'],
            },
          ].map((gw, idx) => {
            const Icon = gw.icon;
            return (
              <div key={idx} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-background border border-border-custom/80 flex items-center justify-center ${gw.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-foreground">{gw.title}</h4>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> {gw.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-custom font-semibold leading-relaxed">
                  {gw.desc}
                </p>

                <div className="p-3 bg-background rounded-xl border border-border-custom/60 space-y-1">
                  <span className="text-[10px] uppercase font-black text-muted-custom block">Environment Variables:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {gw.envKeys.map((k) => (
                      <code key={k} className="px-2 py-0.5 bg-background-secondary border border-border-custom/60 rounded text-[10px] font-mono text-primary font-bold">
                        {k}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-foreground">Edit Notification Template</h3>
                <span className="text-xs font-mono text-muted-custom">
                  {editingTemplate.event_name} ({editingTemplate.channel.toUpperCase()})
                </span>
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs font-semibold">
              {editingTemplate.channel === 'email' && (
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Email Subject</label>
                  <input
                    type="text"
                    value={editingTemplate.subject || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    className="w-full bg-background border border-border-custom/80 px-3.5 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Message Body (Supports placeholders)</label>
                <textarea
                  rows={5}
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className="w-full bg-background border border-border-custom/80 p-3 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary resize-none"
                />
                <span className="text-[10px] text-muted-custom block">
                  Available placeholders: <code>{'{name}'}</code>, <code>{'{order_number}'}</code>, <code>{'{amount}'}</code>, <code>{'{product_name}'}</code>, <code>{'{old_price}'}</code>, <code>{'{new_price}'}</code>
                </span>
              </div>

              {editingTemplate.channel === 'sms' && (
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">MSG91 / DLT Template ID</label>
                  <input
                    type="text"
                    value={editingTemplate.dlt_template_id || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, dlt_template_id: e.target.value })}
                    placeholder="e.g. 1007123456789012345"
                    className="w-full bg-background border border-border-custom/80 px-3.5 py-2 rounded-xl text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
              )}

              {editingTemplate.channel === 'whatsapp' && (
                <div className="space-y-1.5">
                  <label className="text-foreground/80 block">Approved WhatsApp Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.whatsapp_template_name || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, whatsapp_template_name: e.target.value })}
                    placeholder="e.g. jss_order_placed_v1"
                    className="w-full bg-background border border-border-custom/80 px-3.5 py-2 rounded-xl text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-background-secondary rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTemplate}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-black text-xs shadow-2xs transition-all flex items-center gap-1.5"
                >
                  {isSavingTemplate ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG DETAIL MODAL */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-foreground">Delivery Log Inspection</h3>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border-custom/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-custom block">Recipient Target</span>
                <span className="font-mono font-bold text-foreground">{selectedLogDetail.recipient_target}</span>
              </div>

              <div className="p-3 bg-background rounded-xl border border-border-custom/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-custom block">Event & Channel</span>
                <span className="font-mono font-bold text-foreground">
                  {selectedLogDetail.event_key} ({selectedLogDetail.channel.toUpperCase()})
                </span>
              </div>

              <div className="p-3 bg-background rounded-xl border border-border-custom/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-custom block">Rendered Content</span>
                <p className="font-mono text-[11px] text-foreground/80 whitespace-pre-wrap">
                  {selectedLogDetail.message_content}
                </p>
              </div>

              {selectedLogDetail.error_message && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-black block">Failure Error:</span>
                  <p className="font-mono text-[11px]">{selectedLogDetail.error_message}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
