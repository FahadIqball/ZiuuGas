export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  orderId?: string;
  sellerId?: string;
  productId?: string;
  createdAt: any;
}
