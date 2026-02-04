
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, setDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../db/firebase';
import { Product, Order } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Listen to products (public read)
    const qProducts = query(collection(db, 'products'));
    const unsubscribeProducts = onSnapshot(qProducts,
      (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productList);
      },
      (error) => {
        console.error("Firestore Products Listener Error:", error.code, error.message);
        if (error.code === 'permission-denied') {
          console.warn("Product access denied. Ensure public read rules are set.");
        }
      }
    );

    // Listen to orders - only when user is authenticated
    let unsubscribeOrders: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Clean up previous orders listener
      if (unsubscribeOrders) {
        unsubscribeOrders();
        unsubscribeOrders = null;
      }

      if (user) {
        // Check if user is admin
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const isAdmin = userDoc.exists() && userDoc.data().role === 'ADMIN';

        // Build query based on role
        let qOrders;
        if (isAdmin) {
          // Admin can see all orders
          qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        } else {
          // Regular users only see their own orders
          qOrders = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        }

        unsubscribeOrders = onSnapshot(qOrders,
          (snapshot) => {
            const orderList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
            })) as Order[];
            setOrders(orderList);
          },
          (error) => {
            console.error("Firestore Orders Listener Error:", error.code, error.message);
            if (error.code === 'permission-denied') {
              console.warn("Order access denied. Check Firestore rules.");
            }
          }
        );
      } else {
        // User not logged in, clear orders
        setOrders([]);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeAuth();
      if (unsubscribeOrders) {
        unsubscribeOrders();
      }
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

  const deleteProduct = async (id: string) => {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  };

  const placeOrder = async (o: Omit<Order, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'orders'), {
      ...o,
      createdAt: serverTimestamp()
    });
  };

  const clearAllData = async () => {
    try {
      // Clear Products
      const productsSnap = await getDocs(collection(db, 'products'));
      const productDeletions = productsSnap.docs.map(d => deleteDoc(doc(db, 'products', d.id)));

      // Clear Orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const orderDeletions = ordersSnap.docs.map(d => deleteDoc(doc(db, 'orders', d.id)));

      await Promise.all([...productDeletions, ...orderDeletions]);

      // Clear local browser storage relevant to the app
      localStorage.clear();
      sessionStorage.clear();

      console.log("Database and Browser storage cleared successfully");
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, placeOrder, clearAllData }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
