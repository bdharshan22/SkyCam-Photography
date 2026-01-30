import React, { useState, useEffect, useRef } from 'react';
import { NavLink, PhotoItem } from '../types';
import { Maximize2, Filter, ArrowUpRight, Camera } from 'lucide-react';
import Lightbox from './Lightbox';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>('wedding');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<number>(12); // Initial load count

  // Intersection Observer for fade-in animations
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
  }, [filter, visibleItems]);

  // Listen for navbar dropdown events
  useEffect(() => {
    const handleFilterChange = (e: CustomEvent) => {
      setFilter(e.detail);
      // Reset visible items when filter changes from dropdown
      setVisibleItems(12);
    };

    window.addEventListener('portfolio-filter-change' as any, handleFilterChange);
    return () => {
      window.removeEventListener('portfolio-filter-change' as any, handleFilterChange);
    };
  }, []);

  const photos: PhotoItem[] = [
    { id: 1, url: '/Instapage/birthday.jpeg', category: 'Couple Photography', title: 'Couple Moments' },
    { id: 2, url: '/Instapage/kids.jpeg', category: 'portrait', title: 'Little Wonder' },
    { id: 3, url: '/Instapage/babyshower.jpeg', category: 'Baby Shower', title: 'Awaiting Miracle' },
    { id: 4, url: '/Instapage/familyphoto.jpeg', category: 'Family Photo', title: 'Generations' },
    { id: 5, url: '/Instapage/marriage.jpeg', category: 'wedding', title: 'Standard Wedding' },
    { id: 6, url: '/Instapage/bride.jpeg', category: 'wedding', title: 'Bridal Glow' },
    { id: 7, url: '/Instapage/marriage02.jpeg', category: 'wedding', title: 'Couple Goals' },
    { id: 8, url: '/Instapage/kids03.jpeg', category: 'baby', title: 'First Steps' },
    { id: 9, url: '/Instapage/wedding03.jpeg', category: 'portrait', title: 'Soulful Eyes' },
    { id: 10, url: '/Instapage/kids.jpeg', category: 'baby', title: 'Innocence' },
    { id: 11, url: '/Instapage/wedding04.jpeg', category: 'wedding', title: 'Candid Joy' },
    { id: 12, url: '/Instapage/groom.jpeg', category: 'portrait', title: 'Monochrome Dream' },
    { id: 13, url: '/Instapage/portrait.jpeg', category: 'baby', title: 'Sweet Dreams' },
  ];

  const categories = ['wedding', 'puberty', 'maternity', 'baby', 'portrait', 'Couple Photography'];
  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  // Cinematic Grid Logic: Varied spans for visual interest
  const getGridClass = (index: number) => {
    // 6-item repeating pattern for a more organic feel
    const pattern = [
      'md:col-span-2 md:row-span-2 aspect-[4/3]', // Hero
      'md:col-span-1 md:row-span-1 aspect-[3/4]', // Portrait
      'md:col-span-1 md:row-span-1 aspect-square', // Square
      'md:col-span-1 md:row-span-2 aspect-[3/5]', // Tall
      'md:col-span-2 md:row-span-1 aspect-[16/9]', // Wide
      'md:col-span-1 md:row-span-1 aspect-square', // Square
    ];
    return pattern[index % pattern.length];
  };

  // Handlers for Lightbox
  const openLightbox = (index: number) => setSelectedPhotoIndex(index);
  const closeLightbox = () => setSelectedPhotoIndex(null);
  const nextPhoto = () => setSelectedPhotoIndex(prev => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev));
  const prevPhoto = () => setSelectedPhotoIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));

  return (
    <section id={NavLink.PORTFOLIO} ref={sectionRef} className="py-24 relative z-20 min-h-screen bg-zinc-950 text-white selection:bg-brand-500 selection:text-white">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Cinematic Header */}
        <div className="flex flex-col items-start mb-20 reveal-on-scroll border-b border-white/5 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-brand-500"></span>
            <span className="text-brand-500 font-bold uppercase tracking-[0.3em] text-xs">Portable Gallery</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-serif font-medium text-white mb-6 leading-[0.9]">
            Visual <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Masterpieces</span>
          </h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-8">
            <p className="max-w-xl text-zinc-400 text-lg font-light leading-relaxed">
              We believe every frame should be a work of art. Dive into our curated collection of moments that define luxury and emotion.
            </p>

            {/* Minimalist Filter Tabs */}
            <div className="flex flex-wrap gap-2 md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-none border-b-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${filter === cat
                    ? 'border-brand-500 text-white'
                    : 'border-transparent text-zinc-600 hover:text-zinc-300'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(100px,auto)]">
          {filteredPhotos.slice(0, visibleItems).map((photo, index) => (
            <div
              key={photo.id}
              className={`
                group relative overflow-hidden bg-zinc-900 cursor-none
                ${getGridClass(index)}
                reveal-on-scroll
              `}
              onClick={() => openLightbox(index)}
            >
              {/* Image */}
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:filter group-hover:grayscale-[0.2]"
              />

              {/* Dark Overlay with Glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">

                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-widest rounded border border-brand-500/20 backdrop-blur-md">
                      {photo.category}
                    </span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-serif text-white mb-2">{photo.title}</h4>
                  <div className="h-px w-0 group-hover:w-full bg-brand-500 transition-all duration-700 delay-100 opacity-50"></div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <span>View Project</span>
                    <ArrowUpRight size={14} className="text-brand-500" />
                  </div>
                </div>
              </div>

              {/* Cursor Icon (Mock) - visible only on hover if we had a custom cursor implementation, 
                  but here just a corner icon for indication */}
              <div className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-500 hover:text-black">
                <Maximize2 size={18} />
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button (if applicable) */}
        {visibleItems < filteredPhotos.length && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => setVisibleItems(prev => prev + 6)}
              className="group relative px-8 py-4 bg-transparent overflow-hidden text-white font-bold tracking-[0.2em] uppercase text-xs border border-white/20 hover:border-brand-500 transition-colors"
            >
              <span className="relative z-10 flex items-center gap-2">
                Load More Memories <Camera size={14} />
              </span>
              <div className="absolute inset-0 bg-brand-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="py-32 text-center border border-white/5 rounded-2xl bg-zinc-900/50">
            <div className="inline-flex p-4 rounded-full bg-zinc-800 mb-6 text-zinc-500">
              <Camera size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">No moments found</h3>
            <p className="text-zinc-500">Try selecting a different category.</p>
          </div>
        )}

      </div>

      {/* Lightbox Overlay */}
      {selectedPhotoIndex !== null && (
        <Lightbox
          photo={filteredPhotos[selectedPhotoIndex]}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
          hasNext={selectedPhotoIndex < filteredPhotos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}

    </section>
  );
};

export default Portfolio;