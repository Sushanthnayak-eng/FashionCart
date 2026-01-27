
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-600 tracking-tight">FashionStore</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-pink-600">Home</Link>
            {user && <Link to="/shop" className="text-gray-600 hover:text-pink-600">Shop</Link>}
            {isAdmin && <Link to="/admin" className="text-pink-600 font-semibold">Admin Panel</Link>}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-pink-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-700 border px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-pink-600 px-4 py-2">Login</Link>
                <Link to="/signup" className="text-sm font-medium bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
