import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Lock, ArrowRight, Camera, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });
            if (error) throw error;
            setError('Recovery email sent! Please check your inbox.');
        } catch (err: any) {
            setError(err.message || 'Failed to send recovery email');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('skycam_remembered_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (rememberMe) {
            localStorage.setItem('skycam_remembered_email', email);
        } else {
            localStorage.removeItem('skycam_remembered_email');
        }

        try {
            if (!supabase) throw new Error('Supabase client not initialized');

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    if (isForgotPassword) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Background with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop")',
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-serif text-white mb-2">Reset Password</h2>
                            <p className="text-gray-300 text-sm font-sans">Enter your email to receive a recovery link.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                    placeholder="admin@skycam.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className={`p-3 rounded-lg text-center text-sm border ${error.includes('sent') ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200' : 'bg-red-500/10 border-red-500/50 text-red-200'}`}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition-all font-semibold text-sm disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Recovery Link'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => { setIsForgotPassword(false); setError(''); }}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 animate-fade-in-up">
                    <div className="flex justify-center mb-8">
                        <div className="h-16 w-16 bg-brand-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-600/30">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif text-white mb-2">Admin Portal</h2>
                        <p className="text-gray-300 text-sm font-sans">Enter your credentials to access the dashboard</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin} autoComplete="off">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="off"
                                    className="block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                    placeholder="admin@skycam.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="new-password"
                                        className="block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded bg-black/20 border-white/10"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center">
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-500 transition-all shadow-lg hover:shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <Lock className="h-5 w-5 text-brand-200 group-hover:text-white transition-colors" />
                                )}
                            </span>
                            {loading ? 'Authenticating...' : 'Sign In'}
                            {!loading && <ArrowRight className="absolute right-3 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                        >
                            Forgot your password?
                        </button>
                        <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-gray-400 pb-0.5">
                            Back to Website
                        </a>
                    </div>
                </div>
                <p className="text-center text-gray-500 text-xs mt-8 font-sans">
                    &copy; {new Date().getFullYear()} SkyCam Photography. Secure Admin System.
                </p>
            </div>
        </div>
    );
};

export default Login;
