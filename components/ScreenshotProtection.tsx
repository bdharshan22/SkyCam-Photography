import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

const ScreenshotProtection: React.FC = () => {
    const [isObscured, setIsObscured] = useState(false);

    useEffect(() => {
        // Obscure on blur or visibility change (for app switchers and some screen recording)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsObscured(true);
            } else {
                setIsObscured(false);
            }
        };

        const handleBlur = () => {
            setIsObscured(true);
        };

        const handleFocus = () => {
            setIsObscured(false);
        };

        // Prevent common keyboard shortcuts for screenshots/printing
        const handleKeyDown = (e: KeyboardEvent) => {
            // Print Screen key
            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText(''); // Attempt to clear clipboard
                e.preventDefault();
                setIsObscured(true);
                setTimeout(() => setIsObscured(false), 3000);
            }

            // Command/Ctrl + P (Print)
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
            }

            // Command/Ctrl + S (Save)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
            }

            // Mac Screenshot shortcuts: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
                e.preventDefault();
                setIsObscured(true);
                setTimeout(() => setIsObscured(false), 3000);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText('');
            }
        };

        // Prevent drag copying of images
        const handleDragStart = (e: DragEvent) => {
            if (e.target instanceof HTMLImageElement) {
                e.preventDefault();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    // Also using CSS classes injected here for document-wide protection
    useEffect(() => {
        document.body.classList.add('protection-active');
        return () => {
            document.body.classList.remove('protection-active');
        };
    }, []);

    if (!isObscured) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-black backdrop-blur-3xl flex flex-col items-center justify-center text-white p-6">
            <ShieldAlert size={64} className="text-red-500 mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold mb-4 text-center">Privacy Protected</h2>
            <p className="text-gray-400 text-center max-w-md">
                For security and copyright reasons, screenshots, screen recording, and background previews are disabled.
            </p>
        </div>
    );
};

export default ScreenshotProtection;
