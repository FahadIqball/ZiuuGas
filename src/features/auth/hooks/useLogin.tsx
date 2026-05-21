import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { UserRole } from '../services/types';

export const useLogin = () => {
  const { loginWithGoogle, error: authError } = useAuth();
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

  return {
    loading,
    error: error || authError,
    signInWithGoogle,
  };
};
export default useLogin;
