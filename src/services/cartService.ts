import { CartRepository } from '../features/cart/services/CartRepository';
import { FirebaseCartRepository } from '../features/cart/services/FirebaseCartRepository';

export const cartRepository: CartRepository = new FirebaseCartRepository();
