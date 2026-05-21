import firestore from '@react-native-firebase/firestore';
import { ProductRepository } from './ProductRepository';
import { Product } from './types';

export class FirebaseProductRepository implements ProductRepository {
  private productsCollection = firestore().collection('products');

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const snapshot = await this.productsCollection
        .where('categoryId', '==', categoryId)
        .get();
        
      const products = snapshot.docs.map(doc => this.mapDocToProduct(doc));
      // Sort client-side or use orderBy (requires firestore indexes, let's sort client-side for safety)
      return products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (err) {
      console.error('getProductsByCategory Firestore error:', err);
      throw err;
    }
  }

  async getProductDetails(productId: string): Promise<Product | null> {
    try {
      const doc = await this.productsCollection.doc(productId).get();
      if (!doc.exists) {
        return null;
      }
      return this.mapDocToProduct(doc);
    } catch (err) {
      console.error('getProductDetails Firestore error:', err);
      throw err;
    }
  }

  async getSellerInventory(sellerId: string): Promise<Product[]> {
    try {
      const snapshot = await this.productsCollection
        .where('sellerId', '==', sellerId)
        .get();
      
      const products = snapshot.docs.map(doc => this.mapDocToProduct(doc));
      return products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (err) {
      console.error('getSellerInventory Firestore error:', err);
      throw err;
    }
  }

  async createProduct(sellerId: string, data: Omit<Product, 'id' | 'sellerId'>): Promise<Product> {
    try {
      const docRef = this.productsCollection.doc();
      const timestamp = firestore.FieldValue.serverTimestamp();
      const newProduct = {
        id: docRef.id,
        sellerId,
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await docRef.set(newProduct);
      return {
        ...newProduct,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    } catch (err) {
      console.error('createProduct Firestore error:', err);
      throw err;
    }
  }

  async updateProduct(productId: string, data: Partial<Product>): Promise<void> {
    try {
      await this.productsCollection.doc(productId).update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error('updateProduct Firestore error:', err);
      throw err;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.productsCollection.doc(productId).delete();
    } catch (err) {
      console.error('deleteProduct Firestore error:', err);
      throw err;
    }
  }

  private mapDocToProduct(doc: any): Product {
    const data = doc.data();
    return {
      id: doc.id,
      categoryId: data.categoryId || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      stock: Number(data.stock) || 0,
      price: Number(data.price) || 0,
      image: data.image || '',
      description: data.description || '',
      weight: data.weight || '',
      sellerId: data.sellerId || '',
      seller: data.seller || undefined,
      reviews: data.reviews || undefined,
      createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt || null,
      updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate() : data.updatedAt || null,
    };
  }
}
