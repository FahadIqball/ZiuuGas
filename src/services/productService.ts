import { ProductRepository } from '../features/products/services/ProductRepository';
import { FirebaseProductRepository } from '../features/products/services/FirebaseProductRepository';

// Abstracted Service Resolution / Dependency Injection (DI) as per the architecture guidelines.
// If we ever want to switch from Firebase to another BaaS (like Supabase or custom REST API),
// we only need to swap the implementation class instantiated here.
export const productRepository: ProductRepository = new FirebaseProductRepository();
export default productRepository;
