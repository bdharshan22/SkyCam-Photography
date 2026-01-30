import React from 'react';

const BionicLogo = ({ className = "w-32 h-32" }: { className?: string }) => {
    return (
        <div className={`relative ${className} flex items-center justify-center`}>
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>

            {/* Counter-Rotating Ring */}
            <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-[spin_15s_linear_infinite_reverse]"></div>

            {/* Main Container */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
                {/* Hexagon Frame */}
                <path
                    d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z"
                    stroke="url(#gradient-border)"
                    strokeWidth="1.5"
                    className="animate-[pulse_3s_ease-in-out_infinite]"
                    opacity="0.8"
                />

                {/* Dynamic Iris / Shutter Blades */}
                <g className="origin-center animate-[spin_8s_ease-in-out_infinite]">
                    {/* Blade 1 */}
                    <path d="M50 50 L50 10 L70 15 Z" fill="#06b6d4" className="opacity-60 mix-blend-screen" />
                    {/* Blade 2 */}
                    <path d="M50 50 L84.6 30 L90 50 Z" fill="#06b6d4" className="opacity-60 mix-blend-screen" />
                    {/* Blade 3 */}
                    <path d="M50 50 L84.6 70 L70 85 Z" fill="#06b6d4" className="opacity-60 mix-blend-screen" />
                    {/* Blade 4 */}
                    <path d="M50 50 L50 90 L30 85 Z" fill="#06b6d4" className="opacity-60 mix-blend-screen" />
                    {/* Blade 5 */}
                    <path d="M50 50 L15.4 70 L10 50 Z" fill="#06b6d4" className="opacity-60 mix-blend-screen" />
                    {/* Blade 6 */}
                    <path d="M50 50 L15.4 30 L30 15 Z" fill="#06b6d4" className="opacity-60 mix-blend-screen" />
                </g>

                {/* Center Eye / Lens */}
                <circle cx="50" cy="50" r="10" fill="url(#lens-gradient)" className="animate-pulse">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Scanning Line */}
                <rect x="0" y="48" width="100" height="2" fill="#22d3ee" className="opacity-50 blur-[2px]">
                    <animate attributeName="y" values="10;90;10" dur="2s" repeatCount="indefinite" />
                </rect>

                <defs>
                    <linearGradient id="gradient-border" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#06b6d4" />
                        <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                    <radialGradient id="lens-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(15)">
                        <stop stopColor="#cffafe" />
                        <stop offset="1" stopColor="#0891b2" />
                    </radialGradient>
                </defs>
            </svg>

            {/* Glitch Overlay Text Effect (Optional, external to SVG) */}
        </div>
    );
};

export default BionicLogo;
