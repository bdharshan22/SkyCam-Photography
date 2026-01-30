import React from 'react';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 py-16 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Logo Container */}
        <div className=" px-4 py-2 rounded-sm mb-8">
          <img
            src="/logo2.png"
            alt="Skycam Photography"
            className="h-12 w-auto object-contain invert dark:invert-0"
            onError={(e) => {
              // Fallback text if image missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden text-2xl font-serif italic font-bold tracking-wider text-black dark:text-white">
            <span className="text-brand-600">SKYCAM</span> <span className="text-black dark:text-white text-lg not-italic">PHOTOGRAPHY</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a
            href="https://www.instagram.com/skycamphotography01/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 group"
          >
            <div className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-black dark:group-hover:border-white group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-all">
              <Instagram className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest hidden md:block">Instagram</span>
          </a>

          <a
            href="https://wa.me/918667518859?text=Hello%20Skycam.%20I%20would%20like%20information%20about%20your%20packages%20and%20availability."
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 group"
          >
            <div className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-black dark:group-hover:border-white group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-all">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest hidden md:block">WhatsApp</span>
          </a>

          <a
            href="mailto:skycam2809@gmail.com"
            className="text-zinc-600 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 group"
          >
            <div className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-black dark:group-hover:border-white group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-all">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest hidden md:block">Email</span>
          </a>

          <a
            href="https://maps.app.goo.gl/KSHXMcyVfHfc7FkT7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 group"
          >
            <div className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-black dark:group-hover:border-white group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-all">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest hidden md:block">Location</span>
          </a>
        </div>

        <div className="text-center text-zinc-500 dark:text-zinc-600 text-sm font-light">
          <p className="mb-2">&copy; {new Date().getFullYear()} Skycam Photography. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-black dark:hover:text-zinc-400">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-zinc-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;