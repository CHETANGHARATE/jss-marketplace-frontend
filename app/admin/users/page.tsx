'use client';

import React, { useState } from 'react';
import { useAdminCustomersQuery, useAdminCustomerQuery, useToggleCustomerStatusMutation } from '../../../hooks/useAdmin';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import {
  Users,
  Search,
  UserX,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // Fetch paginated customer list
  const { data, isLoading } = useAdminCustomersQuery({
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    filter: orderFilter !== 'all' ? orderFilter : undefined,
  });

  // Fetch single customer detail when modal is open
  const { data: customerDetail, isLoading: isDetailLoading } = useAdminCustomerQuery(
    selectedCustomerId,
    !!selectedCustomerId
  );

  const toggleMutation = useToggleCustomerStatusMutation();

  const customers: any[] = data?.data || [];
  const meta = data?.meta;

  const activeCount = customers.filter((c) => c.status === 'active').length;
  const blockedCount = customers.filter((c) => c.status === 'blocked').length;
  const withOrdersCount = customers.filter((c) => (c.total_orders || 0) > 0).length;

  const handleToggleStatus = async (id: number, currentStatus: string, name: string) => {
    const action = currentStatus === 'blocked' ? 'unblock and activate' : 'block';
    if (!confirm(`Are you sure you want to ${action} customer "${name}"?`)) return;
    try {
      await toggleMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update customer status.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Accounts Directory"
        subtitle="Search registered marketplace buyers, review contact details, total order spending, loyalty status, and account access."
        badge="Customer Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Customers' }]}
        actions={
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border-custom/80 text-foreground text-xs font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
            />
          </div>
        }
      />

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border-custom/80 rounded-3xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-custom block">
            Total Customers
          </span>
          <span className="text-2xl font-black text-foreground">
            {isLoading ? '...' : meta?.total ?? customers.length}
          </span>
        </div>

        <div className="bg-card border border-emerald-500/30 rounded-3xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Active Accounts
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {isLoading ? '...' : activeCount}
          </span>
        </div>

        <div className="bg-card border border-rose-500/30 rounded-3xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
            Blocked Accounts
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {isLoading ? '...' : blockedCount}
          </span>
        </div>

        <div className="bg-card border border-indigo-500/30 rounded-3xl p-5 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            With Order History
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {isLoading ? '...' : withOrdersCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border-custom/80 rounded-3xl p-4 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Customers' },
            { id: 'active', label: 'Active Only' },
            { id: 'blocked', label: 'Blocked Only' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-background-secondary text-muted-custom hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black text-muted-custom uppercase">Order Filter:</span>
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className="bg-background-secondary border border-border-custom/80 text-foreground text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Activity</option>
            <option value="with_orders">With Orders</option>
            <option value="no_orders">No Orders Yet</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs font-bold text-muted-custom animate-pulse flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-rose-500 animate-spin" />
          <span>Loading customer database directory...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card border border-border-custom/80 rounded-3xl p-8">
          <Users className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Customers Found</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            No registered marketplace buyers matching search criteria or selected filters.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-border-custom/60 bg-background-secondary text-muted-custom uppercase text-[10px] tracking-wider font-black">
                  <th className="py-3.5 px-4">Customer Profile</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Orders & Lifetime Spend</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60">
                {customers.map((cust) => {
                  const isBlocked = cust.status === 'blocked' || cust.is_blocked;
                  const totalOrders = cust.total_orders || 0;
                  const lifetimeSpent = cust.lifetime_spent || 0;
                  const avgOrderValue = cust.avg_order_value || 0;

                  return (
                    <tr key={cust.id} className="hover:bg-background-secondary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-sm border border-primary/20 shrink-0">
                            {cust.name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <div className="font-extrabold text-foreground">{cust.name}</div>
                            <div className="text-[10px] text-muted-custom font-mono">
                              ID: #{cust.id} • Joined{' '}
                              {cust.created_at
                                ? new Date(cust.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="text-foreground flex items-center gap-1.5 font-medium">
                            <Mail size={12} className="text-muted-custom shrink-0" />
                            <span className="truncate max-w-[180px]">{cust.email}</span>
                          </div>
                          <div className="text-muted-custom font-mono text-[11px] flex items-center gap-1.5">
                            <Phone size={12} className="text-muted-custom shrink-0" />
                            <span>{cust.phone || 'No phone added'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="font-black text-foreground flex items-center gap-1">
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                              ₹{lifetimeSpent.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-muted-custom font-medium">
                              ({totalOrders} {totalOrders === 1 ? 'order' : 'orders'})
                            </span>
                          </div>
                          {totalOrders > 0 && (
                            <div className="text-[10px] text-muted-custom font-medium">
                              AOV: ₹{avgOrderValue.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-muted-custom text-[11px] font-medium">
                        {cust.last_order_at ? (
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-muted-custom" />
                            <span>
                              {new Date(cust.last_order_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-custom/60 italic">Never ordered</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isBlocked
                              ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          }`}
                        >
                          {isBlocked ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                          <span>{isBlocked ? 'Blocked' : 'Active'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomerId(cust.id)}
                            className="px-3 py-1.5 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-[11px] rounded-xl transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="View Customer Order History & Profile"
                          >
                            <Eye size={13} className="text-primary" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cust.id, cust.status, cust.name)}
                            disabled={toggleMutation.isPending}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50 ${
                              isBlocked
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500 hover:text-white'
                            }`}
                            title={isBlocked ? 'Unblock customer account' : 'Block customer account'}
                          >
                            {isBlocked ? <CheckCircle2 size={13} /> : <UserX size={13} />}
                            <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Modal / Drawer */}
      {selectedCustomerId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border border-border-custom rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 font-black flex items-center justify-center text-lg border border-rose-500/20">
                  {customerDetail?.profile?.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                    Customer Account Overview
                  </span>
                  <h3 className="text-xl font-black text-foreground">
                    {customerDetail?.profile?.name || 'Loading profile...'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomerId(null)}
                className="p-2 text-muted-custom hover:text-foreground rounded-xl hover:bg-background-secondary cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {isDetailLoading ? (
              <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-rose-500 animate-spin" />
                <span>Loading customer profile & order history...</span>
              </div>
            ) : customerDetail ? (
              <div className="space-y-6">
                {/* 1. Account Summary KPI Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-background-secondary rounded-2xl border border-border-custom/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-custom uppercase block">Total Orders</span>
                    <span className="text-lg font-black text-foreground">{customerDetail.analytics?.total_orders || 0}</span>
                  </div>
                  <div className="p-3.5 bg-background-secondary rounded-2xl border border-border-custom/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-custom uppercase block">Delivered Orders</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {customerDetail.analytics?.completed_orders || 0}
                    </span>
                  </div>
                  <div className="p-3.5 bg-background-secondary rounded-2xl border border-border-custom/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-custom uppercase block">Lifetime Spending</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{(customerDetail.analytics?.lifetime_spent || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3.5 bg-background-secondary rounded-2xl border border-border-custom/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-custom uppercase block">Average Order</span>
                    <span className="text-lg font-black text-foreground font-mono">
                      ₹{(customerDetail.analytics?.avg_order_value || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 2. Customer Contact & Profile Details */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Shield size={14} className="text-primary" />
                    <span>Personal Profile & Identity</span>
                  </h4>
                  <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-muted-custom font-medium block">Full Name:</span>
                      <span className="font-bold text-foreground">{customerDetail.profile?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-custom font-medium block">Email Address:</span>
                      <span className="font-bold text-foreground">{customerDetail.profile?.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-custom font-medium block">Mobile Number:</span>
                      <span className="font-mono font-bold text-foreground">{customerDetail.profile?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-custom font-medium block">Account Status:</span>
                      <span className="font-bold text-foreground capitalize">
                        {customerDetail.profile?.status || 'Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-custom font-medium block">Registration Date:</span>
                      <span className="font-bold text-foreground">
                        {customerDetail.profile?.created_at
                          ? new Date(customerDetail.profile.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Recent Orders History */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-indigo-500" />
                    <span>Recent Order History ({customerDetail.orders?.length || 0})</span>
                  </h4>
                  {(!customerDetail.orders || customerDetail.orders.length === 0) ? (
                    <div className="p-6 bg-background-secondary rounded-2xl text-center text-xs text-muted-custom font-semibold">
                      This customer has not placed any orders yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
                      {customerDetail.orders.map((ord: any) => (
                        <div
                          key={ord.id}
                          className="p-3 bg-background-secondary rounded-2xl border border-border-custom flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-black text-foreground flex items-center gap-2">
                              <span>#{ord.order_number}</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary">
                                {ord.status}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-custom font-medium mt-0.5">
                              {new Date(ord.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              • {ord.payment_method?.toUpperCase()} ({ord.payment_status})
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-foreground font-mono text-sm">
                              ₹{Number(ord.total_amount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Saved Delivery Addresses */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-500" />
                    <span>Saved Shipping Addresses</span>
                  </h4>
                  {(!customerDetail.addresses || customerDetail.addresses.length === 0) ? (
                    <div className="p-4 bg-background-secondary rounded-2xl text-center text-xs text-muted-custom font-semibold">
                      No shipping addresses saved on file.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {customerDetail.addresses.map((addr: any) => (
                        <div
                          key={addr.id}
                          className="p-3.5 bg-background-secondary rounded-2xl border border-border-custom space-y-1"
                        >
                          <div className="font-bold text-foreground flex items-center justify-between">
                            <span>{addr.name}</span>
                            {addr.is_default && (
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-black rounded-md">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="text-muted-custom text-[11px] leading-relaxed">
                            {addr.address_line_1}
                            {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                            <br />
                            {addr.city}, {addr.state} - {addr.postal_code}
                          </div>
                          <div className="text-muted-custom font-mono text-[10px]">📞 {addr.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Footer Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border-custom">
              {customerDetail?.profile && (
                <button
                  type="button"
                  onClick={() =>
                    handleToggleStatus(
                      customerDetail.profile.id,
                      customerDetail.profile.status,
                      customerDetail.profile.name
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    customerDetail.profile.status === 'blocked'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  {customerDetail.profile.status === 'blocked' ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Unblock Customer Account</span>
                    </>
                  ) : (
                    <>
                      <UserX size={14} />
                      <span>Block Customer Account</span>
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedCustomerId(null)}
                className="px-5 py-2 bg-background-secondary border border-border-custom text-foreground text-xs font-bold rounded-xl hover:bg-card cursor-pointer ml-auto"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
