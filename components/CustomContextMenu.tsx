import React, { useEffect, useState, useRef } from 'react';
import { Camera, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomContextMenu: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();

            // Calculate position (keep within bounds)
            let x = e.clientX;
            let y = e.clientY;

            const menuWidth = 220;
            const menuHeight = 200;

            if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 20;
            if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 20;

            setPosition({ x, y });
            setVisible(true);
        };

        const handleClick = () => setVisible(false);
        const handleScroll = () => setVisible(false);

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-[10000] w-64 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
            style={{ top: position.y, left: position.x }}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    <Camera size={14} className="text-brand-600" />
                    Skycam Photo
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">© 2026 All Rights Reserved</p>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                    <ShieldCheck size={14} />
                    <span>Images are protected</span>
                </div>

                <button
                    onClick={() => {
                        const el = document.getElementById('contact');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        setVisible(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 rounded-lg transition-colors text-left"
                >
                    <Mail size={14} />
                    <span>Contact for Licensing</span>
                </button>

                <button
                    onClick={() => {
                        window.location.reload();
                        setVisible(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                    <span>Refresh Page</span>
                    <span className="text-[10px] text-gray-400">F5</span>
                </button>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-100 dark:border-white/5">
                <div className="px-3 py-1.5 text-[10px] text-center text-gray-400">
                    Designed with ❤️ by Skycam
                </div>
            </div>
        </div>
    );
};

export default CustomContextMenu;
