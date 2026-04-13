import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from '../types';
import { Menu, X, ChevronDown, Navigation } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  activeLink: string;
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeLink, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    // Close on Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { id: NavLink.HOME, label: 'Home' },
    { id: 'about', label: 'About' },
    { id: NavLink.PORTFOLIO, label: 'Portfolio', hasDropdown: true },
    { id: NavLink.SERVICES, label: 'Packages' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'drone', label: 'Drone', isRoute: true, route: '/drone-videography' },
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
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20' 
          : 'py-4 bg-transparent'
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => scrollToSection(NavLink.HOME)}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-serif font-bold text-gradient-gold tracking-tight">
              SKYCAM
            </span>
            <span className="text-xs font-display font-medium tracking-[0.3em] uppercase text-white/40 group-hover:text-white/60 transition-colors">
              Photography
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.id} className="relative group">
              <button
                onClick={() => {
                  if ((link as any).isRoute) {
                    navigate((link as any).route);
                  } else if (link.id !== NavLink.PORTFOLIO) {
                    scrollToSection(link.id);
                  }
                }}
                className={`flex items-center gap-1 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 rounded-lg ${
                  activeLink === link.id 
                    ? 'text-brand-400 bg-brand-500/5' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.id === 'drone' && <Navigation size={11} className="text-brand-400" />}
                {link.label}
                {link.hasDropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />}
              </button>

              {/* Dropdown */}
              {link.hasDropdown && (
                <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="glass-card rounded-xl overflow-hidden min-w-[220px] py-2">
                    {portfolioCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePortfolioClick(cat);
                        }}
                        className="block w-full text-left px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 hover:bg-brand-500/10 hover:text-brand-400 transition-all duration-200"
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

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white hover:text-brand-400 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-surface-950/95 backdrop-blur-xl border-b border-white/5 transition-all duration-400 overflow-hidden ${
        isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col p-6 space-y-1">
          {navLinks.map((link) => (
            <div key={link.id}>
              {link.hasDropdown ? (
                <div className="flex flex-col">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === link.id ? null : link.id)}
                    className={`flex items-center justify-between w-full text-left text-xs tracking-[0.15em] uppercase py-3 px-3 rounded-lg font-medium ${
                      activeLink === link.id ? 'text-brand-400 bg-brand-500/5' : 'text-zinc-400'
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.id ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`flex flex-col pl-4 border-l border-brand-500/20 ml-3 transition-all duration-300 overflow-hidden ${
                    activeDropdown === link.id ? 'max-h-[300px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}>
                    {portfolioCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handlePortfolioClick(cat)}
                        className="text-left text-[11px] font-medium uppercase tracking-wider py-2 px-3 text-zinc-500 hover:text-brand-400 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if ((link as any).isRoute) {
                      navigate((link as any).route);
                    } else {
                      scrollToSection(link.id);
                    }
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left text-xs tracking-[0.15em] uppercase py-3 px-3 rounded-lg font-medium flex items-center gap-2 ${
                    activeLink === link.id ? 'text-brand-400 bg-brand-500/5' : 'text-zinc-400'
                  }`}
                >
                  {link.id === 'drone' && <Navigation size={11} className="text-brand-400" />}
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