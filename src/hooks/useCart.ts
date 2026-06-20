import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '@/api/client';
import { CartItem, Product } from '@/types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await cartApi.getItems();
      if (response.data.success) {
        const items = response.data.data;
        setCartItems(items);
        
        const itemsCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        const priceTotal = items.reduce((sum: number, item: CartItem) => 
          sum + (item.product.productPrice * item.quantity), 0);
        
        setTotalItems(itemsCount);
        setTotalPrice(priceTotal);
      }
    } catch (error) {
      console.error('Load cart error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await cartApi.add({ productId, quantity });
      if (response.data.success) {
        await loadCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add to cart error:', error);
      return false;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const response = await cartApi.updateQuantity(cartItemId, { quantity });
      if (response.data.success) {
        await loadCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update quantity error:', error);
      return false;
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const response = await cartApi.deleteItem(cartItemId);
      if (response.data.success) {
        await loadCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Remove item error:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartApi.clearCart();
      if (response.data.success) {
        await loadCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Clear cart error:', error);
      return false;
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cartItems,
    isLoading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: loadCart,
  };
};