import { FirebaseAuthRepository } from '../features/auth/services/FirebaseAuthRepository';
import { FirebaseUserRepository } from '../features/auth/services/FirebaseUserRepository';
import { AuthRepository } from '../features/auth/services/AuthRepository';
import { UserRepository } from '../features/auth/services/UserRepository';

// Dependency Injection Entry Point:
// By exporting interfaces here, the rest of the application remains agnostic
// of our specific choice of Firebase for auth or database storage.
export const authRepository: AuthRepository = new FirebaseAuthRepository();
export const userRepository: UserRepository = new FirebaseUserRepository();
