
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Browse our collection and find something you love!</p>
        <Link to="/shop" className="bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10">Your Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border flex items-center space-x-6">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category} • {item.ageGroup}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-100 border-r">-</button>
                    <span className="px-4 py-1 font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-100 border-l">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-medium hover:underline">Remove</button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">₹{item.price * item.quantity}</span>
                <p className="text-xs text-gray-400">₹{item.price} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border h-fit shadow-sm space-y-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-2 border-b pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition"
          >
            Proceed to Checkout
          </button>
          <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-gray-700">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
