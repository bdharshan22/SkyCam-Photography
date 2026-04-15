import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, ChevronRight, Camera, Video, Globe, Building, Mountain, PartyPopper, Check, ArrowUpRight, Sparkles, Shield, Zap, Eye } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   DRONE VIDEOGRAPHY — Premium Landing Page
   ────────────────────────────────────────────────────────── */
const DronePhotography: React.FC = () => {
  const [droneReady, setDroneReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  /* scroll-driven parallax */
  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* trigger drone fly-in after mount */
  useEffect(() => {
    const t = setTimeout(() => setDroneReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* intersection observer for reveals */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const services = [
    { icon: <PartyPopper />, title: 'Wedding Aerials', desc: 'Sweeping cinematic footage of your grand celebrations — venue reveals, processions, and couple portraits from the sky.', color: 'from-pink-500/20 to-pink-600/5', accent: 'pink' },
    { icon: <Building />, title: 'Real Estate & Architecture', desc: 'Stunning property showcases, construction progress documentation, and commercial listing photography.', color: 'from-blue-500/20 to-blue-600/5', accent: 'blue' },
    { icon: <Mountain />, title: 'Landscape & Nature', desc: 'Breathtaking skyline panoramas, terrain mapping, and nature documentary-grade footage.', color: 'from-green-500/20 to-green-600/5', accent: 'green' },
    { icon: <Video />, title: 'Event Coverage', desc: 'Corporate events, festivals, and public gatherings captured from unique aerial perspectives.', color: 'from-purple-500/20 to-purple-600/5', accent: 'purple' },
    { icon: <Camera />, title: 'Aerial Portraits', desc: 'Creative top-down and orbital portrait sessions for pre-weddings, engagements, and personal shoots.', color: 'from-brand-500/20 to-brand-600/5', accent: 'amber' },
    { icon: <Globe />, title: 'Mapping & Surveys', desc: 'Orthomosaic maps, 3D terrain models, and precision land surveys for industrial applications.', color: 'from-cyan-500/20 to-cyan-600/5', accent: 'cyan' },
  ];

  const equipment = [
    { name: 'DJI Mavic 3 Pro', spec: '4K/120fps, Hasselblad Camera', detail: 'Our primary drone for cinematic shoots', badge: 'FLAGSHIP' },
    { name: 'DJI Mini 4 Pro', spec: '4K HDR, Compact & Quiet', detail: 'Perfect for intimate venues and indoor events', badge: 'COMPACT' },
    { name: 'DJI Air 3', spec: 'Dual Camera, 48MP Photos', detail: 'Versatile mid-range for all-terrain coverage', badge: 'VERSATILE' },
  ];

  const pricing = [
    { name: 'Aerial Basic', price: '₹5,000', duration: '1 Hour', features: ['4K Video', '20+ Edited Photos', '1 Location', 'Same-day preview'] },
    { name: 'Aerial Pro', price: '₹12,000', duration: 'Half Day', features: ['4K + Slow-Mo', '50+ Edited Photos', '3 Locations', 'Cinematic Highlight Film', 'Colour Grading'], popular: true },
    { name: 'Aerial Elite', price: '₹25,000', duration: 'Full Day', features: ['4K/8K + HyperLapse', '100+ Edited Photos', 'Unlimited Locations', 'Full Cinematic Film', 'Priority Edit & Delivery', 'Raw Files Included'] },
  ];

  const heroParallax = Math.min(scrollY * 0.4, 200);

  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO — Drone Fly-In Animation
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Layered animated background */}
        <div className="absolute inset-0 z-0">
          {/* Radial gradient base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.06)_0%,_transparent_70%)]" />

          {/* Animated grid */}
          <div
            className="absolute inset-0 grid-bg opacity-20"
            style={{ transform: `translateY(${heroParallax * 0.2}px)` }}
          />

          {/* Floating orbs */}
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-purple-600/4 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '5s' }} />

          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="drone-scan-line" />
          </div>
        </div>

        {/* Back button */}
        <Link to="/" className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-900/80 backdrop-blur-md border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-all text-xs font-medium tracking-wider uppercase group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Home
        </Link>

        {/* Hero content with inline drone */}
        <div
          className="relative z-20 text-center px-6 max-w-5xl mx-auto"
          style={{ transform: `translateY(${heroParallax * -0.15}px)` }}
        >
          <div className={`transition-all duration-1000 ${droneReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '1.8s' }}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-brand-300">Aerial Excellence</span>
            </div>
          </div>

          {/* ── 3D DRONE — perspective fly-in ── */}
          <div className="drone-scene mb-4">
            <div className={`drone-3d ${droneReady ? 'drone-landed-3d' : 'drone-flying-3d'}`}>
              {/* Ground shadow ellipse */}
              <div className="drone-shadow-3d" />

              {/*
                SVG drawn in perspective view:
                  - Front arms longer / rotors bigger (closer to viewer)
                  - Rear arms shorter / rotors smaller (farther)
                  - Body has visible TOP face + FRONT face for 3D depth
              */}
              <svg viewBox="0 0 320 250" className="drone-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Glow filter */}
                  <filter id="glow3d" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  {/* Body top face gradient */}
                  <linearGradient id="bodyTop3d" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#38311f"/>
                    <stop offset="100%" stopColor="#26200e"/>
                  </linearGradient>
                  {/* Body front face gradient (darker) */}
                  <linearGradient id="bodyFront3d" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#1c1708"/>
                    <stop offset="100%" stopColor="#0f0d04"/>
                  </linearGradient>
                  {/* Arm gradient front */}
                  <linearGradient id="armFront" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.48)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0.10)"/>
                  </linearGradient>
                  {/* Arm gradient rear (dimmer — farther away) */}
                  <linearGradient id="armRear" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0.04)"/>
                  </linearGradient>
                  {/* Rotor glow front (brighter) */}
                  <radialGradient id="propGlowFront" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(245,158,11,0.38)"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </radialGradient>
                  {/* Rotor glow rear (dimmer) */}
                  <radialGradient id="propGlowRear" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(245,158,11,0.18)"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </radialGradient>
                  {/* Camera lens */}
                  <radialGradient id="lensGrad3d" cx="35%" cy="35%" r="60%">
                    <stop offset="0%"   stopColor="rgba(190,220,255,0.95)"/>
                    <stop offset="100%" stopColor="rgba(20,50,110,0.75)"/>
                  </radialGradient>
                </defs>

                {/* ── REAR ARMS (draw first — behind body) ── */}
                {/* Rear-left arm — shorter (foreshortened away from viewer) */}
                <line x1="146" y1="122" x2="80"  y2="170"
                  stroke="url(#armRear)" strokeWidth="3.5" strokeLinecap="round"/>
                {/* Rear-right arm */}
                <line x1="174" y1="122" x2="240" y2="170"
                  stroke="url(#armRear)" strokeWidth="3.5" strokeLinecap="round"/>

                {/* ── REAR ROTORS — smaller + more oval (farther from viewer) ── */}
                {/* Rear-left motor pod */}
                <g>
                  <ellipse cx="80" cy="170" rx="34" ry="8" fill="url(#propGlowRear)"/>
                  <ellipse cx="80" cy="170" rx="29" ry="4.5"
                    fill="rgba(245,158,11,0.07)" stroke="rgba(245,158,11,0.18)" strokeWidth="0.7"
                    style={{animation:'propSpin3d 0.13s linear infinite'}}/>
                  <ellipse cx="80" cy="170" rx="4.5" ry="29"
                    fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.14)" strokeWidth="0.7"
                    style={{animation:'propSpin3d 0.13s linear infinite'}}/>
                  <circle cx="80" cy="170" r="9" fill="#1c1810" stroke="rgba(245,158,11,0.35)" strokeWidth="1.4" filter="url(#softGlow)"/>
                  <circle cx="80" cy="170" r="3.5" fill="#28200c"/>
                </g>
                {/* Rear-right motor pod */}
                <g>
                  <ellipse cx="240" cy="170" rx="34" ry="8" fill="url(#propGlowRear)"/>
                  <ellipse cx="240" cy="170" rx="29" ry="4.5"
                    fill="rgba(245,158,11,0.07)" stroke="rgba(245,158,11,0.18)" strokeWidth="0.7"
                    style={{animation:'propSpin3d 0.11s linear infinite reverse'}}/>
                  <ellipse cx="240" cy="170" rx="4.5" ry="29"
                    fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.14)" strokeWidth="0.7"
                    style={{animation:'propSpin3d 0.11s linear infinite reverse'}}/>
                  <circle cx="240" cy="170" r="9" fill="#1c1810" stroke="rgba(245,158,11,0.35)" strokeWidth="1.4" filter="url(#softGlow)"/>
                  <circle cx="240" cy="170" r="3.5" fill="#28200c"/>
                </g>

                {/* ── BODY — 3D box illusion ── */}
                {/* Front extruded face (bottom strip — darkest) */}
                <polygon
                  points="126,130 194,130 190,145 130,145"
                  fill="url(#bodyFront3d)" stroke="rgba(245,158,11,0.22)" strokeWidth="0.8"/>
                {/* Top face (main visible surface) */}
                <polygon
                  points="122,88 198,88 194,130 126,130"
                  fill="url(#bodyTop3d)" stroke="rgba(245,158,11,0.7)" strokeWidth="1.8"
                  filter="url(#glow3d)"/>
                {/* Panel inset on top */}
                <polygon
                  points="130,95 190,95 187,122 133,122"
                  fill="rgba(245,158,11,0.03)" stroke="rgba(245,158,11,0.18)" strokeWidth="0.8"/>
                {/* Center seam */}
                <line x1="160" y1="95" x2="160" y2="122"
                  stroke="rgba(245,158,11,0.12)" strokeWidth="0.6"/>
                {/* Battery bar (green) */}
                <rect x="136" y="99"  width="18" height="3" rx="1.5" fill="rgba(34,197,94,0.45)"/>
                <rect x="157" y="99"  width="13" height="3" rx="1.5" fill="rgba(34,197,94,0.25)"/>
                {/* LEDs */}
                <circle cx="133" cy="92" r="2.5" fill="#22c55e" filter="url(#glow3d)" className="animate-pulse"/>
                <circle cx="187" cy="92" r="2.5" fill="#ef4444" filter="url(#glow3d)" className="animate-pulse" style={{animationDelay:'0.5s'}}/>
                <circle cx="160" cy="90" r="2"   fill="#f59e0b" className="animate-pulse" style={{animationDelay:'0.25s'}}/>

                {/* ── FRONT ARMS (drawn after body — in front) ── */}
                {/* Front-left arm — longer + brighter (closer to viewer) */}
                <line x1="144" y1="104" x2="50"  y2="52"
                  stroke="url(#armFront)" strokeWidth="5" strokeLinecap="round"/>
                {/* Front-right arm */}
                <line x1="176" y1="104" x2="270" y2="52"
                  stroke="url(#armFront)" strokeWidth="5" strokeLinecap="round"/>

                {/* ── FRONT ROTORS — bigger + rounder (closer to viewer) ── */}
                {/* Front-left motor pod */}
                <g>
                  <ellipse cx="50" cy="52" rx="46" ry="12" fill="url(#propGlowFront)"/>
                  <ellipse cx="50" cy="52" rx="40" ry="6"
                    fill="rgba(245,158,11,0.13)" stroke="rgba(245,158,11,0.28)" strokeWidth="0.9"
                    style={{animation:'propSpin3d 0.11s linear infinite'}}/>
                  <ellipse cx="50" cy="52" rx="6" ry="40"
                    fill="rgba(245,158,11,0.10)" stroke="rgba(245,158,11,0.22)" strokeWidth="0.9"
                    style={{animation:'propSpin3d 0.11s linear infinite'}}/>
                  <circle cx="50" cy="52" r="12" fill="#1e1a12" stroke="rgba(245,158,11,0.5)" strokeWidth="1.8" filter="url(#glow3d)"/>
                  <circle cx="50" cy="52" r="5" fill="#2c2414"/>
                </g>
                {/* Front-right motor pod */}
                <g>
                  <ellipse cx="270" cy="52" rx="46" ry="12" fill="url(#propGlowFront)"/>
                  <ellipse cx="270" cy="52" rx="40" ry="6"
                    fill="rgba(245,158,11,0.13)" stroke="rgba(245,158,11,0.28)" strokeWidth="0.9"
                    style={{animation:'propSpin3d 0.13s linear infinite reverse'}}/>
                  <ellipse cx="270" cy="52" rx="6" ry="40"
                    fill="rgba(245,158,11,0.10)" stroke="rgba(245,158,11,0.22)" strokeWidth="0.9"
                    style={{animation:'propSpin3d 0.13s linear infinite reverse'}}/>
                  <circle cx="270" cy="52" r="12" fill="#1e1a12" stroke="rgba(245,158,11,0.5)" strokeWidth="1.8" filter="url(#glow3d)"/>
                  <circle cx="270" cy="52" r="5" fill="#2c2414"/>
                </g>

                {/* ── LANDING GEAR ── */}
                <line x1="136" y1="145" x2="132" y2="163" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="184" y1="145" x2="188" y2="163" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="122" y1="163" x2="146" y2="163" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="174" y1="163" x2="198" y2="163" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round"/>

                {/* ── GIMBAL + CAMERA ── */}
                <line x1="160" y1="145" x2="160" y2="156" stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="160" cy="164" rx="13" ry="10" fill="#16120a" stroke="rgba(245,158,11,0.55)" strokeWidth="1.5" filter="url(#glow3d)"/>
                <circle cx="160" cy="164" r="8" fill="#080808" stroke="rgba(100,150,220,0.40)" strokeWidth="1"/>
                <circle cx="160" cy="164" r="5" fill="url(#lensGrad3d)"/>
                <circle cx="160" cy="164" r="2" fill="rgba(210,235,255,0.95)" className="animate-pulse"/>
                <circle cx="160" cy="164" r="11" fill="none" stroke="rgba(100,150,220,0.12)" strokeWidth="0.6" className="drone-lens-ring"/>
              </svg>
            </div>
          </div>



          <h1 className={`transition-all duration-1000 ${droneReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '2s' }}>
            <span className="block text-[clamp(4rem,15vw,8rem)] font-serif font-bold leading-[0.85] mb-2">
              <span className="text-gradient-gold">Drone</span>
            </span>
            <span className="block text-[clamp(3rem,8vw,6rem)] font-serif font-bold text-white leading-[0.9]">
              Videography
            </span>
          </h1>

          <p className={`text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mt-8 mb-10 font-light leading-relaxed transition-all duration-1000 ${droneReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '2.3s' }}>
            See your world from a perspective you've never imagined.
            Professional aerial cinematography for weddings, real estate, and events.
          </p>

          <div className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 ${droneReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '2.6s' }}>
            <a
              href="https://wa.me/918667518859?text=Hi!%20I'm%20interested%20in%20drone%20videography%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium gap-2 group"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" /> Book Drone Shoot
            </a>
            <button
              onClick={() => document.getElementById('drone-services')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline gap-2"
            >
              View Services
            </button>
          </div>

          {/* Trust badges */}
          <div className={`mt-16 flex flex-wrap items-center justify-center gap-8 transition-all duration-1000 ${droneReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '2.9s' }}>
            {[
              { icon: <Shield className="w-4 h-4" />, label: 'DGCA Certified' },
              { icon: <Zap className="w-4 h-4" />, label: '4K / 8K Ready' },
              { icon: <Eye className="w-4 h-4" />, label: 'DJI Fleet' },
              { icon: <Sparkles className="w-4 h-4" />, label: '500+ Flights' },
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase text-zinc-500 hover:text-brand-400 transition-colors cursor-default">
                <span className="text-brand-500/60">{t.icon}</span>{t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer transition-all duration-700 ${droneReady ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => document.getElementById('drone-services')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ transitionDelay: '3.2s' }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Discover</span>
          <div className="w-5 h-8 border border-zinc-700/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-brand-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES GRID
          ═══════════════════════════════════════════════════════ */}
      <section id="drone-services" className="py-24 md:py-32 bg-surface-950 noise-overlay relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <Camera className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Our Capabilities</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              What We{' '}
              <span className="text-gradient-gold">Capture</span>
            </h2>
            <p className="text-zinc-400 text-lg font-light max-w-xl mx-auto">
              From wedding celebrations to industrial surveys — our drones go where cameras can't.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className={`reveal-on-scroll group glass-card rounded-2xl p-7 relative overflow-hidden hover:border-brand-500/20 transition-all duration-500`} style={{ animationDelay: `${i * 0.08}s` }}>
                {/* Hover glow */}
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${s.color} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                {/* Number watermark */}
                <span className="absolute top-4 right-5 text-[60px] font-serif font-bold text-white/[0.02] leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand-400 group-hover:border-brand-500/20 group-hover:bg-brand-500/10 transition-all duration-300 mb-5">
                    {React.cloneElement(s.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EQUIPMENT SHOWCASE
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-surface-900 noise-overlay relative overflow-hidden">
        {/* Background lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-brand-500/10 to-transparent" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-14 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Equipment</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
              Our <span className="text-gradient-gold">Fleet</span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">Professional-grade DJI drones for every scenario.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipment.map((eq, i) => (
              <div key={i} className="reveal-on-scroll group relative" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden hover:border-brand-500/20 transition-all duration-500 h-full">
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {eq.badge}
                    </span>
                  </div>

                  {/* Drone icon */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <svg viewBox="0 0 64 64" className="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="24" y="28" width="16" height="8" rx="3" />
                      <line x1="24" y1="30" x2="14" y2="22" /><line x1="40" y1="30" x2="50" y2="22" />
                      <line x1="24" y1="34" x2="14" y2="42" /><line x1="40" y1="34" x2="50" y2="42" />
                      <circle cx="14" cy="22" r="4" /><circle cx="50" cy="22" r="4" />
                      <circle cx="14" cy="42" r="4" /><circle cx="50" cy="42" r="4" />
                      <circle cx="32" cy="38" r="2" />
                    </svg>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1.5 group-hover:text-brand-400 transition-colors">{eq.name}</h3>
                  <p className="text-brand-400 text-xs font-semibold mb-2 tracking-wider">{eq.spec}</p>
                  <p className="text-zinc-500 text-sm">{eq.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-surface-950 noise-overlay relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              Drone{' '}
              <span className="text-gradient-gold">Packages</span>
            </h2>
            <p className="text-zinc-400 text-lg font-light max-w-lg mx-auto">
              Transparent pricing. No hidden fees. Pick a package or request a custom quote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {pricing.map((p, i) => (
              <div
                key={i}
                className={`reveal-on-scroll flex flex-col rounded-2xl transition-all duration-500 h-full ${p.popular
                  ? 'bg-gradient-to-b from-surface-800 to-surface-950 border-2 border-brand-500/30 md:scale-105 md:-translate-y-4 glow-gold relative z-20'
                  : 'glass-card z-10'
                  }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-600 to-brand-400 text-black text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full shadow-lg shadow-brand-500/20 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Best Value
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-zinc-500 text-xs mb-5">{p.duration} Coverage</p>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 mb-7">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Starting From</p>
                    <p className="text-3xl font-bold text-gradient-gold">{p.price}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start text-sm text-zinc-300 gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? 'text-brand-500' : 'text-zinc-600'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/918667518859?text=${encodeURIComponent(`Hi! I'm interested in the "${p.name}" drone package.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${p.popular
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                      : 'bg-white text-black hover:bg-zinc-100'
                      }`}
                  >
                    Book Now <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA FOOTER
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-surface-900 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10 reveal-on-scroll">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center animate-float">
            <Play className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Ready to <span className="text-gradient-gold">Take Flight?</span>
          </h2>
          <p className="text-zinc-400 mb-10 text-base max-w-md mx-auto">
            Contact us to discuss your aerial videography needs. Free consultation available.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/918667518859?text=Hi%20Skycam!%20I%20want%20to%20book%20drone%20videography."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium gap-2 group"
            >
              WhatsApp Us <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/" className="btn-outline gap-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INLINE STYLES — Drone Fly-In Animation System
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* ─────────────────────────────────────────────
           PROPELLER SPIN
        ───────────────────────────────────────────── */
        @keyframes propSpin3d {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ─────────────────────────────────────────────
           3D SCENE WRAPPER  (gives CSS perspective)
        ───────────────────────────────────────────── */
        .drone-scene {
          perspective: 900px;
          perspective-origin: 50% 35%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          height: 240px;
        }

        /* ─────────────────────────────────────────────
           3D DRONE  (receives 3D transforms)
        ───────────────────────────────────────────── */
        .drone-3d {
          position: relative;
          width: 320px;
          height: 220px;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        /* ── FLY-IN: slides in from top-right with real 3D rotation ── */
        .drone-flying-3d {
          opacity: 0;
          animation: none;
          transform:
            translateX(80vw)
            translateY(-45vh)
            translateZ(-160px)
            rotateX(-18deg)
            rotateY(-42deg)
            rotateZ(12deg)
            scale(0.28);
        }

        /* ── LANDED: settles then floats with 3D tilt ── */
        .drone-landed-3d {
          animation:
            droneFlyIn3d  2.0s cubic-bezier(0.16, 1, 0.3, 1) 0.5s  1        forwards,
            droneHover3d  6.0s ease-in-out                   2.7s  infinite;
        }

        @keyframes droneFlyIn3d {
          0% {
            opacity: 0;
            transform:
              translateX(80vw) translateY(-45vh) translateZ(-160px)
              rotateX(-18deg) rotateY(-42deg) rotateZ(12deg)
              scale(0.28);
            filter: blur(8px);
          }
          50% {
            opacity: 0.85;
            transform:
              translateX(12vw) translateY(-8vh) translateZ(-40px)
              rotateX(-5deg) rotateY(-15deg) rotateZ(3deg)
              scale(0.72);
            filter: blur(2px);
          }
          78% {
            opacity: 1;
            transform:
              translateX(-3vw) translateY(2vh) translateZ(8px)
              rotateX(4deg) rotateY(5deg) rotateZ(-1deg)
              scale(1.03);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform:
              translateX(0) translateY(0) translateZ(0)
              rotateX(6deg) rotateY(0deg) rotateZ(0deg)
              scale(1);
            filter: blur(0);
          }
        }

        /* ── Hovering: gentle realistic banking & pitching ── */
        @keyframes droneHover3d {
          0%,100% {
            transform: translateX(0)    translateY(0px)   translateZ(0)
                       rotateX(6deg)   rotateY(0deg);
          }
          20% {
            transform: translateX(5px)  translateY(-9px)  translateZ(4px)
                       rotateX(10deg)  rotateY(4deg);
          }
          45% {
            transform: translateX(-4px) translateY(-14px) translateZ(-2px)
                       rotateX(4deg)   rotateY(-3deg);
          }
          70% {
            transform: translateX(3px)  translateY(-8px)  translateZ(3px)
                       rotateX(8deg)   rotateY(2deg);
          }
        }

        /* ─────────────────────────────────────────────
           DRONE SVG — receives the 3D transforms
        ───────────────────────────────────────────── */
        .drone-svg {
          width: 100%;
          height: 100%;
          filter:
            drop-shadow(0  6px 32px rgba(245,158,11,0.28))
            drop-shadow(0 20px 60px rgba(245,158,11,0.12));
        }

        /* ─────────────────────────────────────────────
           GROUND GLOW SHADOW
        ───────────────────────────────────────────── */
        .drone-shadow-3d {
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%) scaleX(0) scaleY(0);
          width: 200px;
          height: 22px;
          background: radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition:
            opacity   0.9s ease 2.4s,
            transform 0.9s ease 2.4s;
        }
        .drone-landed-3d .drone-shadow-3d {
          opacity: 1;
          transform: translateX(-50%) scaleX(1) scaleY(1);
          animation: shadowBreath3d 6s ease-in-out infinite 2.8s;
        }
        @keyframes shadowBreath3d {
          0%,100% { transform: translateX(-50%) scaleX(1.0) scaleY(1.0); opacity: 0.85; }
          45%     { transform: translateX(-50%) scaleX(1.3) scaleY(0.8); opacity: 0.30; }
        }

        /* ─────────────────────────────────────────────
           LENS RING PULSE
        ───────────────────────────────────────────── */
        .drone-lens-ring {
          animation: lensRing3d 2.8s ease-in-out infinite;
        }
        @keyframes lensRing3d {
          0%,100% { r: 11; opacity: 0.12; }
          50%     { r: 16; opacity: 0; }
        }

        /* ─────────────────────────────────────────────
           HERO SCAN LINE
        ───────────────────────────────────────────── */
        .drone-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.14), transparent);
          animation: scanDown 8s ease-in-out infinite;
        }
        @keyframes scanDown {
          0%   { top: -2%; }
          100% { top: 102%; }
        }
      `}</style>
    </div>
  );
};

export default DronePhotography;
