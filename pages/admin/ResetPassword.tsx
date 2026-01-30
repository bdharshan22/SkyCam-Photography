import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Lock, Eye, EyeOff, Save, Loader2, Check, KeyRound } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [sessionValid, setSessionValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setSessionValid(true);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!sessionValid) {
            setMessage({ text: 'Session expired. Request a new link.', type: 'error' });
            return;
        }

        if (password.length < 6) {
            setMessage({ text: 'Password too short (min 6 chars)', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setMessage({ text: 'Passsword Updated! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/admin/login'), 2000);
        } catch (err: any) {
            setMessage({ text: err.message || 'Update failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black font-sans">
            {/* Background Image & Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop")', // Dark moody background
                }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden p-8 animate-fade-in-up">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Reset Password</h2>
                        <p className="text-gray-400 text-sm font-medium">Enter your new secure password below.</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        {/* New Password Field */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">New Password *</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1.5 pl-1">Must be at least 6 characters long.</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Confirm Password *</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Check className={`h-5 w-5 transition-colors duration-300 ${password && confirmPassword && password === confirmPassword ? 'text-emerald-500' : 'text-gray-500'}`} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`block w-full pl-10 pr-10 py-3 bg-black/40 border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all text-sm ${password && confirmPassword && password === confirmPassword ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500' : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Status Message */}
                        {message && (
                            <div className={`p-3 rounded-lg text-xs text-center font-bold tracking-wide ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                {message.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all font-bold text-sm flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
