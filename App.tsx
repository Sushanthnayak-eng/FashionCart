
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/shop" element={
                    <ProtectedRoute>
                      <Shop />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <footer className="bg-gray-900 text-white py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                      <h3 className="text-xl font-bold text-pink-500 mb-4 tracking-tight">FashionStore</h3>
                      <p className="text-gray-400">Making the world more fashionable, one outfit at a time. High quality, affordable styles for all.</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Quick Links</h4>
                      <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                        <li><a href="#/admin-login" className="hover:text-pink-500 transition">Admin Portal</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Support</h4>
                      <p className="text-gray-400">support@fashionstore.com</p>
                      <p className="text-gray-400">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Fashion Store. Built for Students.
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
