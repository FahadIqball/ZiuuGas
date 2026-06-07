import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { UserRole } from '../services/types';

export const useLogin = () => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail, error: authError } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async (targetRole?: UserRole | any) => {
    const role: UserRole = (typeof targetRole === 'string' ? targetRole : 'user') as UserRole;
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle(role);
    } catch (err: any) {
      console.error('useLogin: Google sign in failed:', err);
      // Map common errors or use translated messages
      if (err.code === 'SIGN_IN_CANCELLED') {
        setError(t('google_sign_in_cancelled'));
      } else if (err.code === 'IN_PROGRESS') {
        setError(t('google_sign_in_in_progress'));
      } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        setError(t('google_play_services_outdated'));
      } else {
        setError(t('google_sign_in_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string, targetRole?: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password, targetRole);
    } catch (err: any) {
      console.error('useLogin: Email sign in failed:', err);
      if (err.code === 'auth/invalid-email') {
        setError(t('invalid_email') || 'Invalid email address.');
      } else if (err.code === 'auth/user-disabled') {
        setError(t('user_disabled') || 'This user has been disabled.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(t('invalid_credentials') || 'Invalid email or password.');
      } else {
        setError(err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, targetRole?: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password, targetRole);
    } catch (err: any) {
      console.error('useLogin: Email sign up failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError(t('email_already_in_use') || 'That email address is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError(t('invalid_email') || 'Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError(t('weak_password') || 'The password is too weak.');
      } else {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error: error || authError,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
  };
};
export default useLogin;
