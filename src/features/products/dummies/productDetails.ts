import { IMAGES } from "../../../assets";

export interface Review {
    id: string;
    userName: string;
    avatar: any;
    rating: number;
    time: string;
    comment: string;
}

export interface SellerInfo {
    name: string;
    avatar: any;
    positiveRatings: string;
    shippingOnTime: string;
}

export interface ProductDetails {
    id: string;
    name: string;
    price: string;
    rating: number;
    reviewCount: number;
    image: any;
    imageRaw?: string;
    sellerId?: string;
    description: string;
    seller: SellerInfo;
    reviews: Review[];
    productKey?: string;
    weight?: string;
}

export const MOCK_PRODUCT_DETAILS: ProductDetails = {
    id: '1',
    name: 'Gas Tank Barometer',
    price: '20',
    rating: 4.5,
    reviewCount: 150,
    image: IMAGES.GAS_BAROMETER,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    seller: {
        name: 'Gas Store',
        avatar: IMAGES.NOTIFICATION_CYLINDER, // Using existing assets
        positiveRatings: '90%',
        shippingOnTime: '90%',
    },
    reviews: [
        {
            id: 'r1',
            userName: 'Haris',
            avatar: IMAGES.MAN2,
            rating: 4,
            time: '2daysago',
            comment: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
        }
    ]
};
