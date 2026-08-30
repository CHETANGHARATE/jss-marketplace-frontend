'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import {
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
  Layers,
  MessageSquare,
  Warehouse,
  Ticket,
  Receipt,
  UserCheck,
  Bell,
  HelpCircle,
  ShieldCheck,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  LayoutGrid,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export type NavEntry =
  | {
      type: 'link';
      label: string;
      href: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      exact?: boolean;
      badge?: string;
      permission?: string;
    }
  | {
      type: 'group';
      groupName: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      permission?: string;
      items: {
        label: string;
        href: string;
        exact?: boolean;
        badge?: string;
        permission?: string;
      }[];
    };

export const NAVIGATION_ENTRIES: NavEntry[] = [
  // 1. Dashboard — Accessible to all authenticated admin & staff
  {
    type: 'link',
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },

  // 2. Product Management
  {
    type: 'group',
    groupName: 'PRODUCT MANAGEMENT',
    icon: Package,
    permission: 'products.view',
    items: [
      { href: '/admin/products', label: 'All Products', exact: true, permission: 'products.view' },
      { href: '/admin/products/create', label: 'Add Product', permission: 'products.create' },
      { href: '/admin/products/import', label: 'Bulk Import', permission: 'products.create' },
      { href: '/admin/brands', label: 'Brands', permission: 'brands.view' },
      { href: '/admin/attribute-templates', label: 'Attributes', permission: 'attributes.view' },
    ],
  },

  // 3. Category Management
  {
    type: 'link',
    label: 'CATEGORY MANAGEMENT',
    href: '/admin/categories',
    icon: Layers,
    permission: 'categories.view',
  },

  // 4. Order Management
  {
    type: 'link',
    label: 'ORDER MANAGEMENT',
    href: '/admin/orders',
    icon: ShoppingBag,
    permission: 'orders.view',
  },

  // 5. Customer Management
  {
    type: 'link',
    label: 'CUSTOMER MANAGEMENT',
    href: '/admin/users',
    icon: Users,
    permission: 'customers.view',
  },

  // 6. Inventory Management
  {
    type: 'link',
    label: 'INVENTORY MANAGEMENT',
    href: '/admin/inventory',
    icon: Warehouse,
    permission: 'inventory.view',
  },

  // 7. Vendor Management
  {
    type: 'link',
    label: 'VENDOR MANAGEMENT',
    href: '/admin/vendors',
    icon: Store,
    permission: 'vendors.view',
  },

  // 8. Payment Management
  {
    type: 'link',
    label: 'PAYMENT MANAGEMENT',
    href: '/admin/payments',
    icon: CreditCard,
    permission: 'payments.view',
  },

  // 9. Shipping Management
  {
    type: 'link',
    label: 'SHIPPING MANAGEMENT',
    href: '/admin/shipping',
    icon: Truck,
    permission: 'shipping.view',
  },

  // 10. Promotions & Coupons
  {
    type: 'group',
    groupName: 'PROMOTIONS & COUPONS',
    icon: Ticket,
    permission: 'promotions.view',
    items: [
      { href: '/admin/coupons', label: 'Coupons', exact: true, permission: 'promotions.view' },
      { href: '/admin/promotions', label: 'Promotions', permission: 'promotions.view' },
      { href: '/admin/flash-sales', label: 'Flash Sales', permission: 'promotions.view' },
    ],
  },

  // 11. CMS & Content
  {
    type: 'link',
    label: 'CMS & CONTENT',
    href: '/admin/cms',
    icon: LayoutGrid,
    permission: 'cms.view',
  },

  // 12. Reviews & Ratings
  {
    type: 'link',
    label: 'REVIEWS & RATINGS',
    href: '/admin/reviews',
    icon: MessageSquare,
    permission: 'reviews.view',
  },

  // 13. Reports & Analytics
  {
    type: 'link',
    label: 'REPORTS & ANALYTICS',
    href: '/admin/reports',
    icon: BarChart3,
    permission: 'reports.view',
  },

  // 14. Tax & Invoicing
  {
    type: 'link',
    label: 'TAX & INVOICING',
    href: '/admin/tax',
    icon: Receipt,
    permission: 'tax.view',
  },

  // 15. Suppliers & Purchase
  {
    type: 'link',
    label: 'SUPPLIERS & PURCHASE',
    href: '/admin/suppliers',
    icon: Boxes,
    permission: 'suppliers.view',
  },

  // 16. Staff & Roles
  {
    type: 'link',
    label: 'STAFF & ROLES',
    href: '/admin/staff',
    icon: UserCheck,
    permission: 'staff.view',
  },

  // 17. Notifications
  {
    type: 'link',
    label: 'NOTIFICATIONS',
    href: '/admin/notifications',
    icon: Bell,
    permission: 'notifications.view',
  },

  // 18. Support
  {
    type: 'link',
    label: 'SUPPORT',
    href: '/admin/support',
    icon: HelpCircle,
    permission: 'support.view',
  },

  // 19. Settings
  {
    type: 'link',
    label: 'SETTINGS',
    href: '/admin/settings',
    icon: Sliders,
    permission: 'settings.view',
  },

  // 20. Security & Backup
  {
    type: 'link',
    label: 'SECURITY & BACKUP',
    href: '/admin/security',
    icon: ShieldCheck,
    permission: 'security.view',
  },
];

/** Check if a pathname matches a link route */
function isLinkActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact || href === '/admin') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(href + '/');
}

/** Check if a pathname belongs to a group */
function isGroupActive(pathname: string, group: Extract<NavEntry, { type: 'group' }>): boolean {
  return group.items.some((item) => {
    if (item.exact) return pathname === item.href;
    const base = item.href.split('?')[0];
    return pathname === item.href || pathname.startsWith(base + '/');
  });
}

