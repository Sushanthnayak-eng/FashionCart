
import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Category, AgeGroup, Product } from '../types';

const Shop: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<Category | 'All'>('All');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'All'>('All');

  // Strict Filtering Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search filter: Matches name, description, or category keywords
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    // 2. Strict Style (Category) filter
    if (selectedStyle !== 'All') {
      list = list.filter(p => p.category === selectedStyle);
    }

    // 3. Strict Age Group filter
    if (selectedAge !== 'All') {
      list = list.filter(p => p.ageGroup === selectedAge);
    }

    return list;
  }, [products, selectedStyle, selectedAge, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search and Filters Header */}
      <div className="mb-10 space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search dresses, styles, or keywords..."
            className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Personalized Collection</h1>
            <p className="text-gray-500 text-sm">Showing {filteredProducts.length} items</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-400">Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as any)}
                className="block w-full border-gray-200 rounded-xl text-sm focus:ring-pink-500 p-2 border outline-none cursor-pointer"
              >
                <option value="All">All Styles</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Party">Party</option>
                <option value="Ethnic">Ethnic</option>
                <option value="Sleepwear">Sleepwear</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-400">Age Group</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value as any)}
                className="block w-full border-gray-200 rounded-xl text-sm focus:ring-pink-500 p-2 border outline-none cursor-pointer"
              >
                <option value="All">All Ages</option>
                <option value="Kids (0-10)">Kids (0-10)</option>
                <option value="Teens (11-18)">Teens (11-18)</option>
                <option value="Young (19-30)">Young (19-30)</option>
                <option value="Adults (30+)">Adults (30+)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-shadow flex flex-col group animate-in fade-in duration-500">
              <div className="h-72 overflow-hidden relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase text-pink-600 shadow-sm">{product.category}</span>
                  <span className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase text-white shadow-sm">{product.ageGroup}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-pink-600">₹{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition shadow-sm active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4">👗</div>
          <h2 className="text-2xl font-bold text-gray-900">No dresses found.</h2>
          <p className="text-gray-500 mt-2">Try adjusting your filters to find the perfect fit!</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedStyle('All'); setSelectedAge('All'); }}
            className="mt-8 bg-pink-100 text-pink-600 px-6 py-2 rounded-xl font-bold hover:bg-pink-200 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
