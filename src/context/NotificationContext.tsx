import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IMAGES } from '../assets';
import { useAuth } from './AuthContext';
import { notificationRepository } from '../services/notificationService';
import { DbNotification } from '../features/notification/services/types';
import firestore from '@react-native-firebase/firestore';
import { offerRepository } from '../services/offerService';
import { orderRepository } from '../services/orderService';
import { addressRepository } from '../services/addressService';

interface NotificationContextType {
  notifications: any[];
  hasGasNotification: boolean;
  hasActiveOrder: boolean;
  gasNotificationData: any | null;
  activeOrderData: any | null;
  showGasNotification: (id: string) => void;
  hideGasNotification: () => void;
  acceptOffer: () => Promise<void>;
  rejectOffer: () => Promise<void>;
  trackOrder: () => void;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
}

const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minStr} ${ampm}`;
};

const groupNotificationsByDate = (list: DbNotification[]) => {
  const todaySection: any[] = [];
  const yesterdaySection: any[] = [];
  const earlierSection: any[] = [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  list.forEach((item) => {
    let createdDate: Date;
    try {
      createdDate = new Date(item.createdAt);
      if (isNaN(createdDate.getTime())) {
        createdDate = new Date();
      }
    } catch {
      createdDate = new Date();
    }
    
    let timeStr = '';
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 5) {
      timeStr = 'just_now';
    } else if (diffHours < 1) {
      timeStr = `${diffMins} mins`;
    } else if (diffHours < 24 && createdDate >= todayStart) {
      timeStr = formatTime(createdDate);
    } else if (createdDate >= yesterdayStart) {
      timeStr = 'yesterday';
    } else {
      const diffDays = Math.floor((todayStart.getTime() - new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate()).getTime()) / 86400000);
      if (diffDays === 2) {
        timeStr = '2daysago';
      } else {
        timeStr = `${diffDays} days ago`;
      }
    }

    const formattedItem = {
      ...item,
      time: timeStr,
      // Map local asset vs network URL safely
      image: item.image || (item.type === 'new_offer' ? IMAGES.CYLINDER_1 : IMAGES.MAN1),
    };

    if (createdDate >= todayStart) {
      todaySection.push(formattedItem);
    } else if (createdDate >= yesterdayStart) {
      yesterdaySection.push(formattedItem);
    } else {
      earlierSection.push(formattedItem);
    }
  });

  const sections: any[] = [];
  if (todaySection.length > 0) {
    sections.push({ title: 'today', data: todaySection });
  }
  if (yesterdaySection.length > 0) {
    sections.push({ title: 'yesterday', data: yesterdaySection });
  }
  if (earlierSection.length > 0) {
    sections.push({ title: 'earlier', data: earlierSection });
  }

  return sections;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasGasNotification, setHasGasNotification] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const [gasNotificationData, setGasNotificationData] = useState<any | null>(null);
  const [activeOrderData, setActiveOrderData] = useState<any | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setUnreadCount(0);
      setHasGasNotification(false);
      setGasNotificationData(null);
      setHasActiveOrder(false);
      setActiveOrderData(null);
      return;
    }

    // 1. Subscribe to push/in-app notifications
    const unsubscribeNotifications = notificationRepository.subscribeToNotifications(user.uid, async (dbNotifications) => {
      const grouped = groupNotificationsByDate(dbNotifications);
      setNotifications(grouped);
      
      const unreads = dbNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unreads);

      const unreadOffers = dbNotifications.filter(n => !n.isRead && n.type === 'new_offer');
      if (unreadOffers.length > 0) {
        unreadOffers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const latestNotif = unreadOffers[0];
        
        if (latestNotif.offerId) {
          try {
            const doc = await firestore().collection('offers').doc(latestNotif.offerId).get();
            if (doc.exists()) {
              const offerData = doc.data();
              setGasNotificationData({
                notificationId: latestNotif.id,
                offerId: latestNotif.offerId,
                ...offerData,
              });
              setHasGasNotification(true);
            }
          } catch (err) {
            console.error('[NotificationContext] Failed to fetch offer data for notification:', err);
          }
        }
      } else {
        setHasGasNotification(false);
        setGasNotificationData(null);
      }
    });

    // 2. Subscribe to user's active orders (placed or dispatched) to show in bottom banner
    const unsubscribeOrders = firestore()
      .collection('orders')
      .where('userId', '==', user.uid)
      .where('status', 'in', ['order_placed', 'dispatched'])
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot.empty) {
          setHasActiveOrder(false);
          setActiveOrderData(null);
        } else {
          const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          docs.sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          setHasActiveOrder(true);
          setActiveOrderData(docs[0]);
        }
      }, (err) => {
        console.error('[NotificationContext] Active orders subscription failed:', err);
      });

    return () => {
      unsubscribeNotifications();
      unsubscribeOrders();
    };
  }, [user?.uid]);

  const showGasNotification = (id: string) => {
    // Manually trigger displaying gas notification for specific ID
    firestore().collection('notifications').doc(id).get().then(async (docNotif) => {
      if (docNotif.exists()) {
        const notifData = docNotif.data();
        if (notifData?.offerId) {
          const docOffer = await firestore().collection('offers').doc(notifData.offerId).get();
          if (docOffer.exists()) {
            setGasNotificationData({
              notificationId: id,
              offerId: notifData.offerId,
              ...docOffer.data(),
            });
            setHasGasNotification(true);
          }
        }
      }
    });
  };

  const hideGasNotification = () => {
    setHasGasNotification(false);
    setGasNotificationData(null);
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationRepository.markAsRead(id);
    } catch (error) {
      console.error('[NotificationContext] markAsRead failed:', error);
    }
  };

  const acceptOffer = async () => {
    if (gasNotificationData) {
      try {
        let addressString = 'Default Address';
        try {
          if (user) {
            const addresses = await addressRepository.getAddresses(user.uid);
            const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
            if (defaultAddress) {
              addressString = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}, ${defaultAddress.country}`;
            }
          }
        } catch (addrErr) {
          console.error('[NotificationContext] Failed to load address for offer conversion:', addrErr);
        }

        const newOrder = {
          userId: gasNotificationData.userId,
          userName: gasNotificationData.userName || 'Customer',
          userEmail: user?.email || '',
          userPhoto: gasNotificationData.userPhotoURL || '',
          userAddress: addressString,
          sellerId: gasNotificationData.sellerId,
          sellerName: gasNotificationData.sellerName || '',
          sellerImage: gasNotificationData.sellerPhotoURL || '',
          sellerRating: gasNotificationData.rating || '4.5',
          items: [{
            productId: gasNotificationData.requestId || 'unknown',
            title: gasNotificationData.title || 'Gas Cylinder Refill',
            price: Number(gasNotificationData.price) || 0,
            quantity: 1,
            image: gasNotificationData.image || '',
          }],
          totalPrice: Number(gasNotificationData.price) || 0,
          status: 'order_placed' as const,
          orderCode: Math.floor(10000 + Math.random() * 90000).toString(),
          estimatedDeliveryMin: gasNotificationData.estimatedTime || '20',
        };

        await orderRepository.placeOrder(newOrder);
        await offerRepository.updateOfferStatus(gasNotificationData.offerId, 'accepted');
        await notificationRepository.markAsRead(gasNotificationData.notificationId);
      } catch (err) {
        console.error('[NotificationContext] Error accepting offer:', err);
      }
    }
    setHasGasNotification(false);
    setGasNotificationData(null);
  };

  const rejectOffer = async () => {
    if (gasNotificationData) {
      try {
        await offerRepository.updateOfferStatus(gasNotificationData.offerId, 'rejected');
        await notificationRepository.markAsRead(gasNotificationData.notificationId);
      } catch (err) {
        console.error('[NotificationContext] Error rejecting offer:', err);
      }
    }
    setHasGasNotification(false);
    setGasNotificationData(null);
  };

  const trackOrder = () => {
    setHasActiveOrder(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        hasGasNotification,
        hasActiveOrder,
        gasNotificationData,
        activeOrderData,
        showGasNotification,
        hideGasNotification,
        acceptOffer,
        rejectOffer,
        trackOrder,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
