import { UserProfile } from './types';

export interface AuthRepository {
  /**
   * Performs authentication via Google Sign-In and returns the user profile details.
   */
  signInWithGoogle(): Promise<UserProfile>;

  /**
   * Signs out the current user from Firebase and Google client.
   */
  signOut(): Promise<void>;

  /**
   * Retrieves the currently logged-in user profile, if any.
   */
  getCurrentUser(): Promise<UserProfile | null>;

  /**
   * Subscribes to changes in authentication state (login/logout).
   * Returns an unsubscribe function.
   */
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void;

  /**
   * Sign in with Email and Password
   */
  signInWithEmail(email: string, password: string): Promise<UserProfile>;

  /**
   * Sign up with Email and Password
   */
  signUpWithEmail(email: string, password: string): Promise<UserProfile>;
}
