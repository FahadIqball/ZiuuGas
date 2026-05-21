import { OrderRepository } from '../features/orders/services/OrderRepository';
import { FirebaseOrderRepository } from '../features/orders/services/FirebaseOrderRepository';

export const orderRepository: OrderRepository = new FirebaseOrderRepository();
