import { DeliveryRepository } from '../features/partner/services/DeliveryRepository';
import { FirebaseDeliveryRepository } from '../features/partner/services/FirebaseDeliveryRepository';

export const deliveryRepository: DeliveryRepository = new FirebaseDeliveryRepository();
