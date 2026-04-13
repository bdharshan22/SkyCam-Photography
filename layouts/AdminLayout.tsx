import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Settings, Menu, X, LayoutDashboard, ChevronRight, Image, Package, MessageSquare } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import { Camera } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const isPublicAdminRoute = location.pathname === '/admin/login' || location.pathname === '/admin/reset-password';

    if (isPublicAdminRoute) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
            {/* Background Ambience (Dark Mode Only) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar / Navigation */}
            <nav className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Camera size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">SkyCam</h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium">Admin Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                        {/* Analytics */}
                        <p className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Analytics</p>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${location.pathname === '/admin/dashboard' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <LayoutDashboard size={20} className={location.pathname === '/admin/dashboard' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'} />
                            Dashboard
                            {location.pathname === '/admin/dashboard' && <ChevronRight size={16} className="ml-auto opacity-50" />}
                        </button>

                        {/* Content CMS */}
                        <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Content CMS</p>
                        {[
                            { path: '/admin/cms/portfolio', label: 'Portfolio', Icon: Image },
                            { path: '/admin/cms/packages', label: 'Packages', Icon: Package },
                            { path: '/admin/cms/reviews', label: 'Reviews', Icon: MessageSquare },
                        ].map(({ path, label, Icon }) => (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${location.pathname === path ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <Icon size={20} className={location.pathname === path ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'} />
                                {label}
                                {location.pathname === path && <ChevronRight size={16} className="ml-auto opacity-50" />}
                            </button>
                        ))}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm relative">
                                <span className="font-bold text-emerald-600 dark:text-emerald-500">{user?.email?.[0].toUpperCase()}</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => navigate('/')}
                                className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 shadow-sm dark:shadow-none"
                                title="Website"
                            >
                                <Home size={18} />
                                <span className="text-[10px] mt-1">Home</span>
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 shadow-sm dark:shadow-none"
                                title="Settings"
                            >
                                <Settings size={18} />
                                <span className="text-[10px] mt-1">Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all border border-red-200 dark:border-red-500/10 hover:border-red-300 dark:hover:border-red-500/20"
                                title="Logout"
                            >
                                <LogOut size={18} />
                                <span className="text-[10px] mt-1">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                        <Camera size={16} />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">SkyCam</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Main Content */}
            <main className={`transition-all duration-300 ease-in-out md:ml-64 p-4 sm:p-8 min-h-screen relative z-10 ${isMobileMenuOpen ? 'blur-sm md:blur-none' : ''}`}>
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default AdminLayout;
