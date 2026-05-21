import { Review } from './types';

export interface ReviewRepository {
  addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string>;
  getReviewsBySeller(sellerId: string): Promise<Review[]>;
  getReviewsByProduct(productId: string): Promise<Review[]>;
}
