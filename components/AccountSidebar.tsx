'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
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
  LogOut,
  ShieldCheck,
  Sparkles
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      queryClient.clear();
      await logout();
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-full lg:w-72 bg-card border border-border-custom/80 rounded-3xl p-5 shadow-xs space-y-6 shrink-0">
      {/* Customer Profile Avatar Box */}
      <div className="p-4 bg-background-secondary/80 border border-border-custom/80 rounded-2xl flex items-center gap-3.5">
        <div className="h-12 w-12 bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary border border-primary/20 font-black rounded-2xl flex items-center justify-center text-sm uppercase shrink-0 shadow-2xs">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h4 className="font-extrabold text-sm text-foreground truncate">{user?.name || 'Customer Account'}</h4>
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
          </div>
          <span className="text-[11px] font-medium text-muted-custom truncate block mt-0.5">{user?.email || 'customer@jss.com'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-custom hover:bg-background-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-rose-500 hover:bg-rose-500/10 transition-colors text-left disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
              <span>Signing Out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </nav>
    </aside>
  );
}
