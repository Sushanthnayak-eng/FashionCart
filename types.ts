
export type Role = 'USER' | 'ADMIN';

export type Category = 'Casual' | 'Formal' | 'Party' | 'Ethnic' | 'Sleepwear';
export type AgeGroup = 'Kids (0-10)' | 'Teens (11-18)' | 'Young (19-30)' | 'Adults (30+)';

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
