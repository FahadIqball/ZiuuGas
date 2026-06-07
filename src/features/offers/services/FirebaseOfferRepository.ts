import firestore from '@react-native-firebase/firestore';
import { OfferRepository } from './OfferRepository';
import { Offer, OfferRequest } from './types';
import { notificationRepository } from '../../../services/notificationService';

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

    // Notify all sellers about the new request
    try {
      const sellersSnapshot = await firestore()
        .collection('users')
        .where('role', '==', 'seller')
        .get();

      const customerName = userData?.displayName || request.userName || 'Customer';
      const notifMsg = 'notif_msg_3'; // "Sent you an offer" or customized: "New offer request created"

      for (const sellerDoc of sellersSnapshot.docs) {
        const sellerId = sellerDoc.id;

        await notificationRepository.createNotification({
          recipientId: sellerId,
          title: customerName,
          message: notifMsg,
          type: 'new_offer',
          image: userData?.photoURL || null,
          offerId: docRef.id,
        });

        await notificationRepository.sendPushNotification(
          sellerId,
          customerName,
          'Sent a new offer request',
          { type: 'new_offer', offerId: docRef.id }
        );
      }
    } catch (err) {
      console.error('Failed to notify sellers of new offer request:', err);
    }

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

    // Notify the customer about the new offer
    try {
      const sellerStoreName = sellerData?.displayName || offer.sellerName || 'Store';
      const notifMsg = 'notif_msg_2'; // "Just sent you an offer"

      await notificationRepository.createNotification({
        recipientId: offer.userId,
        title: sellerStoreName,
        message: notifMsg,
        type: 'new_offer',
        offerId: docRef.id,
        image: sellerData?.photoURL || null,
      });

      await notificationRepository.sendPushNotification(
        offer.userId,
        sellerStoreName,
        'Just sent you an offer',
        { offerId: docRef.id, type: 'new_offer' }
      );
    } catch (notifErr) {
      console.error('Failed to notify customer of sent offer:', notifErr);
    }

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
    try {
      const offerDoc = await this.offersCollection.doc(offerId).get();
      if (!offerDoc.exists) return;
      const offerData = offerDoc.data();
      if (!offerData) return;

      await this.offersCollection.doc(offerId).update({
        status,
      });

      // Notify the seller when their offer status changes
      const customerName = offerData.userName || 'Customer';
      if (status === 'accepted') {
        const notifMsg = 'notif_msg_4'; // "Accepted your offer request"

        await notificationRepository.createNotification({
          recipientId: offerData.sellerId,
          title: customerName,
          message: notifMsg,
          type: 'offer_accepted',
          offerId: offerId,
          image: offerData.userPhotoURL || null,
        });

        await notificationRepository.sendPushNotification(
          offerData.sellerId,
          customerName,
          'Accepted your offer request',
          { offerId, type: 'offer_accepted' }
        );
      } else if (status === 'rejected') {
        const notifMsg = 'Offer rejected';

        await notificationRepository.createNotification({
          recipientId: offerData.sellerId,
          title: customerName,
          message: notifMsg,
          type: 'cancelled',
          offerId: offerId,
          image: offerData.userPhotoURL || null,
        });

        await notificationRepository.sendPushNotification(
          offerData.sellerId,
          customerName,
          'Rejected your offer',
          { offerId, type: 'cancelled' }
        );
      }
    } catch (err) {
      console.error('FirebaseOfferRepository.updateOfferStatus failed:', err);
      throw err;
    }
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

  subscribeToOffersByUser(userId: string, onUpdate: (offers: Offer[]) => void): () => void {
    return this.offersCollection
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        if (!snapshot) return;
        const offers = snapshot.docs.map(doc => this.mapDocToOffer(doc));
        offers.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
        onUpdate(offers);
      }, (err) => {
        console.error('subscribeToOffersByUser error:', err);
      });
  }

  subscribeToOffersBySeller(sellerId: string, onUpdate: (offers: Offer[]) => void): () => void {
    return this.offersCollection
      .where('sellerId', '==', sellerId)
      .onSnapshot((snapshot) => {
        if (!snapshot) return;
        const offers = snapshot.docs.map(doc => this.mapDocToOffer(doc));
        offers.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
        onUpdate(offers);
      }, (err) => {
        console.error('subscribeToOffersBySeller error:', err);
      });
  }

  subscribeToOfferRequestsBySeller(onUpdate: (requests: OfferRequest[]) => void): () => void {
    return this.requestsCollection
      .where('status', '==', 'pending')
      .onSnapshot((snapshot) => {
        if (!snapshot) return;
        const requests = snapshot.docs.map(doc => this.mapDocToRequest(doc));
        requests.sort((a, b) => this.sortDescending(a.createdAt, b.createdAt));
        onUpdate(requests);
      }, (err) => {
        console.error('subscribeToOfferRequestsBySeller error:', err);
      });
  }
}
