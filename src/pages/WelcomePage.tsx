import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface WelcomePageProps {
    setCurrentPage: (page: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ setCurrentPage }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-white">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden transition-all duration-1000 -z-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col items-center justify-center text-center">
                {/* Animated Brand Logo */}
                <div className="mb-8 animate-bounce">
                    <div className="w-20 h-20 bg-rose-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <ShoppingBag className="h-12 w-12 text-white" />
                    </div>
                </div>

                {/* Brand Name */}
                <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">
                    FASHION <span className="text-rose-600">CART</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-12 font-medium leading-relaxed">
                    Elevate your presence with curated collections that define modern luxury and effortless elegance.
                </p>

                {/* Get Started Button */}
                <button
                    onClick={() => setCurrentPage('about')}
                    className="group relative px-10 py-5 bg-black text-white rounded-full text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                        Get Started
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>

                {/* Aesthetic Detail */}
                <div className="mt-20 flex gap-8 opacity-20 hover:opacity-100 transition-opacity duration-500">
                    <span className="text-sm font-bold tracking-widest uppercase">Elegance</span>
                    <span className="text-sm font-bold tracking-widest uppercase text-rose-600">•</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Innovation</span>
                    <span className="text-sm font-bold tracking-widest uppercase text-purple-600">•</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Style</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
