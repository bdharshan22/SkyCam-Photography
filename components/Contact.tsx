import React, { useEffect, useState } from 'react';
import { NavLink } from '../types';
import { MapPin, Phone, Mail, Star, User, MessageSquare, Send, CheckCircle, PenLine, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const Contact: React.FC = () => {
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    event_type: '',
    rating: 5,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const sectionRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setReviewForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await api.submitReview({
        name: reviewForm.name,
        event_type: reviewForm.event_type,
        rating: reviewForm.rating,
        message: reviewForm.message,
      });

      if (result.success) {
        setSubmitState('success');
        setReviewForm({ name: '', event_type: '', rating: 5, message: '' });
        setTimeout(() => setSubmitState('idle'), 5000);
      } else {
        setSubmitState('error');
        setTimeout(() => setSubmitState('idle'), 4000);
      }
    } catch {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = ['Wedding', 'Pre-Wedding', 'Engagement', 'Birthday', 'Maternity', 'Baby Shower', 'Corporate Event', 'Portrait Session', 'Drone Videography', 'Other'];

  return (
    <section id={NavLink.CONTACT} ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-surface-900 noise-overlay">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
            <Mail className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Get In Touch</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Let's Create{' '}
            <span className="text-gradient-gold">Magic</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light">
            Reach us directly or share your experience — your feedback helps us grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info — LEFT */}
          <div className="lg:col-span-2 space-y-6 reveal-on-scroll">
            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                title: 'Studio Location',
                content: 'Hosur, Tamil Nadu',
                sub: 'View on Google Maps',
                href: 'https://maps.app.goo.gl/KSHXMcyVfHfc7FkT7',
              },
              {
                icon: <Mail className="w-5 h-5" />,
                title: 'Email Us',
                content: 'skycam2809@gmail.com',
                href: 'mailto:skycam2809@gmail.com',
              },
              {
                icon: <Phone className="w-5 h-5" />,
                title: 'Call Us',
                content: '+91 86675 18859',
                href: 'tel:+918667518859',
              },
            ].map((info, i) => (
              <a
                key={i}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 glass-card rounded-xl p-5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-black transition-all duration-300">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-0.5">{info.title}</h4>
                  <p className="text-zinc-400 text-sm">{info.content}</p>
                  {info.sub && (
                    <span className="text-brand-400 text-xs font-medium hover:text-brand-300 mt-1 inline-block">{info.sub}</span>
                  )}
                </div>
              </a>
            ))}

            {/* Map */}
            <div className="glass-card rounded-xl overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.80440024844!2d77.64835!3d12.7358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b2c0e52f667%3A0x4606ca07a98adf86!2sHosur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Skycam Photography Location"
              />
            </div>
          </div>

          {/* ============================================ */}
          {/* USER REVIEW AREA — RIGHT */}
          {/* ============================================ */}
          <div className="lg:col-span-3 reveal-on-scroll reveal-delay-2">
            <div className="glass-card rounded-2xl p-8">

              {submitState === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Review Submitted!</h3>
                  <p className="text-zinc-400 text-center text-sm max-w-sm">
                    Thank you for your feedback! Your review will be visible on the site once approved by the admin.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <PenLine className="w-4 h-4 text-brand-400" />
                    <h3 className="text-lg font-serif font-semibold text-white">Share Your Experience</h3>
                  </div>
                  <p className="text-zinc-500 text-xs -mt-3 mb-4">
                    Your review helps others find the right photographer. Reviews are published after admin approval.
                  </p>

                  {submitState === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  {/* Name & Event Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Your Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-zinc-600" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={reviewForm.name}
                          onChange={handleChange}
                          required
                          className="input-premium !pl-12"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Event Type *</label>
                      <select
                        name="event_type"
                        value={reviewForm.event_type}
                        onChange={handleChange}
                        required
                        className="input-premium appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:16px]"
                      >
                        <option value="" className="bg-zinc-900 text-white">Select event type</option>
                        {eventTypes.map(t => <option key={t} value={t} className="bg-zinc-900 text-white">{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Your Rating *</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="transition-all duration-200 hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= reviewForm.rating
                                ? 'text-brand-400 fill-brand-400'
                                : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-zinc-400 font-medium">{reviewForm.rating}/5</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Your Review *</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none">
                        <MessageSquare className="h-4 w-4 text-zinc-600" />
                      </div>
                      <textarea
                        name="message"
                        value={reviewForm.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="input-premium resize-none !pl-12"
                        placeholder="Share your experience with Skycam Photography..."
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !reviewForm.name || !reviewForm.event_type || !reviewForm.message}
                    className="w-full btn-premium justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>

                  <p className="text-center text-zinc-600 text-xs">
                    Your review will be visible after admin approval.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;