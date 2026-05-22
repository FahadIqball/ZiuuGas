import firestore from '@react-native-firebase/firestore';
import { OrderRepository } from './OrderRepository';
import { Order, OrderStatus } from './types';

export class FirebaseOrderRepository implements OrderRepository {
  private ordersCollection = firestore().collection('orders');

  async placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = this.ordersCollection.doc();
      const timestamp = firestore.FieldValue.serverTimestamp();
      
      const newOrder = {
        ...order,
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      await docRef.set(newOrder);
      return docRef.id;
    } catch (err) {
      console.error('FirebaseOrderRepository.placeOrder failed:', err);
      throw err;
    }
  }

  private mapDoc(doc: any): Order {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId || '',
      userName: data.userName || '',
      userAddress: data.userAddress || '',
      sellerId: data.sellerId || '',
      items: data.items || [],
      totalPrice: Number(data.totalPrice) || 0,
      status: data.status || 'order_placed',
      orderCode: data.orderCode || '',
      estimatedDeliveryMin: data.estimatedDeliveryMin || '20',
      userEmail: data.userEmail || '',
      userPhoto: data.userPhoto || '',
      sellerName: data.sellerName || '',
      sellerImage: data.sellerImage || '',
      sellerRating: data.sellerRating || '4.5',
      riderId: data.riderId || '',
      payout: Number(data.payout) || 0,
      createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt || null,
      updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate() : data.updatedAt || null,
    };
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const snapshot = await this.ordersCollection.where('userId', '==', userId).get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => this.mapDoc(doc));
    } catch (err) {
      console.error('FirebaseOrderRepository.getOrdersByUser failed:', err);
      throw err;
    }
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    try {
      const snapshot = await this.ordersCollection
        .where('sellerId', '==', sellerId)
        .get();
      return snapshot.docs.map(doc => this.mapDoc(doc));
    } catch (err) {
      console.error('FirebaseOrderRepository.getOrdersBySeller failed:', err);
      throw err;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      await this.ordersCollection.doc(orderId).update({
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error('FirebaseOrderRepository.updateOrderStatus failed:', err);
      throw err;
    }
  }
}
