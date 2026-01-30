import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hide cursor on touch devices to prevent weirdness
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const moveCursor = (e: MouseEvent) => {
            setIsVisible(true);
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
            if (followerRef.current) {
                // Add a tiny delay/lag for the "follower" feel
                followerRef.current.animate({
                    transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
                }, {
                    duration: 500,
                    fill: "forwards"
                });
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // Check for hoverable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-zoom-in') ||
                target.classList.contains('hover-target')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        // Initial Hide Default Cursor via CSS is handled in global CSS or body style
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.style.cursor = 'auto'; // Restore
        };
    }, []);

    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

    return (
        <>
            {/* Main Small Dot */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-3 h-3 bg-brand-600 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isHovering ? 'scale-[0]' : 'scale-100'}`}
                style={{ marginTop: -6, marginLeft: -6 }}
            />

            {/* Larger Follower Ring */}
            <div
                ref={followerRef}
                className={`
            fixed top-0 left-0 border border-brand-500 rounded-full pointer-events-none z-[9998] 
            transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 mix-blend-difference
            flex items-center justify-center
            ${isVisible ? 'opacity-100' : 'opacity-0'}
            ${isHovering ? 'w-16 h-16 bg-brand-600/20 border-transparent backdrop-blur-[1px]' : 'w-8 h-8 opacity-50'}
            ${isClicking ? 'scale-75' : 'scale-100'}
        `}
                style={{ marginTop: -16, marginLeft: -16 }} // approximate offset compensation
            />
        </>
    );
};

export default CustomCursor;
