import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { promoterRepository } from '../../../services/promoterService';
import { ReferralItem, PromoterMetrics } from '../types';

export const usePromoterReferrals = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PromoterMetrics | null>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralsData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedMetrics, fetchedReferrals] = await Promise.all([
        promoterRepository.getPromoterMetrics(user.uid),
        promoterRepository.getReferralsList(user.uid),
      ]);
      setMetrics(fetchedMetrics);
      setReferrals(fetchedReferrals);
    } catch (err: any) {
      console.error('Error fetching promoter referrals:', err);
      setError(err?.message || 'Failed to fetch referrals');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReferralsData();
  }, [fetchReferralsData]);

  return {
    metrics,
    referrals,
    isLoading,
    error,
    refreshReferrals: fetchReferralsData,
  };
};
