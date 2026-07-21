'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('jss-cart');
    const savedWishlist = localStorage.getItem('jss-wishlist');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      cartService.mergeCart().catch(() => {});
      wishlistService.getWishlist().then((items) => {
        if (items && Array.isArray(items)) {
          const mappedWishlist: Product[] = items.map((p) => ({
            id: String(p.id),
            name: p.name,
            brand: p.brand?.name || 'Generic',
            seller: { id: '1', name: '', rating: 5, location: '', joinedDate: '', description: '' },
            category: p.category?.slug || 'general',
            subcategory: '',
            originalPrice: p.original_price,
            offerPrice: p.sale_price || p.original_price,
            discountPercent: 0,
            rating: p.rating || 5,
            reviewsCount: p.reviews_count || 0,
            stockStatus: 'in_stock',
            image: p.images?.[0] || '/placeholder-product.png',
            description: p.description || '',
            features: [],
            reviews: [],
            tags: [],
          }));
          setWishlist(mappedWishlist);
        }
      }).catch(() => {});
    }
  }, [mounted, isAuthenticated]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('jss-cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('jss-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity }];
    });

    if (!isNaN(Number(product.id))) {
      cartService.addItem({ product_id: Number(product.id), quantity }).catch(() => {});
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((p) => p.id === product.id);
      if (exists) {
        return prevWishlist.filter((p) => p.id !== product.id);
      }
      return [...prevWishlist, product];
    });

    if (isAuthenticated && !isNaN(Number(product.id))) {
      wishlistService.toggleWishlist(Number(product.id)).catch(() => {});
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearCart = () => {
    setCart([]);
    cartService.clearCart().catch(() => {});
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.offerPrice * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isInWishlist,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      <div className={mounted ? '' : 'invisible'}>{children}</div>
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
