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
  - System Administrator Dashboard, Customer Directory, Vendor Control, Catalog Moderation, Platform Orders, Payment Audit, Logistics, Executive Reports, and Global Settings (`app/admin/*`).

- **Module 10 (Marketing & Promotions)**:
  - Coupon API Service (`services/couponService.ts`).
  - Promotion & Campaign API Service (`services/promotionService.ts`).
  - Loyalty Points API Service (`services/loyaltyService.ts`).
  - Referral Program API Service (`services/referralService.ts`).
  - TanStack Query hooks (`useCouponsQuery`, `useApplyCouponMutation`, `useRemoveCouponMutation`, `useFlashSalesQuery`, `useLoyaltyQuery`, `useRedeemPointsMutation`, `useReferralQuery`, `usePromotionalBannersQuery`, `useCampaignsQuery`).
  - Interactive Coupon Applying Widget (`components/CouponSelector.tsx`).
  - Live Flash Sale Countdown Banner (`components/FlashSaleBanner.tsx`).
  - Promotional Deals & Campaign Landing Page (`app/promotions/page.tsx`).
  - Customer Loyalty Points Rewards Dashboard (`app/account/loyalty/page.tsx`).
  - Customer Refer & Earn Program Dashboard (`app/account/referrals/page.tsx`).

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
