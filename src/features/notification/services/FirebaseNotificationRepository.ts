import firestore from '@react-native-firebase/firestore';
import { NotificationRepository } from './NotificationRepository';
import { DbNotification } from './types';
import { ENV } from '../../../config/env';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Firebase Firestore implementation of the NotificationRepository interface.
 */
export class FirebaseNotificationRepository implements NotificationRepository {
  subscribeToNotifications(
    userId: string,
    onUpdate: (notifications: DbNotification[]) => void
  ): () => void {
    return firestore()
      .collection(NOTIFICATIONS_COLLECTION)
      .where('recipientId', '==', userId)
      .onSnapshot(
        (snapshot) => {
          if (!snapshot) return;
          const notifications: DbNotification[] = [];
          snapshot.forEach((doc) => {
            notifications.push({
              id: doc.id,
              ...doc.data(),
            } as DbNotification);
          });
          // Sort client-side by createdAt descending to avoid requiring a Firestore composite index
          notifications.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });
          onUpdate(notifications);
        },
        (error) => {
          console.error('[FirebaseNotificationRepository] Subscription failed:', error);
        }
      );
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await firestore()
        .collection(NOTIFICATIONS_COLLECTION)
        .doc(notificationId)
        .update({ isRead: true });
    } catch (error) {
      console.error('[FirebaseNotificationRepository] markAsRead failed:', error);
      throw error;
    }
  }

  async createNotification(
    notification: Omit<DbNotification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<string> {
    try {
      const docRef = firestore().collection(NOTIFICATIONS_COLLECTION).doc();
      const now = new Date().toISOString();
      
      const newNotification: DbNotification = {
        ...notification,
        id: docRef.id,
        isRead: false,
        createdAt: now,
      };

      await docRef.set(newNotification);
      return docRef.id;
    } catch (error) {
      console.error('[FirebaseNotificationRepository] createNotification failed:', error);
      throw error;
    }
  }

  async sendPushNotification(
    recipientId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    if (!ENV.VERCEL_API_URL || ENV.VERCEL_API_URL === 'YOUR_VERCEL_BACKEND_URL_PLACEHOLDER') {
      console.warn(
        '[FirebaseNotificationRepository] Vercel API URL is not set. Skipping push notification dispatch.'
      );
      return;
    }

    try {
      const response = await fetch(`${ENV.VERCEL_API_URL}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          title,
          body,
          data,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[FirebaseNotificationRepository] Vercel push request failed. Status: ${response.status}. Details: ${errorText}`
        );
      }
    } catch (error) {
      console.error('[FirebaseNotificationRepository] sendPushNotification fetch error:', error);
    }
  }
}
