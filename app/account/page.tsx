'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useOrdersQuery } from '../../hooks/useOrders';
import { useNotificationsQuery } from '../../hooks/useNotifications';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AccountSidebar } from '../../components/AccountSidebar';
import {
  ShoppingBag,
  Bell,
  User,
  Heart,
  ChevronRight,
  ShieldCheck,
  Package,
  ArrowRight
} from 'lucide-react';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const { data: orders = [] } = useOrdersQuery();
  const { data: notifications = [] } = useNotificationsQuery();

  const unreadNotifications = notifications.filter((n) => !n.read_at);

  return (
    <div className="space-y-8 sm:space-y-10">
      <Breadcrumbs items={[{ label: 'Account Dashboard' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 space-y-6 min-w-0 w-full">
          {/* Hero Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95" />
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  <ShieldCheck size={13} />
                  <span>Verified Customer Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome Back, {user?.name || 'Customer'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-lg leading-relaxed">
                  Manage your marketplace orders, delivery tracking, account profile, support tickets, and loyalty rewards.
                </p>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-300 block">
                  Escrow Security
                </span>
                <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Protected</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            <Link
              href="/orders"
              className="p-5 bg-card border border-border-custom/80 hover:border-primary/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-2xs group-hover:bg-primary group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">{orders.length}</span>
                <span className="text-xs font-black text-muted-custom block group-hover:text-primary transition-colors">Total Orders</span>
              </div>
            </Link>

            <Link
              href="/account/notifications"
              className="p-5 bg-card border border-border-custom/80 hover:border-amber-500/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-2xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground block">{unreadNotifications.length}</span>
                <span className="text-xs font-black text-muted-custom block group-hover:text-amber-500 transition-colors">Unread Alerts</span>
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="p-5 bg-card border border-border-custom/80 hover:border-rose-500/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-2xs group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-muted-custom block group-hover:text-rose-500 transition-colors pt-4">Saved Wishlist</span>
              </div>
            </Link>

            <Link
              href="/account/profile"
              className="p-5 bg-card border border-border-custom/80 hover:border-indigo-500/60 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-2xs group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-muted-custom block group-hover:text-indigo-500 transition-colors pt-4">Edit Profile</span>
              </div>
            </Link>
          </div>

          {/* Recent Orders Showcase */}
          <div className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom/80">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span>Recent Orders</span>
              </h3>
              <Link
                href="/orders"
                className="text-xs font-black text-primary hover:underline flex items-center gap-1.5"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <ShoppingBag className="w-10 h-10 text-muted-custom/30 mx-auto" />
                <p className="text-xs font-bold text-muted-custom">
                  You haven't placed any orders yet. Start exploring marketplace categories!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-4 bg-background-secondary/80 rounded-2xl border border-border-custom/80 text-xs"
                  >
                    <div>
                      <span className="font-mono font-black text-primary text-sm">#{ord.order_number}</span>
                      <span className="text-muted-custom block font-semibold mt-0.5">
                        Placed on {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="font-black text-foreground text-sm block">
                        ₹{ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="font-black text-[10px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
