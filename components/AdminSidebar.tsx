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
      className={`bg-card border border-border-custom/80 rounded-3xl p-4 shadow-sm shrink-0 lg:sticky lg:top-4 self-start transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-full lg:w-64 xl:w-72'
      }`}
    >
      {/* Admin Profile Header */}
      <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-rose-500 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} />
            {!isCollapsed && <span>Control Center</span>}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-rose-500 hover:bg-rose-500/20 p-1 rounded-lg transition-colors cursor-pointer hidden lg:block"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>
        {!isCollapsed && (
          <>
            <h4 className="font-black text-sm text-foreground truncate mt-1">{user?.name || 'Administrator'}</h4>
            <span className="text-[11px] text-muted-custom font-semibold block truncate">{user?.email || 'admin@jss.com'}</span>
          </>
        )}
      </div>

      {/* Navigation Group Accordion */}
      <nav className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pr-1">
        {NAVIGATION_GROUPS.map((group) => {
          const isGroupCollapsed = collapsedGroups[group.groupName];

          return (
            <div key={group.groupName} className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.groupName)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-custom/80 hover:text-foreground transition-colors"
                >
                  <span>{group.groupName}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isGroupCollapsed ? '-rotate-90' : ''}`} />
                </button>
              )}

              {!isGroupCollapsed && (
                <div className="space-y-0.5">
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
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'text-foreground/75 hover:bg-background-secondary hover:text-foreground'
                        } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      >
                        <Icon size={16} className="shrink-0" />
                        {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
                        {!isCollapsed && item.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-400/20 text-white">
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
        <div className="pt-3 border-t border-border-custom/60 mt-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left disabled:opacity-50 ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            {isLoggingOut ? (
              <Sparkles size={16} className="animate-spin text-rose-500 shrink-0" />
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
