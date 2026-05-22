import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { promoterRepository } from '../../../services/promoterService';
import { PayoutRequest } from '../types';

export const usePromoterPayouts = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayoutsData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const list = await promoterRepository.getPayoutsList(user.uid);
      setPayouts(list);
    } catch (err: any) {
      console.error('Error fetching promoter payouts:', err);
      setError(err?.message || 'Failed to fetch payouts');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const requestPayout = async (amount: number, pixKey: string) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await promoterRepository.requestPayout(user.uid, amount, pixKey);
      await fetchPayoutsData();
    } catch (err: any) {
      console.error('Error requesting payout:', err);
      setError(err?.message || 'Failed to request payout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutsData();
  }, [fetchPayoutsData]);

  return {
    payouts,
    isLoading,
    error,
    requestPayout,
    refreshPayouts: fetchPayoutsData,
  };
};
