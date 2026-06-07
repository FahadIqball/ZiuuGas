import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { storeRiderRepository } from '../../../services/storeRiderService';
import { StoreRiderInvitation } from '../services/StoreRiderRepository';

export const usePartnerInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<StoreRiderInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = useCallback(async () => {
    if (!user || !user.email) return;
    setLoading(true);
    try {
      const data = await storeRiderRepository.getPendingInvitations(user.email);
      setInvitations(data);
    } catch (err) {
      console.error('Error fetching partner invitations:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const respondToInvitation = async (invitationId: string, accept: boolean) => {
    if (!user) return;
    setLoading(true);
    try {
      await storeRiderRepository.respondToInvitation(invitationId, accept, user.uid);
      await fetchInvitations();
    } catch (err) {
      console.error('Error responding to invitation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return {
    invitations,
    loading,
    refreshInvitations: fetchInvitations,
    respondToInvitation,
  };
};
