import React, { useEffect, useRef } from 'react';
import { Camera, Award, Heart, Users, Clock, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

  const milestones = [
    { year: '2019', title: 'The Beginning', desc: 'Started with a passion for capturing moments that matter', icon: <Camera className="w-5 h-5" /> },
    { year: '2020', title: 'First Wedding', desc: 'Shot our first full wedding — 2000+ photos delivered', icon: <Heart className="w-5 h-5" /> },
    { year: '2022', title: 'Drone Certified', desc: 'Professional drone pilot certification for aerial cinematography', icon: <Award className="w-5 h-5" /> },
    { year: '2024', title: '500+ Events', desc: 'Crossed 500 successfully completed events with 100% satisfaction', icon: <Users className="w-5 h-5" /> },
    { year: '2026', title: 'Studio Launch', desc: 'Launched our premium studio with state-of-the-art equipment', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-surface-950 noise-overlay">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left: Text Content */}
          <div className="reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <Camera className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">Our Story</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Capturing life's most{' '}
              <span className="text-gradient-gold">precious</span>{' '}
              moments
            </h2>
            
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              At Skycam Photography, we believe every frame tells a story. 
              Founded with a passion for cinematic storytelling, we've grown 
              from a small dream into Hosur's most trusted photography studio.
            </p>
            
            <p className="text-zinc-500 leading-relaxed mb-8">
              Our team combines cutting-edge technology with artistic vision 
              to deliver photographs and videos that you'll treasure forever. 
              From intimate portraits to grand weddings, we bring the same 
              level of dedication and creativity to every project.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '500+', label: 'Events' },
                { value: '10K+', label: 'Photos' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 glass-card rounded-xl">
                  <p className="text-2xl font-serif font-bold text-gradient-gold">{stat.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image + Badge */}
          <div className="reveal-on-scroll reveal-delay-2 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] glow-gold">
              <img 
                src="/Instapage/photographer_at_work.png" 
                alt="Skycam Photography at work" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent" />
              
              {/* Floating badge — inside container so it never overflows */}
              <div className="absolute bottom-6 left-4 right-4 glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Certified Professional</p>
                    <p className="text-zinc-400 text-xs">Licensed Drone Pilot & Photographer</p>
                  </div>
                </div>
              </div>

              {/* Experience badge — top right inside image */}
              <div className="absolute top-4 right-4 glass-card rounded-2xl p-3 animate-float">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <div>
                    <p className="text-white font-bold text-base">7+</p>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Years Exp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="reveal-on-scroll">
          <h3 className="text-center text-2xl font-serif font-semibold text-white mb-12">
            Our <span className="text-gradient-gold">Journey</span>
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {milestones.map((milestone, i) => (
                <div 
                  key={i} 
                  className={`reveal-on-scroll reveal-delay-${i + 1} flex flex-col items-center text-center group`}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center mb-4 group-hover:border-brand-500/50 group-hover:bg-brand-500/10 transition-all duration-300 relative z-10">
                    <span className="text-zinc-400 group-hover:text-brand-400 transition-colors">{milestone.icon}</span>
                  </div>
                  
                  <span className="text-brand-400 font-bold text-sm mb-1">{milestone.year}</span>
                  <h4 className="text-white font-semibold text-sm mb-1">{milestone.title}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
