import firestore from '@react-native-firebase/firestore';
import { StoreRiderRepository, StoreRiderInvitation } from './StoreRiderRepository';
import { UserProfile } from '../../auth/services/types';

export class FirebaseStoreRiderRepository implements StoreRiderRepository {
  private invitationsCollection = firestore().collection('store_rider_invitations');
  private usersCollection = firestore().collection('users');

  async sendInvitation(storeId: string, storeName: string, riderEmail: string): Promise<void> {
    try {
      const cleanEmail = riderEmail.trim().toLowerCase();

      // Check if invitation already exists and is pending
      const querySnapshot = await this.invitationsCollection
        .where('storeId', '==', storeId)
        .where('riderEmail', '==', cleanEmail)
        .where('status', '==', 'pending')
        .get();

      if (!querySnapshot.empty) {
        throw new Error('An invitation to this email is already pending.');
      }

      // Check if rider exists and has partner role
      const riderSnapshot = await this.usersCollection
        .where('email', '==', cleanEmail)
        .where('role', '==', 'partner')
        .get();

      if (riderSnapshot.empty) {
        throw new Error('No registered delivery rider found with this email.');
      }

      const docRef = this.invitationsCollection.doc();
      const now = new Date().toISOString();

      await docRef.set({
        id: docRef.id,
        storeId,
        storeName,
        riderEmail: cleanEmail,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      });
    } catch (err: any) {
      console.error('FirebaseStoreRiderRepository.sendInvitation failed:', err);
      throw err;
    }
  }

  async getPendingInvitations(riderEmail: string): Promise<StoreRiderInvitation[]> {
    try {
      const snapshot = await this.invitationsCollection
        .where('riderEmail', '==', riderEmail.trim().toLowerCase())
        .where('status', '==', 'pending')
        .get();

      const invitations: StoreRiderInvitation[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        invitations.push({
          id: doc.id,
          storeId: data.storeId || '',
          storeName: data.storeName || '',
          riderEmail: data.riderEmail || '',
          status: data.status || 'pending',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      });
      return invitations;
    } catch (err) {
      console.error('FirebaseStoreRiderRepository.getPendingInvitations failed:', err);
      throw err;
    }
  }

  async respondToInvitation(invitationId: string, accept: boolean, riderId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const status = accept ? 'accepted' : 'declined';

      const inviteRef = this.invitationsCollection.doc(invitationId);
      const inviteDoc = await inviteRef.get();
      if (!inviteDoc.exists) {
        throw new Error('Invitation not found.');
      }
      
      const inviteData = inviteDoc.data();
      const storeId = inviteData?.storeId;

      await firestore().runTransaction(async (transaction) => {
        // Update invitation status
        transaction.update(inviteRef, {
          status,
          updatedAt: now,
        });

        // If accepted, link the rider to the store
        if (accept && storeId) {
          const riderRef = this.usersCollection.doc(riderId);
          transaction.update(riderRef, {
            storeId,
            updatedAt: now,
          });
        }
      });
    } catch (err) {
      console.error('FirebaseStoreRiderRepository.respondToInvitation failed:', err);
      throw err;
    }
  }

  async getLinkedRiders(storeId: string): Promise<UserProfile[]> {
    try {
      const snapshot = await this.usersCollection
        .where('storeId', '==', storeId)
        .where('role', '==', 'partner')
        .get();

      const riders: UserProfile[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        riders.push({
          uid: doc.id,
          email: data.email || null,
          displayName: data.displayName || null,
          photoURL: data.photoURL || null,
          role: data.role || null,
          cnpj: data.cnpj,
          address: data.address,
          location: data.location,
          areaInKm: data.areaInKm,
          storeId: data.storeId || null,
          isOnline: data.isOnline !== false,
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      });
      return riders;
    } catch (err) {
      console.error('FirebaseStoreRiderRepository.getLinkedRiders failed:', err);
      throw err;
    }
  }

  async removeRiderLink(storeId: string, riderId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      await this.usersCollection.doc(riderId).update({
        storeId: null,
        updatedAt: now,
      });

      // Update any pending/accepted invitations to declined/cancelled if unlinked
      const snapshots = await this.invitationsCollection
        .where('storeId', '==', storeId)
        .where('status', '==', 'accepted')
        .get();

      const batch = firestore().batch();
      snapshots.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'declined',
          updatedAt: now,
        });
      });
      await batch.commit();
    } catch (err) {
      console.error('FirebaseStoreRiderRepository.removeRiderLink failed:', err);
      throw err;
    }
  }
}
