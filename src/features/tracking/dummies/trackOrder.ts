import { TxKeyPath } from '../../../context/LanguageContext';

export enum OrderStatus {
    PLACED = 'order_placed',
    DISPATCHED = 'dispatched',
    DELIVERED = 'delivered',
}

export interface TrackingDetails {
    id: string;
    currentStatus: OrderStatus;
    orderCode: string;
    estimatedDelivery: string;
    price?: string;
    rating?: string;
    storeName?: string;
    storeImage?: string;
    riderId?: string;
    riderName?: string;
    riderPhoto?: string;
    riderPhone?: string;
    riderLatitude?: number;
    riderLongitude?: number;
}

export const MOCK_TRACKING_DETAILS: TrackingDetails = {
    id: 't1',
    currentStatus: OrderStatus.DISPATCHED,
    orderCode: '03403',
    estimatedDelivery: '20',
};

export const STATUS_LIST: { key: OrderStatus; label: TxKeyPath }[] = [
    { key: OrderStatus.PLACED, label: 'order_placed' },
    { key: OrderStatus.DISPATCHED, label: 'dispatched' },
    { key: OrderStatus.DELIVERED, label: 'delivered' },
];
