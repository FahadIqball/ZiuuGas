import { Order, OrderStatus } from './types';

export interface OrderRepository {
  /**
   * Places a new order and returns the generated order ID.
   */
  placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;

  /**
   * Retrieves all orders placed by a buyer (filtered by userId).
   */
  getOrdersByUser(userId: string): Promise<Order[]>;

  /**
   * Retrieves all orders assigned to a seller (filtered by sellerId).
   */
  getOrdersBySeller(sellerId: string): Promise<Order[]>;

  /**
   * Updates status of an order.
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;

  subscribeToOrdersByUser(userId: string, onUpdate: (orders: Order[]) => void): () => void;
  subscribeToOrdersBySeller(sellerId: string, onUpdate: (orders: Order[]) => void): () => void;
}
