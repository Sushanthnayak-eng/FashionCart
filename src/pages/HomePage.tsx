import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HomePageProps {
    user: any;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Dashboard Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            Dashboard
                        </h1>
                        <p className="text-gray-500">Welcome back to your style sanctuary.</p>
                    </div>
                    {user && (
                        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Verified Style Member</p>
                                <p className="font-bold text-gray-900">{user.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats / Greeting */}
                <div className="bg-black rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80" alt="Fashion Background" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <span className="bg-rose-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">Member Exclusive</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">The New Season is Here.</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Curated specifically for your style preferences. Explore the latest drops and trend-setting silhouettes.
                        </p>
                        <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-rose-600 hover:text-white transition-all transform hover:scale-105 shadow-xl">
                            Browse Collection
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 transition-colors">
                            <ShoppingBag className="text-rose-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Order History</h3>
                        <p className="text-gray-500 leading-relaxed">Track your latest style investments and view purchase details.</p>
                    </div>

                    <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Wishlist</h3>
                        <p className="text-gray-500 leading-relaxed">Your saved favorites are waiting for you. Don't let them go.</p>
                    </div>

                    <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                            <span className="text-2xl">👤</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Profile Settings</h3>
                        <p className="text-gray-500 leading-relaxed">Manage your account, preferences, and style profile.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
