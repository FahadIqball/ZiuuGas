import { Product } from './types';

export interface ProductRepository {
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getProductDetails(productId: string): Promise<Product | null>;
  getSellerInventory(sellerId: string): Promise<Product[]>;
  createProduct(sellerId: string, data: Omit<Product, 'id' | 'sellerId'>): Promise<Product>;
  updateProduct(productId: string, data: Partial<Product>): Promise<void>;
  deleteProduct(productId: string): Promise<void>;
}
