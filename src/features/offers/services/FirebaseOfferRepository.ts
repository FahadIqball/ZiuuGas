import firestore from '@react-native-firebase/firestore';
import { OfferRepository } from './OfferRepository';
import { Offer, OfferRequest } from './types';

export class FirebaseOfferRepository implements OfferRepository {
  private requestsCollection = firestore().collection('offerRequests');
  private offersCollection = firestore().collection('offers');

  async createOfferRequest(request: Omit<OfferRequest, 'id' | 'createdAt'>): Promise<OfferRequest> {
    const docRef = this.requestsCollection.doc();
    const timestamp = firestore.FieldValue.serverTimestamp();
    
    // Fetch user profile to ensure latest name and photo are used
    const userDoc = await firestore().collection('users').doc(request.userId).get();
    const userData = userDoc.data();

    const newRequest = {
      ...request,
      id: docRef.id,
      userName: userData?.displayName || request.userName || '',
      userPhotoURL: userData?.photoURL || '',
      image: request.image || '',
      createdAt: timestamp,
    };
    await docRef.set(newRequest);
    return { ...newRequest, createdAt: new Date() } as any;
  }

  async getOfferRequests(): Promise<OfferRequest[]> {
    const snapshot = await this.requestsCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => this.mapDocToRequest(doc));
  }

  async getOfferRequestsBySeller(sellerId: string): Promise<OfferRequest[]> {
    try {
      const snapshot = await this.requestsCollection
        .where('status', '==', 'pending')
        .get();
      
      const requests = snapshot.docs.map(doc => this.mapDocToRequest(doc));
      return requests.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
    } catch (err) {
      console.error('getOfferRequestsBySeller error:', err);
      throw err;
    }
  }

  async getOfferRequestsByUser(userId: string): Promise<OfferRequest[]> {
    try {
      const snapshot = await this.requestsCollection
        .where('userId', '==', userId)
        .get();
      
      const requests = snapshot.docs.map(doc => this.mapDocToRequest(doc));
      return requests.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
    } catch (err) {
      console.error('getOfferRequestsByUser error:', err);
      throw err;
    }
  }

  async sendOffer(offer: Omit<Offer, 'id' | 'createdAt'>): Promise<Offer> {
    const docRef = this.offersCollection.doc();
    const timestamp = firestore.FieldValue.serverTimestamp();

    // Fetch seller profile to ensure latest name and photo are used
    const sellerDoc = await firestore().collection('users').doc(offer.sellerId).get();
    const sellerData = sellerDoc.data();

    // Fetch customer profile
    const userDoc = await firestore().collection('users').doc(offer.userId).get();
    const userData = userDoc.data();

    const newOffer = {
      ...offer,
      id: docRef.id,
      sellerName: sellerData?.displayName || offer.sellerName || '',
      sellerPhotoURL: sellerData?.photoURL || '',
      userName: userData?.displayName || '',
      userPhotoURL: userData?.photoURL || '',
      image: offer.image || '',
      createdAt: timestamp,
    };
    await docRef.set(newOffer);
    
    // Update request status to 'responded'
    await this.requestsCollection.doc(offer.requestId).update({
        status: 'responded'
    });

    return { ...newOffer, createdAt: new Date() } as any;
  }

  async getOffersByUser(userId: string): Promise<Offer[]> {
    try {
      const snapshot = await this.offersCollection
        .where('userId', '==', userId)
        .get();
      
      const offers = snapshot.docs.map(doc => this.mapDocToOffer(doc));
      return offers.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
    } catch (err) {
      console.error('getOffersByUser error:', err);
      throw err;
    }
  }

  async getOffersBySeller(sellerId: string): Promise<Offer[]> {
    try {
      const snapshot = await this.offersCollection
        .where('sellerId', '==', sellerId)
        .get();
      
      const offers = snapshot.docs.map(doc => this.mapDocToOffer(doc));
      return offers.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
    } catch (err) {
      console.error('getOffersBySeller error:', err);
      throw err;
    }
  }

  async getOffersByRequest(requestId: string): Promise<Offer[]> {
    try {
      const snapshot = await this.offersCollection
        .where('requestId', '==', requestId)
        .get();
      
      const offers = snapshot.docs.map(doc => this.mapDocToOffer(doc));
      return offers.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
    } catch (err) {
      console.error('getOffersByRequest error:', err);
      throw err;
    }
  }

  async updateOfferStatus(offerId: string, status: Offer['status']): Promise<void> {
    await this.offersCollection.doc(offerId).update({
      status,
    });
  }

  private sortDescending(a: any, b: any) {
    const dateA = a ? new Date(a).getTime() : 0;
    const dateB = b ? new Date(b).getTime() : 0;
    return dateB - dateA;
  }

  private mapDocToRequest(doc: any): OfferRequest {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    } as OfferRequest;
  }

  private mapDocToOffer(doc: any): Offer {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    } as Offer;
  }
}
