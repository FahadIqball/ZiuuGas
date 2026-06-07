import firestore from '@react-native-firebase/firestore';
import { DeliveryRepository } from './DeliveryRepository';
import { DeliveryJob } from '../types';
import { notificationRepository } from '../../../services/notificationService';

export class FirebaseDeliveryRepository implements DeliveryRepository {
  private ordersCollection = firestore().collection('orders');
  private usersCollection = firestore().collection('users');

  async getAvailableJobs(areaInKm: number, location: string, storeId?: string | null): Promise<DeliveryJob[]> {
    try {
      if (!storeId || storeId === 'null' || storeId === 'undefined') {
        return [];
      }
      // Fetch orders that have been placed but not yet assigned to any delivery partner
      const snapshot = await this.ordersCollection
        .where('status', '==', 'order_placed')
        .where('sellerId', '==', storeId)
        .get();

      const jobs: DeliveryJob[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        // Skip if already assigned
        if (data.riderId && data.riderId !== 'null' && data.riderId !== 'undefined') return;

        const items = data.items || [];
        const itemsSummary = items.map((item: any) => `${item.title} x ${item.quantity}`).join(', ');
        
        // Payout can be 15% of order price with a minimum of $5
        const price = Number(data.totalPrice) || 20;
        const calculatedPayout = Math.max(5, Math.round(price * 0.15 * 100) / 100);

        jobs.push({
          id: doc.id,
          orderId: doc.id,
          storeName: data.sellerName || 'Gas Store',
          storeAddress: 'Seller Depot', // placeholder since seller profile has address
          customerName: data.userName || 'Customer',
          customerAddress: data.userAddress || 'Customer Address',
          itemsSummary: itemsSummary || 'Gas Cylinder Refill',
          payout: calculatedPayout,
          status: 'pending',
          distance: '1.2 km', // Mock distance for display
        });
      });

      return jobs;
    } catch (err) {
      console.error('FirebaseDeliveryRepository.getAvailableJobs failed:', err);
      throw err;
    }
  }

  async acceptJob(jobId: string, riderId: string): Promise<void> {
    try {
      const orderRef = this.ordersCollection.doc(jobId);
      const doc = await orderRef.get();
      if (!doc.exists) {
        throw new Error('Order does not exist.');
      }
      
      const orderData = doc.data();
      const buyerId = orderData?.userId;
      const orderCode = orderData?.orderCode || '';
      const sellerName = orderData?.sellerName || 'Gas Store';
      const sellerImage = orderData?.sellerImage || null;

      const price = Number(orderData?.totalPrice) || 20;
      const calculatedPayout = Math.max(5, Math.round(price * 0.15 * 100) / 100);

      await orderRef.update({
        riderId: riderId,
        payout: calculatedPayout,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      if (buyerId) {
        try {
          const notifTitle = 'Rider Assigned';
          const notifMsg = `A delivery rider has accepted your order from ${sellerName}`;
          const orderNo = ` #${orderCode}`;

          await notificationRepository.createNotification({
            recipientId: buyerId,
            title: notifTitle,
            message: notifMsg,
            orderNo,
            type: 'rider_assigned',
            orderId: jobId,
            image: sellerImage,
          });

          await notificationRepository.sendPushNotification(
            buyerId,
            notifTitle,
            `${notifMsg}${orderNo}`,
            { orderId: jobId, type: 'rider_assigned' }
          );
        } catch (notifErr) {
          console.error('Failed to send notification for rider assignment:', notifErr);
        }
      }
    } catch (err) {
      console.error('FirebaseDeliveryRepository.acceptJob failed:', err);
      throw err;
    }
  }

  async pickupOrder(orderId: string): Promise<void> {
    try {
      const orderRef = this.ordersCollection.doc(orderId);
      const doc = await orderRef.get();
      if (!doc.exists) {
        throw new Error('Order does not exist.');
      }

      await orderRef.update({
        status: 'dispatched',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      const orderData = doc.data();
      const buyerId = orderData?.userId;
      const orderCode = orderData?.orderCode || '';
      const sellerName = orderData?.sellerName || 'Gas Store';
      const sellerImage = orderData?.sellerImage || null;

      if (buyerId) {
        try {
          const notifTitle = 'Order Dispatched';
          const notifMsg = `Your order from ${sellerName} has been picked up and is on its way`;
          const orderNo = ` #${orderCode}`;

          await notificationRepository.createNotification({
            recipientId: buyerId,
            title: notifTitle,
            message: notifMsg,
            orderNo,
            type: 'dispatched',
            orderId: orderId,
            image: sellerImage,
          });

          await notificationRepository.sendPushNotification(
            buyerId,
            notifTitle,
            `${notifMsg}${orderNo}`,
            { orderId: orderId, type: 'dispatched' }
          );
        } catch (notifErr) {
          console.error('Failed to send notification for order dispatch:', notifErr);
        }
      }
    } catch (err) {
      console.error('FirebaseDeliveryRepository.pickupOrder failed:', err);
      throw err;
    }
  }

  async updateRiderLocation(riderId: string, lat: number, lng: number): Promise<void> {
    try {
      await this.usersCollection.doc(riderId).update({
        latitude: lat,
        longitude: lng,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('FirebaseDeliveryRepository.updateRiderLocation failed:', err);
      throw err;
    }
  }

  async verifyDeliveryOTP(orderId: string, otp: string): Promise<boolean> {
    try {
      const orderRef = this.ordersCollection.doc(orderId);
      const doc = await orderRef.get();
      if (!doc.exists) {
        return false;
      }
      const data = doc.data();
      if (data?.orderCode === otp) {
        await orderRef.update({
          status: 'delivered',
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        const buyerId = data?.userId;
        const sellerId = data?.sellerId;
        const orderCode = data?.orderCode || '';
        const sellerName = data?.sellerName || 'Gas Store';
        const sellerImage = data?.sellerImage || null;
        const buyerImage = data?.userPhoto || null;
        const buyerName = data?.userName || 'Customer';

        // Notify Buyer
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
              orderId: orderId,
              image: sellerImage,
            });

            await notificationRepository.sendPushNotification(
              buyerId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId: orderId, type: 'delivered' }
            );
          } catch (notifErr) {
            console.error('Failed to send buyer delivery notification:', notifErr);
          }
        }

        // Notify Seller
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
              orderId: orderId,
              image: buyerImage,
            });

            await notificationRepository.sendPushNotification(
              sellerId,
              notifTitle,
              `${notifMsg}${orderNo}`,
              { orderId: orderId, type: 'delivered' }
            );
          } catch (notifErr) {
            console.error('Failed to send seller delivery notification:', notifErr);
          }
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error('FirebaseDeliveryRepository.verifyDeliveryOTP failed:', err);
      throw err;
    }
  }

  async getCompletedDeliveries(riderId: string): Promise<DeliveryJob[]> {
    try {
      const snapshot = await this.ordersCollection
        .where('riderId', '==', riderId)
        .where('status', '==', 'delivered')
        .get();

      const deliveries: DeliveryJob[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const items = data.items || [];
        const itemsSummary = items.map((item: any) => `${item.title} x ${item.quantity}`).join(', ');
        const price = Number(data.totalPrice) || 20;
        const calculatedPayout = Number(data.payout) || Math.max(5, Math.round(price * 0.15 * 100) / 100);

        deliveries.push({
          id: doc.id,
          orderId: doc.id,
          storeName: data.sellerName || 'Gas Store',
          storeAddress: 'Seller Depot',
          customerName: data.userName || 'Customer',
          customerAddress: data.userAddress || 'Customer Address',
          itemsSummary: itemsSummary || 'Gas Cylinder Refill',
          payout: calculatedPayout,
          status: 'delivered',
          distance: '1.2 km',
          orderCode: data.orderCode || '00000',
          date: data.updatedAt && typeof data.updatedAt.toDate === 'function' 
            ? data.updatedAt.toDate().toLocaleDateString() 
            : new Date().toLocaleDateString(),
        });
      });

      return deliveries;
    } catch (err) {
      console.error('FirebaseDeliveryRepository.getCompletedDeliveries failed:', err);
      throw err;
    }
  }
}
