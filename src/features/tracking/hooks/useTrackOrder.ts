import { useState, useEffect } from 'react';
import { Share, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TrackingDetails, OrderStatus } from '../dummies/trackOrder';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../context/AuthContext';

export const useTrackOrder = (orderId?: string) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [trackingData, setTrackingData] = useState<TrackingDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: () => void = () => {};

        const setupSubscription = async () => {
            setIsLoading(true);
            try {
                let targetId = orderId;
                
                if (!targetId && user) {
                    const snapshot = await firestore()
                        .collection('orders')
                        .where('userId', '==', user.uid)
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
                    setIsLoading(false);
                    return;
                }

                unsubscribe = firestore()
                    .collection('orders')
                    .doc(targetId)
                    .onSnapshot(
                        docSnapshot => {
                            setIsLoading(false);
                            if (docSnapshot.exists()) {
                                const data = docSnapshot.data();
                                
                                let currentStatus = OrderStatus.PLACED;
                                if (data?.status === 'dispatched') {
                                    currentStatus = OrderStatus.DISPATCHED;
                                } else if (data?.status === 'delivered') {
                                    currentStatus = OrderStatus.DELIVERED;
                                }
                                
                                setTrackingData({
                                    id: docSnapshot.id,
                                    currentStatus,
                                    orderCode: data?.orderCode || '',
                                    estimatedDelivery: data?.estimatedDeliveryMin || '20',
                                });
                            } else {
                                setTrackingData(null);
                            }
                        },
                        err => {
                            console.error('Error listening to order tracking:', err);
                            setIsLoading(false);
                        }
                    );
            } catch (err) {
                console.error('Error fetching recent order for tracking:', err);
                setIsLoading(false);
            }
        };

        if (user) {
            setupSubscription();
        } else {
            setIsLoading(false);
        }

        return () => unsubscribe();
    }, [orderId, user]);

    const handleShareCode = async () => {
        if (!trackingData) return;
        try {
            await Share.share({
                message: `${t('share_msg')}${trackingData.orderCode}`,
            });
        } catch (error) {
            console.error('Error sharing code', error);
        }
    };

    const isStatusDone = (status: OrderStatus) => {
        if (!trackingData) return false;
        const statusOrder = [OrderStatus.PLACED, OrderStatus.DISPATCHED, OrderStatus.DELIVERED];
        const currentIdx = statusOrder.indexOf(trackingData.currentStatus);
        const targetIdx = statusOrder.indexOf(status);
        return targetIdx <= currentIdx;
    };

    return { trackingData, isLoading, handleShareCode, isStatusDone };
};
