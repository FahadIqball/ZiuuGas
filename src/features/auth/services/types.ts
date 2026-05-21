export type UserRole = 'user' | 'seller' | 'partner' | 'promoter';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole | null;
  cnpj?: string;
  address?: string;
  location?: string;
  areaInKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const checkIsProfileComplete = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (!user.role) return false;

  if (user.role === 'user') {
    return !!(user.displayName?.trim() && user.location?.trim());
  }

  if (user.role === 'seller') {
    return !!(user.cnpj?.trim() && user.address?.trim() && user.areaInKm);
  }

  // Fallback for promoter/partner placeholder roles
  return true;
};

