'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Wallet,
  BarChart3,
  Store,
  LogOut,
  Sparkles
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendor/products', label: 'Products Catalog', icon: Package },
  { href: '/vendor/inventory', label: 'Inventory & Stock', icon: Boxes },
  { href: '/vendor/orders', label: 'Vendor Orders', icon: ShoppingBag },
  { href: '/vendor/wallet', label: 'Wallet & Payouts', icon: Wallet },
  { href: '/vendor/analytics', label: 'Sales Analytics', icon: BarChart3 },
  { href: '/vendor/settings', label: 'Storefront Settings', icon: Store },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full lg:w-64 bg-card border border-border/40 rounded-3xl p-4 shadow-sm space-y-6 shrink-0">
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-1">
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vendor Control Panel</span>
        </div>
        <h4 className="font-black text-sm text-foreground truncate">{user?.name || 'Verified Seller Store'}</h4>
        <span className="text-[11px] text-foreground/60 block truncate">{user?.email || 'vendor@jss.com'}</span>
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
                  ? 'bg-primary text-primary-foreground shadow-xs'
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
          <span>Exit Vendor Panel</span>
        </button>
      </nav>
    </aside>
  );
}
