# JSS Solutions Multi Vendor Marketplace - Next.js Enterprise Frontend

Enterprise-grade multi-vendor eCommerce frontend for JSS Solutions Marketplace. Built using **Next.js 16 (App Router)**, **TypeScript**, **React 19**, **TanStack Query (React Query v5)**, **Axios**, and **Tailwind CSS v4**.

---

## Backend API Integration & Architecture

This frontend is designed to consume the **Laravel 12 REST API Backend** running at `https://api.jsssolutions.in/api/v1`.

### Completed Master Roadmap (All 13 Modules Released):

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
  - Coupon, Flash Sale, Loyalty Rewards, and Referral Program API Services (`app/promotions`, `app/account/loyalty`, `app/account/referrals`).

- **Module 11 (Search, SEO & Personalization)**:
  - SEO Service (`services/seoService.ts`) for Schema.org JSON-LD structured data (Product, BreadcrumbList, Organization).
  - Personalization Service (`services/personalizationService.ts`) for personalized product recommendations and trending items.
  - Next.js App Router dynamic XML Sitemap (`app/sitemap.ts`) and Crawl Rules (`app/robots.ts`).
  - Instant Search Autocomplete (`components/SearchBar.tsx`) with search history and popular keyword chips.

- **Module 12 (Performance, Accessibility & Optimization)**:
  - Skip to Main Content Link (`components/SkipLink.tsx`) for WCAG 2.2 accessibility.
  - Global Error Boundary (`app/error.tsx`) and custom accessible 404 page (`app/not-found.tsx`).
  - Optimized React Query caching strategy (`gcTime: 15m`, `staleTime: 5m`, `retry: 1`, `refetchOnWindowFocus: false`).

- **Module 13 (Production Readiness & Enterprise Audit)**:
  - Centralized Telemetry & Analytics Abstraction (`services/telemetryService.ts`).
  - Environment Variable Config & Validation (`config/env.ts`).
  - Architectural & Deployment Guides (`docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`).

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
