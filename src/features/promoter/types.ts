export interface ReferralItem {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: 'active' | 'pending';
}

export interface PromoterMetrics {
  totalSignups: number;
  totalCommissions: number;
  referralCode: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  pixKey: string;
}
