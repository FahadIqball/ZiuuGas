import { UserProfile, UserRole } from './types';

export interface UserRepository {
  /**
   * Fetches user profile data by their unique UID.
   */
  getUserProfile(uid: string): Promise<UserProfile | null>;

  /**
   * Creates a new user profile document.
   */
  createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<UserProfile>;

  /**
   * Updates existing fields in a user profile.
   */
  updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void>;

  /**
   * Helper to set/update a user's role (user, seller, partner, promoter).
   */
  updateUserRole(uid: string, role: UserRole): Promise<void>;
}
