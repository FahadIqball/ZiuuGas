import firestore from '@react-native-firebase/firestore';
import { ReviewRepository } from './ReviewRepository';
import { Review } from './types';

export class FirebaseReviewRepository implements ReviewRepository {
  private reviewsCollection = firestore().collection('reviews');

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = this.reviewsCollection.doc();
      const timestamp = firestore.FieldValue.serverTimestamp();
      
      // Fetch the latest user profile data to ensure actual name and avatar are saved
      const userDoc = await firestore().collection('users').doc(review.userId).get();
      const userData = userDoc.data();

      const finalReview = {
        ...review,
        id: docRef.id,
        userName: userData?.displayName || review.userName || 'User',
        userAvatar: userData?.photoURL || review.userAvatar || '',
        createdAt: timestamp,
      };
      
      await docRef.set(finalReview);
      return docRef.id;
    } catch (err) {
      console.error('FirebaseReviewRepository.addReview failed:', err);
      throw err;
    }
  }

  private mapDoc(doc: any): Review {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    } as Review;
  }

  async getReviewsBySeller(sellerId: string): Promise<Review[]> {
    try {
      const snapshot = await this.reviewsCollection
        .where('sellerId', '==', sellerId)
        .get();
      return snapshot.docs.map(doc => this.mapDoc(doc)).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (err) {
      console.error('FirebaseReviewRepository.getReviewsBySeller failed:', err);
      throw err;
    }
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    try {
      const snapshot = await this.reviewsCollection
        .where('productId', '==', productId)
        .get();
      return snapshot.docs.map(doc => this.mapDoc(doc)).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (err) {
      console.error('FirebaseReviewRepository.getReviewsByProduct failed:', err);
      throw err;
    }
  }
}
