import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress?: number;
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0, onComplete }) => {
  const [loadingText, setLoadingText] = useState("INITIALIZING");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setLoadingText("SYSTEM READY");
      setIsExiting(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 100);
      return () => clearTimeout(timer);
    }

    const texts = ["INITIALIZING", "LOADING ASSETS", "CALIBRATING OPTICS", "SYSTEM READY"];
    let i = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        setLoadingText(texts[i % texts.length]);
        i++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-950 overflow-hidden font-mono text-brand-400 selection:bg-brand-500/30 transition-colors duration-300">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-20 transition-all duration-300"
        style={{ backgroundImage: `linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      />
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{ backgroundImage: `radial-gradient(circle at center, rgba(245,158,11,0.08), transparent 70%)` }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center scale-110 md:scale-125 transition-all duration-700 perspective-[1000px]">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12 flex items-center justify-center">
          
          {/* Core Glow */}
          <div className="absolute inset-10 rounded-full blur-xl animate-pulse bg-brand-500/10" />

          {/* Orbit Rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-brand-500/20 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-[-10%] flex items-center justify-center p-4 animate-[spin_12s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-full h-full rounded-full border border-brand-400/15 border-t-brand-400/50" style={{ transform: 'rotateX(70deg)' }} />
          </div>
          <div className="absolute inset-[-10%] flex items-center justify-center p-4 animate-[spin_15s_linear_infinite_reverse]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-full h-full rounded-full border border-brand-400/15 border-b-brand-400/50" style={{ transform: 'rotateX(-70deg) rotateY(20deg)' }} />
          </div>
          <div className="absolute inset-[-5%] flex items-center justify-center p-4 animate-[spin_20s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-full h-full rounded-full border border-brand-400/10" style={{ transform: 'rotateY(90deg)' }} />
          </div>

          {/* Orbiting particle */}
          <div className="absolute inset-[-25%] animate-[spin_8s_linear_infinite]" style={{ transform: 'rotateX(60deg) rotateY(-10deg)' }}>
            <div className="w-full h-full rounded-full relative">
              <div className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-brand-400 shadow-[0_0_15px_rgba(251,191,36,1)]" />
            </div>
          </div>

          {/* Logo */}
          <div className="relative z-10 p-2 rounded-full backdrop-blur-sm bg-black/20">
            <img
              src="/skycam.jpeg"
              alt="SkyCam Logo"
              className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full animate-[pulse_4s_ease-in-out_infinite] drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center space-y-4 min-h-[140px] animate-[jump-in-bounce_1.5s_cubic-bezier(0.25,1,0.5,1)_forwards]">
          <h1 className="flex flex-col items-center text-4xl md:text-5xl font-black tracking-[0.2em] text-white/90 mix-blend-screen" style={{ textShadow: '0 0 20px rgba(245,158,11,0.6)' }}>
            <span>SKY<span className="text-brand-400">CAM</span></span>
            <span className="text-sm md:text-lg tracking-[0.5em] mt-2 font-light text-brand-500/80">PHOTOGRAPHY</span>
          </h1>

          <div className="flex items-center space-x-3 text-xs md:text-sm tracking-[0.4em] uppercase text-brand-400/80">
            <span className="w-2 h-2 rounded-full animate-ping bg-brand-500" />
            <span>{loadingText}</span>
            <span className="w-2 h-2 rounded-full animate-ping bg-brand-500" />
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-surface-800 rounded-full mt-6 overflow-hidden border border-white/5">
            <div
              className="h-full transition-all duration-300 ease-out relative bg-brand-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50 skew-x-[-20deg] animate-[shimmer_1s_infinite]" />
            </div>
          </div>

          <p className="font-mono text-[10px] mt-4 text-brand-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
            {isExiting ? "ACCESS GRANTED" : "AWAITING SYSTEM ENTRY"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes jump-in-bounce {
            0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
            60% { transform: translateY(-30px) scale(1.1); opacity: 1; }
            80% { transform: translateY(10px) scale(0.95); }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
