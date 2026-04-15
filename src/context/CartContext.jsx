import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContextObject';
import { useAuth } from './useAuth';

const GUEST_CART_STORAGE_KEY = 'fitness_store_guest_cart_v1';

const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [guestCartItems, setGuestCartItems] = useState(() => readGuestCart());

  useEffect(() => {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(guestCartItems));
  }, [guestCartItems]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === GUEST_CART_STORAGE_KEY) {
        setGuestCartItems(readGuestCart());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product?.productId) {
      return { added: false, message: 'Invalid product.' };
    }

    if (isAuthenticated) {
      return { added: false, message: 'Cart for logged-in users is currently empty by design.' };
    }

    const qtyToAdd = Math.max(1, Number(quantity) || 1);
    setGuestCartItems((prev) => {
      const index = prev.findIndex((item) => item.productId === product.productId);
      if (index === -1) {
        return [
          ...prev,
          {
            productId: product.productId,
            name: product.name,
            brand: product.brand,
            imageUrl: product.imageUrl,
            finalPrice: product.finalPrice,
            mrp: product.mrp,
            stock: product.stock,
            quantity: qtyToAdd,
          },
        ];
      }
      const updated = [...prev];
      const current = updated[index];
      updated[index] = {
        ...current,
        quantity: current.quantity + qtyToAdd,
      };
      return updated;
    });

    return { added: true, message: 'Added to cart.' };
  }, [isAuthenticated]);

  const incrementQuantity = useCallback((productId) => {
    setGuestCartItems((prev) => prev.map((item) => (
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )));
  }, []);

  const decrementQuantity = useCallback((productId) => {
    setGuestCartItems((prev) => prev.map((item) => (
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    )));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setGuestCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setGuestCartItems([]);
  }, []);

  const cartItems = useMemo(() => (
    isAuthenticated ? [] : guestCartItems
  ), [guestCartItems, isAuthenticated]);

  const cartCount = useMemo(() => (
    isAuthenticated ? 0 : guestCartItems.reduce((total, item) => total + item.quantity, 0)
  ), [guestCartItems, isAuthenticated]);

  const value = useMemo(() => ({
    cartItems,
    cartCount,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  }), [cartItems, cartCount, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
