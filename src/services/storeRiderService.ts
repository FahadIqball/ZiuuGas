import { StoreRiderRepository } from '../features/partner/services/StoreRiderRepository';
import { FirebaseStoreRiderRepository } from '../features/partner/services/FirebaseStoreRiderRepository';

export const storeRiderRepository: StoreRiderRepository = new FirebaseStoreRiderRepository();
