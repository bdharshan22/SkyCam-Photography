import React, { useEffect } from 'react';
import { NavLink } from '../types';
import { Camera, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.05 });
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  // Featured highlights — 3 best shots shown on the home page
  const featured = [
    { url: '/Instapage/wedding_ceremony.png', title: 'Sacred Vows', category: 'wedding' },
    { url: '/Instapage/child_wonder.png', title: 'Little Wonder', category: 'portrait' },
    { url: '/Instapage/maternity_hero.png', title: 'Awaiting Miracle', category: 'maternity' },
  ];

  // Category cards — clickable, each navigates to its own gallery page
  const categories = [
    {
      key: 'wedding',
      label: 'Wedding',
      tagline: 'Timeless love stories',
      count: 6,
      cover: '/Instapage/wedding_hero.png',
    },
    {
      key: 'portrait',
      label: 'Portrait',
      tagline: 'Faces that speak',
      count: 2,
      cover: '/Instapage/portrait_hero.png',
    },
    {
      key: 'baby',
      label: 'Baby & Kids',
      tagline: 'Pure innocence',
      count: 2,
      cover: '/Instapage/baby_hero.png',
    },
    {
      key: 'maternity',
      label: 'Maternity',
      tagline: 'Awaiting miracles',
      count: 1,
      cover: '/Instapage/maternity_hero.png',
    },
    {
      key: 'couple',
      label: 'Couple',
      tagline: 'Two hearts, one frame',
      count: 1,
      cover: '/Instapage/couple_hero.png',
    },
    {
      key: 'puberty',
      label: 'Puberty',
      tagline: 'A joyous milestone',
      count: 1,
      cover: '/Instapage/portrait_hero.png',
    },
  ];

  return (
    <section id={NavLink.PORTFOLIO} ref={sectionRef} className="py-24 md:py-32 relative z-20 bg-surface-950 noise-overlay">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">

        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="text-center mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
            <Camera className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Our Work</span>
          </div>

          <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 leading-[0.9]">
            Visual{' '}
            <span className="text-gradient-gold">Masterpieces</span>
          </h2>
          <p className="max-w-xl mx-auto text-zinc-400 text-lg font-light leading-relaxed">
            Each frame is a symphony of light and emotion — explore our curated collection of unforgettable moments.
          </p>
        </div>

        {/* ============================================ */}
        {/* FEATURED HIGHLIGHTS — 3 hero-sized images */}
        {/* ============================================ */}
        <div className="mb-20 reveal-on-scroll">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Featured Works</h3>
            <Link to="/portfolio/all" className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-wider">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((photo, i) => (
              <Link
                to={`/portfolio/${photo.category}`}
                key={i}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer watermark-overlay"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  draggable="false"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {/* Hover tint */}
                <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <div className="absolute top-5 left-5 text-[10px] font-bold text-white/20 tracking-widest font-display">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Expand icon */}
                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-500 hover:text-black">
                  <ArrowUpRight size={14} />
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2.5 py-1 bg-brand-500/20 text-brand-400 text-[9px] font-bold uppercase tracking-widest rounded-full border border-brand-500/20 backdrop-blur-sm mb-2">
                    {photo.category}
                  </span>
                  <h4 className="text-xl font-serif text-white font-medium">{photo.title}</h4>
                  <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-brand-500/50 to-transparent transition-all duration-700 delay-100 mt-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* CATEGORY CARDS — Click to open gallery page */}
        {/* ============================================ */}
        <div className="reveal-on-scroll">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Browse by Category</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Link
                to={`/portfolio/${cat.key}`}
                key={cat.key}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer watermark-overlay"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Cover image */}
                <img
                  src={cat.cover}
                  alt={cat.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  draggable="false"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-brand-400 bg-brand-500/15 px-2 py-0.5 rounded border border-brand-500/15">
                      {cat.count}
                    </span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">photos</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-white group-hover:text-brand-400 transition-colors">{cat.label}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 italic">{cat.tagline}</p>
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* DRONE CTA */}
        {/* ============================================ */}
        <div className="mt-16 reveal-on-scroll">
          <Link to="/drone-videography" className="block group">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 hover:border-brand-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-surface-800 via-surface-900 to-surface-800" />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand-500/5 rounded-full blur-[80px]" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 animate-float">
                  <svg viewBox="0 0 64 64" className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="24" y="28" width="16" height="8" rx="3" />
                    <line x1="24" y1="30" x2="12" y2="22" /><line x1="40" y1="30" x2="52" y2="22" />
                    <line x1="24" y1="34" x2="12" y2="42" /><line x1="40" y1="34" x2="52" y2="42" />
                    <circle cx="12" cy="22" r="4" /><circle cx="52" cy="22" r="4" />
                    <circle cx="12" cy="42" r="4" /><circle cx="52" cy="42" r="4" />
                    <circle cx="32" cy="38" r="2" />
                  </svg>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-1.5">
                    Aerial <span className="text-gradient-gold">Drone</span> Videography
                  </h3>
                  <p className="text-zinc-400 text-sm max-w-md">
                    4K cinematic aerial footage, real estate aerials, and event coverage from the skies.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider group-hover:bg-brand-500 group-hover:text-black transition-all duration-300">
                  Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;