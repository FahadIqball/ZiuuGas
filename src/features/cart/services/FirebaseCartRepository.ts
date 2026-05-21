import firestore from '@react-native-firebase/firestore';
import { CartRepository } from './CartRepository';
import { CartItem } from './types';

export class FirebaseCartRepository implements CartRepository {
  private getCollection(userId: string) {
    return firestore()
      .collection('users')
      .doc(userId)
      .collection('cart');
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const snapshot = await this.getCollection(userId).get();
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          price: Number(data.price) || 0,
          image: data.image || '',
          quantity: Number(data.quantity) || 1,
          rating: data.rating !== undefined ? Number(data.rating) : undefined,
          sellerId: data.sellerId || '',
        };
      });
    } catch (err) {
      console.error('FirebaseCartRepository.getCartItems failed:', err);
      throw err;
    }
  }

  async addToCart(userId: string, item: CartItem): Promise<void> {
    try {
      const docRef = this.getCollection(userId).doc(item.id);
      // Atomically create or update: if doc doesn't exist, set() creates it;
      // if it does, merge only updates the quantity field atomically.
      await docRef.set(
        {
          ...item,
          quantity: firestore.FieldValue.increment(item.quantity),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('FirebaseCartRepository.addToCart failed:', err);
      throw err;
    }
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    try {
      await this.getCollection(userId).doc(productId).delete();
    } catch (err) {
      console.error('FirebaseCartRepository.removeFromCart failed:', err);
      throw err;
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const snapshot = await this.getCollection(userId).get();
      const batch = firestore().batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (err) {
      console.error('FirebaseCartRepository.clearCart failed:', err);
      throw err;
    }
  }
}
