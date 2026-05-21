import { Address } from './types';

export interface AddressRepository {
  /**
   * Fetches all registered addresses for a given user.
   */
  getAddresses(userId: string): Promise<Address[]>;

  /**
   * Adds or updates a user's address.
   */
  saveAddress(userId: string, address: Address): Promise<void>;

  /**
   * Deletes an address.
   */
  deleteAddress(userId: string, addressId: string): Promise<void>;
}
