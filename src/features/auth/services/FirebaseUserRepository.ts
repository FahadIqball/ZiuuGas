import firestore from '@react-native-firebase/firestore';
import { UserRepository } from './UserRepository';
import { UserProfile, UserRole } from './types';

const USERS_COLLECTION = 'users';

export class FirebaseUserRepository implements UserRepository {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const doc = await firestore().collection(USERS_COLLECTION).doc(uid).get();
      if (!doc.exists) {
        return null;
      }
      return doc.data() as UserProfile;
    } catch (error) {
      console.error('FirebaseUserRepository.getUserProfile failed:', error);
      throw error;
    }
  }

  async createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        uid,
        email: profile.email || null,
        displayName: profile.displayName || null,
        photoURL: profile.photoURL || null,
        role: profile.role || null,
        cnpj: profile.cnpj,
        address: profile.address,
        location: profile.location,
        areaInKm: profile.areaInKm,
        createdAt: now,
        updatedAt: now,
      };
      await firestore().collection(USERS_COLLECTION).doc(uid).set(newProfile);
      return newProfile;
    } catch (error) {
      console.error('FirebaseUserRepository.createUserProfile failed:', error);
      throw error;
    }
  }

  async updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const now = new Date().toISOString();
      await firestore().collection(USERS_COLLECTION).doc(uid).update({
        ...profile,
        updatedAt: now,
      });
    } catch (error) {
      console.error('FirebaseUserRepository.updateUserProfile failed:', error);
      throw error;
    }
  }

  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      await this.updateUserProfile(uid, { role });
    } catch (error) {
      console.error('FirebaseUserRepository.updateUserRole failed:', error);
      throw error;
    }
  }
}