/** Check which group is active for auto-expansion */
function getActiveGroupName(pathname: string, entries: NavEntry[]): string | null {
  for (const entry of entries) {
    if (entry.type === 'group' && isGroupActive(pathname, entry)) {
      return entry.groupName;
    }
  }
  return null;
}

export function AdminSidebar({ isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout, can } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Filter navigation entries based on user permissions + Smart Sidebar Rule:
  // 0 accessible children → completely hidden
  // 1 accessible child → direct link without dropdown
  // 2+ accessible children → dropdown with only permitted items
  const accessibleEntries = useMemo(() => {
    return NAVIGATION_ENTRIES.map((entry) => {
      if (entry.type === 'link') {
        if (entry.permission && !can(entry.permission)) {
          return null;
        }
        return entry;
      }

      if (entry.type === 'group') {
        const permittedItems = entry.items.filter((item) => {
          return !item.permission || can(item.permission);
        });

        // 0 accessible children → hide group completely
        if (permittedItems.length === 0) {
          return null;
        }

        // 1 accessible child → collapse to direct link (no dropdown accordion)
        if (permittedItems.length === 1) {
          const single = permittedItems[0];
          return {
            type: 'link' as const,
            label: single.label,
            href: single.href,
            icon: entry.icon,
            exact: single.exact,
            badge: single.badge,
            permission: single.permission,
          };
        }

        // 2+ accessible children → dropdown accordion with accessible children only
        return {
          ...entry,
          items: permittedItems,
        };
      }

      return null;
    }).filter(Boolean) as NavEntry[];
  }, [can]);

  // Active group auto-expansion
  const activeGroupName = useMemo(() => getActiveGroupName(pathname, accessibleEntries), [pathname, accessibleEntries]);
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupName);

  useEffect(() => {
    if (activeGroupName) {
      setOpenGroup(activeGroupName);
    }
  }, [activeGroupName]);

  const toggleGroup = (groupName: string) => {
    setOpenGroup((prev) => (prev === groupName ? null : groupName));
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

  const displayRole = user?.is_super_admin || user?.role_slug === 'super_admin'
    ? 'Super Admin'
    : user?.role_slug
    ? user.role_slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Staff Administrator';

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
            {!isCollapsed && <span>{displayRole}</span>}
          </div>
          {onToggleCollapse && (
            <button
              type="button"
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

      {/* Navigation List (Filtered by Permissions with Smart Direct Links & Groups) */}
      <nav className="space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar pr-1">
        {accessibleEntries.map((entry) => {
          const Icon = entry.icon;

          // ── CASE 1 & 2: Direct Link (0 or 1 real destination) ──
          if (entry.type === 'link') {
            const isActive = isLinkActive(pathname, entry.href, entry.exact);

            return (
              <div key={entry.href} className="mb-0.5">
                <Link
                  href={entry.href}
                  title={isCollapsed ? entry.label : undefined}
                  className={`flex items-center gap-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#FF1654] text-white shadow-md font-bold'
                      : 'text-[#D7E2F3] hover:bg-white/10 hover:text-white font-semibold'
                  }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 ${isActive ? 'text-white' : 'text-[#7090B8]'}`}
                  />
                  {!isCollapsed && (
                    <span className="truncate font-bold uppercase text-[11px] tracking-[0.04em]">
                      {entry.label}
                    </span>
                  )}
                  {!isCollapsed && entry.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white">
                      {entry.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          }

          // ── CASE 3: Expandable Accordion Group (2+ real distinct destinations) ──
          const isGroupOpen = openGroup === entry.groupName;
          const isGroupCurrentlyActive = isGroupActive(pathname, entry);

          return (
            <div key={entry.groupName} className="mb-0.5">
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(entry.groupName)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 mt-0.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.04em] transition-all cursor-pointer ${
                    isGroupOpen
                      ? 'text-white bg-white/10 shadow-xs'
                      : isGroupCurrentlyActive
                      ? 'text-white bg-white/5'
                      : 'text-[#D7E2F3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={16}
                      className={`shrink-0 ${
                        isGroupOpen || isGroupCurrentlyActive ? 'text-[#FF1654]' : 'text-[#7090B8]'
                      }`}
                    />
                    <span className="truncate">{entry.groupName}</span>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${
                      isGroupOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleGroup(entry.groupName)}
                  title={entry.groupName}
                  className={`w-full flex justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
                    isGroupCurrentlyActive
                      ? 'bg-[#FF1654] text-white'
                      : 'text-[#7090B8] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                </button>
              )}

              {/* Submenu Items (Only shown for 2+ child groups when open) */}
              {isGroupOpen && !isCollapsed && (
                <div className="space-y-0.5 ml-3 pl-2.5 border-l border-white/10 mt-1 mb-2">
                  {entry.items.map((subItem) => {
                    // Check exact single active child item
                    let isSubActive = false;
                    if (subItem.exact) {
                      isSubActive = pathname === subItem.href;
                    } else if (subItem.href === '/admin/products') {
                      isSubActive = pathname === '/admin/products' || /^\/admin\/products\/\d+(\/edit)?$/.test(pathname);
                    } else {
                      isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                    }

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-[#FF1654] text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                        }`}
                      >
                        <span className="truncate">{subItem.label}</span>
                        {subItem.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white">
                            {subItem.badge}
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
      </nav>

      {/* Logout Action */}
      <div className="pt-3 mt-3 border-t border-[#1c325c]">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer ${
            isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'
          }`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>}
        </button>
      </div>
    </aside>
  );
}
