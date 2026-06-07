import { NotificationRepository } from '../features/notification/services/NotificationRepository';
import { FirebaseNotificationRepository } from '../features/notification/services/FirebaseNotificationRepository';

// Abstracted Service Resolution / Dependency Injection (DI) as per the architecture guidelines.
// Decouples the UI and hook layers from direct reliance on FirebaseNotificationRepository.
export const notificationRepository: NotificationRepository = new FirebaseNotificationRepository();
export default notificationRepository;
