export type OrderStatus = 'order_placed' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  sellerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  orderCode: string;
  estimatedDeliveryMin: string;
  userEmail?: string;
  userPhoto?: string;
  sellerName?: string;
  sellerImage?: string;
  sellerRating?: string;
  createdAt: any;
  updatedAt: any;
}
