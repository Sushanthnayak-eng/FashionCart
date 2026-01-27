
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../db/firebase';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Strict role check for Admin Portal
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'ADMIN') {
        navigate('/admin');
      } else {
        await auth.signOut(); // Log out non-admin users
        setError('Unauthorized access. Only administrators can enter this portal.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in as admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-10 rounded-3xl border-2 border-pink-100 shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-full -mr-10 -mt-10"></div>

        <div className="relative">
          <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mb-8 font-medium">Secure access for fashion store managers only.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Admin ID / Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-pink-500 transition-colors"
                placeholder="admin@fashionstore.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Access Token / Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-pink-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-xl transform active:scale-95 disabled:opacity-50">
              {loading ? 'Securing Access...' : 'Secure Login'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-400 hover:text-pink-600 font-medium transition">
              Are you a user? Go to Customer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
