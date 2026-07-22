# JSS Marketplace Frontend - Enterprise System Architecture

This document provides a comprehensive technical overview of the JSS Marketplace frontend architecture.

---

## 1. Core Stack & Framework

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **UI Library**: React 19
- **State & Data Fetching**: TanStack Query (React Query v5) + Axios
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **SEO & Structured Data**: Schema.org JSON-LD + Next.js Metadata API

---

## 2. Layered Architecture Design

```
┌─────────────────────────────────────────────────────────┐
│                      UI Layer                           │
│        App Router Pages & Reusable Components           │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Hooks Layer                          │
│          Custom TanStack Query React Hooks              │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                   Services Layer                        │
│         API Services (Axios HTTP Interceptors)          │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                 Laravel REST API                        │
│               https://api.jsssolutions.in/api/v1        │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Completed Architecture Modules

1. **Module 1 (Core Infrastructure)**: Centralized Axios HTTP client with Bearer auth & guest session header injection.
2. **Module 2 (Catalog Foundation)**: Multilingual category mega menu and brand catalog navigation.
3. **Module 3 (Product Engine)**: Product details, gallery image zoom, related products, search filters.
4. **Module 4 (Cart & Wishlist)**: Persistent shopping cart and customer wishlist.
5. **Module 5 (Checkout & Orders)**: Multi-step checkout, saved addresses, order tracking history.
6. **Module 6 (Payments & Shipping)**: Digital payments (Razorpay), COD authorization, AWB tracking.
7. **Module 7 (Customer Account)**: Profile management, security, reviews, notifications, returns & support tickets.
8. **Module 8 (Vendor Portal)**: Merchant store dashboard, inventory controls, vendor orders, wallet settlements.
9. **Module 9 (Admin Dashboard)**: Marketplace super admin command center, catalog moderation, vendor approvals.
10. **Module 10 (Marketing & Promotions)**: Promo coupons, flash sale event countdowns, loyalty points, refer & earn.
11. **Module 11 (Search, SEO & Personalization)**: Instant search autocomplete, Schema.org JSON-LD, sitemaps, personalized recommendations.
12. **Module 12 (Performance & Accessibility)**: WCAG 2.2 SkipLink, ARIA landmarks, global error boundaries, React Query caching.
13. **Module 13 (Production Readiness)**: Telemetry logging, environment validation, deployment guides.
