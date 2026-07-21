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
  Sparkles
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', label: 'System Dashboard', icon: ShieldAlert },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/vendors', label: 'Vendor Management', icon: Store },
  { href: '/admin/products', label: 'Product Catalog', icon: Package },
  { href: '/admin/orders', label: 'Platform Orders', icon: ShoppingBag },
  { href: '/admin/payments', label: 'Payment Audit', icon: CreditCard },
  { href: '/admin/shipping', label: 'Logistics & Shipping', icon: Truck },
  { href: '/admin/reports', label: 'Executive Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Platform Settings', icon: Sliders },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full lg:w-64 bg-card border border-border/40 rounded-3xl p-4 shadow-sm space-y-6 shrink-0">
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1">
        <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Super Admin Access</span>
        </div>
        <h4 className="font-black text-sm text-foreground truncate">{user?.name || 'Administrator'}</h4>
        <span className="text-[11px] text-foreground/60 block truncate">{user?.email || 'admin@jss.com'}</span>
      </div>

      <nav className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-foreground/70 hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </nav>
    </aside>
  );
}
