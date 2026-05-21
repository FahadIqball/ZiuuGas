import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthRepository } from './AuthRepository';
import { UserProfile } from './types';
import ENV from '../../../config/env';

export class FirebaseAuthRepository implements AuthRepository {
  constructor() {
    // Configure Google Sign-In dynamically using client ID from env
    if (ENV.GOOGLE_WEB_CLIENT_ID) {
      GoogleSignin.configure({
        webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
      });
    } else {
      console.warn(
        'Google Sign-In initialized without a GOOGLE_WEB_CLIENT_ID. Ensure configuration is loaded correctly.'
      );
    }
  }

  private mapFirebaseUser(user: any): UserProfile {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: null, // Role must be loaded/assigned from Firestore UserRepository
      createdAt: user.metadata.creationTime || new Date().toISOString(),
      updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
    };
  }

  async signInWithGoogle(): Promise<UserProfile> {
    try {
      // Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Perform the sign in flow
      const signInResult = await GoogleSignin.signIn();
      
      // Check idToken in data object (standard in newer versions of the SDK)
      const idToken = signInResult.data?.idToken || (signInResult as any).idToken;
      if (!idToken) {
        throw new Error('Google Sign-In: ID token is missing from sign-in response.');
      }

      // Create a Google credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Authenticate with Firebase using the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      if (!userCredential.user) {
        throw new Error('Firebase Authentication sign-in failed.');
      }

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      console.error('FirebaseAuthRepository.signInWithGoogle failed:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      // We can fail silently or log warning if the Google SDK session wasn't active
      console.warn('Google Sign-In session sign out warning:', error);
    }
    
    try {
      await auth().signOut();
    } catch (error) {
      console.error('FirebaseAuthRepository.signOut failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const user = auth().currentUser;
    if (!user) {
      return null;
    }
    return this.mapFirebaseUser(user);
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        callback(this.mapFirebaseUser(user));
      } else {
        callback(null);
      }
    });
  }
}
