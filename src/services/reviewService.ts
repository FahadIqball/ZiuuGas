import { ReviewRepository } from '../features/review/services/ReviewRepository';
import { FirebaseReviewRepository } from '../features/review/services/FirebaseReviewRepository';

export const reviewRepository: ReviewRepository = new FirebaseReviewRepository();
export default reviewRepository;
