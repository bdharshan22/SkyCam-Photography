import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a scroll threshold
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickMessages = [
    { label: '📸 Book a Session', msg: 'Hi Skycam! I would like to book a photography session.' },
    { label: '💰 Package Pricing', msg: 'Hello! Can I get details about your photography packages and pricing?' },
    { label: '📅 Check Availability', msg: 'Hi! I wanted to check your availability for an upcoming event.' },
    { label: '🎥 Drone Coverage', msg: 'Hello Skycam! I\'m interested in your drone videography services.' },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Quick Message Panel */}
      {isOpen && (
        <div className="glass-card rounded-2xl p-5 w-72 max-w-[calc(100vw-3rem)] animate-modal-enter shadow-2xl shadow-black/40 mb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white text-sm font-bold">Chat with us</h4>
              <p className="text-zinc-500 text-xs">Usually replies within minutes</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {quickMessages.map((qm, i) => (
              <a
                key={i}
                href={`https://wa.me/918667518859?text=${encodeURIComponent(qm.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/20 text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200"
              >
                {qm.label}
              </a>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5">
            <a
              href="https://wa.me/918667518859?text=Hello%20Skycam!"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-zinc-800 border border-white/10 text-white'
            : 'bg-green-600 hover:bg-green-500 text-white hover:scale-110 hover:shadow-green-500/30'
        }`}
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <MessageCircle size={24} />
            {/* Ping animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppFloat;
