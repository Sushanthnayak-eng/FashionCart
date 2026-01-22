import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';

// ==========================================
// UTILITY FUNCTIONS & CONSTANTS
// ==========================================

const STORAGE_KEYS = {
  USERS: 'stylesphere_users',
  CURRENT_USER: 'stylesphere_current_user'
};

// Initialize storage
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
};

// User management functions
const saveUser = (userData) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  users.push({ ...userData, id: Date.now() });
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const findUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  return users.find(u => u.email === email && u.password === password);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
};

const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// ==========================================
// HEADER COMPONENT
// ==========================================

const Header = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <ShoppingBag className="h-8 w-8 text-rose-600 group-hover:text-rose-700 transition-colors" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              StyleSphere
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentPage('about')}
              className={`text-gray-700 hover:text-rose-600 transition-colors font-medium ${
                currentPage === 'about' ? 'text-rose-600' : ''
              }`}
            >
              About
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-rose-50 rounded-lg">
                  <User className="h-4 w-4 text-rose-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden py-4 space-y-3">
            <button
              onClick={() => {
                setCurrentPage('about');
                setMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50 rounded-lg"
            >
              About
            </button>
            {user ? (
              <>
                <div className="px-4 py-2 bg-rose-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentPage('login');
                    setMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('signup');
                    setMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

// ==========================================
// SIGNUP PAGE
// ==========================================

const SignUpPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const userExists = users.find(u => u.email === formData.email);

      if (userExists) {
        setErrors({ email: 'Email already registered' });
        return;
      }

      saveUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setSuccess(true);
      setTimeout(() => {
        setCurrentPage('login');
      }, 2000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join StyleSphere and discover your style</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Created!</h3>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all`}
                  placeholder="Create a strong password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-rose-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Account
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentPage('login')}
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// LOGIN PAGE
// ==========================================

const LoginPage = ({ setCurrentPage, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length === 0) {
      const user = findUser(formData.email, formData.password);

      if (user) {
        setCurrentUser(user);
        onLogin(user);
        setCurrentPage('home');
      } else {
        setLoginError('Invalid email or password');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-rose-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your style journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-rose-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-rose-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('signup')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ABOUT PAGE
// ==========================================

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About StyleSphere</h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            Your premier destination for discovering and expressing your unique style
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To revolutionize the online fashion industry by creating a platform that combines cutting-edge technology with personalized styling, making premium fashion accessible to everyone while celebrating individual expression.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower individuals through fashion by curating the finest collections, providing seamless shopping experiences, and fostering a community where style meets sustainability and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose StyleSphere?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Curated Collections</h4>
              <p className="text-gray-600">
                Handpicked pieces from emerging and established designers, ensuring quality and uniqueness in every item.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h4>
              <p className="text-gray-600">
                Competitive pricing with regular promotions and exclusive deals for our loyal community members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure Shopping</h4>
              <p className="text-gray-600">
                Advanced encryption and secure payment gateways to protect your information and transactions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h4>
              <p className="text-gray-600">
                Express shipping options with real-time tracking to get your fashion finds to you quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Easy Returns</h4>
              <p className="text-gray-600">
                Hassle-free 30-day return policy because your satisfaction is our top priority.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h4>
              <p className="text-gray-600">
                Dedicated customer service team available around the clock to assist with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Passionate individuals dedicated to bringing you the best fashion experience
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-rose-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">SK</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">Sarah Kim</h4>
              <p className="text-rose-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Fashion industry veteran with 15+ years of experience in retail innovation
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-rose-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">MP</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">Michael Park</h4>
              <p className="text-purple-600 font-medium mb-2">Head of Design</p>
              <p className="text-gray-600 text-sm">
                Award-winning designer focused on creating seamless user experiences
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-rose-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">EJ</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">Emma Johnson</h4>
              <p className="text-rose-600 font-medium mb-2">Chief Technology Officer</p>
              <p className="text-gray-600 text-sm">
                Tech innovator building the future of digital fashion commerce
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <ShoppingBag className="h-8 w-8 text-rose-500" />
            <span className="ml-2 text-2xl font-bold">StyleSphere</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your premier destination for fashion excellence
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 StyleSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// ==========================================
// HOME PAGE (Temporary Landing)
// ==========================================

const HomePage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              StyleSphere
            </span>
          </h1>
          {user && (
            <p className="text-2xl text-gray-700 mb-8">
              Hello, <span className="font-semibold text-rose-600">{user.name}</span>! 👋
            </p>
          )}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover your unique style with our curated collection of premium fashion
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Phase 1 Complete! 🎉</h3>
            <p className="text-gray-600 mb-6">
              Authentication and About pages are ready. Coming soon:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs">•</span>
                </div>
                <span className="text-gray-700">Product Categories</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs">•</span>
                </div>
                <span className="text-gray-700">Shopping Cart</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs">•</span>
                </div>
                <span className="text-gray-700">Product Listings</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs">•</span>
                </div>
                <span className="text-gray-700">Checkout Process</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs">•</span>
                </div>
                <span className="text-gray-700">User Profile</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs">•</span>
                </div>
                <span className="text-gray-700">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    initStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && <HomePage user={user} />}
      {currentPage === 'signup' && <SignUpPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />}
      {currentPage === 'about' && <AboutPage />}
    </div>
  );
}