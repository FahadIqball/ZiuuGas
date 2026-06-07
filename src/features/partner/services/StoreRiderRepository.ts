import { UserProfile } from '../../auth/services/types';

export interface StoreRiderInvitation {
  id: string;
  storeId: string;
  storeName: string;
  riderEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface StoreRiderRepository {
  /**
   * Sends an invitation from a store to a rider via their email.
   */
  sendInvitation(storeId: string, storeName: string, riderEmail: string): Promise<void>;

  /**
   * Retrieves all pending invitations for a given rider's email.
   */
  getPendingInvitations(riderEmail: string): Promise<StoreRiderInvitation[]>;

  /**
   * Responds (Accept or Decline) to a store invitation.
   */
  respondToInvitation(invitationId: string, accept: boolean, riderId: string): Promise<void>;

  /**
   * Retrieves all delivery riders linked to a specific store.
   */
  getLinkedRiders(storeId: string): Promise<UserProfile[]>;

  /**
   * Unlinks a delivery rider from a store.
   */
  removeRiderLink(storeId: string, riderId: string): Promise<void>;
}
