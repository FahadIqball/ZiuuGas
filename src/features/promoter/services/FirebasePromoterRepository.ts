import firestore from '@react-native-firebase/firestore';
import { PromoterRepository } from './PromoterRepository';
import { ReferralItem, PromoterMetrics, PayoutRequest } from '../types';

export class FirebasePromoterRepository implements PromoterRepository {
  private usersCollection = firestore().collection('users');
  private payoutsCollection = firestore().collection('payouts');

  async getPromoterMetrics(promoterId: string): Promise<PromoterMetrics> {
    try {
      const doc = await this.usersCollection.doc(promoterId).get();
      const data = doc.data();
      
      let referralCode = data?.referralCode;
      if (!referralCode) {
        // Generate a referral code if not exists
        referralCode = `ZIUU-PROM-${promoterId.substring(0, 4).toUpperCase()}`;
        await this.usersCollection.doc(promoterId).update({ referralCode });
      }

      // Count registered referred users
      const referredSnapshot = await this.usersCollection
        .where('referredBy', '==', referralCode)
        .get();

      const totalSignups = referredSnapshot.size;
      // Let's assume each referral earns $10 commission
      const totalCommissions = totalSignups * 10;

      return {
        totalSignups,
        totalCommissions,
        referralCode,
      };
    } catch (err) {
      console.error('FirebasePromoterRepository.getPromoterMetrics failed:', err);
      throw err;
    }
  }

  async getReferralsList(promoterId: string): Promise<ReferralItem[]> {
    try {
      const doc = await this.usersCollection.doc(promoterId).get();
      const referralCode = doc.data()?.referralCode || '';

      if (!referralCode) return [];

      const snapshot = await this.usersCollection
        .where('referredBy', '==', referralCode)
        .get();

      const list: ReferralItem[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.displayName || '',
          email: data.email || '',
          registrationDate: data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate().toLocaleDateString()
            : data.createdAt instanceof Date
              ? data.createdAt.toLocaleDateString()
              : new Date().toLocaleDateString(),
          status: 'active',
        });
      });

      return list;
    } catch (err) {
      console.error('FirebasePromoterRepository.getReferralsList failed:', err);
      throw err;
    }
  }

  async requestPayout(promoterId: string, amount: number, pixKey: string): Promise<void> {
    try {
      await this.payoutsCollection.add({
        promoterId,
        amount,
        pixKey,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error('FirebasePromoterRepository.requestPayout failed:', err);
      throw err;
    }
  }

  async getPayoutsList(promoterId: string): Promise<PayoutRequest[]> {
    try {
      const snapshot = await this.payoutsCollection
        .where('promoterId', '==', promoterId)
        .get();

      const list: PayoutRequest[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        list.push({
          id: doc.id,
          amount: Number(data.amount) || 0,
          status: data.status || 'pending',
          date: data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate().toLocaleDateString()
            : new Date().toLocaleDateString(),
          pixKey: data.pixKey || '',
        });
      });
      return list;
    } catch (err) {
      console.error('FirebasePromoterRepository.getPayoutsList failed:', err);
      throw err;
    }
  }
}
