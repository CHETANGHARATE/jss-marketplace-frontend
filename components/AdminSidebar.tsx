'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldAlert,
  Users,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  BarChart3,
  Sliders,
  LogOut,
  Sparkles,
  Tag,
  Layers,
  Award,
  MessageSquare,
  Warehouse,
  Ticket,
  Zap,
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: ShieldAlert, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/brands', label: 'Brands', icon: Award },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/vendors', label: 'Vendors', icon: Store },
  { href: '/admin/users', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/promotions', label: 'Promotions', icon: Zap },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/shipping', label: 'Shipping', icon: Truck },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Sliders },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full lg:w-60 xl:w-64 bg-card border border-border/40 rounded-3xl p-4 shadow-sm shrink-0 lg:sticky lg:top-6 self-start">
      {/* Admin Badge */}
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1 mb-4">
        <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Super Admin</span>
        </div>
        <h4 className="font-black text-sm text-foreground truncate">{user?.name || 'Administrator'}</h4>
        <span className="text-[11px] text-foreground/60 block truncate">{user?.email || 'admin@jss.com'}</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-foreground/70 hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-2 border-t border-border/40 mt-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
