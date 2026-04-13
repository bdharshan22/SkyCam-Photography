import React, { useEffect, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';

const ScreenshotProtection: React.FC = () => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const toggleObscure = (obscure: boolean) => {
            if (overlayRef.current) {
                if (obscure) {
                    overlayRef.current.style.opacity = '1';
                    overlayRef.current.style.pointerEvents = 'auto';
                } else {
                    overlayRef.current.style.opacity = '0';
                    overlayRef.current.style.pointerEvents = 'none';
                }
            }
        };

        const triggerFlash = () => {
            toggleObscure(true);
            setTimeout(() => toggleObscure(false), 3000);
        };

        // Obscure on visibility change
        const handleVisibilityChange = () => {
            toggleObscure(document.hidden);
        };

        // Prevent common keyboard shortcuts for screenshots/printing
        const handleKeyDown = (e: KeyboardEvent) => {
            // Print Screen key
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                navigator.clipboard.writeText('').catch(() => {}); // Attempt to clear clipboard
                e.preventDefault();
                triggerFlash();
            }

            // Windows Snipping Tool: Win + Shift + S
            // Or Mac: Cmd + Shift + S
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                navigator.clipboard.writeText(''); 
                triggerFlash();
            }

            // Command/Ctrl + P (Print)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                triggerFlash();
            }

            // Command/Ctrl + S (Save)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !e.shiftKey) {
                e.preventDefault();
            }

            // Mac Screenshot shortcuts: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
                e.preventDefault();
                triggerFlash();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                navigator.clipboard.writeText('').catch(() => {});
                triggerFlash();
            }
        };

        const handleDragStart = (e: DragEvent) => {
            if (e.target instanceof HTMLImageElement) {
                e.preventDefault();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange, { capture: true });
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        document.addEventListener('keyup', handleKeyUp, { capture: true });
        document.addEventListener('dragstart', handleDragStart, { capture: true });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange, { capture: true });
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
            document.removeEventListener('keyup', handleKeyUp, { capture: true });
            document.removeEventListener('dragstart', handleDragStart, { capture: true });
        };
    }, []);

    useEffect(() => {
        document.body.classList.add('protection-active');
        return () => {
            document.body.classList.remove('protection-active');
        };
    }, []);

    return (
        <div 
            ref={overlayRef}
            className="fixed inset-0 z-[99999] bg-black backdrop-blur-3xl flex flex-col items-center justify-center text-white p-6 transition-opacity duration-0"
            style={{ opacity: 0, pointerEvents: 'none' }}
        >
            <ShieldAlert size={64} className="text-red-500 mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold mb-4 text-center">Privacy Protected</h2>
            <p className="text-gray-400 text-center max-w-md">
                For security and copyright reasons, screenshots, screen recording, and background previews are disabled.
            </p>
        </div>
    );
};

export default ScreenshotProtection;
