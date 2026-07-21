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
  - Strongly-typed DTOs (`types/api.ts`).

- **Module 2 (Catalog Foundation & Multi-lingual Category Navigation)**:
  - Hierarchical Category API Service (`services/categoryService.ts`).
  - Brand API Service (`services/brandService.ts`).
  - Attribute API Service (`services/attributeService.ts`).
  - TanStack Query hooks (`useCategories`, `useCategoryBySlug`, `useBrands`, `useBrandBySlug`, `useAttributes`).
  - Dynamic Mega Menu (`components/MegaMenu.tsx`) with multilingual name resolution (`en`, `hi`, `mr`).
  - Accessible Breadcrumbs (`components/Breadcrumbs.tsx`).
  - Brand landing page (`app/brand/[slug]/page.tsx`).
  - Category catalog page (`app/category/[id]/page.tsx`).

- **Module 3 (Product Engine & Search Experience)**:
  - Product API Service (`services/productService.ts`).
  - Search API Service (`services/searchService.ts`).
  - Recommendation API Service (`services/recommendationService.ts`).
  - TanStack Query hooks (`useProducts`, `useProductBySlug`, `useFeaturedProducts`, `useTrendingProducts`, `useRelatedProducts`, `useSearch`, `useAutocompleteSuggestions`, `useTrendingRecommendations`, `usePersonalizedRecommendations`).
  - Recently viewed local storage hook (`hooks/useRecentlyViewed.ts`).
  - Product Gallery component (`components/ProductGallery.tsx`).
  - Product Details Info panel (`components/ProductDetailsInfo.tsx`).
  - Grid & List view skeletons (`components/ProductGridSkeleton.tsx`).
  - Recently Viewed Products section (`components/RecentlyViewedSection.tsx`).
  - Product Details Page route (`app/product/[slug]/page.tsx`).
  - Advanced Search Results Page route (`app/search/page.tsx`).

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
