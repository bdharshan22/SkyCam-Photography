import React from 'react';
import { Instagram, MessageCircle, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-surface-950 py-20 border-t border-white/5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-brand-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-serif font-bold text-gradient-gold">SKYCAM</span>
              <span className="text-xs font-display font-medium tracking-[0.3em] uppercase text-white/30">Photography</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
              Premium photography & videography studio based in Hosur, Tamil Nadu. 
              Crafting cinematic visual stories for your most precious moments.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { href: "https://www.instagram.com/skycamphotography01/", icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
                { href: "https://wa.me/918667518859", icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp" },
                { href: "mailto:skycam2809@gmail.com", icon: <Mail className="w-4 h-4" />, label: "Email" },
                { href: "tel:+918667518859", icon: <Phone className="w-4 h-4" />, label: "Phone" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target={s.href.startsWith('http') ? "_blank" : undefined}
                  rel={s.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="p-2.5 rounded-xl border border-white/5 text-zinc-500 hover:text-brand-400 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all duration-300"
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — with proper routes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Packages</h4>
            <ul className="space-y-3">
              {[
                { label: 'Wedding Photography', to: '/portfolio/wedding' },
                { label: 'Drone Videography', to: '/drone-videography' },
                { label: 'Portrait Sessions', to: '/portfolio/portrait' },
                { label: 'Baby & Kids', to: '/portfolio/baby' },
                { label: 'Maternity Shoots', to: '/portfolio/maternity' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-zinc-500 hover:text-brand-400 text-sm transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+918667518859" className="text-zinc-500 hover:text-brand-400 text-sm transition-colors flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  +91 86675 18859
                </a>
              </li>
              <li>
                <a href="mailto:skycam2809@gmail.com" className="text-zinc-500 hover:text-brand-400 text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  skycam2809@gmail.com
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/KSHXMcyVfHfc7FkT7" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-brand-400 text-sm transition-colors flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Hosur, Tamil Nadu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs">
            &copy; {currentYear} Skycam Photography. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-600 text-xs">Privacy Policy</span>
            <span className="text-zinc-600 text-xs">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;