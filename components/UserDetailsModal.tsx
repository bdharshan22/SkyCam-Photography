import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, CheckCircle, User, Phone } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden animate-scale-up">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-500 to-brand-600"></div>
        <div className="absolute top-4 right-4">
          <Sparkles className="w-6 h-6 text-white opacity-50" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Heart className="w-5 h-5 text-white opacity-30" />
        </div>

        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 group"
            aria-label="Close"
          >
            <X size={20} className="group-hover:scale-110 transition-transform" />
          </button>

          {!showSuccess ? (
            <>
              <div className="text-center mb-8 relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white relative z-10 text-brand-600">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 pt-2">Welcome to Skycam!</h2>
                <p className="text-gray-600">Please share your details so we can create something beautiful together.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 outline-none bg-white text-black placeholder-gray-500 appearance-none text-base"
                        style={{
                          colorScheme: 'light',
                          color: 'black',
                          backgroundColor: '#ffffff',
                          WebkitTextFillColor: 'black',
                          opacity: 1
                        }}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="whatsapp"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 outline-none bg-white text-black placeholder-gray-500 appearance-none text-base"
                        style={{
                          colorScheme: 'light',
                          color: 'black',
                          backgroundColor: '#ffffff',
                          WebkitTextFillColor: 'black',
                          opacity: 1
                        }}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !whatsapp.trim()}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-4 px-6 rounded-xl font-bold text-lg focus:ring-4 focus:ring-brand-500/30 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Continue to Portfolio'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-4">Welcome to the world of beautiful photography!</p>
              <p className="text-sm text-gray-500">We're excited to create amazing memories with you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
