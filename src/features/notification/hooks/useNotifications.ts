import { useNotification } from '../../../context/NotificationContext';

export const useNotifications = () => {
    const { notifications } = useNotification();
    return {
        notifications,
    };
};
