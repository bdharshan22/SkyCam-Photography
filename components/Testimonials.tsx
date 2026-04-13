import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { supabase } from '../services/supabase';

interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  text: string;
  rating: number;
  event: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya & Karthik',
    role: 'Wedding Clients',
    text: 'Skycam captured our wedding beautifully! The drone shots were absolutely breathtaking, and the cinematic highlight film brought tears to our eyes. Every single photo tells a story.',
    rating: 5,
    event: 'Wedding Photography',
    avatar: 'PK',
  },
  {
    id: 2,
    name: 'Deepika Rajan',
    role: 'Maternity Shoot',
    text: 'The team made us feel so comfortable during the maternity shoot. The photos are ethereal — soft, dreamy, and full of emotion. We couldn\'t have asked for better pictures.',
    rating: 5,
    event: 'Maternity Photography',
    avatar: 'DR',
  },
  {
    id: 3,
    name: 'Arun & Lakshmi',
    role: 'Wedding Clients',
    text: 'From the candid moments to the traditional shots — everything was perfect. The videography team captured angles we didn\'t even know existed. Truly premium service.',
    rating: 5,
    event: 'Wedding + Drone',
    avatar: 'AL',
  },
  {
    id: 4,
    name: 'Sanjay Kumar',
    role: 'Corporate Event',
    text: 'We hired Skycam for our company\'s annual day celebration. The professionalism, speed of delivery, and quality of photos exceeded all expectations. Highly recommended!',
    rating: 5,
    event: 'Corporate Event',
    avatar: 'SK',
  },
  {
    id: 5,
    name: 'Meera & Raj',
    role: 'Engagement Shoot',
    text: 'Our pre-wedding shoot was like a Bollywood movie! The outdoor locations chosen were perfect, and the editing style gave everything a cinematic feel. 10/10!',
    rating: 5,
    event: 'Pre-Wedding Shoot',
    avatar: 'MR',
  },
  {
    id: 6,
    name: 'Kavitha Sundaram',
    role: 'Birthday Party',
    text: 'Booked Skycam for my daughter\'s first birthday. They were so patient with the kids and captured the most adorable candid moments. The photo book turned out amazing!',
    rating: 5,
    event: 'Birthday Photography',
    avatar: 'KS',
  },
];

const Testimonials: React.FC = () => {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(testimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const [visibleCount, setVisibleCount] = useState(typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1);

  // Update visible count on resize (e.g. orientation change)
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth >= 768 ? 3 : 1);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        const dbTestimonials: Testimonial[] = data.map((review) => {
          const initials = review.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'C';
          return {
            id: `db-${review.id}`,
            name: review.name,
            role: 'Client',
            text: review.message,
            rating: review.rating,
            event: review.event_type,
            avatar: initials,
          };
        });
        setAllTestimonials([...dbTestimonials, ...testimonials]);
      }
    };
    fetchApprovedReviews();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || allTestimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, allTestimonials.length]);

  // Reset index if it goes out of bounds after resize changes visibleCount
  useEffect(() => {
    if (currentIndex >= allTestimonials.length) {
      setCurrentIndex(0);
    }
  }, [visibleCount, allTestimonials.length, currentIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const getVisibleTestimonials = () => {
    if (allTestimonials.length === 0) return [];
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(allTestimonials[(currentIndex + i) % allTestimonials.length]);
    }
    return result;
  };

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-surface-900 noise-overlay">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
            <Star className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Client Love</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            What Our Clients{' '}
            <span className="text-gradient-gold">Say</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light">
            Hear from the people whose precious moments we've had the honour of capturing.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {getVisibleTestimonials().map((t, i) => (
              <div
                key={`${t.id}-${currentIndex}`}
                className="testimonial-card glass-card rounded-2xl p-8 flex flex-col animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-brand-500/20 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-brand-400 fill-brand-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-zinc-300 text-sm leading-relaxed flex-grow mb-6 font-light italic">
                  "{t.text}"
                </p>

                {/* Divider */}
                <div className="h-px bg-white/5 mb-4" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-black text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-zinc-500 text-xs">{t.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>



            <button
              onClick={next}
              className="p-3 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Google Review CTA */}
        <div className="mt-16 text-center reveal-on-scroll">
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-8 py-4">
            <div className="flex -space-x-2">
              {['PK', 'DR', 'AL', 'SK'].map((initials, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-[10px] font-bold text-black border-2 border-surface-900">
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3 h-3 text-brand-400 fill-brand-400" />
                ))}
                <span className="text-white text-sm font-bold ml-1">5.0</span>
              </div>
              <p className="text-zinc-500 text-xs">Rated by 100+ happy clients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
