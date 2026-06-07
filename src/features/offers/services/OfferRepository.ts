import { Offer, OfferRequest } from './types';

export interface OfferRepository {
  createOfferRequest(request: Omit<OfferRequest, 'id' | 'createdAt'>): Promise<OfferRequest>;
  getOfferRequests(): Promise<OfferRequest[]>;
  getOfferRequestsBySeller(sellerId: string): Promise<OfferRequest[]>;
  getOfferRequestsByUser(userId: string): Promise<OfferRequest[]>;
  
  sendOffer(offer: Omit<Offer, 'id' | 'createdAt'>): Promise<Offer>;
  getOffersByUser(userId: string): Promise<Offer[]>;
  getOffersBySeller(sellerId: string): Promise<Offer[]>;
  getOffersByRequest(requestId: string): Promise<Offer[]>;
  updateOfferStatus(offerId: string, status: Offer['status']): Promise<void>;

  subscribeToOffersByUser(userId: string, onUpdate: (offers: Offer[]) => void): () => void;
  subscribeToOffersBySeller(sellerId: string, onUpdate: (offers: Offer[]) => void): () => void;
  subscribeToOfferRequestsBySeller(onUpdate: (requests: OfferRequest[]) => void): () => void;
}
