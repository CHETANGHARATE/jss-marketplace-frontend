'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  KeyRound,
  Bell,
  Star,
  LifeBuoy,
  RotateCcw,
  Gift,
  Share2,
  LogOut
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/account', label: 'Dashboard Overview', icon: LayoutDashboard },
  { href: '/account/profile', label: 'Profile Details', icon: User },
  { href: '/account/password', label: 'Security & Password', icon: KeyRound },
  { href: '/account/notifications', label: 'Notifications', icon: Bell },
  { href: '/account/reviews', label: 'My Reviews', icon: Star },
  { href: '/account/support', label: 'Support Tickets', icon: LifeBuoy },
  { href: '/account/returns', label: 'Returns & Refunds', icon: RotateCcw },
  { href: '/account/loyalty', label: 'Loyalty Rewards', icon: Gift },
  { href: '/account/referrals', label: 'Refer & Earn', icon: Share2 },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full lg:w-64 bg-card border border-border/40 rounded-3xl p-4 shadow-sm space-y-6 shrink-0">
      <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm uppercase">
          {user?.name ? user.name.slice(0, 2) : 'CU'}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-foreground truncate">{user?.name || 'Customer Account'}</h4>
          <span className="text-[11px] text-foreground/60 truncate block">{user?.email || 'customer@jss.com'}</span>
        </div>
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
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
