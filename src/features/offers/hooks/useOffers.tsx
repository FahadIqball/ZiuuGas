import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!user?.uid) {
            setCurrentOffers([]);
            setOfferRequests([]);
            setSentOffers([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        let unsubscribeOffers: (() => void) | undefined;
        let unsubscribeRequests: (() => void) | undefined;

        if (isSeller) {
            // Subscribe to offers sent by this seller
            unsubscribeOffers = offerRepository.subscribeToOffersBySeller(user.uid, (offers) => {
                setSentOffers(offers);
                setIsLoading(false);
            });

            // Subscribe to pending offer requests
            unsubscribeRequests = offerRepository.subscribeToOfferRequestsBySeller((requests) => {
                setOfferRequests(requests);
                setIsLoading(false);
            });
        } else {
            // Subscribe to offers received by this customer
            unsubscribeOffers = offerRepository.subscribeToOffersByUser(user.uid, (offers) => {
                setCurrentOffers(offers);
                setIsLoading(false);
            });
        }

        return () => {
            if (unsubscribeOffers) unsubscribeOffers();
            if (unsubscribeRequests) unsubscribeRequests();
        };
    }, [user?.uid, isSeller]);

    return {
        currentOffers,
        offerRequests,
        sentOffers,
        isLoading,
        error,
        refresh: () => {},
    };
};
