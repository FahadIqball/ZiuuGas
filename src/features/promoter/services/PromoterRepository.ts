import { ReferralItem, PromoterMetrics, PayoutRequest } from '../types';

export interface PromoterRepository {
  getPromoterMetrics(promoterId: string): Promise<PromoterMetrics>;
  getReferralsList(promoterId: string): Promise<ReferralItem[]>;
  requestPayout(promoterId: string, amount: number, pixKey: string): Promise<void>;
  getPayoutsList(promoterId: string): Promise<PayoutRequest[]>;
}
