import { IMAGES } from "../../../assets";

export interface CartItem {
    id: string;
    title: string;
    rating: string;
    price: string;
    image: any;
}

export const MOCK_CART_ITEMS: CartItem[] = [
    {
        id: '1',
        title: "Gas tank Barometer",
        rating: "4.5",
        price: "20",
        image: IMAGES.GAS_BAROMETER,
    },
    {
        id: '2',
        title: "Gas pressure Regulator",
        rating: "4.5",
        price: "15",
        image: IMAGES.GAS_REGULATOR,
    }
];
