import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { storage } from '../utils/storage';
import { authRepository, userRepository } from '../services/authService';
import { UserProfile, UserRole, checkIsProfileComplete } from '../features/auth/services/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
  isProfileComplete: boolean;
  login: (role?: UserRole, extraProfile?: Partial<UserProfile>) => Promise<void>;
  loginWithGoogle: (defaultRole?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    storage.getBoolean(STORAGE_KEYS.IS_AUTHENTICATED) ?? false
  );
  const [userRole, setUserRole] = useState<UserRole | null>(
    (storage.getString('USER_ROLE') as UserRole) || null
  );
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = storage.getString('USER_PROFILE');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isProfileComplete = useMemo(() => checkIsProfileComplete(user), [user]);

  useEffect(() => {
    // Subscribe to Firebase Auth state updates
    const unsubscribe = authRepository.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const pendingRole = storage.getString('PENDING_TARGET_ROLE') as UserRole | null;
          
          // Fetch additional profile and role information from Cloud Firestore
          let profile = await userRepository.getUserProfile(firebaseUser.uid);
          if (!profile) {
            // Document does not exist yet (first time sign-in), create profile with target role
            const targetRole = pendingRole || 'user';
            
            let extraFields = {};
            if (targetRole === 'seller') {
              try {
                const storedInfo = storage.getString('PENDING_SELLER_INFO');
                if (storedInfo) {
                  extraFields = JSON.parse(storedInfo);
                  storage.remove('PENDING_SELLER_INFO');
                }
              } catch (err) {
                console.error('Failed to parse PENDING_SELLER_INFO:', err);
              }
            }
            
            profile = await userRepository.createUserProfile(firebaseUser.uid, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: targetRole,
              ...extraFields,
            });
          } else {
            let needsUpdate = false;
            let updatedFields: Partial<UserProfile> = {};

            if (pendingRole && profile.role !== pendingRole) {
              updatedFields.role = pendingRole;
              needsUpdate = true;
            }

            // If profile exists but is incomplete, check if we have pending info to write
            if (!checkIsProfileComplete(profile)) {
              try {
                const storedInfo = storage.getString('PENDING_SELLER_INFO');
                if (storedInfo) {
                  const extraFields = JSON.parse(storedInfo);
                  updatedFields = { ...updatedFields, ...extraFields };
                  needsUpdate = true;
                  storage.remove('PENDING_SELLER_INFO');
                }
              } catch (err) {
                console.error('Failed to parse pending seller info:', err);
              }
            }

            if (needsUpdate) {
              await userRepository.updateUserProfile(firebaseUser.uid, updatedFields);
              profile = { ...profile, ...updatedFields };
            }
          }
          
          if (pendingRole) {
            storage.remove('PENDING_TARGET_ROLE');
          }
          
          setUser(profile);
          storage.set('USER_PROFILE', JSON.stringify(profile));
          const activeRole = profile.role || 'user';
          setUserRole(activeRole);
          storage.set(STORAGE_KEYS.IS_AUTHENTICATED, true);
          storage.set('USER_ROLE', activeRole);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setUserRole(null);
          storage.set(STORAGE_KEYS.IS_AUTHENTICATED, false);
          storage.remove('USER_ROLE');
          storage.remove('USER_PROFILE');
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        console.error('AuthContext sync profile failed:', err);
        setError(err.message || 'Failed to synchronise user profile.');
        
        // Fallback: Authenticate locally even if Firestore query failed temporarily
        if (firebaseUser) {
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: (storage.getString('USER_ROLE') as UserRole) || 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(fallbackProfile);
          storage.set('USER_PROFILE', JSON.stringify(fallbackProfile));
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async (defaultRole?: UserRole | any) => {
    setLoading(true);
    setError(null);
    const role = typeof defaultRole === 'string' ? defaultRole : undefined;
    if (role) {
      storage.set('PENDING_TARGET_ROLE', role);
    }
    try {
      await authRepository.signInWithGoogle();
      // State changes are automatically captured by the onAuthStateChanged listener
    } catch (err: any) {
      console.error('Google login failed in AuthContext:', err);
      storage.remove('PENDING_TARGET_ROLE');
      storage.remove('PENDING_SELLER_INFO');
      setError(err.message || 'Google Sign-in failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (role: UserRole = 'user', extraProfile?: Partial<UserProfile>) => {
    setError(null);
    const currentUser = user || (await authRepository.getCurrentUser());
    if (currentUser && currentUser.uid !== 'mock-uid') {
      setLoading(true);
      try {
        const profileUpdate = { role, ...extraProfile };
        await userRepository.updateUserProfile(currentUser.uid, profileUpdate);
        const updated = { ...currentUser, ...profileUpdate };
        setUser(updated);
        storage.set('USER_PROFILE', JSON.stringify(updated));
        setUserRole(role);
        storage.set('USER_ROLE', role);
      } catch (err: any) {
        console.error('Role update failed in AuthContext:', err);
        setError(err.message || 'Failed to assign role.');
      } finally {
        setLoading(false);
      }
    } else {
      // Offline/Mock Fallback
      setLoading(true);
      try {
        const mockUid = 'mock-uid';
        const mockProfile: UserProfile = {
          uid: mockUid,
          email: 'mockuser@example.com',
          displayName: extraProfile?.displayName || '',
          photoURL: null,
          role: role,
          cnpj: extraProfile?.cnpj,
          address: extraProfile?.address,
          location: extraProfile?.location,
          areaInKm: extraProfile?.areaInKm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(mockProfile);
        storage.set('USER_PROFILE', JSON.stringify(mockProfile));
        storage.set(STORAGE_KEYS.IS_AUTHENTICATED, true);
        storage.set('USER_ROLE', role);
        setIsAuthenticated(true);
        setUserRole(role);
      } catch (err: any) {
        console.error('Mock login failed in AuthContext:', err);
        setError(err.message || 'Mock login failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    setError(null);
    if (!user) {
      throw new Error('No authenticated user profile to update.');
    }
    
    setLoading(true);
    try {
      const updatedUser = { ...user, ...profileUpdate, updatedAt: new Date().toISOString() };
      
      // If we are authenticated via actual Firebase Auth, write to Firestore
      if (user.uid !== 'mock-uid') {
        const currentUser = await authRepository.getCurrentUser();
        if (currentUser) {
          await userRepository.updateUserProfile(user.uid, profileUpdate);
        }
      }
      
      setUser(updatedUser);
      storage.set('USER_PROFILE', JSON.stringify(updatedUser));
      if (profileUpdate.role) {
        setUserRole(profileUpdate.role);
        storage.set('USER_ROLE', profileUpdate.role);
      }
    } catch (err: any) {
      console.error('updateProfile failed in AuthContext:', err);
      setError(err.message || 'Failed to update profile.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authRepository.signOut();
    } catch (err: any) {
      // We can fail silently or log warning if the Google SDK session wasn't active
      console.warn('Google Sign-In session sign out warning:', err);
    }
    
    try {
      setUser(null);
      setUserRole(null);
      storage.set(STORAGE_KEYS.IS_AUTHENTICATED, false);
      storage.remove('USER_ROLE');
      storage.remove('USER_PROFILE');
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error('Logout failed in AuthContext:', err);
      setError(err.message || 'Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    userRole,
    loading,
    error,
    isProfileComplete,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
  }), [isAuthenticated, user, userRole, loading, error, isProfileComplete]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

