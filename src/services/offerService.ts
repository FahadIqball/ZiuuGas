import { FirebaseOfferRepository } from '../features/offers/services/FirebaseOfferRepository';
import { OfferRepository } from '../features/offers/services/OfferRepository';

export const offerRepository: OfferRepository = new FirebaseOfferRepository();
export default offerRepository;
