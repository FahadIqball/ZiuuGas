import { CartItem } from './types';

export interface CartRepository {
  /**
   * Fetches all active items in the user's shopping cart.
   */
  getCartItems(userId: string): Promise<CartItem[]>;

  /**
   * Adds an item to the shopping cart or increments quantity if already exists.
   */
  addToCart(userId: string, item: CartItem): Promise<void>;

  /**
   * Removes an item from the shopping cart.
   */
  removeFromCart(userId: string, productId: string): Promise<void>;

  /**
   * Clears all items in the user's shopping cart.
   */
  clearCart(userId: string): Promise<void>;
}
