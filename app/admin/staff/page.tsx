'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  useAdminStaffRolesQuery,
  useAdminStaffListQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation
} from '../../../hooks/useAdmin';
import {
  UserCheck,
  Plus,
  Shield,
  CheckCircle2,
  Lock,
  Users,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Key,
  ShieldAlert
} from 'lucide-react';

export default function AdminStaffPage() {
  const { data: rolesData, isLoading: isRolesLoading } = useAdminStaffRolesQuery();
  const { data: staffList = [], isLoading: isStaffLoading } = useAdminStaffListQuery();

  const createStaffMutation = useCreateStaffMutation();
  const updateStaffMutation = useUpdateStaffMutation();
  const deleteStaffMutation = useDeleteStaffMutation();

  const [activeTab, setActiveTab] = useState<'roles' | 'accounts'>('roles');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const INITIAL_STAFF_FORM = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role_title: 'Catalog Manager'
  };

  const [form, setForm] = useState(INITIAL_STAFF_FORM);

  const roles = rolesData?.data || [
    { name: 'Super Admin', slug: 'super_admin', users_count: 0, permissions: 'Full Access across all modules & settings' },
    { name: 'Catalog Manager', slug: 'catalog_manager', users_count: 0, permissions: 'Products, Categories, Brands & Attributes (Read/Write)' },
    { name: 'Order Manager', slug: 'order_manager', users_count: 0, permissions: 'Orders, Shipping & Customer Support (Read/Write)' },
    { name: 'Accountant', slug: 'finance_officer', users_count: 0, permissions: 'Payments, Refunds, Tax & Financial Reports' },
    { name: 'Customer Support', slug: 'support_executive', users_count: 0, permissions: 'Support Tickets & Orders (View Only)' },
  ];

  const openCreateModal = (defaultRole?: string) => {
    setForm({
      ...INITIAL_STAFF_FORM,
      role_title: defaultRole || 'Catalog Manager',
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setForm(INITIAL_STAFF_FORM);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (form.password.length < 8) {
      setFieldErrors({ password: ['Temporary password must be at least 8 characters long.'] });
      return;
    }

    try {
      await createStaffMutation.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        role_title: form.role_title,
      });

      const createdName = form.name.trim();
      closeCreateModal();
      setSuccessMessage(`Staff account for '${createdName}' created successfully.`);
      setActiveTab('accounts');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const backendFieldErrors = err?.errors || err?.response?.data?.errors;
      if (backendFieldErrors && typeof backendFieldErrors === 'object' && Object.keys(backendFieldErrors).length > 0) {
        setFieldErrors(backendFieldErrors);
        const firstFieldMsg = Object.values(backendFieldErrors).flat().filter(Boolean)[0];
        setGeneralError((firstFieldMsg as string) || err.message || 'Please correct the highlighted fields.');
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to create staff account.';
        setGeneralError(msg);
      }
    }
  };

  const handleDeleteStaff = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete staff account '${name}'?`)) return;
    try {
      await deleteStaffMutation.mutateAsync(id);
      setSuccessMessage(`Staff account '${name}' deleted successfully.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete staff account.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Staff & Role-Based Access Control (RBAC)"
        subtitle="Manage administrator accounts, assign module-specific action permissions (View, Create, Edit, Delete, Approve, Export), and monitor activity logs."
        badge="Security & Access"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Staff & Roles' }]}
        actions={
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Staff Account</span>
          </button>
        }
      />

      {/* Global Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-600 font-bold text-xs shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-custom/60 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'bg-rose-500 text-white shadow-2xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Shield size={14} />
          <span>Configured Roles ({roles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'accounts'
              ? 'bg-rose-500 text-white shadow-2xs'
              : 'text-muted-custom hover:text-foreground hover:bg-background-secondary'
          }`}
        >
          <Users size={14} />
          <span>Active Staff Accounts ({staffList.length})</span>
        </button>
      </div>

      {/* 1. Roles Overview */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {isRolesLoading ? (
            <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
              Loading role permissions...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((r: any, i: number) => {
                const count = r.users_count || 0;
                return (
                  <div key={i} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-rose-500" />
                          <h4 className="font-black text-base text-foreground">{r.name}</h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 font-black text-xs rounded-full ${
                            count > 0
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-background-secondary text-muted-custom border border-border-custom'
                          }`}
                        >
                          {count} Staff Active
                        </span>
                      </div>
                      <p className="text-xs text-muted-custom font-semibold leading-relaxed">{r.permissions}</p>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-border-custom/60 text-xs">
                      <span className="text-[11px] font-mono text-muted-custom">Role Code: {r.slug || 'system'}</span>
                      <button
                        type="button"
                        onClick={() => openCreateModal(r.name)}
                        className="px-3 py-1.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card cursor-pointer"
                      >
                        + Assign User
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Staff Accounts Directory */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {isStaffLoading ? (
            <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
              Loading staff accounts...
            </div>
          ) : staffList.length === 0 ? (
            <div className="bg-card border border-border-custom/80 rounded-3xl p-12 text-center space-y-4 shadow-2xs">
              <Users className="w-16 h-16 text-muted-custom/40 mx-auto" />
              <h3 className="text-lg font-black text-foreground">No Additional Staff Accounts</h3>
              <p className="text-xs text-muted-custom max-w-md mx-auto">
                Add staff accounts with dedicated role permissions (e.g. Catalog Manager, Order Support) to delegate marketplace operations securely.
              </p>
              <button
                type="button"
                onClick={() => openCreateModal()}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Create First Staff Account
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border-custom/60 bg-background-secondary text-muted-custom uppercase text-[10px] tracking-wider font-black">
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/60">
                  {staffList.map((st: any) => (
                    <tr key={st.id} className="hover:bg-background-secondary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-xs">
                            {st.name?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <div className="font-extrabold text-foreground">{st.name}</div>
                            <div className="text-[10px] text-muted-custom font-mono">ID: #{st.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-foreground">{st.email}</td>
                      <td className="py-4 px-4 font-mono text-muted-custom">{st.phone || '—'}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
                          {st.role_title || st.role?.toUpperCase() || 'ADMIN'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(st.id, st.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                          title="Delete Staff Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={closeCreateModal}
        >
          <form
            onSubmit={handleCreateStaff}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-lg font-black text-foreground">Add New Staff Account</h3>
              <button
                type="button"
                onClick={closeCreateModal}
                className="text-muted-custom hover:text-foreground text-xs font-bold cursor-pointer p-1 rounded-lg hover:bg-background-secondary"
              >
                ✕
              </button>
            </div>

            {generalError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-bold flex items-start gap-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: [] }));
                }}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3 py-2 bg-background-secondary border ${
                  fieldErrors.name?.length ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-border-custom'
                } text-foreground font-bold rounded-xl focus:outline-none`}
              />
              {fieldErrors.name?.length ? (
                <p className="text-[11px] font-bold text-rose-500">{fieldErrors.name[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: [] }));
                }}
                placeholder="staff@jsssolutions.in"
                className={`w-full px-3 py-2 bg-background-secondary border ${
                  fieldErrors.email?.length ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-border-custom'
                } text-foreground font-medium rounded-xl focus:outline-none`}
              />
              {fieldErrors.email?.length ? (
                <p className="text-[11px] font-bold text-rose-500">{fieldErrors.email[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Mobile Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: [] }));
                }}
                placeholder="+91 9876543210"
                className={`w-full px-3 py-2 bg-background-secondary border ${
                  fieldErrors.phone?.length ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-border-custom'
                } text-foreground font-mono font-bold rounded-xl focus:outline-none`}
              />
              {fieldErrors.phone?.length ? (
                <p className="text-[11px] font-bold text-rose-500">{fieldErrors.phone[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Assigned Role *</label>
              <select
                value={form.role_title}
                onChange={(e) => {
                  setForm({ ...form, role_title: e.target.value });
                  if (fieldErrors.role_title || fieldErrors.role) {
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.role_title;
                      delete updated.role;
                      return updated;
                    });
                  }
                }}
                className={`w-full px-3 py-2 bg-background-secondary border ${
                  fieldErrors.role_title?.length || fieldErrors.role?.length
                    ? 'border-rose-500 ring-1 ring-rose-500/30'
                    : 'border-border-custom'
                } text-foreground font-bold rounded-xl focus:outline-none`}
              >
                <option value="Catalog Manager">Catalog Manager (Products, Categories, Brands)</option>
                <option value="Order & Logistics Manager">Order & Logistics Manager</option>
                <option value="Finance & Settlement Officer">Finance & Settlement Officer</option>
                <option value="Customer Support Executive">Customer Support Executive</option>
                <option value="Super Admin">Super Admin (Full System Access)</option>
              </select>
              {fieldErrors.role_title?.length ? (
                <p className="text-[11px] font-bold text-rose-500">{fieldErrors.role_title[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-muted-custom">Temporary Password * (Min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: [] }));
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full px-3 py-2 bg-background-secondary border ${
                  fieldErrors.password?.length ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-border-custom'
                } text-foreground font-mono font-bold rounded-xl focus:outline-none`}
              />
              {fieldErrors.password?.length ? (
                <p className="text-[11px] font-bold text-rose-500">{fieldErrors.password[0]}</p>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-custom">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 bg-background-secondary text-foreground text-xs font-bold rounded-xl cursor-pointer hover:bg-card transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createStaffMutation.isPending}
                className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 cursor-pointer disabled:opacity-50 transition-colors shadow-2xs"
              >
                {createStaffMutation.isPending ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
