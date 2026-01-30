import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from '../types';
import { ChevronDown, Instagram, MessageCircle, Phone, Mail } from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';
import { api } from '../services/api';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Parallax calculations
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0) scale(1.1)`;
      }

      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
        contentRef.current.style.opacity = `${1 - scrollY / 700}`;
      }

      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // Check if user has already submitted
    const submitted = localStorage.getItem('skycam_user_submitted');
    if (submitted === 'true') {
      setHasSubmitted(true);
    }
  }, []);

  // Show modal after 3 seconds if not already submitted
  // Show modal with a short smooth delay (0.8s) so it doesn't feel abrupt
  useEffect(() => {
    if (hasSubmitted) return;

    // Double check here to be safe
    const submitted = localStorage.getItem('skycam_user_submitted');
    if (submitted === 'true') {
      setHasSubmitted(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasSubmitted]);

  const handleModalSubmit = async (name: string, whatsapp: string): Promise<{ success: boolean; error?: string }> => {
    const result = await api.storeUserDetails(name, whatsapp);
    if (result.success) {
      setHasSubmitted(true);
      setShowModal(false);
      localStorage.setItem('skycam_user_submitted', 'true');
    }
    return result;
  };

  return (
    <section id={NavLink.HOME} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-900 transition-colors duration-300">

      {/* Parallax Background Layer - Image Removed as requested */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform origin-center pointer-events-none"
      >
        {/* Background intentionally left empty/removed */}
      </div>

      {/* Social Sidebar (Right Side) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-30 hidden md:flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <a
          href="https://www.instagram.com/skycamphotography01/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-brand-600 hover:border-brand-600 dark:hover:text-brand-400 dark:hover:border-brand-500 transition-all duration-300 hover:scale-110 shadow-md group relative"
          title="Instagram"
        >
          <Instagram className="w-5 h-5" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            Instagram
          </span>
        </a>
        <a
          href="https://wa.me/918667518859?text=Hello%20Skycam.%20I%20would%20like%20information%20about%20your%20packages%20and%20availability."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 hover:border-cyan-600 dark:hover:text-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 hover:scale-110 shadow-md group relative"
          title="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            WhatsApp
          </span>
        </a>
        <a
          href="tel:+918667518859"
          className="p-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-blue-600 hover:border-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:scale-110 shadow-md group relative"
          title="Phone"
        >
          <Phone className="w-5 h-5" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            Call Us
          </span>
        </a>
        <a
          href="mailto:skycam2809@gmail.com"
          className="p-3.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:border-red-600 dark:hover:text-red-400 dark:hover:border-red-500 transition-all duration-300 hover:scale-110 shadow-md group relative"
          title="Email"
        >
          <Mail className="w-5 h-5" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            Email
          </span>
        </a>
      </div>

      {/* Content Layer */}
      <div
        ref={contentRef}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto space-y-8 will-change-transform"
      >
        <p className="text-brand-600 tracking-[0.4em] uppercase text-xs md:text-sm font-semibold mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Chasing Light & Love
        </p>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-brand-600 leading-[0.9] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Skycam <br />
          <span className="italic text-brand-500">Photography</span>
        </h1>

        <p className="text-zinc-900 dark:text-zinc-300 max-w-xl mx-auto text-lg md:text-xl
         leading-relaxed animate-fade-in-up font-sans font-medium" style={{ animationDelay: '0.4s' }}>
          Where modern aesthetics meet timeless storytelling. We craft visual narratives that resonate with elegance.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => scrollToSection(NavLink.PORTFOLIO)}
            className="group relative px-8 py-4 bg-brand-600 text-white overflow-hidden transition-all duration-300 hover:bg-brand-700 w-full md:w-auto min-w-[180px] shadow-[0_10px_25px_rgba(220,38,38,0.2)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.3)]"
          >
            <span className="relative z-10 font-medium tracking-widest uppercase text-xs">View Works</span>
          </button>


        </div>

        {/* Mobile Social Links (Visible only on small screens) */}
        <div className="flex md:hidden items-center justify-center gap-6 mt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <a
            href="https://www.instagram.com/skycamphotography01/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://wa.me/918667518859?text=Hello%20Skycam.%20I%20would%20like%20information%20about%20your%20packages%20and%20availability."
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
          <a
            href="tel:+918667518859"
            className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone className="w-6 h-6" />
          </a>
          <a
            href="mailto:skycam2809@gmail.com"
            className="text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        onClick={() => scrollToSection(NavLink.PORTFOLIO)}
      >
        <ChevronDown size={32} className="text-black dark:text-white" />
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
      />
    </section>
  );
};

export default Hero;
