export type NotificationType = 
  | 'order_placed' 
  | 'dispatched' 
  | 'delivered' 
  | 'new_offer' 
  | 'offer_accepted'
  | 'rider_assigned'
  | 'association_request'
  | 'cancelled';

export interface DbNotification {
  id: string;
  recipientId: string;   // Recipient user UID (customer, seller, or rider)
  title: string;         // Name of triggerer (e.g. store name) or localized translation key
  message: string;       // Notification description or translation key
  orderNo?: string;      // Connected order number (e.g., ' #27257372')
  type: NotificationType;
  isRead: boolean;
  image?: string | null;  // HTTP URL (from ImageKit) or null
  createdAt: string;     // ISO timestamp string
  orderId?: string;      // Related order document UID
  offerId?: string;      // Related offer document UID
  storeId?: string;      // Related store document UID
}
