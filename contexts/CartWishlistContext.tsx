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
  resetSessionState: () => void;
  cartTotal: number;
  cartItemCount: number;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const getCartKey = (u?: typeof user) => (u?.id ? `jss-cart-user-${u.id}` : 'jss-cart-guest');
  const getWishlistKey = (u?: typeof user) => (u?.id ? `jss-wishlist-user-${u.id}` : 'jss-wishlist-guest');

  const resetSessionState = React.useCallback(() => {
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('jss-cart');
    localStorage.removeItem('jss-cart-guest');
    localStorage.removeItem('jss-wishlist');
    localStorage.removeItem('jss-wishlist-guest');
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      resetSessionState();
    };

    window.addEventListener('jss-logout', handleLogout);
    return () => {
      window.removeEventListener('jss-logout', handleLogout);
    };
  }, [resetSessionState]);

  // Initial mount load
  useEffect(() => {
    const guestCart = localStorage.getItem('jss-cart-guest') || localStorage.getItem('jss-cart');
    const guestWishlist = localStorage.getItem('jss-wishlist-guest') || localStorage.getItem('jss-wishlist');

    if (guestCart) {
      try {
        setCart(JSON.parse(guestCart));
      } catch (e) {}
    }

    if (guestWishlist) {
      try {
        setWishlist(JSON.parse(guestWishlist));
      } catch (e) {}
    }

    setMounted(true);
  }, []);

  // Cart Restoration & Merging on Auth Change
  useEffect(() => {
    if (!mounted) return;

    const cartKey = getCartKey(user);
    const wishlistKey = getWishlistKey(user);

    if (isAuthenticated && user?.id) {
      const guestCartRaw = localStorage.getItem('jss-cart-guest') || localStorage.getItem('jss-cart');
      const userCartRaw = localStorage.getItem(cartKey);

      let guestCart: CartItem[] = [];
      let userCart: CartItem[] = [];

      if (guestCartRaw) {
        try { guestCart = JSON.parse(guestCartRaw); } catch (e) {}
      }
      if (userCartRaw) {
        try { userCart = JSON.parse(userCartRaw); } catch (e) {}
      }

      const mergedMap = new Map<string, CartItem>();
      userCart.forEach((item) => mergedMap.set(item.product.id, { ...item }));
      guestCart.forEach((item) => {
        if (mergedMap.has(item.product.id)) {
          const existing = mergedMap.get(item.product.id)!;
          mergedMap.set(item.product.id, { ...existing, quantity: existing.quantity + item.quantity });
        } else {
          mergedMap.set(item.product.id, { ...item });
        }
      });

      const finalCart = Array.from(mergedMap.values());
      setCart(finalCart);
      localStorage.setItem(cartKey, JSON.stringify(finalCart));
      localStorage.removeItem('jss-cart-guest');
      localStorage.removeItem('jss-cart');

      cartService.mergeCart().catch(() => {});
      wishlistService.getWishlist().then((items) => {
        if (items && Array.isArray(items)) {
          const mappedWishlist: Product[] = items.map((p) => {
            const origPrice = p.originalPrice ?? p.original_price ?? 0;
            const offerPrice = p.offerPrice ?? p.sale_price ?? origPrice;
            return {
              id: String(p.id),
              name: p.name,
              brand: p.brand?.name || 'Generic',
              seller: { id: '1', name: '', rating: 5, location: '', joinedDate: '', description: '' },
              category: typeof p.category?.name === 'string' ? p.category.name : (p.category?.slug || 'general'),
              subcategory: '',
              originalPrice: origPrice,
              offerPrice: offerPrice,
              discountPercent: p.discountPercent ?? 0,
              rating: p.rating || 5,
              reviewsCount: p.reviewsCount || p.reviews_count || 0,
              stockStatus: 'in_stock',
              image: p.image || p.images?.[0] || '/placeholder-product.png',
              description: p.description || '',
              features: [],
              reviews: [],
              tags: [],
            };
          });
          setWishlist(mappedWishlist);
          localStorage.setItem(wishlistKey, JSON.stringify(mappedWishlist));
        }
      }).catch(() => {});
    } else if (!user) {
      const guestCartRaw = localStorage.getItem('jss-cart-guest') || localStorage.getItem('jss-cart');
      if (guestCartRaw) {
        try { setCart(JSON.parse(guestCartRaw)); } catch (e) {}
      } else {
        setCart([]);
      }
    }
  }, [mounted, user?.id, isAuthenticated]);

  useEffect(() => {
    if (mounted) {
      const key = getCartKey(user);
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }, [cart, mounted, user?.id]);

  useEffect(() => {
    if (mounted) {
      const key = getWishlistKey(user);
      localStorage.setItem(key, JSON.stringify(wishlist));
    }
  }, [wishlist, mounted, user?.id]);

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
        resetSessionState,
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
