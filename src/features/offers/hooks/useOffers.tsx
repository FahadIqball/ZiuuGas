import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { offerRepository } from '../../../services/offerService';
import { Offer, OfferRequest } from '../services/types';

export const useOffers = () => {
    const { user, userRole } = useAuth();
    const [currentOffers, setCurrentOffers] = useState<Offer[]>([]);
    const [offerRequests, setOfferRequests] = useState<OfferRequest[]>([]);
    const [sentOffers, setSentOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isSeller = userRole === 'seller';

    const fetchData = useCallback(async () => {
        if (!user) return;
        
        setIsLoading(true);
        setError(null);
        try {
            if (isSeller) {
                // Sellers see requests from users AND offers they have sent
                const [requests, offers] = await Promise.all([
                    offerRepository.getOfferRequestsBySeller(user.uid),
                    offerRepository.getOffersBySeller(user.uid)
                ]);
                setOfferRequests(requests);
                setSentOffers(offers);
            } else {
                // Users see offers sent by sellers
                const offers = await offerRepository.getOffersByUser(user.uid);
                setCurrentOffers(offers);
            }
        } catch (err) {
            console.error('Error fetching offers data:', err);
            setError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    }, [user, isSeller]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        currentOffers,
        offerRequests,
        sentOffers,
        isLoading,
        error,
        refresh: fetchData,
    };
};
