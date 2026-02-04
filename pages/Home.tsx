
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="/fashion-hero.png" alt="Fashion Store Collection" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Fashion for <br /><span className="text-pink-500">Everyone.</span></h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl text-gray-300">Discover the latest trends in female fashion for <span className="text-pink-400 font-bold">Kids, Teens, and Adults</span>. Affordable, stylish, and made for you.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-700 transition shadow-lg text-center">Get Started</Link>
            <Link to="/login" className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg text-center">Login to Shop</Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Fashion Store</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We started with a simple vision: to make high-quality fashion accessible to everyone. Our platform connects thousands of artisans and manufacturers directly to customers, cutting out the middleman and providing you with the best prices.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src="/fashion-about.png" alt="Our Fashion Design Team" className="w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              title="Wide Variety"
              desc="Thousands of styles for every age group: Kids, Teens, and Adults."
              icon="🛍️"
            />
            <FeatureCard
              title="Best Prices"
              desc="Direct-to-consumer model ensuring unbeatable value for money."
              icon="💰"
            />
            <FeatureCard
              title="Secure Checkout"
              desc="Safe and reliable payment gateway for worry-free shopping."
              icon="🔒"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-8 border rounded-2xl hover:shadow-md transition bg-gray-50 group">
    <div className="text-4xl mb-4 transform group-hover:scale-110 transition">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
