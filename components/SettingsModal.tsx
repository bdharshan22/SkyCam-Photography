import React, { useState, useEffect } from 'react';
import { X, Bell, Moon, Check, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    // Preferences State
    const [notifications, setNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(false);

    // Initialize from LocalStorage
    useEffect(() => {
        const savedDark = localStorage.getItem('skycam_dark_mode') === 'true';
        const savedNotif = localStorage.getItem('skycam_notifications') === 'true';
        const savedEmail = localStorage.getItem('skycam_email_alerts') === 'true';

        setDarkMode(savedDark);
        setNotifications(savedNotif);
        setEmailAlerts(savedEmail);

        // Apply Dark Mode immediately on mount
        if (savedDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Handlers
    const toggleDarkMode = () => {
        const newVal = !darkMode;
        setDarkMode(newVal);
        localStorage.setItem('skycam_dark_mode', String(newVal));
        if (newVal) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleNotifications = () => {
        const newVal = !notifications;
        setNotifications(newVal);
        localStorage.setItem('skycam_notifications', String(newVal));
    };

    const toggleEmailAlerts = () => {
        const newVal = !emailAlerts;
        setEmailAlerts(newVal);
        localStorage.setItem('skycam_email_alerts', String(newVal));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-zinc-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Profile Badge */}
                    <div className="flex items-center space-x-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                        <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Admin Account</p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{user?.email}</p>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Preferences</h3>

                        <div className="flex items-center justify-between group cursor-pointer" onClick={toggleNotifications}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${notifications ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                                    <Bell size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Push Notifications</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-500">Receive alerts for new leads</p>
                                </div>
                            </div>
                            <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between group cursor-pointer" onClick={toggleEmailAlerts}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${emailAlerts ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                                    <Check size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Email Reports</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-500">Daily summary to your inbox</p>
                                </div>
                            </div>
                            <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${emailAlerts ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between group cursor-pointer" onClick={toggleDarkMode}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 dark:bg-yellow-400/10 dark:text-yellow-400' : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                                    <Moon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Dark Mode</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-500">Easier on the eyes</p>
                                </div>
                            </div>
                            <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
