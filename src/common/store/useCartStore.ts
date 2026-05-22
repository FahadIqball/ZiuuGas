import { create } from 'zustand';
import { cartRepository } from '../../services/cartService';
import { CartItem } from '../../features/cart/services/types';

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCartItems: (userId: string) => Promise<void>;
  addToCart: (userId: string, item: any) => Promise<void>;
  removeFromCart: (userId: string, id: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isLoading: false,
  error: null,

  fetchCartItems: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const items = await cartRepository.getCartItems(userId);
      set({ cartItems: items, isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch cart items:', err);
      set({ error: err?.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addToCart: async (userId: string, item: any) => {
    set({ isLoading: true, error: null });
    try {
      await cartRepository.addToCart(userId, item);
      // Refresh items to keep local state in sync
      const items = await cartRepository.getCartItems(userId);
      set({ cartItems: items, isLoading: false });
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
      set({ error: err?.message || 'Failed to add item', isLoading: false });
      throw err;
    }
  },

  removeFromCart: async (userId: string, id: string) => {
    try {
      await cartRepository.removeFromCart(userId, id);
      set({
        cartItems: get().cartItems.filter(item => item.id !== id),
      });
    } catch (err: any) {
      console.error('Failed to remove item from cart:', err);
      set({ error: err?.message || 'Failed to remove item' });
      throw err;
    }
  },

  clearCart: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await cartRepository.clearCart(userId);
      set({ cartItems: [], isLoading: false });
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      set({ error: err?.message || 'Failed to clear cart', isLoading: false });
      throw err;
    }
  },
}));
