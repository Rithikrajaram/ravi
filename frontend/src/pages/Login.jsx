import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, reset } from '../store/slices/authSlice';
import { Target, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) navigate('/');
        return () => dispatch(reset());
    }, [user, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            dispatch(login({
                email: formData.email,
                password: formData.password
            }));
        } else {
            if (formData.password !== formData.confirmPassword) {
                // Ideally set an error state here, but for now rely on alert or just failing
                alert("Passwords do not match");
                return;
            }
            dispatch(register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }));
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        dispatch(reset());
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 blur-[100px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md p-8 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary-600 p-3 rounded-2xl mb-4 shadow-xl shadow-primary-600/20">
                        <Target className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin
                            ? 'Please enter your details to sign in'
                            : 'Join Task Nexus to manage your tasks'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        required={!isLogin}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all placeholder-gray-500"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all placeholder-gray-500"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all placeholder-gray-500"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        required={!isLogin}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all placeholder-gray-500"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isError && <p className="text-rose-400 text-xs text-center">{typeof message === 'string' ? message : 'Authentication failed'}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (isLogin ? 'Signing in...' : 'Creating Account...') : (
                            <>
                                {isLogin ? 'Sign In' : 'Sign Up'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={toggleMode}
                        className="text-primary-400 cursor-pointer hover:underline focus:outline-none font-medium"
                    >
                        {isLogin ? 'Sign up for free' : 'Sign in'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Auth;
