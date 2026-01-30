import React, { useEffect } from 'react';
import { NavLink } from '../types';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id={NavLink.CONTACT} className="py-24 bg-white dark:bg-zinc-900 relative overflow-hidden transition-colors duration-300">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5 dark:opacity-[0.03] pointer-events-none whitespace-nowrap select-none">
        <span className="text-[140px] md:text-[200px] font-serif font-bold text-zinc-900 dark:text-white leading-none">GET IN TOUCH</span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <div className="reveal-on-scroll mb-16">
            <h2 className="text-brand-600 tracking-widest text-sm uppercase font-semibold mb-3">Get in Touch</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-black dark:text-white mb-6">Let's Capture Moments Together</h3>
            <div className="h-[1px] w-[120px] bg-brand-600 mx-auto mb-8"></div>
            <p className="text-zinc-600 dark:text-zinc-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed text-lg">
              Ready to capture your special moments? Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-on-scroll">

            <div className="flex flex-col items-center group">
              <a
                href="https://maps.app.goo.gl/KSHXMcyVfHfc7FkT7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors"
              >
                <MapPin className="w-6 h-6 text-brand-600 dark:text-brand-500" />
              </a>
              <h4 className="text-black dark:text-white text-lg font-medium mb-2">Studio Location</h4>
              <a
                href="https://maps.app.goo.gl/KSHXMcyVfHfc7FkT7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 font-light hover:text-brand-600 dark:hover:text-brand-500 transition-colors text-center"
              >
                Hosur, Tamil Nadu<br />
                <span className="text-xs uppercase tracking-widest border-b border-zinc-300 dark:border-zinc-600 pb-0.5">View on Google Maps</span>
              </a>
            </div>

            <div className="flex flex-col items-center group">
              <a href="mailto:skycam2809@gmail.com" className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
                <Mail className="w-6 h-6 text-brand-600 dark:text-brand-500" />
              </a>
              <h4 className="text-black dark:text-white text-lg font-medium mb-2">Email</h4>
              <a href="mailto:skycam2809@gmail.com" className="text-zinc-500 dark:text-zinc-400 font-light hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
                skycam2809@gmail.com
              </a>
            </div>

            <div className="flex flex-col items-center group">
              <a href="tel:+918667518859" className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
                <Phone className="w-6 h-6 text-brand-600 dark:text-brand-500" />
              </a>
              <h4 className="text-black dark:text-white text-lg font-medium mb-2">Phone</h4>
              <a href="tel:+918667518859" className="text-zinc-500 dark:text-zinc-400 font-light hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
                +91 86675 18859
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;