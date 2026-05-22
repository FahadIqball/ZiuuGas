import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { deliveryRepository } from '../../../services/deliveryService';
import { DeliveryJob } from '../types';
import firestore from '@react-native-firebase/firestore';

export const usePartnerDeliveries = () => {
  const { user } = useAuth();
  const [availableJobs, setAvailableJobs] = useState<DeliveryJob[]>([]);
  const [activeJob, setActiveJob] = useState<DeliveryJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Get available jobs (placed but unassigned orders)
      const jobs = await deliveryRepository.getAvailableJobs(10, 'depot');
      setAvailableJobs(jobs);

      // 2. Look for active job assigned to this partner (placed or dispatched status)
      const activeSnapshot = await firestore()
        .collection('orders')
        .where('riderId', '==', user.uid)
        .where('status', 'in', ['order_placed', 'dispatched'])
        .get();

      if (!activeSnapshot.empty) {
        const doc = activeSnapshot.docs[0];
        const data = doc.data();
        const items = data.items || [];
        const itemsSummary = items.map((item: any) => `${item.title} x ${item.quantity}`).join(', ');
        
        setActiveJob({
          id: doc.id,
          orderId: doc.id,
          storeName: data.sellerName || 'Gas Store',
          storeAddress: 'Seller Depot',
          customerName: data.userName || 'Customer',
          customerAddress: data.userAddress || 'Customer Address',
          itemsSummary,
          payout: Number(data.payout) || 5,
          status: data.status === 'dispatched' ? 'picked_up' : 'accepted',
          distance: '1.2 km',
        });
      } else {
        setActiveJob(null);
      }
    } catch (err) {
      console.error('Error fetching partner deliveries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const acceptJob = async (jobId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await deliveryRepository.acceptJob(jobId, user.uid);
      await fetchJobs();
    } catch (err) {
      console.error('Error accepting job:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const pickupOrder = async (orderId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await deliveryRepository.pickupOrder(orderId);
      await fetchJobs();
    } catch (err) {
      console.error('Error picking up order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    availableJobs,
    activeJob,
    isLoading,
    refreshJobs: fetchJobs,
    acceptJob,
    pickupOrder,
  };
};
