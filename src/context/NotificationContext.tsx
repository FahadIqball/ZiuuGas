import React, { createContext, useContext, useState, ReactNode } from 'react';

import { IMAGES } from '../assets';

export const NOTIFICATIONS_DATA = [
    {
        title: 'today',
        data: [
            {
                id: '1',
                store: 'cylinder_store',
                message: 'notif_msg_1',
                time: 'just_now',
                image: IMAGES.CYLINDER_1,
            },
            {
                id: '2',
                store: 'gas_store',
                message: 'notif_msg_2',
                time: '1h_ago',
                image: IMAGES.CYLINDER_2,
            },
        ],
    },
    {
        title: 'yesterday',
        data: [
            {
                id: '3',
                store: 'gas_cylinder',
                message: 'notif_msg_3',
                time: '11_20_am',
                image: IMAGES.CYLINDER_3,
            },
            {
                id: '4',
                store: 'gas',
                message: 'notif_msg_4',
                time: '12_30_pm',
                image: IMAGES.CYLINDER_1,
            },
        ],
    },
];

interface NotificationContextType {
  notifications: any[];
  hasGasNotification: boolean;
  hasActiveOrder: boolean;
  showGasNotification: (id: string) => void;
  hideGasNotification: () => void;
  acceptOffer: () => void;
  trackOrder: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [hasGasNotification, setHasGasNotification] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const showGasNotification = (id: string) => {
    setSelectedNotificationId(id);
    setHasGasNotification(true);
  };

  const hideGasNotification = () => {
    setHasGasNotification(false);
    setSelectedNotificationId(null);
  };

  const acceptOffer = () => {
    if (selectedNotificationId) {
      setNotifications(prev => prev.map(section => ({
        ...section,
        data: section.data.filter((item: any) => item.id !== selectedNotificationId)
      })).filter(section => section.data.length > 0));
    }
    setHasGasNotification(false);
    setHasActiveOrder(true);
    setSelectedNotificationId(null);
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
        showGasNotification,
        hideGasNotification,
        acceptOffer,
        trackOrder,
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
