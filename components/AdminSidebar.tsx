'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  UserCheck,
  Bell,
  HelpCircle,
  ShieldCheck,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleDot,
  LayoutDashboard,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
  badge?: string;
}

export interface NavGroup {
  groupName: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: NavItem[];
}

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    groupName: 'DASHBOARD',
    icon: LayoutDashboard,
    items: [
      { href: '/admin', label: 'Dashboard', exact: true },
    ],
  },
  {
    groupName: 'PRODUCT MANAGEMENT',
    icon: Package,
    items: [
      { href: '/admin/products', label: 'All Products', exact: true },
      { href: '/admin/products/create', label: 'Add Product' },
      { href: '/admin/products/import', label: 'Bulk Import' },
      { href: '/admin/products?tab=pending', label: 'Product Approval' },
      { href: '/admin/products?tab=draft', label: 'Draft Products' },
      { href: '/admin/attribute-templates', label: 'Product Variants' },
      { href: '/admin/brands', label: 'Brands' },
      { href: '/admin/attribute-templates', label: 'Attributes' },
    ],
  },
  {
    groupName: 'CATEGORY MANAGEMENT',
    icon: Layers,
    items: [
      { href: '/admin/categories', label: 'Main Categories', exact: true },
      { href: '/admin/categories?tab=subcategories', label: 'Subcategories' },
      { href: '/admin/categories?tab=child', label: 'Child Categories' },
      { href: '/admin/cms?tab=banners', label: 'Category Banners' },
      { href: '/admin/categories', label: 'Category Icons' },
      { href: '/admin/categories', label: 'Category Ordering' },
      { href: '/admin/categories', label: 'SEO / Slugs' },
    ],
  },
  {
    groupName: 'ORDER MANAGEMENT',
    icon: ShoppingBag,
    items: [
      { href: '/admin/orders', label: 'All Orders', exact: true },
      { href: '/admin/orders?status=pending', label: 'New Orders' },
      { href: '/admin/orders?status=pending', label: 'Pending Orders' },
      { href: '/admin/orders?status=processing', label: 'Processing' },
      { href: '/admin/orders?status=packed', label: 'Packed' },
      { href: '/admin/orders?status=shipped', label: 'Shipped' },
      { href: '/admin/orders?status=delivered', label: 'Delivered' },
      { href: '/admin/orders?status=cancelled', label: 'Cancelled' },
      { href: '/admin/orders?status=returned', label: 'Returns' },
      { href: '/admin/orders?status=replacement', label: 'Replacements' },
      { href: '/admin/orders?status=exchange', label: 'Exchanges' },
      { href: '/admin/payments?status=refunded', label: 'Refunds' },
    ],
  },
  {
    groupName: 'CUSTOMER MANAGEMENT',
    icon: Users,
    items: [
      { href: '/admin/users', label: 'All Customers', exact: true },
      { href: '/admin/users?tab=groups', label: 'Customer Groups' },
      { href: '/admin/users?tab=memberships', label: 'Memberships' },
      { href: '/admin/users?tab=wallet', label: 'Wallet' },
      { href: '/admin/promotions?tab=loyalty', label: 'Loyalty Points' },
      { href: '/admin/users?status=inactive', label: 'Blocked Customers' },
      { href: '/admin/users', label: 'Customer Notes' },
      { href: '/admin/support', label: 'Support History' },
    ],
  },
  {
    groupName: 'INVENTORY MANAGEMENT',
    icon: Warehouse,
    items: [
      { href: '/admin/inventory', label: 'Stock Overview', exact: true },
      { href: '/admin/inventory?tab=stock-in', label: 'Stock In' },
      { href: '/admin/inventory?tab=stock-out', label: 'Stock Out' },
      { href: '/admin/inventory?tab=adjust', label: 'Stock Adjustment' },
      { href: '/admin/inventory?tab=low-stock', label: 'Low Stock' },
      { href: '/admin/inventory?tab=out-of-stock', label: 'Out of Stock' },
      { href: '/admin/inventory?tab=warehouses', label: 'Warehouses' },
      { href: '/admin/inventory?tab=damaged', label: 'Damaged Stock' },
      { href: '/admin/inventory?tab=returned', label: 'Returned Stock' },
      { href: '/admin/inventory?tab=expired', label: 'Expired Stock' },
      { href: '/admin/inventory?tab=transfer', label: 'Stock Transfer' },
      { href: '/admin/inventory?tab=audit', label: 'Inventory Audit' },
    ],
  },
  {
    groupName: 'VENDOR MANAGEMENT',
    icon: Store,
    items: [
      { href: '/admin/vendors', label: 'All Vendors', exact: true },
      { href: '/admin/vendors?tab=register', label: 'Vendor Registration' },
      { href: '/admin/vendors?tab=kyc', label: 'KYC Verification' },
      { href: '/admin/vendors?tab=pending', label: 'Pending Approval' },
      { href: '/admin/products', label: 'Vendor Products' },
      { href: '/admin/orders', label: 'Vendor Orders' },
      { href: '/admin/reports?tab=commission', label: 'Commission' },
      { href: '/admin/vendors?tab=settlements', label: 'Settlements' },
      { href: '/admin/orders', label: 'Vendor Returns' },
      { href: '/admin/reports', label: 'Vendor Performance' },
    ],
  },
  {
    groupName: 'PAYMENT MANAGEMENT',
    icon: CreditCard,
    items: [
      { href: '/admin/payments', label: 'Transactions', exact: true },
      { href: '/admin/payments?status=captured', label: 'Successful' },
      { href: '/admin/payments?status=pending', label: 'Pending' },
      { href: '/admin/payments?status=failed', label: 'Failed' },
      { href: '/admin/payments?status=refunded', label: 'Refunds' },
      { href: '/admin/payments?status=refunded', label: 'Partial Refunds' },
      { href: '/admin/payments?tab=cod', label: 'COD Reconciliation' },
      { href: '/admin/payments?tab=settlements', label: 'Settlements' },
      { href: '/admin/settings', label: 'Payment Gateway Settings' },
    ],
  },
  {
    groupName: 'SHIPPING MANAGEMENT',
    icon: Truck,
    items: [
      { href: '/admin/shipping', label: 'Shipping Zones', exact: true },
      { href: '/admin/shipping?tab=pincodes', label: 'Serviceable Pincodes' },
      { href: '/admin/shipping', label: 'Shipping Charges' },
      { href: '/admin/promotions', label: 'Free Shipping Rules' },
      { href: '/admin/shipping?tab=couriers', label: 'Courier Partners' },
      { href: '/admin/shipping?tab=tracking', label: 'AWB / Tracking' },
      { href: '/admin/shipping', label: 'Delivery Estimates' },
      { href: '/admin/orders', label: 'Shipping Labels' },
      { href: '/admin/shipping?tab=pickups', label: 'Pickup Requests' },
      { href: '/admin/shipping?tab=ndr', label: 'NDR Management' },
    ],
  },
  {
    groupName: 'PROMOTIONS & COUPONS',
    icon: Ticket,
    items: [
      { href: '/admin/coupons', label: 'Coupons', exact: true },
      { href: '/admin/promotions', label: 'Automatic Discounts' },
      { href: '/admin/promotions', label: 'Product Offers' },
      { href: '/admin/promotions', label: 'Category Offers' },
      { href: '/admin/promotions', label: 'Brand Offers' },
      { href: '/admin/coupons', label: 'First Order Discount' },
      { href: '/admin/promotions', label: 'Buy One Get One' },
      { href: '/admin/promotions', label: 'Combo Offers' },
      { href: '/admin/flash-sales', label: 'Festival Sales' },
      { href: '/admin/flash-sales', label: 'Flash Sales' },
    ],
  },
  {
    groupName: 'CMS & CONTENT',
    icon: LayoutGrid,
    items: [
      { href: '/admin/cms', label: 'Home Sliders', exact: true },
      { href: '/admin/cms?tab=banners', label: 'Promotional Banners' },
      { href: '/admin/cms?tab=popups', label: 'Popup Banners' },
      { href: '/admin/cms?tab=sections', label: 'Home Sections' },
      { href: '/admin/cms?tab=pages', label: 'Pages' },
      { href: '/admin/cms?tab=pages', label: 'About Us' },
      { href: '/admin/cms?tab=pages', label: 'Contact Us' },
      { href: '/admin/cms?tab=faq', label: 'FAQ' },
      { href: '/admin/cms?tab=policies', label: 'Policies' },
      { href: '/admin/cms?tab=blog', label: 'Blog' },
      { href: '/admin/cms?tab=news', label: 'News' },
      { href: '/admin/cms?tab=announcements', label: 'Announcements' },
    ],
  },
  {
    groupName: 'REVIEWS & RATINGS',
    icon: MessageSquare,
    items: [
      { href: '/admin/reviews', label: 'Product Reviews', exact: true },
      { href: '/admin/reviews', label: 'Star Ratings' },
      { href: '/admin/reviews?status=pending', label: 'Pending Reviews' },
      { href: '/admin/reviews?status=reported', label: 'Reported Reviews' },
      { href: '/admin/reviews?filter=photo', label: 'Photo Reviews' },
      { href: '/admin/reviews?filter=video', label: 'Video Reviews' },
      { href: '/admin/reviews', label: 'Verified Purchases' },
    ],
  },
  {
    groupName: 'REPORTS & ANALYTICS',
    icon: BarChart3,
    items: [
      { href: '/admin/reports', label: 'Sales Reports', exact: true },
      { href: '/admin/reports?tab=orders', label: 'Order Reports' },
      { href: '/admin/reports?tab=revenue', label: 'Revenue Reports' },
      { href: '/admin/reports?tab=products', label: 'Product Performance' },
      { href: '/admin/reports?tab=categories', label: 'Category Performance' },
      { href: '/admin/reports?tab=customers', label: 'Customer Reports' },
      { href: '/admin/reports?tab=inventory', label: 'Inventory Reports' },
      { href: '/admin/reports?tab=returns', label: 'Return / Refund Reports' },
      { href: '/admin/reports?tab=payments', label: 'Payment Reports' },
      { href: '/admin/reports?tab=commission', label: 'Vendor Commission' },
      { href: '/admin/reports?tab=pnl', label: 'Profit & Loss' },
      { href: '/admin/reports?tab=export', label: 'Export Reports' },
    ],
  },
  {
    groupName: 'TAX & INVOICING',
    icon: Receipt,
    items: [
      { href: '/admin/tax', label: 'GST Settings', exact: true },
      { href: '/admin/tax?tab=hsn', label: 'HSN / SAC Codes' },
      { href: '/admin/tax?tab=rules', label: 'Tax Rules' },
      { href: '/admin/tax?tab=gstin', label: 'Company GSTIN' },
      { href: '/admin/tax?tab=billing', label: 'Billing Address' },
      { href: '/admin/tax?tab=invoice', label: 'Invoice Settings' },
      { href: '/admin/tax?tab=invoices', label: 'Tax Invoices' },
      { href: '/admin/tax?tab=credit-notes', label: 'Credit Notes' },
      { href: '/admin/tax?tab=debit-notes', label: 'Debit Notes' },
    ],
  },
  {
    groupName: 'SUPPLIERS & PURCHASE',
    icon: Boxes,
    items: [
      { href: '/admin/suppliers', label: 'Suppliers', exact: true },
      { href: '/admin/suppliers', label: 'Supplier Profiles' },
      { href: '/admin/suppliers?tab=po', label: 'Purchase Orders' },
      { href: '/admin/suppliers?tab=invoices', label: 'Purchase Invoices' },
      { href: '/admin/suppliers?tab=grn', label: 'Goods Received Notes' },
      { href: '/admin/suppliers?tab=payments', label: 'Supplier Payments' },
      { href: '/admin/suppliers?tab=due', label: 'Outstanding Payments' },
      { href: '/admin/suppliers?tab=returns', label: 'Purchase Returns' },
      { href: '/admin/suppliers?tab=costs', label: 'Product Cost History' },
    ],
  },
  {
    groupName: 'STAFF & ROLES',
    icon: UserCheck,
    items: [
      { href: '/admin/staff', label: 'Staff', exact: true },
      { href: '/admin/staff?tab=roles', label: 'Roles' },
      { href: '/admin/staff?tab=permissions', label: 'Permissions' },
      { href: '/admin/staff?tab=departments', label: 'Department Users' },
      { href: '/admin/security?tab=login-activity', label: 'Login Activity' },
      { href: '/admin/security?tab=audit-logs', label: 'Audit Logs' },
    ],
  },
  {
    groupName: 'NOTIFICATIONS',
    icon: Bell,
    items: [
      { href: '/admin/notifications', label: 'Notification Center', exact: true },
      { href: '/admin/notifications?tab=push', label: 'Push Notifications' },
      { href: '/admin/notifications?tab=sms', label: 'SMS' },
      { href: '/admin/notifications?tab=email', label: 'Email' },
      { href: '/admin/notifications?tab=whatsapp', label: 'WhatsApp' },
      { href: '/admin/notifications?tab=templates', label: 'Order Templates' },
      { href: '/admin/notifications?tab=otp', label: 'OTP Notifications' },
      { href: '/admin/notifications?tab=campaigns', label: 'Promotional Campaigns' },
      { href: '/admin/notifications?tab=cart', label: 'Abandoned Cart' },
      { href: '/admin/notifications?tab=stock', label: 'Stock Alerts' },
      { href: '/admin/notifications?tab=admin', label: 'Admin Alerts' },
    ],
  },
  {
    groupName: 'SUPPORT',
    icon: HelpCircle,
    items: [
      { href: '/admin/support', label: 'Customer Tickets', exact: true },
      { href: '/admin/support?type=complaint', label: 'Complaints' },
      { href: '/admin/support?type=refund', label: 'Return / Refund Queries' },
      { href: '/admin/support?tab=categories', label: 'Ticket Categories' },
      { href: '/admin/support?tab=priority', label: 'Ticket Priority' },
      { href: '/admin/support?tab=assigned', label: 'Assigned Tickets' },
      { href: '/admin/support', label: 'Internal Notes' },
      { href: '/admin/support', label: 'Conversation History' },
    ],
  },
  {
    groupName: 'SETTINGS',
    icon: Sliders,
    items: [
      { href: '/admin/settings', label: 'General Settings', exact: true },
      { href: '/admin/settings?tab=company', label: 'Company Details' },
      { href: '/admin/settings?tab=branding', label: 'Logo / Favicon' },
      { href: '/admin/settings?tab=contact', label: 'Contact Details' },
      { href: '/admin/settings?tab=social', label: 'Social Media' },
      { href: '/admin/settings?tab=localization', label: 'Currency' },
      { href: '/admin/settings?tab=localization', label: 'Languages' },
      { href: '/admin/settings?tab=localization', label: 'Date / Time' },
      { href: '/admin/settings?tab=localization', label: 'Timezone' },
      { href: '/admin/settings?tab=seo', label: 'SEO' },
      { href: '/admin/settings?tab=analytics', label: 'Google Analytics' },
      { href: '/admin/settings?tab=analytics', label: 'Meta Pixel' },
      { href: '/admin/settings?tab=maintenance', label: 'Maintenance Mode' },
      { href: '/admin/settings?tab=system', label: 'App Version' },
    ],
  },
  {
    groupName: 'SECURITY & BACKUP',
    icon: ShieldCheck,
    items: [
      { href: '/admin/security', label: 'Security Settings', exact: true },
      { href: '/admin/security?tab=2fa', label: 'Two-Factor Authentication' },
      { href: '/admin/security?tab=password-policy', label: 'Password Policy' },
      { href: '/admin/security?tab=login-attempts', label: 'Login Attempts' },
      { href: '/admin/security?tab=sessions', label: 'Session Control' },
      { href: '/admin/security?tab=ip-restrictions', label: 'IP Restrictions' },
      { href: '/admin/security?tab=activity-logs', label: 'Activity Logs' },
      { href: '/admin/security?tab=change-history', label: 'Change History' },
      { href: '/admin/security?tab=backup', label: 'Data Backup' },
    ],
  },
];

