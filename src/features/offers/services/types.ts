export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type RequestStatus = 'pending' | 'responded' | 'cancelled';

export interface OfferRequest {
  id: string;
  userId: string;
  userName?: string;
  userPhotoURL?: string;
  productId: string;
  title: string;
  subtitle?: string;
  image?: string;
  status: RequestStatus;
  createdAt: any;
}

export interface Offer {
  id: string;
  requestId: string;
  sellerId: string;
  sellerName?: string;
  sellerPhotoURL?: string;
  userId: string;
  userName?: string;
  userPhotoURL?: string;
  price: number;
  estimatedTime: string;
  paymentMethod: string;
  status: OfferStatus;
  createdAt: any;
  // Metadata for UI
  title?: string;
  image?: string;
  rating?: string;
}
