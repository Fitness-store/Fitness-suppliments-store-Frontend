import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContextObject';
import { useAuth } from './useAuth';
import { addCartItem, fetchCart, updateCartItemQuantity, removeCartItem } from '../services/api';

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
  const { isAuthenticated, currentUser } = useAuth();
  const [guestCartItems, setGuestCartItems] = useState(() => readGuestCart());
  const [authCartItems, setAuthCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

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

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const loadAuthCart = async () => {
      if (!isAuthenticated) {
        setAuthCartItems([]);
        return;
      }
      setCartLoading(true);
      try {
        const response = await fetchCart();
        if (response?.success && response?.cart?.items) {
          setAuthCartItems(response.cart.items.map(item => ({
            productId: item.productId,
            name: item.productName,
            brand: item.brand,
            imageUrl: item.imageUrl,
            finalPrice: item.finalPrice,
            mrp: item.mrp,
            quantity: item.quantity,
            cartItemId: item.cartItemId,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setCartLoading(false);
      }
    };
    loadAuthCart();
  }, [isAuthenticated]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!product?.productId) {
      return { added: false, message: 'Invalid product.' };
    }

    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    if (isAuthenticated) {
      try {
        setCartLoading(true);
        const response = await addCartItem({
          productId: product.productId,
          quantity: qtyToAdd,
        });
        if (response?.success) {
          // Refresh cart after adding
          const cartResponse = await fetchCart();
          if (cartResponse?.success && cartResponse?.cart?.items) {
            setAuthCartItems(cartResponse.cart.items.map(item => ({
              productId: item.productId,
              name: item.productName,
              brand: item.brand,
              imageUrl: item.imageUrl,
              finalPrice: item.finalPrice,
              mrp: item.mrp,
              quantity: item.quantity,
              cartItemId: item.cartItemId,
            })));
          }
          return { added: true, message: 'Added to cart.' };
        }
      } catch (error) {
        return { added: false, message: error.message || 'Failed to add to cart.' };
      } finally {
        setCartLoading(false);
      }
      return { added: false, message: 'Failed to add to cart.' };
    }

    // Guest cart logic
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

  const incrementQuantity = useCallback(async (productId) => {
    if (isAuthenticated) {
      const item = authCartItems.find(item => item.productId === productId);
      if (!item?.cartItemId) return;
      try {
        setCartLoading(true);
        await updateCartItemQuantity(item.cartItemId, { quantity: item.quantity + 1 });
        const response = await fetchCart();
        if (response?.success && response?.cart?.items) {
          setAuthCartItems(response.cart.items.map(item => ({
            productId: item.productId,
            name: item.productName,
            brand: item.brand,
            imageUrl: item.imageUrl,
            finalPrice: item.finalPrice,
            mrp: item.mrp,
            quantity: item.quantity,
            cartItemId: item.cartItemId,
          })));
        }
      } catch (error) {
        console.error('Failed to increment quantity:', error);
      } finally {
        setCartLoading(false);
      }
      return;
    }
    // Guest cart
    setGuestCartItems((prev) => prev.map((item) => (
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )));
  }, [isAuthenticated, authCartItems]);

  const decrementQuantity = useCallback(async (productId) => {
    if (isAuthenticated) {
      const item = authCartItems.find(item => item.productId === productId);
      if (!item?.cartItemId || item.quantity <= 1) return;
      try {
        setCartLoading(true);
        await updateCartItemQuantity(item.cartItemId, { quantity: item.quantity - 1 });
        const response = await fetchCart();
        if (response?.success && response?.cart?.items) {
          setAuthCartItems(response.cart.items.map(item => ({
            productId: item.productId,
            name: item.productName,
            brand: item.brand,
            imageUrl: item.imageUrl,
            finalPrice: item.finalPrice,
            mrp: item.mrp,
            quantity: item.quantity,
            cartItemId: item.cartItemId,
          })));
        }
      } catch (error) {
        console.error('Failed to decrement quantity:', error);
      } finally {
        setCartLoading(false);
      }
      return;
    }
    // Guest cart
    setGuestCartItems((prev) => prev.map((item) => (
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    )));
  }, [isAuthenticated, authCartItems]);

  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated) {
      const item = authCartItems.find(item => item.productId === productId);
      if (!item?.cartItemId) return;
      try {
        setCartLoading(true);
        await removeCartItem(item.cartItemId);
        const response = await fetchCart();
        if (response?.success && response?.cart?.items) {
          setAuthCartItems(response.cart.items.map(item => ({
            productId: item.productId,
            name: item.productName,
            brand: item.brand,
            imageUrl: item.imageUrl,
            finalPrice: item.finalPrice,
            mrp: item.mrp,
            quantity: item.quantity,
            cartItemId: item.cartItemId,
          })));
        } else {
          setAuthCartItems([]);
        }
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        setCartLoading(false);
      }
      return;
    }
    // Guest cart
    setGuestCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, [isAuthenticated, authCartItems]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setCartLoading(true);
        // Remove all items one by one
        await Promise.all(authCartItems.map(item => 
          item.cartItemId ? removeCartItem(item.cartItemId) : Promise.resolve()
        ));
        setAuthCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      } finally {
        setCartLoading(false);
      }
      return;
    }
    // Guest cart
    setGuestCartItems([]);
  }, [isAuthenticated, authCartItems]);

  const cartItems = useMemo(() => (
    isAuthenticated ? authCartItems : guestCartItems
  ), [guestCartItems, authCartItems, isAuthenticated]);

  const cartCount = useMemo(() => {
    const items = isAuthenticated ? authCartItems : guestCartItems;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [guestCartItems, authCartItems, isAuthenticated]);

  const value = useMemo(() => ({
    cartItems,
    cartCount,
    cartLoading,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  }), [cartItems, cartCount, cartLoading, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
