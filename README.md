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
  - Dynamic Mega Menu (`components/MegaMenu.tsx`) with multilingual name resolution (`en`, `hi`, `mr`).

- **Module 3 (Product Engine & Search Experience)**:
  - Product API Service (`services/productService.ts`).
  - Search API Service (`services/searchService.ts`).
  - Product Details Page route (`app/product/[slug]/page.tsx`).
  - Advanced Search Results Page route (`app/search/page.tsx`).

- **Module 4 (Shopping Cart & Wishlist)**:
  - Cart API Service (`services/cartService.ts`).
  - Wishlist API Service (`services/wishlistService.ts`).
  - Dedicated Cart Page route (`app/cart/page.tsx`).
  - Dedicated Wishlist Page route (`app/wishlist/page.tsx`).

- **Module 5 (Customer Checkout & Orders)**:
  - Saved Address API Service (`services/addressService.ts`).
  - Checkout API Service (`services/checkoutService.ts`).
  - Orders API Service (`services/orderService.ts`).
  - Multi-step Checkout page (`app/checkout/page.tsx`).
  - Customer Orders History page (`app/orders/page.tsx`).

- **Module 6 (Payments & Shipping)**:
  - Payment API Service (`services/paymentService.ts`).
  - Razorpay SDK Client Service (`services/razorpayService.ts`).
  - Shipping API Service (`services/shippingService.ts`).
  - TanStack Query hooks (`usePaymentMethodsQuery`, `useCreatePaymentOrderMutation`, `useVerifyPaymentMutation`, `useShippingMethodsQuery`, `useCalculateShippingCostMutation`, `useShipmentTrackingQuery`).
  - Modular Payment Selector (`components/PaymentSelector.tsx`).
  - Shipping Delivery Option Selector (`components/ShippingMethodSelector.tsx`).
  - Courier Shipment Tracking Card (`components/ShipmentTrackingCard.tsx`).
  - Real-time Payment Status Modal (`components/PaymentStatusModal.tsx`).

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
