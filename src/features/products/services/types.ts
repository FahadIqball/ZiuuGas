export interface Review {
  id: string;
  userName: string;
  avatar?: any;
  rating: number;
  time: string;
  comment: string;
}

export interface SellerInfo {
  name: string;
  avatar?: any;
  positiveRatings?: string;
  shippingOnTime?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  subtitle?: string;
  stock: number;
  price: number;
  image?: any;
  description?: string;
  weight?: string;
  sellerId: string;
  seller?: SellerInfo;
  reviews?: Review[];
  createdAt?: any;
  updatedAt?: any;
}
