import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { orderRepository } from '../../../services/orderService';
import { useTranslation } from '../../../hooks/useTranslation';
import { resolveProductImage } from '../../products/utils/imageResolver';

export const useOrders = () => {
    const { user, userRole } = useAuth();
    const { t } = useTranslation();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [pastOrders, setPastOrders] = useState<any[]>([]);
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);
    const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);
    const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const isSeller = userRole === 'seller';
            const list = isSeller 
                ? await orderRepository.getOrdersBySeller(user.uid)
                : await orderRepository.getOrdersByUser(user.uid);
            
            const mapped = list.map(order => {
                const firstItem = order.items[0];
                const rawTitle = firstItem?.title || 'Gas Order';
                const parts = rawTitle.split(' ');
                const fallbackKey = parts[0] ? parts[0].toLowerCase() : 'gas_cylinder';
                const fallbackWeight = parts.slice(1).join(' ');

                return {
                    id: order.id,
                    title: rawTitle,
                    productKey: firstItem?.productKey || fallbackKey,
                    weight: firstItem?.weight || fallbackWeight,
                    subtitleKey: order.status === 'delivered' ? 'delivered' : order.status,
                    subtitle: order.status === 'delivered' ? t('delivered_tab') : t(order.status as any),
                    image: resolveProductImage(firstItem?.image),
                    price: firstItem?.price ? firstItem.price.toString() : '20',
                    buttonText: t('view_details'),
                    status: order.status,
                    sellerName: order.sellerName || t('gas_store'),
                    sellerImage: resolveProductImage(order.sellerImage),
                    sellerRating: order.sellerRating || '4.5',
                    rawOrder: order,
                };
            });

            setPastOrders(mapped.filter(o => o.status === 'delivered'));
            setPendingOrders(mapped.filter(o => o.status === 'order_placed' || o.status === 'dispatched'));
            setDeliveredOrders(mapped.filter(o => o.status === 'delivered'));
            setCancelledOrders(mapped.filter(o => o.status === 'cancelled'));
            setOrders(mapped);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    return {
        orders,
        loading,
        pastOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        refreshOrders: fetchOrders,
    };
};
export default useOrders;
