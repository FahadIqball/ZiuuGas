export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  rating?: number;
  sellerId?: string;
  productKey?: string;
  weight?: string;
}
