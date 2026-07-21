# JSS Solutions Multi Vendor Marketplace - Next.js Enterprise Frontend

Enterprise-grade multi-vendor eCommerce frontend for JSS Solutions Marketplace. Built using **Next.js 16 (App Router)**, **TypeScript**, **React 19**, **TanStack Query (React Query v5)**, **Axios**, and **Tailwind CSS v4**.

---

## Backend API Integration & Architecture

This frontend is designed to consume the **Laravel 12 REST API Backend** running at `http://localhost:8000/api/v1`.

### Completed Modules:

- **Module 1 (Core Infrastructure & Real API Client Integration)**:
  - Centralized Axios client (`services/apiClient.ts`) with automatic Sanctum Bearer token and Guest session headers (`X-Session-ID`).
  - TanStack Query provider (`providers/ReactQueryProvider.tsx`).
  - Auth Context (`contexts/AuthContext.tsx` & `hooks/useAuth.ts`).

- **Module 2 (Catalog Foundation & Multi-lingual Category Navigation)**:
  - Category, Brand & Attribute API Services.
  - Dynamic Multilingual Mega Menu (`components/MegaMenu.tsx`).

- **Module 3 (Product Engine & Search Experience)**:
  - Product, Search & Recommendation API Services.
  - Product Details (`app/product/[slug]`) and Search Results (`app/search`).

- **Module 4 (Shopping Cart & Wishlist)**:
  - Cart & Wishlist API Services (`app/cart` and `app/wishlist`).

- **Module 5 (Customer Checkout & Orders)**:
  - Saved Address, Checkout & Orders API Services (`app/checkout` and `app/orders`).

- **Module 6 (Payments & Shipping)**:
  - Payment & Shipping API Services with Razorpay integration.

- **Module 7 (Customer Account)**:
  - Customer Profile, Notifications, Reviews, Support Tickets, Returns & Refunds (`app/account/*`).

- **Module 8 (Vendor Portal)**:
  - Seller Store Dashboard, Product Catalog, Inventory, Vendor Orders, Wallet, Analytics, and Settings (`app/vendor/*`).

- **Module 9 (Admin Dashboard)**:
  - Admin REST API Service (`services/adminService.ts`).
  - TanStack Query hooks (`useAdminDashboardQuery`, `useAdminCustomersQuery`, `useToggleCustomerStatusMutation`, `useAdminVendorsQuery`, `useApproveVendorMutation`, `useSuspendVendorMutation`, `useAdminProductsQuery`, `useApproveProductMutation`, `useRejectProductMutation`, `useToggleFeatureProductMutation`, `useAdminOrdersQuery`, `useUpdateAdminOrderStatusMutation`, `useAdminPaymentsQuery`, `useAdminShipmentsQuery`, `useAdminReportsQuery`, `useAdminSettingsQuery`, `useUpdateAdminSettingsMutation`).
  - Dedicated Admin Control Navigation Sidebar (`components/AdminSidebar.tsx`).
  - System Administrator Dashboard Overview (`app/admin/page.tsx`).
  - Customer Account Directory & Status Controls (`app/admin/users/page.tsx`).
  - Multi-Vendor Merchant Control & Approvals (`app/admin/vendors/page.tsx`).
  - Product Catalog Moderation & Featuring (`app/admin/products/page.tsx`).
  - Platform-wide Orders Audit & Status Overrides (`app/admin/orders/page.tsx`).
  - Payment Gateway Audit Logs (`app/admin/payments/page.tsx`).
  - Platform Logistics & Courier Dispatch (`app/admin/shipping/page.tsx`).
  - Executive Reports & Intelligence (`app/admin/reports/page.tsx`).
  - Global Marketplace Settings & Maintenance Mode (`app/admin/settings/page.tsx`).

---

## Local Development Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run production build validation
npm run build
```
