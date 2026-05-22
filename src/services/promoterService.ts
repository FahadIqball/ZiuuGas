import { PromoterRepository } from '../features/promoter/services/PromoterRepository';
import { FirebasePromoterRepository } from '../features/promoter/services/FirebasePromoterRepository';

export const promoterRepository: PromoterRepository = new FirebasePromoterRepository();
