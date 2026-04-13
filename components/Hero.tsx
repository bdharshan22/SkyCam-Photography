import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from '../types';
import { Instagram, MessageCircle, Phone, Mail, Play, Sparkles, X, Volume2, VolumeX } from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';
import { api } from '../services/api';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showReel, setShowReel] = useState(false);
  const [bgMuted, setBgMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
        contentRef.current.style.opacity = `${1 - scrollY / 800}`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only track mouse on non-touch devices
    const hasPointer = window.matchMedia('(hover: hover)').matches;
    if (!hasPointer) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const submitted = localStorage.getItem('skycam_user_submitted');
    if (submitted === 'true') setHasSubmitted(true);
  }, []);

  useEffect(() => {
    if (hasSubmitted) return;
    const submitted = localStorage.getItem('skycam_user_submitted');
    if (submitted === 'true') { setHasSubmitted(true); return; }
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, [hasSubmitted]);

  // Showreel modal: pause bg video when open, resume when closed
  useEffect(() => {
    if (showReel) {
      bgVideoRef.current?.pause();
      modalVideoRef.current?.play();
    } else {
      bgVideoRef.current?.play();
      if (modalVideoRef.current) {
        modalVideoRef.current.pause();
        modalVideoRef.current.currentTime = 0;
      }
    }
  }, [showReel]);

  // Close showreel on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowReel(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleBgMuteToggle = () => {
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = !bgMuted;
      setBgMuted(prev => !prev);
    }
  };

  const handleModalSubmit = async (name: string, whatsapp: string): Promise<{ success: boolean; error?: string }> => {
    const result = await api.storeUserDetails(name, whatsapp);
    if (result.success) {
      setHasSubmitted(true);
      setShowModal(false);
      localStorage.setItem('skycam_user_submitted', 'true');
    }
    return result;
  };

  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 3,
  }));

  // Cinematic showreel clips — using mixkit for reliable testing
  const BG_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-walk-around-a-fountain-in-a-park-on-42407-large.mp4';
  const REEL_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-walk-around-a-fountain-in-a-park-on-42407-large.mp4';

  return (
    <section id={NavLink.HOME} className="relative h-screen flex items-center justify-center overflow-hidden bg-surface-950">

      {/* ── CINEMATIC VIDEO BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        {/* Video layer */}
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={BG_VIDEO} type="video/mp4" />
        </video>

        {/* Fallback gradient (shows while video loads) */}
        <div className={`absolute inset-0 bg-surface-950 transition-opacity duration-1500 ${
          videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`} />

        {/* Cinematic dark overlay — keeps text legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/70 via-surface-950/50 to-surface-950/80" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Branded colour tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/20 via-transparent to-purple-950/15" />

        {/* Ambient depth gradients (layered on top of video) */}
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-brand-500/8 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 grid-bg opacity-15" />

        {/* Floating particles */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-brand-400/40 animate-float"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

        {/* Mouse-follow glow */}
        <div
          className="absolute w-[400px] h-[400px] bg-brand-500/4 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ease-out"
          style={{ left: `${mousePos.x - 200}px`, top: `${mousePos.y - 200}px` }}
        />
      </div>

      {/* Mute toggle — bottom left */}
      <button
        onClick={handleBgMuteToggle}
        className="absolute bottom-8 left-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-[10px] font-medium tracking-wider uppercase group"
        title={bgMuted ? 'Unmute' : 'Mute'}
      >
        {bgMuted
          ? <VolumeX className="w-3.5 h-3.5" />
          : <Volume2 className="w-3.5 h-3.5 text-brand-400" />
        }
        <span className="hidden sm:inline">{bgMuted ? 'Unmute' : 'Mute'}</span>
        {/* Live indicator */}
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE</span>
        </span>
      </button>

      {/* Decorative Lines */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />
        <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-brand-500/5 to-transparent" />
        <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      {/* Social Sidebar (Desktop) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-30 hidden md:flex flex-col items-center gap-3">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20 mb-2" />
        {[
          { href: "https://www.instagram.com/skycamphotography01/", icon: <Instagram className="w-4 h-4" />, label: "Instagram", color: "hover:text-pink-400 hover:border-pink-400/30" },
          { href: "https://wa.me/918667518859?text=Hello%20Skycam.%20I%20would%20like%20information%20about%20your%20packages%20and%20availability.", icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp", color: "hover:text-green-400 hover:border-green-400/30" },
          { href: "tel:+918667518859", icon: <Phone className="w-4 h-4" />, label: "Call", color: "hover:text-blue-400 hover:border-blue-400/30" },
          { href: "mailto:skycam2809@gmail.com", icon: <Mail className="w-4 h-4" />, label: "Email", color: "hover:text-brand-400 hover:border-brand-400/30" },
        ].map((social, i) => (
          <a
            key={i}
            href={social.href}
            target={social.href.startsWith('http') ? "_blank" : undefined}
            rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
            className={`p-2.5 border border-white/10 rounded-full text-zinc-500 ${social.color} transition-all duration-300 hover:scale-110 group relative backdrop-blur-sm bg-white/[0.02]`}
            title={social.label}
            style={{ animationDelay: `${0.8 + i * 0.1}s` }}
          >
            {social.icon}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium tracking-wider border border-white/5">
              {social.label}
            </span>
          </a>
        ))}
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mt-2" />
      </div>

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto will-change-transform"
      >
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-sm mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-300">
            Premium Photography Studio
          </span>
        </div>

        {/* Main Title */}
        <h1 className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.9] tracking-tight">
            <span className="text-gradient-gold glow-text-gold">Sky</span>
            <span className="text-white">cam</span>
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl font-display font-light tracking-[0.5em] uppercase text-white/50 mt-4">
            Photography
          </span>
        </h1>

        {/* Subtitle with animated line */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-500/60" />
          <p className="text-zinc-400 max-w-lg text-base sm:text-lg font-light leading-relaxed">
            Where cinematic artistry meets timeless storytelling.
            We craft visual narratives that resonate with elegance.
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-500/60" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => scrollToSection(NavLink.PORTFOLIO)}
            className="btn-premium min-w-[200px] gap-2"
          >
            <Play className="w-4 h-4" />
            View Our Works
          </button>
          {/* ── Play Showreel button ── */}
          <button
            onClick={() => setShowReel(true)}
            className="group relative flex items-center gap-3 min-w-[200px] px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300 justify-center overflow-hidden"
          >
            {/* Ripple ring */}
            <span className="relative flex-shrink-0">
              <span className="absolute inset-0 rounded-full bg-brand-500/30 animate-ping" />
              <span className="relative w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                <Play className="w-3 h-3 text-brand-400 translate-x-px" fill="currentColor" />
              </span>
            </span>
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Play Showreel</span>
          </button>
        </div>

        {/* Subtle trust signal */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {['500+ Events', '4K/8K Ready', 'Drone Coverage'].map((text, i) => (
            <span key={i} className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-zinc-600 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-brand-500" />
              {text}
            </span>
          ))}
        </div>

        {/* Mobile Social Links */}
        <div className="flex md:hidden items-center justify-center gap-5 mt-10 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          {[
            { href: "https://www.instagram.com/skycamphotography01/", icon: <Instagram className="w-5 h-5" /> },
            { href: "https://wa.me/918667518859", icon: <MessageCircle className="w-5 h-5" /> },
            { href: "tel:+918667518859", icon: <Phone className="w-5 h-5" /> },
            { href: "mailto:skycam2809@gmail.com", icon: <Mail className="w-5 h-5" /> },
          ].map((s, i) => (
            <a key={i} href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-zinc-500 hover:text-brand-400 transition-colors duration-300">
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => scrollToSection(NavLink.PORTFOLIO)}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600 group-hover:text-brand-400 transition-colors">
          Scroll
        </span>
        <div className="w-5 h-8 border border-zinc-700 group-hover:border-brand-500/50 rounded-full flex justify-center pt-1.5 transition-colors">
          <div className="w-1 h-2 bg-brand-500 rounded-full animate-bounce" />
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
      />

      {/* ══════════════════════════════════════
           SHOWREEL MODAL
          ══════════════════════════════════════ */}
      {showReel && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={() => setShowReel(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

          {/* Modal content */}
          <div
            className="relative z-10 w-full max-w-5xl mx-4 animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowReel(false)}
              className="absolute -top-12 right-0 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs tracking-widest uppercase"
            >
              <X className="w-4 h-4" /> Close
            </button>

            {/* Label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-500/40" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Skycam Showreel
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-500/40" />
            </div>

            {/* Video */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface-900 shadow-2xl shadow-black/60 border border-white/5">
              <video
                ref={modalVideoRef}
                src={REEL_VIDEO}
                controls
                autoPlay
                className="w-full h-full object-cover"
                playsInline
              />
              {/* Corner decorations */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brand-500/50 rounded-tl-sm" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brand-500/50 rounded-tr-sm" />
              <div className="absolute bottom-12 left-3 w-5 h-5 border-b-2 border-l-2 border-brand-500/50 rounded-bl-sm" />
              <div className="absolute bottom-12 right-3 w-5 h-5 border-b-2 border-r-2 border-brand-500/50 rounded-br-sm" />
            </div>

            <p className="text-center text-zinc-600 text-xs mt-4 tracking-widest uppercase">
              Skycam Photography · Hosur, Tamil Nadu
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
