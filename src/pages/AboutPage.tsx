import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface AboutPageProps {
    setCurrentPage: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-black text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-rose-600 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="text-rose-500 font-bold tracking-widest uppercase mb-4 block">Our Story</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-8">Redefining Fashion</h1>
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                        Fashion Cart is more than just a store. It's a movement towards self-expression,
                        where every piece tells a story of craftsmanship and modern elegance.
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Why Fashion Matters</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Fashion is the armor to survive the reality of everyday life. In a world that
                                constantly changes, your style remains your most powerful form of communication.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We stay ahead of modern trends to ensure you always feel confident,
                                sophisticated, and uniquely yourself.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform">
                                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" alt="Fashion 1" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-xl transform translate-y-8 hover:-translate-y-2 transition-transform">
                                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80" alt="Fashion 2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-10 rounded-3xl border border-gray-100 bg-white shadow-xl hover:shadow-2xl transition-all">
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To revolutionize the online fashion industry by creating a platform that combines
                                cutting-edge technology with personalized styling, making premium fashion accessible to everyone.
                            </p>
                        </div>
                        <div className="p-10 rounded-3xl border border-gray-100 bg-white shadow-xl hover:shadow-2xl transition-all">
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To empower individuals through fashion by curating the finest collections and
                                providing seamless shopping experiences that inspire confidence and creativity.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Button */}
                    <div className="mt-24 text-center">
                        <button
                            onClick={() => setCurrentPage('login')}
                            className="bg-black text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-rose-600 transition-all shadow-xl hover:shadow-rose-200"
                        >
                            Explore Collections
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center mb-6">
                        <ShoppingBag className="h-8 w-8 text-rose-600" />
                        <span className="ml-2 text-2xl font-bold">Fashion Cart</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2026 Fashion Cart. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
