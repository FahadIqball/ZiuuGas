import { create } from 'zustand';
import firestore from '@react-native-firebase/firestore';
import { TrackingDetails, OrderStatus } from '../../features/tracking/dummies/trackOrder';

interface TrackingState {
  trackingData: TrackingDetails | null;
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  startTracking: (orderId: string | undefined, userId: string) => Promise<void>;
  stopTracking: () => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  trackingData: null,
  isLoading: false,
  error: null,
  unsubscribe: null,

  startTracking: async (orderId: string | undefined, userId: string) => {
    // Stop any existing tracking
    get().stopTracking();
    set({ isLoading: true, error: null });

    try {
      let targetId = orderId;

      if (!targetId && userId) {
        const snapshot = await firestore()
          .collection('orders')
          .where('userId', '==', userId)
          .get();

        if (!snapshot.empty) {
          const sortedDocs = [...snapshot.docs].sort((a, b) => {
            const timeA = a.data().createdAt?.seconds || 0;
            const timeB = b.data().createdAt?.seconds || 0;
            return timeB - timeA;
          });
          targetId = sortedDocs[0].id;
        }
      }

      if (!targetId) {
        set({ isLoading: false, trackingData: null });
        return;
      }

      const unsub = firestore()
        .collection('orders')
        .doc(targetId)
        .onSnapshot(
          docSnapshot => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();

              let currentStatus = OrderStatus.PLACED;
              if (data?.status === 'dispatched') {
                currentStatus = OrderStatus.DISPATCHED;
              } else if (data?.status === 'delivered') {
                currentStatus = OrderStatus.DELIVERED;
              }

              set({
                trackingData: {
                  id: docSnapshot.id,
                  currentStatus,
                  orderCode: data?.orderCode || '',
                  estimatedDelivery: data?.estimatedDeliveryMin || '20',
                  price: data?.totalPrice ? data.totalPrice.toString() : '20',
                  rating: data?.sellerRating || '4.5',
                  storeName: data?.sellerName || '',
                  storeImage: data?.sellerImage || '',
                },
                isLoading: false,
              });
            } else {
              set({ trackingData: null, isLoading: false });
            }
          },
          err => {
            console.error('Error listening to tracking store snapshot:', err);
            set({ error: err.message, isLoading: false });
          }
        );

      set({ unsubscribe: unsub });
    } catch (err: any) {
      console.error('Error starting tracking in store:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  stopTracking: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null, trackingData: null });
    }
  },
}));