/** Determine which group owns the current pathname */
function getActiveGroupName(pathname: string): string | null {
  if (pathname === '/admin') return 'DASHBOARD';

  for (const group of NAVIGATION_GROUPS) {
    if (group.groupName === 'DASHBOARD') continue;
    for (const item of group.items) {
      const itemBase = item.href.split('?')[0];
      if (item.exact) {
        if (pathname === item.href) return group.groupName;
      } else {
        if (pathname === itemBase || pathname.startsWith(itemBase + '/')) {
          return group.groupName;
        }
      }
    }
  }
  return null;
}

export function AdminSidebar({ isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Determine which group the current route belongs to
  const activeGroupName = useMemo(() => getActiveGroupName(pathname), [pathname]);

  // Single-open accordion: only one group is expanded at a time.
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupName);

  // Auto-expand the active section whenever the route changes
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

      {/* Navigation Group Accordion (All 20 Modules) */}
      <nav className="space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar pr-1">
        {NAVIGATION_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          const isDashboard = group.groupName === 'DASHBOARD';
          const isOpen = isDashboard || openGroup === group.groupName;
          const isGroupActive = activeGroupName === group.groupName;

          // For Dashboard single-item direct link
          if (isDashboard) {
            const isDashActive = pathname === '/admin';
            return (
              <div key={group.groupName} className="mb-1">
                <Link
                  href="/admin"
                  title={isCollapsed ? 'Dashboard' : undefined}
                  className={`flex items-center gap-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'
                  } ${
                    isDashActive
                      ? 'bg-[#FF1654] text-white shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <GroupIcon size={16} className={isDashActive ? 'text-white' : 'text-[#7090B8]'} />
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>
              </div>
            );
          }

          // In collapsed-icon mode, clicking group icon navigates or toggles
          return (
            <div key={group.groupName} className="mb-0.5">
              {/* Section heading / accordion trigger */}
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.groupName)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 mt-0.5 rounded-xl text-[11px] font-black uppercase tracking-[0.06em] transition-all cursor-pointer ${
                    isOpen
                      ? 'text-white bg-white/10 shadow-xs'
                      : isGroupActive
                      ? 'text-white bg-white/5'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GroupIcon
                      size={15}
                      className={isOpen || isGroupActive ? 'text-[#FF1654]' : 'text-slate-400'}
                    />
                    <span className="truncate">{group.groupName}</span>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.groupName)}
                  title={group.groupName}
                  className={`w-full flex justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
                    isGroupActive ? 'bg-[#FF1654] text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <GroupIcon size={18} />
                </button>
              )}

              {/* Submenu items */}
              {isOpen && !isCollapsed && (
                <div className="space-y-0.5 ml-3 pl-2.5 border-l border-white/10 mt-1 mb-2">
                  {group.items.map((item, idx) => {
                    const itemBase = item.href.split('?')[0];
                    const isExactMatch = pathname === item.href;
                    const isBaseMatch = pathname === itemBase;
                    const isActive = item.exact ? isExactMatch : isExactMatch || isBaseMatch;

                    return (
                      <Link
                        key={`${item.href}-${idx}`}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive && isGroupActive
                            ? 'bg-[#FF1654] text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white">
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
      </nav>

      {/* Logout Action */}
      <div className="pt-3 mt-3 border-t border-[#1c325c]">
        <button
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
