import { ImageStorageRepository } from './ImageStorageRepository';
import { ImageKitStorageRepository } from './ImageKitStorageRepository';

// Abstracted Service Resolution / Dependency Injection (DI) as per the architecture guidelines.
// If we ever want to switch from ImageKit to Firebase Storage, S3, or Supabase Storage,
// we only need to swap the implementation class instantiated here.
export const imageStorageRepository: ImageStorageRepository = new ImageKitStorageRepository();
export default imageStorageRepository;
