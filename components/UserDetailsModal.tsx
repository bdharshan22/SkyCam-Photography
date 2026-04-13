import React, { useState, useEffect } from 'react';
import { X, Camera, CheckCircle, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, whatsapp: string) => Promise<{ success: boolean; error?: string }>;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Trigger mount animation
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = await onSubmit(name.trim(), whatsapp.trim());
    setIsSubmitting(false);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } else {
      setError(result.error || 'Please check with the Admin');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[80] p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-[440px] z-10 transition-all duration-500 ease-out ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>

        {/* Card */}
        <div className="relative rounded-[2rem] overflow-hidden bg-zinc-900/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_-20px_rgba(245,158,11,0.15)]">

          {/* Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:rotate-90 transition-all duration-300 backdrop-blur-md"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>

          {/* Decorative Top Glow */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-500/20 via-brand-500/5 to-transparent pointer-events-none" />
          
          <div className="relative px-8 pt-10 pb-8 sm:px-10">

            {!showSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  {/* Premium Icon */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-pulse blur-xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/20 to-transparent" />
                      <Camera className="w-8 h-8 text-brand-400 relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
                      <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-brand-300 animate-pulse" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-light text-white tracking-tight mb-3">
                    Welcome to <span className="font-semibold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">Skycam</span>
                  </h2>
                  <p className="text-zinc-400 text-[14px] leading-relaxed max-w-[280px] mx-auto">
                    Share your details and let's craft something beautiful together.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="modal-name" className="block text-[12px] font-medium text-zinc-400 ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        id="modal-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-[15px] placeholder-zinc-600 outline-none focus:border-brand-500/50 focus:bg-brand-500/[0.02] focus:ring-4 focus:ring-brand-500/10 transition-all duration-300"
                        placeholder="Enter your name"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label htmlFor="modal-whatsapp" className="block text-[12px] font-medium text-zinc-400 ml-1">
                      WhatsApp Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        id="modal-whatsapp"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-[15px] placeholder-zinc-600 outline-none focus:border-brand-500/50 focus:bg-brand-500/[0.02] focus:ring-4 focus:ring-brand-500/10 transition-all duration-300"
                        placeholder="+91 98765 43210"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="pt-2" />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || whatsapp.replace(/\D/g, '').length < 10}
                    className="w-full relative py-4 rounded-2xl text-[15px] font-semibold text-zinc-900 overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] disabled:shadow-none hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Portfolio
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Footer note */}
                <p className="text-center text-zinc-500 text-[12px] mt-6 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  Your privacy is 100% protected
                </p>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping blur-xl" />
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                    <CheckCircle className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                  </div>
                </div>
                <h2 className="text-3xl font-light text-white mb-3">
                  Thank <span className="font-semibold text-emerald-400">You!</span>
                </h2>
                <p className="text-zinc-400 text-[15px] mb-8">
                  Welcome to the world of beautiful photography
                </p>
                <div className="flex items-center justify-center gap-2 text-zinc-500 text-[13px]">
                  <span className="w-4 h-4 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
                  Redirecting you to portfolio...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
