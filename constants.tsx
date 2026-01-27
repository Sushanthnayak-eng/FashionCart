
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Casual Summer Shirt',
    price: 899,
    description: 'Lightweight cotton shirt for summer outings.',
    category: 'Men',
    ageGroup: 'Adults',
    imageUrl: 'https://picsum.photos/seed/shirt1/400/500'
  },
  {
    id: '2',
    name: 'Floral Evening Dress',
    price: 1299,
    description: 'Elegant floral dress for evening parties.',
    category: 'Women',
    ageGroup: 'Adults',
    imageUrl: 'https://picsum.photos/seed/dress1/400/500'
  },
  {
    id: '3',
    name: 'Kids Graphic T-Shirt',
    price: 499,
    description: 'Fun graphic tee for energetic kids.',
    category: 'Kids',
    ageGroup: 'Kids',
    imageUrl: 'https://picsum.photos/seed/kids1/400/500'
  },
  {
    id: '4',
    name: 'Teen Denim Jacket',
    price: 1899,
    description: 'Stylish denim jacket for modern teens.',
    category: 'Unisex',
    ageGroup: 'Teens',
    imageUrl: 'https://picsum.photos/seed/denim1/400/500'
  }
];

export const ADMIN_CREDENTIALS = {
  email: 'admin@fashionstore.com',
  password: 'adminpassword123'
};
