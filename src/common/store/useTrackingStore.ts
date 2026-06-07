import { create } from 'zustand';
import firestore from '@react-native-firebase/firestore';
import { TrackingDetails, OrderStatus } from '../../features/tracking/dummies/trackOrder';

interface TrackingState {
  trackingData: TrackingDetails | null;
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  riderUnsubscribe: (() => void) | null;
  startTracking: (orderId: string | undefined, userId: string) => Promise<void>;
  stopTracking: () => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  trackingData: null,
  isLoading: false,
  error: null,
  unsubscribe: null,
  riderUnsubscribe: null,

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

      let activeRiderId: string | null = null;

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

              const newRiderId = data?.riderId || null;

              // If riderId changed, setup a new listener
              if (newRiderId !== activeRiderId) {
                const prevRiderUnsub = get().riderUnsubscribe;
                if (prevRiderUnsub) {
                  prevRiderUnsub();
                }
                set({ riderUnsubscribe: null });
                activeRiderId = newRiderId;

                if (newRiderId) {
                  const riderUnsub = firestore()
                    .collection('users')
                    .doc(newRiderId)
                    .onSnapshot(
                      riderSnapshot => {
                        if (riderSnapshot.exists()) {
                          const rData = riderSnapshot.data();
                          set(state => {
                            if (!state.trackingData) return {};
                            return {
                              trackingData: {
                                ...state.trackingData,
                                riderId: newRiderId,
                                riderName: rData?.displayName || rData?.email || 'Rider',
                                riderPhoto: rData?.photoURL || '',
                                riderPhone: rData?.phone || '',
                                riderLatitude: rData?.latitude,
                                riderLongitude: rData?.longitude,
                              }
                            };
                          });
                        }
                      },
                      err => {
                        console.error('Error listening to rider snapshot:', err);
                      }
                    );
                  set({ riderUnsubscribe: riderUnsub });
                }
              }

              // Set base tracking data (or merge existing rider data if already set)
              set(state => {
                const existingRiderData = (state.trackingData && state.trackingData.riderId === newRiderId) ? {
                  riderId: state.trackingData.riderId,
                  riderName: state.trackingData.riderName,
                  riderPhoto: state.trackingData.riderPhoto,
                  riderPhone: state.trackingData.riderPhone,
                  riderLatitude: state.trackingData.riderLatitude,
                  riderLongitude: state.trackingData.riderLongitude,
                } : {};

                return {
                  trackingData: {
                    id: docSnapshot.id,
                    currentStatus,
                    orderCode: data?.orderCode || '',
                    estimatedDelivery: data?.estimatedDeliveryMin || '20',
                    price: data?.totalPrice ? data.totalPrice.toString() : '20',
                    rating: data?.sellerRating || '4.5',
                    storeName: data?.sellerName || '',
                    storeImage: data?.sellerImage || '',
                    ...existingRiderData,
                  },
                  isLoading: false,
                };
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
      set({ unsubscribe: null });
    }
    const unsubRider = get().riderUnsubscribe;
    if (unsubRider) {
      unsubRider();
      set({ riderUnsubscribe: null });
    }
    set({ trackingData: null });
  },
}));
