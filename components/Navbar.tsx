import React, { useState } from 'react';
import { NavLink } from '../types';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeLink: string;
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeLink, scrollToSection, isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { id: NavLink.HOME, label: 'Home' },
    { id: NavLink.PORTFOLIO, label: 'Portfolio' },
    { id: NavLink.SERVICES, label: 'Services' },
    { id: NavLink.CONTACT, label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md py-3 border-b border-zinc-100 shadow-sm`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => scrollToSection(NavLink.HOME)}
        >
          <img 
            src="/logo.png" 
            alt="Skycam Photography" 
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden text-2xl font-serif italic font-bold tracking-wider text-black">
            <span className="text-brand-600">SKYCAM</span> <span className="text-black text-lg not-italic">PHOTOGRAPHY</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-sm tracking-widest uppercase transition-colors duration-300 hover:text-brand-600 ${activeLink === link.id ? 'text-brand-600 font-medium' : 'text-zinc-800 font-medium'}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button 
          className="md:hidden hover:text-brand-600 transition-colors text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-100 transition-all duration-300 overflow-hidden shadow-xl ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                scrollToSection(link.id);
                setIsMenuOpen(false);
              }}
              className={`text-left text-sm tracking-widest uppercase py-2 ${activeLink === link.id ? 'text-brand-600 font-medium' : `${isDarkMode ? 'text-gray-300' : 'text-zinc-800'}`}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;