import React, { useState, useEffect } from 'react';
import { NavLink } from '../types';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  activeLink: string;
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeLink, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Enforce dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('skycam_dark_mode', 'true');
  }, []);

  const navLinks = [
    { id: NavLink.HOME, label: 'Home' },
    { id: NavLink.PORTFOLIO, label: 'Portfolio', hasDropdown: true },
    { id: NavLink.SERVICES, label: 'Services' },
    { id: NavLink.CONTACT, label: 'Contact' },
  ];

  const portfolioCategories = [
    'Wedding', 'Puberty', 'Maternity', 'Baby', 'Portrait', 'Couple Photography'
  ];

  const handlePortfolioClick = (category: string) => {
    scrollToSection(NavLink.PORTFOLIO);
    const event = new CustomEvent('portfolio-filter-change', { detail: category });
    window.dispatchEvent(event);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 dark:bg-black/90 backdrop-blur-md py-3 border-b border-zinc-100 dark:border-zinc-800 shadow-sm dark:shadow-zinc-900/20`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => scrollToSection(NavLink.HOME)}
        >
          <div className="text-2xl font-serif italic font-bold tracking-wider text-black dark:text-white">
            <span className="text-brand-600">SKYCAM</span> <span className="text-black dark:text-white text-lg not-italic">PHOTOGRAPHY</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.id} className="relative group">
              <button
                onClick={() => {
                  if (link.id !== NavLink.PORTFOLIO) {
                    scrollToSection(link.id);
                  }
                }}
                className={`flex items-center gap-1 text-sm tracking-widest uppercase transition-colors duration-300 hover:text-brand-600 ${activeLink === link.id ? 'text-brand-600 font-medium' : 'text-zinc-800 dark:text-zinc-300 font-medium'}`}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
              </button>

              {/* Dropdown Menu */}
              {link.hasDropdown && (
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden min-w-[200px]">
                    {portfolioCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePortfolioClick(cat);
                        }}
                        className="block w-full text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 transition-colors border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}


        </div>

        <button
          className="md:hidden hover:text-brand-600 transition-colors text-black dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 transition-all duration-300 overflow-hidden shadow-xl ${isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <div key={link.id}>
              {link.hasDropdown ? (
                <div className="flex flex-col">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === link.id ? null : link.id)}
                    className={`flex items-center justify-between w-full text-left text-sm tracking-widest uppercase py-2 ${activeLink === link.id ? 'text-brand-600 font-medium' : 'text-zinc-800 dark:text-zinc-300'}`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.id ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`flex flex-col pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 ml-1 transition-all duration-300 overflow-hidden ${activeDropdown === link.id ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    {portfolioCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handlePortfolioClick(cat)}
                        className="text-left text-xs font-bold uppercase tracking-wider py-2 text-zinc-500 dark:text-zinc-400 hover:text-brand-600"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    scrollToSection(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-sm tracking-widest uppercase py-2 ${activeLink === link.id ? 'text-brand-600 font-medium' : 'text-zinc-800 dark:text-zinc-300'}`}
                >
                  {link.label}
                </button>
              )}
            </div>
          ))}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;