import firestore from '@react-native-firebase/firestore';
import { OrderRepository } from './OrderRepository';
import { Order, OrderStatus } from './types';
import { notificationRepository } from '../../../services/notificationService';

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
      const orderRef = this.ordersCollection.doc(orderId);
      const doc = await orderRef.get();
      if (!doc.exists) {
        throw new Error('Order does not exist.');
      }

      const oldData = doc.data();
      if (oldData?.status === status) {
        return; // Skip if no state change to prevent double triggering
      }

      await orderRef.update({
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      const buyerId = oldData?.userId;
      const sellerId = oldData?.sellerId;
      const riderId = oldData?.riderId;
      const orderCode = oldData?.orderCode || '';
      const sellerName = oldData?.sellerName || 'Gas Store';
      const sellerImage = oldData?.sellerImage || null;
      const buyerImage = oldData?.userPhoto || null;
      const buyerName = oldData?.userName || 'Customer';

      if (status === 'cancelled') {
        // Notify buyer
        if (buyerId) {
          try {
            const notifTitle = 'Order Cancelled';
            const notifMsg = `Your order from ${sellerName} has been cancelled`;
            const orderNo = ` #${orderCode}`;

            await notificationRepository.createNotification({
              recipientId: buyerId,
              title: notifTitle,
              message: notifMsg,
              orderNo,
              type: 'cancelled',
              orderId,
              image: sellerImage,
            });

            await notificationRepository.sendPushNotification(
              buyerId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId, type: 'cancelled' }
            );
          } catch (notifErr) {
            console.error('Failed to notify buyer of cancellation:', notifErr);
          }
        }

        // Notify seller
        if (sellerId) {
          try {
            const notifTitle = 'Order Cancelled';
            const notifMsg = `Order from ${buyerName} has been cancelled`;
            const orderNo = ` #${orderCode}`;

            await notificationRepository.createNotification({
              recipientId: sellerId,
              title: notifTitle,
              message: notifMsg,
              orderNo,
              type: 'cancelled',
              orderId,
              image: buyerImage,
            });

            await notificationRepository.sendPushNotification(
              sellerId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId, type: 'cancelled' }
            );
          } catch (notifErr) {
            console.error('Failed to notify seller of cancellation:', notifErr);
          }
        }

        // Notify rider
        if (riderId) {
          try {
            const notifTitle = 'Order Cancelled';
            const notifMsg = `Assigned order from ${sellerName} has been cancelled`;
            const orderNo = ` #${orderCode}`;

            await notificationRepository.createNotification({
              recipientId: riderId,
              title: notifTitle,
              message: notifMsg,
              orderNo,
              type: 'cancelled',
              orderId,
              image: sellerImage,
            });

            await notificationRepository.sendPushNotification(
              riderId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId, type: 'cancelled' }
            );
          } catch (notifErr) {
            console.error('Failed to notify rider of cancellation:', notifErr);
          }
        }
      } else if (status === 'delivered') {
        // Notify buyer
        if (buyerId) {
          try {
            const notifTitle = 'Order Delivered';
            const notifMsg = `Your order from ${sellerName} has been delivered successfully`;
            const orderNo = ` #${orderCode}`;

            await notificationRepository.createNotification({
              recipientId: buyerId,
              title: notifTitle,
              message: notifMsg,
              orderNo,
              type: 'delivered',
              orderId,
              image: sellerImage,
            });

            await notificationRepository.sendPushNotification(
              buyerId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId, type: 'delivered' }
            );
          } catch (notifErr) {
            console.error('Failed to notify buyer of delivery:', notifErr);
          }
        }

        // Notify seller
        if (sellerId) {
          try {
            const notifTitle = 'Order Delivered';
            const notifMsg = `Order delivered to ${buyerName}`;
            const orderNo = ` #${orderCode}`;

            await notificationRepository.createNotification({
              recipientId: sellerId,
              title: notifTitle,
              message: notifMsg,
              orderNo,
              type: 'delivered',
              orderId,
              image: buyerImage,
            });

            await notificationRepository.sendPushNotification(
              sellerId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId, type: 'delivered' }
            );
          } catch (notifErr) {
            console.error('Failed to notify seller of delivery:', notifErr);
          }
        }
      }
    } catch (err) {
      console.error('FirebaseOrderRepository.updateOrderStatus failed:', err);
      throw err;
    }
  }

  subscribeToOrdersByUser(userId: string, onUpdate: (orders: Order[]) => void): () => void {
    return this.ordersCollection
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        if (!snapshot) return;
        const orders = snapshot.docs.map(doc => this.mapDoc(doc));
        orders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        onUpdate(orders);
      }, (err) => {
        console.error('subscribeToOrdersByUser error:', err);
      });
  }

  subscribeToOrdersBySeller(sellerId: string, onUpdate: (orders: Order[]) => void): () => void {
    return this.ordersCollection
      .where('sellerId', '==', sellerId)
      .onSnapshot((snapshot) => {
        if (!snapshot) return;
        const orders = snapshot.docs.map(doc => this.mapDoc(doc));
        orders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        onUpdate(orders);
      }, (err) => {
        console.error('subscribeToOrdersBySeller error:', err);
      });
  }
}
