import { DbNotification } from './types';

/**
 * Repository interface for managing notifications in Firestore and dispatching pushes via Vercel.
 * Provides separation of database access code from application logic.
 */
export interface NotificationRepository {
  /**
   * Subscribes to real-time notifications for a specific user, ordered by creation date descending.
   * @param userId The recipient user's UID.
   * @param onUpdate Callback fired when the list of notifications updates.
   * @returns Unsubscribe function to tear down the listener.
   */
  subscribeToNotifications(
    userId: string,
    onUpdate: (notifications: DbNotification[]) => void
  ): () => void;

  /**
   * Marks a notification as read in Firestore.
   * @param notificationId The document UID of the notification.
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * Creates a notification document in Firestore and triggers a push dispatch.
   * @param notification Details of the notification (excluding auto-generated database metadata).
   * @returns The newly created notification's document ID.
   */
  createNotification(
    notification: Omit<DbNotification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<string>;

  /**
   * Dispatches an HTTP push notification request to the Vercel serverless function.
   * @param recipientId The recipient user's UID to look up their FCM token.
   * @param title The title of the push notification.
   * @param body The body message of the push notification.
   * @param data Optional payload fields to include in the push package.
   */
  sendPushNotification(
    recipientId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void>;
}
