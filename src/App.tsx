import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import WelcomePage from './pages/WelcomePage';

// ==========================================
// UTILITY FUNCTIONS & CONSTANTS
// ==========================================

const STORAGE_KEYS = {
  USERS: 'fashioncart_users',
  CURRENT_USER: 'fashioncart_current_user'
};

// Initialize storage
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
};

interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

// User management functions
const saveUser = (userData: User) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  users.push({ ...userData, id: Date.now() });
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const findUser = (email: string, password: string): User | undefined => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  return users.find((u: User) => u.email === email && u.password === password);
};

const getCurrentUser = (): User | null => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
};

const setCurrentUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// ==========================================
// HEADER COMPONENT
// ==========================================

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
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
              Fashion Cart
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentPage('about')}
              className={`text-gray-700 hover:text-rose-600 transition-colors font-medium ${currentPage === 'about' ? 'text-rose-600' : ''
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

// Local components moved to src/pages/

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Show header only if user is logged in or if on home/login/signup. 
          Hide it for the immersive Welcome and About flow as per modern fashion site trends. */}
      {currentPage !== 'welcome' && currentPage !== 'about' && (
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Navigation Flow: Welcome -> About -> Login/Signup -> Home */}
      {currentPage === 'welcome' && <WelcomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'about' && <AboutPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'signup' && <AuthPage setCurrentPage={setCurrentPage} onLogin={handleLogin} isLoginMode={false} />}
      {currentPage === 'login' && <AuthPage setCurrentPage={setCurrentPage} onLogin={handleLogin} isLoginMode={true} />}
      {currentPage === 'home' && <HomePage user={user} />}
    </div>
  );
}