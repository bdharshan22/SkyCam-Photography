import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress?: number;
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0, onComplete }) => {
  const [loadingText, setLoadingText] = useState("INITIALIZING");
  const [isExiting, setIsExiting] = useState(false);

  // Dynamic color classes - Always Green
  const color = "green";
  const textColor = "text-green-500";
  const selectionColor = "selection:bg-green-500/30";
  const glowStart = "rgba(34,197,94,0.03)";
  const glowEnd = "rgba(34,197,94,0.1)";
  const coreGlow = "bg-green-500/10";
  const ringColor = "border-green-500/30";
  const ringTiltTop = "border-green-400/20 border-t-green-400/60";
  const ringTiltBottom = "border-green-400/20 border-b-green-400/60";
  const ringVertical = "border-green-400/10";
  const planetColor = "bg-green-400";
  const planetShadow = "shadow-[0_0_15px_rgba(74,222,128,1)]";
  const coreShadow = "drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]";
  const titleShadow = "0 0 20px rgba(34,197,94,0.8)";
  const titleAccent = "text-green-400";
  const subtitleColor = "text-green-500/80";
  const loadingDot = "bg-green-500";
  const loadingTextColor = "text-green-400/80";
  const progressShadow = "shadow-[0_0_15px_rgba(34,197,94,0.8)]";
  const progressFill = "bg-green-500";
  const accessText = "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]";

  useEffect(() => {
    if (progress >= 100) {
      setLoadingText("SYSTEM READY");
      setIsExiting(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }

    const texts = ["INITIALIZING", "LOADING ASSETS", "CALIBRATING OPTICS", "SYSTEM READY"];
    let i = 0;
    const interval = setInterval(() => {
      // Only cycle text if strictly less than 100
      if (progress < 100) {
        setLoadingText(texts[i % texts.length]);
        i++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, [progress, onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden font-mono ${textColor} ${selectionColor} transition-colors duration-300`}>
      {/* Background Grid Ambience */}
      <div
        className="absolute inset-0 bg-[size:40px_40px] opacity-20 transition-all duration-300"
        style={{ backgroundImage: `linear-gradient(${glowStart} 1px, transparent 1px), linear-gradient(90deg, ${glowStart} 1px, transparent 1px)` }}
      ></div>
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{ backgroundImage: `radial-gradient(circle at center, ${glowEnd}, transparent 70%)` }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center scale-110 md:scale-125 transition-all duration-700 perspective-[1000px]">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12 flex items-center justify-center transform-style-3d">

          {/* Core Glow */}
          <div className={`absolute inset-10 rounded-full blur-xl animate-pulse transition-colors duration-500 ${coreGlow}`}></div>

          {/* Orbit 1 - Horizontal Ring */}
          <div className={`absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite] transition-colors duration-500 ${ringColor}`}></div>

          {/* Orbit 2 - Tilted System */}
          <div className="absolute inset-[-10%] flex items-center justify-center p-4 animate-[spin_12s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            <div className={`w-full h-full rounded-full border transition-colors duration-500 ${ringTiltTop}`} style={{ transform: 'rotateX(70deg)' }}></div>
          </div>

          {/* Orbit 3 - Reverse Tilted System */}
          <div className="absolute inset-[-10%] flex items-center justify-center p-4 animate-[spin_15s_linear_infinite_reverse]" style={{ transformStyle: 'preserve-3d' }}>
            <div className={`w-full h-full rounded-full border transition-colors duration-500 ${ringTiltBottom}`} style={{ transform: 'rotateX(-70deg) rotateY(20deg)' }}></div>
          </div>

          {/* Orbit 4 - Vertical Ring */}
          <div className="absolute inset-[-5%] flex items-center justify-center p-4 animate-[spin_20s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            <div className={`w-full h-full rounded-full border transition-colors duration-500 ${ringVertical}`} style={{ transform: 'rotateY(90deg)' }}></div>
          </div>

          {/* Floating Particles (Planets) */}
          <div className="absolute inset-[-25%] animate-[spin_8s_linear_infinite]" style={{ transform: 'rotateX(60deg) rotateY(-10deg)' }}>
            <div className="w-full h-full rounded-full relative">
              <div className={`absolute top-0 left-1/2 w-3 h-3 rounded-full transition-all duration-500 ${planetColor} ${planetShadow}`}></div>
            </div>
          </div>

          {/* User Logo (Planet Core) */}
          <div className="relative z-10 p-2 rounded-full backdrop-blur-sm bg-black/20">
            <img
              src="/skycam.jpeg"
              alt="SkyCam Logo"
              className={`w-28 h-28 md:w-36 md:h-36 object-contain rounded-full animate-[pulse_4s_ease-in-out_infinite] transition-all duration-500 ${coreShadow}`}
            />
          </div>
        </div>

        {/* Animated Text Block */}
        <div className="flex flex-col items-center space-y-4 min-h-[140px] animate-[jump-in-bounce_1.5s_cubic-bezier(0.25,1,0.5,1)_forwards]">
          <h1 className="flex flex-col items-center text-4xl md:text-5xl font-black tracking-[0.2em] text-white/90 mix-blend-screen transition-all duration-500" style={{ textShadow: titleShadow }}>
            <span>SKY<span className={`transition-colors duration-500 ${titleAccent}`}>CAM</span></span>
            <span className={`text-sm md:text-lg tracking-[0.5em] mt-2 font-light transition-colors duration-500 ${subtitleColor}`}>PHOTOGRAPHY</span>
          </h1>

          <>
            <div className={`flex items-center space-x-3 text-xs md:text-sm tracking-[0.4em] uppercase transition-colors duration-500 ${loadingTextColor}`}>
              <span className={`w-2 h-2 rounded-full animate-ping transition-colors duration-500 ${loadingDot}`}></span>
              <span>{loadingText}</span>
              <span className={`w-2 h-2 rounded-full animate-ping transition-colors duration-500 ${loadingDot}`}></span>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-900 rounded-full mt-6 overflow-hidden border border-gray-800">
              <div
                className={`h-full transition-all duration-300 ease-out relative ${progressFill} ${progressShadow}`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50 skew-x-[-20deg] animate-[shimmer_1s_infinite]"></div>
              </div>
            </div>
          </>

          <p className={`font-mono text-[10px] mt-4 transition-colors duration-300 ${accessText}`}>
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
        @keyframes slide-in-left {
            0% { transform: translateX(-100vw); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out-right {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100vw); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;

