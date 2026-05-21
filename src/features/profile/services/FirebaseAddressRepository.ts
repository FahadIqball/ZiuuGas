import firestore from '@react-native-firebase/firestore';
import { AddressRepository } from './AddressRepository';
import { Address } from './types';

export class FirebaseAddressRepository implements AddressRepository {
  private getCollection(userId: string) {
    return firestore()
      .collection('users')
      .doc(userId)
      .collection('addresses');
  }

  async getAddresses(userId: string): Promise<Address[]> {
    try {
      const snapshot = await this.getCollection(userId).get();
      if (snapshot.empty) {
        const defaults: Address[] = [
          {
            id: 'addr1',
            street: '44 W 12th St',
            city: 'New York',
            state: 'NY',
            zipCode: '13011',
            country: 'USA',
            isDefault: true,
          },
          {
            id: 'addr2',
            street: '47 W 13th St',
            city: 'New York',
            state: 'NY',
            zipCode: '10011',
            country: 'USA',
            isDefault: false,
          }
        ];
        
        const batch = firestore().batch();
        for (const addr of defaults) {
          const docRef = this.getCollection(userId).doc(addr.id);
          batch.set(docRef, addr);
        }
        await batch.commit();
        return defaults;
      }

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          house: data.house || '',
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: data.country || '',
          isDefault: !!data.isDefault,
        };
      });
    } catch (err) {
      console.error('FirebaseAddressRepository.getAddresses failed:', err);
      throw err;
    }
  }

  async saveAddress(userId: string, address: Address): Promise<void> {
    try {
      const docRef = this.getCollection(userId).doc(address.id || undefined);
      const dataToSave = {
        ...address,
        id: docRef.id,
      };
      
      if (address.isDefault) {
        const snapshot = await this.getCollection(userId).where('isDefault', '==', true).get();
        const batch = firestore().batch();
        snapshot.docs.forEach(doc => {
          if (doc.id !== docRef.id) {
            batch.update(doc.ref, { isDefault: false });
          }
        });
        batch.set(docRef, dataToSave, { merge: true });
        await batch.commit();
      } else {
        await docRef.set(dataToSave, { merge: true });
      }
    } catch (err) {
      console.error('FirebaseAddressRepository.saveAddress failed:', err);
      throw err;
    }
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      await this.getCollection(userId).doc(addressId).delete();
    } catch (err) {
      console.error('FirebaseAddressRepository.deleteAddress failed:', err);
      throw err;
    }
  }
}
