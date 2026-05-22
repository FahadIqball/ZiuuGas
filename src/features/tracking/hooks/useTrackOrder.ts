import { useEffect } from 'react';
import { Share } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../context/AuthContext';
import { useTrackingStore } from '../../../common/store/useTrackingStore';
import { OrderStatus } from '../dummies/trackOrder';

export const useTrackOrder = (orderId?: string) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { trackingData, isLoading, startTracking, stopTracking } = useTrackingStore();

    useEffect(() => {
        if (user) {
            startTracking(orderId, user.uid);
        }
        return () => {
            stopTracking();
        };
    }, [orderId, user, startTracking, stopTracking]);

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
