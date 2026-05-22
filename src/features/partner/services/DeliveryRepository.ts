import { DeliveryJob } from '../types';

export interface DeliveryRepository {
  getAvailableJobs(areaInKm: number, location: string): Promise<DeliveryJob[]>;
  acceptJob(jobId: string, riderId: string): Promise<void>;
  pickupOrder(orderId: string): Promise<void>;
  updateRiderLocation(riderId: string, lat: number, lng: number): Promise<void>;
  verifyDeliveryOTP(orderId: string, otp: string): Promise<boolean>;
  getCompletedDeliveries(riderId: string): Promise<DeliveryJob[]>;
}
