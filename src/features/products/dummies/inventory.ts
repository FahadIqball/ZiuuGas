import { IMAGES, SVG } from '../../../assets';

export const CATEGORIES = [
  {
    id: '1',
    title: 'Gas Cylinder',
    icon: SVG.Gas,
  },
  {
    id: '2',
    title: 'Water Can',
    icon: SVG.Water,
  },
  {
    id: '3',
    title: 'Refill',
    icon: SVG.Refill,
  },
  {
    id: '4',
    title: 'Accessories',
    icon: SVG.Accessories,
  },
];

export const INVENTORY_ITEMS = [
  {
    id: '1',
    title: 'Weight 13kg Gas',
    stock: 36,
    price: 20,
    image: IMAGES.CYLINDER_1,
  },
  {
    id: '2',
    title: 'Weight 13kg Gas',
    stock: 36,
    price: 20,
    image: IMAGES.CYLINDER_2,
  },
  {
    id: '3',
    title: 'Weight 5 liter Aqua Mineral',
    stock: 32,
    price: 30,
    image: IMAGES.WATER_1,
  },
];
