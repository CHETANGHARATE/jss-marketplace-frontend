'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
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
  FileSpreadsheet,
  LayoutGrid,
  Percent,
  Receipt,
  Truck as SupplierIcon,
  UserCheck,
  Bell,
  HelpCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavGroup {
  groupName: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    exact?: boolean;
    badge?: string;
  }[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    groupName: 'CONTROL CENTER',
    items: [
      { href: '/admin', label: 'Dashboard', icon: ShieldAlert, exact: true },
    ],
  },
  {
    groupName: 'CATALOG',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package, exact: true },
      { href: '/admin/products/import', label: 'Bulk Import', icon: FileSpreadsheet },
      { href: '/admin/categories', label: 'Categories', icon: Layers },
      { href: '/admin/brands', label: 'Brands', icon: Award },
      { href: '/admin/attribute-templates', label: 'Attributes', icon: Tag },
    ],
  },
  {
    groupName: 'SALES',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/users', label: 'Customers', icon: Users },
    ],
  },
  {
    groupName: 'OPERATIONS',
    items: [
      { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
      { href: '/admin/vendors', label: 'Vendors', icon: Store },
      { href: '/admin/payments', label: 'Payments', icon: CreditCard },
      { href: '/admin/shipping', label: 'Shipping', icon: Truck },
    ],
  },
  {
    groupName: 'MARKETING',
    items: [
      { href: '/admin/promotions', label: 'Promotions', icon: Zap },
      { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
      { href: '/admin/flash-sales', label: 'Flash Sales', icon: Percent },
    ],
  },
  {
    groupName: 'CONTENT & CMS',
    items: [
      { href: '/admin/cms', label: 'CMS & Banners', icon: LayoutGrid },
      { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    ],
  },
  {
    groupName: 'ANALYTICS',
    items: [
      { href: '/admin/reports', label: 'Reports & BI', icon: BarChart3 },
    ],
  },
  {
    groupName: 'FINANCE & PROCUREMENT',
    items: [
      { href: '/admin/tax', label: 'Tax & GST', icon: Receipt },
      { href: '/admin/suppliers', label: 'Suppliers', icon: SupplierIcon },
    ],
  },
  {
    groupName: 'SYSTEM & SECURITY',
    items: [
      { href: '/admin/staff', label: 'Staff & Roles', icon: UserCheck },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
      { href: '/admin/support', label: 'Customer Support', icon: HelpCircle },
      { href: '/admin/settings', label: 'Platform Settings', icon: Sliders },
      { href: '/admin/security', label: 'Audit & Security', icon: ShieldCheck },
    ],
  },
];

export function AdminSidebar({ isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

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
    <aside
      className={`bg-[#07152F] text-white border border-[#1c325c] rounded-3xl p-4 shadow-xl shrink-0 lg:sticky lg:top-4 self-start transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-full lg:w-64 xl:w-72'
      }`}
    >
      {/* Admin Profile Header */}
      <div className="p-3.5 bg-[#0d2146] border border-[#1e3a6e] rounded-2xl space-y-1 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#FF1654] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            {!isCollapsed && <span>Control Center</span>}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer hidden lg:block"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>
        {!isCollapsed && (
          <>
            <h4 className="font-bold text-sm text-white truncate mt-1">{user?.name || 'Administrator'}</h4>
            <span className="text-[11px] text-[#94A3B8] font-medium block truncate">{user?.email || 'admin@jss.com'}</span>
          </>
        )}
      </div>

      {/* Navigation Group Accordion */}
      <nav className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pr-1">
        {NAVIGATION_GROUPS.map((group) => {
          const isGroupCollapsed = collapsedGroups[group.groupName];

          return (
            <div key={group.groupName} className="space-y-1.5">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.groupName)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-white hover:text-slate-200 transition-colors"
                >
                  <span>{group.groupName}</span>
                  <ChevronDown size={14} className={`text-slate-300 transition-transform duration-200 ${isGroupCollapsed ? '-rotate-90' : ''}`} />
                </button>
              )}

              {!isGroupCollapsed && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#FF1654] text-white shadow-md font-bold'
                            : 'text-[#D7E2F3] hover:bg-white/10 hover:text-white'
                        } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      >
                        <Icon size={16} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                        {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
                        {!isCollapsed && item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Sign Out Button */}
        <div className="pt-3 border-t border-[#1c325c] mt-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#FF1654] hover:bg-[#FF1654]/15 hover:text-white transition-colors text-left disabled:opacity-50 ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            {isLoggingOut ? (
              <Sparkles size={16} className="animate-spin text-[#FF1654] shrink-0" />
            ) : (
              <LogOut size={16} className="shrink-0" />
            )}
            {!isCollapsed && <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
