import firestore from '@react-native-firebase/firestore';
import { DeliveryRepository } from './DeliveryRepository';
import { DeliveryJob } from '../types';

export class FirebaseDeliveryRepository implements DeliveryRepository {
  private ordersCollection = firestore().collection('orders');
  private usersCollection = firestore().collection('users');

  async getAvailableJobs(areaInKm: number, location: string): Promise<DeliveryJob[]> {
    try {
      // Fetch orders that have been placed but not yet assigned to any delivery partner
      const snapshot = await this.ordersCollection
        .where('status', '==', 'order_placed')
        .get();

      const jobs: DeliveryJob[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        // Skip if already assigned
        if (data.riderId) return;

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
      
      const price = Number(doc.data()?.totalPrice) || 20;
      const calculatedPayout = Math.max(5, Math.round(price * 0.15 * 100) / 100);

      await orderRef.update({
        riderId: riderId,
        payout: calculatedPayout,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error('FirebaseDeliveryRepository.acceptJob failed:', err);
      throw err;
    }
  }

  async pickupOrder(orderId: string): Promise<void> {
    try {
      await this.ordersCollection.doc(orderId).update({
        status: 'dispatched',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
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
