
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from '../db/firebase';
import { Product, Order } from '../types';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Listen to products
    const qProducts = query(collection(db, 'products'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList);
    });

    // Listen to orders
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
      })) as Order[];
      setOrders(orderList);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const addProduct = async (p: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), {
      ...p,
      createdAt: serverTimestamp()
    });
  };

  const updateProduct = async (id: string, updated: Omit<Product, 'id'>) => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updated);
  };

  const placeOrder = async (o: Omit<Order, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'orders'), {
      ...o,
      createdAt: serverTimestamp()
    });
  };

  return (
    <ProductContext.Provider value={{ products, orders, addProduct, updateProduct, placeOrder }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
