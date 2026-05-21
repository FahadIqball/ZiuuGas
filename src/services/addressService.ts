import { AddressRepository } from '../features/profile/services/AddressRepository';
import { FirebaseAddressRepository } from '../features/profile/services/FirebaseAddressRepository';

export const addressRepository: AddressRepository = new FirebaseAddressRepository();
