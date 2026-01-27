
export type Role = 'USER' | 'ADMIN';

export type Category = 'Men' | 'Women' | 'Kids' | 'Unisex';
export type AgeGroup = 'Kids' | 'Teens' | 'Adults';

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  ageGroup: AgeGroup;
  imageUrl: string;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  address: Address;
  status: 'Pending' | 'Paid' | 'Shipped';
  createdAt: string;
}
