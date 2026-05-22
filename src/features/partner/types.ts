export interface DeliveryJob {
  id: string;
  orderId: string;
  storeName: string;
  storeAddress: string;
  customerName: string;
  customerAddress: string;
  itemsSummary: string;
  payout: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  distance: string;
  orderCode?: string;
  date?: string;
}
