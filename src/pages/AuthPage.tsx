import React, { useState } from 'react';

interface AuthPageProps {
    setCurrentPage: (page: string) => void;
    onLogin: (user: any) => void;
    isLoginMode?: boolean;
}

const STORAGE_KEYS = {
    USERS: 'fashioncart_users',
    CURRENT_USER: 'fashioncart_current_user'
};

const AuthPage: React.FC<AuthPageProps> = ({ setCurrentPage, onLogin, isLoginMode = true }) => {
    const [isLogin, setIsLogin] = useState(isLoginMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [loginError, setLoginError] = useState('');

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!isLogin && !formData.name.trim()) newErrors.name = 'Full name is required';
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
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            if (isLogin) {
                const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
                if (user) {
                    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
                    onLogin(user);
                    setCurrentPage('home');
                } else {
                    setLoginError('Invalid email or password');
                }
            } else {
                const userExists = users.find((u: any) => u.email === formData.email);
                if (userExists) {
                    setErrors({ email: 'Email already registered' });
                    return;
                }
                const newUser = { name: formData.name, email: formData.email, password: formData.password, id: Date.now() };
                users.push(newUser);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                setSuccess(true);
                setTimeout(() => setIsLogin(true), 2000);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setLoginError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-8">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                {success ? (
                    <div className="text-center py-8 text-green-600 font-semibold">Account Created! Redirecting...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input type="text" name="name" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500" placeholder="John Doe" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500" placeholder="you@example.com" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500" placeholder="••••••••" />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input type="password" name="confirmPassword" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500" placeholder="••••••••" />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                        )}
                        <button type="submit" className="w-full bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 transition-colors">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>
                )}
                <p className="text-center mt-6 text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-rose-600 font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
