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
  Package
} from 'lucide-react';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const { data: orders = [] } = useOrdersQuery();
  const { data: notifications = [] } = useNotificationsQuery();

  const unreadNotifications = notifications.filter((n) => !n.read_at);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Account Dashboard' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 space-y-6 min-w-0 w-full">
          {/* Welcome Card */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Customer Account</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
                  Welcome Back, {user?.name || 'Customer'}!
                </h1>
                <p className="text-xs text-muted-custom font-medium mt-1">
                  Manage your orders, profile preferences, support requests, and security settings.
                </p>
              </div>

              <div className="shrink-0 bg-primary/10 border border-primary/20 px-4 py-3 rounded-2xl text-center">
                <span className="text-[10px] font-extrabold uppercase text-primary block">
                  Account Status
                </span>
                <span className="text-base font-black text-primary flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Active</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/orders"
              className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs hover:border-primary transition-all space-y-2 group"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="text-2xl font-black text-foreground block">{orders.length}</span>
              <span className="text-xs font-bold text-muted-custom block group-hover:text-primary transition-colors">Total Orders</span>
            </Link>

            <Link
              href="/account/notifications"
              className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs hover:border-primary transition-all space-y-2 group"
            >
              <Bell className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-black text-foreground block">{unreadNotifications.length}</span>
              <span className="text-xs font-bold text-muted-custom block group-hover:text-primary transition-colors">Unread Alerts</span>
            </Link>

            <Link
              href="/wishlist"
              className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs hover:border-primary transition-all space-y-2 group"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="text-xs font-bold text-muted-custom block pt-4 group-hover:text-primary transition-colors">Saved Wishlist</span>
            </Link>

            <Link
              href="/account/profile"
              className="p-5 bg-card border border-border-custom rounded-2xl shadow-xs hover:border-primary transition-all space-y-2 group"
            >
              <User className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold text-muted-custom block pt-4 group-hover:text-primary transition-colors">Edit Profile</span>
            </Link>
          </div>

          {/* Recent Orders Showcase */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span>Recent Orders</span>
              </h3>
              <Link
                href="/orders"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-muted-custom py-6 text-center">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-3.5 bg-background-secondary rounded-2xl border border-border-custom text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-primary">#{ord.order_number}</span>
                      <span className="text-muted-custom block font-medium mt-0.5">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-foreground block">
                        ₹{ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="font-bold text-[10px] text-emerald-600 uppercase tracking-wider">
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
