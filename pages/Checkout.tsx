
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Address } from '../types';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useProducts();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Address Form State
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (Object.values(address).some(val => (val as string).trim() === '')) {
      alert('Please fill in all shipping details.');
      return;
    }

    setLoading(true);

    try {
      // Create the order in Firestore
      await placeOrder({
        userId: user?.id || 'guest',
        userEmail: user?.email || 'guest@example.com',
        items: cart,
        total: totalPrice,
        address: address,
        status: 'Paid'
      });

      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-7xl animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-gray-500 text-lg">Your order will be shipped to: <br /><strong>{address.street}, {address.city}</strong></p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 shadow-lg"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10">Complete Your Order</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <form onSubmit={handlePayment} className="space-y-6">
            {/* Delivery Address Form */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  required
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Receiver's Full Name"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none border-gray-200"
                />
                <input
                  required
                  name="phone"
                  value={address.phone}
                  onChange={handleInputChange}
                  type="tel"
                  placeholder="Mobile Number (10 digits)"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none border-gray-200"
                />
                <input
                  required
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="House No, Street, Area"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none border-gray-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input required name="city" value={address.city} onChange={handleInputChange} type="text" placeholder="City" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none border-gray-200" />
                  <input required name="state" value={address.state} onChange={handleInputChange} type="text" placeholder="State" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none border-gray-200" />
                </div>
                <input required name="pincode" value={address.pincode} onChange={handleInputChange} type="text" placeholder="Pincode" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none border-gray-200" />
              </div>
            </div>

            {/* Mock Payment */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                Payment Method
              </h2>
              <div className="p-4 border-2 border-pink-500 bg-pink-50 rounded-2xl mb-4">
                <p className="text-pink-800 font-bold">Credit/Debit Card (Safe & Secure)</p>
                <p className="text-xs text-pink-600">This is a mock payment simulator.</p>
              </div>
              <input required type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" className="w-full p-3 border rounded-xl mb-4 outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="MM/YY" className="p-3 border rounded-xl outline-none" />
                <input required type="password" placeholder="CVC" className="p-3 border rounded-xl outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-700 transition disabled:bg-gray-400 shadow-xl disabled:opacity-50"
            >
              {loading ? 'Processing Transaction...' : `Confirm & Pay ₹${totalPrice}`}
            </button>
          </form>
        </div>

        {/* Summary Sticky */}
        <div className="h-fit sticky top-24 space-y-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4">
                    <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.category} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-6 pt-6 space-y-2">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-pink-600 pt-2 border-t mt-2">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
