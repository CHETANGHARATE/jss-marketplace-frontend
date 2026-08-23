'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Plus,
  Bell,
  Package,
  Layers,
  Store,
  Ticket,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark / Light Theme
  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.toggle('dark');
      setIsDarkMode(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickCreateItems = [
    { label: 'Add New Product', href: '/admin/products/create', icon: Package },
    { label: 'Create Category', href: '/admin/categories', icon: Layers },
    { label: 'Add Coupon Code', href: '/admin/coupons', icon: Ticket },
    { label: 'Onboard Vendor', href: '/admin/vendors', icon: Store },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border-custom/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Toggle, Admin Brand Logo & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-muted-custom hover:text-foreground hover:bg-background-secondary transition-colors"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={20} />
            </button>
          )}

          <BrandLogo variant="admin" size="sm" href="/admin" className="hidden md:inline-flex" />

          {/* Quick Global Search Bar */}
          <form onSubmit={handleGlobalSearch} className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, vendors, customers..."
              className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-custom"
            />
          </form>
        </div>

        {/* Right: Quick Actions, Theme Toggle, Notifications & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all shadow-2xs"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Quick Create</span>
              <ChevronDown size={14} className={`transition-transform ${isQuickCreateOpen ? 'rotate-180' : ''}`} />
            </button>

            {isQuickCreateOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-card border border-border-custom/80 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setIsQuickCreateOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-border-custom/60 mb-1">
                  <span className="text-[10px] font-black uppercase text-muted-custom tracking-wider">Quick Actions</span>
                </div>
                {quickCreateItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsQuickCreateOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-foreground hover:bg-background-secondary hover:text-primary transition-colors"
                    >
                      <Icon size={15} className="text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-background-secondary border border-border-custom/80 text-foreground/80 hover:text-foreground transition-all"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600 dark:text-slate-300" />}
          </button>

          {/* Notifications Trigger */}
          <Link
            href="/admin/notifications"
            className="relative p-2 rounded-xl bg-background-secondary border border-border-custom/80 text-foreground/80 hover:text-foreground transition-all"
            title="System Alerts & Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-border-custom/80 bg-background-secondary hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center font-black text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-black text-foreground leading-tight truncate max-w-[110px]">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-[10px] text-muted-custom font-semibold leading-tight">Super Admin</div>
              </div>
              <ChevronDown size={14} className="text-muted-custom" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-card border border-border-custom/80 rounded-2xl shadow-xl py-2 z-50"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-border-custom/60 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                    <Sparkles size={13} />
                    <span>Logged as Super Admin</span>
                  </div>
                  <div className="text-xs font-bold text-foreground truncate mt-0.5">{user?.email || 'admin@jss.com'}</div>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-foreground hover:bg-background-secondary transition-colors"
                >
                  <User size={15} className="text-muted-custom" />
                  <span>Account & Settings</span>
                </Link>

                <div className="border-t border-border-custom/60 my-1 pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
