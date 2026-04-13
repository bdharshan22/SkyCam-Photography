import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpRight, X, ChevronLeft, ChevronRight,
  ZoomIn, Camera, LayoutGrid, Grid3X3, Sparkles
} from 'lucide-react';
import { useCmsPhotos } from '../hooks/useCmsPhotos';
import { CmsPhoto } from '../services/cms';

// ─── Category metadata ───────────────────────────────────────────────────────
const categoryMeta: Record<string, { title: string; tagline: string; description: string; emoji: string }> = {
  all:       { title: 'All Works',   tagline: 'Complete Collection',  description: 'Every story we\'ve had the privilege of capturing — browse our complete portfolio.',           emoji: '✦' },
  wedding:   { title: 'Wedding',     tagline: 'Timeless Love Stories', description: 'From sacred vows to candid celebrations — every wedding is a cinematic masterpiece.',        emoji: '💍' },
  portrait:  { title: 'Portrait',    tagline: 'Faces That Speak',      description: 'Intimate portraits that reveal character, emotion, and the beauty of the human spirit.',      emoji: '🎭' },
  baby:      { title: 'Baby & Kids', tagline: 'Pure Innocence',        description: 'Precious moments of childhood wonder — first smiles, first steps, first everything.',        emoji: '👶' },
  maternity: { title: 'Maternity',   tagline: 'Awaiting Miracles',     description: 'Celebrating the beautiful journey of motherhood with grace and artistic vision.',            emoji: '🌸' },
  couple:    { title: 'Couple',      tagline: 'Two Hearts, One Frame', description: 'Pre-wedding shoots, engagements, and love stories captured in their most natural form.',     emoji: '❤️' },
  drone:     { title: 'Drone',       tagline: 'Above & Beyond',        description: 'Breathtaking aerial perspectives that transform every landscape into cinematic art.',          emoji: '🚁' },
  event:     { title: 'Events',      tagline: 'Every Milestone',       description: 'Birthdays, corporate events, celebrations — every occasion deserves a perfect frame.',        emoji: '🎉' },
};

// ─── Masonry column layout helpers ──────────────────────────────────────────
function assignColumns(photos: CmsPhoto[], cols: number): CmsPhoto[][] {
  const columns: CmsPhoto[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  photos.forEach((photo) => {
    const shortest = heights.indexOf(Math.min(...heights));
    // Vary aspect so grid looks organic: alternate tall/wide ratios
    const aspectVariant = photo.id % 3;
    const fakeH = aspectVariant === 0 ? 1.4 : aspectVariant === 1 ? 1.0 : 1.8;
    columns[shortest].push(photo);
    heights[shortest] += fakeH;
  });
  return columns;
}

function useColumns() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const update = () => setCols(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

// ─── Single photo card ───────────────────────────────────────────────────────
interface PhotoCardProps {
  photo: CmsPhoto;
  index: number;
  onClick: () => void;
  visible: boolean;
}

const ASPECT_CLASSES = ['aspect-[3/4]', 'aspect-[1/1]', 'aspect-[3/5]'];

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index, onClick, visible }) => {
  const aspectClass = ASPECT_CLASSES[photo.id % 3];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-out watermark-overlay ${aspectClass} ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${(index % 8) * 45}ms` }}
      onClick={onClick}
    >
      <img
        src={photo.url}
        alt={photo.title}
        loading="lazy"
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Zoom icon */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/60 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-brand-500 hover:text-black">
        <ZoomIn size={13} />
      </div>

      {/* Category tag */}
      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/70 text-[9px] font-bold uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {photo.category}
      </span>

      {/* Title bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
        <h4 className="text-sm font-serif text-white font-medium leading-tight">{photo.title}</h4>
        <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-brand-500/70 to-transparent transition-all duration-500 delay-75 mt-1.5" />
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const PortfolioGallery: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const cols = useColumns();

  // Active filter (independent from URL — allows in-page filtering without navigation)
  const [activeFilter, setActiveFilter] = useState<string>(category || 'all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');

  // Sync filter with URL param on mount / URL change
  useEffect(() => {
    setActiveFilter(category || 'all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  // When filter changes: briefly hide cards → reassign → fade back in
  const prevFilter = useRef(activeFilter);
  useEffect(() => {
    if (prevFilter.current !== activeFilter) {
      setCardsVisible(false);
      const t = setTimeout(() => setCardsVisible(true), 80);
      prevFilter.current = activeFilter;
      return () => clearTimeout(t);
    }
  }, [activeFilter]);

  const { photos: allLivePhotos, loading, isFallback } = useCmsPhotos(); // fetch ALL, filter client-side

  const filtered: CmsPhoto[] = activeFilter === 'all'
    ? allLivePhotos
    : allLivePhotos.filter(p => p.category === activeFilter);

  // Trigger entrance animation after loading
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setCardsVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight' && selectedIndex < filtered.length - 1) setSelectedIndex(s => s! + 1);
      if (e.key === 'ArrowLeft' && selectedIndex > 0) setSelectedIndex(s => s! - 1);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selectedIndex, filtered.length]);

  const meta = categoryMeta[activeFilter] || categoryMeta.all;
  const masonryColumns = assignColumns(filtered, cols);
  const categories = Object.keys(categoryMeta);

  const handleFilterClick = useCallback((key: string) => {
    setCardsVisible(false);
    setTimeout(() => {
      setActiveFilter(key);
      navigate(`/portfolio/${key}`, { replace: true });
    }, 60);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface-950 text-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[140px]" />
          <div className="absolute inset-0 grid-bg opacity-20" />
        </div>

        {/* Back button */}
        <Link
          to="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-900/80 backdrop-blur-md border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-all text-xs font-medium tracking-wider uppercase"
        >
          <ArrowLeft size={14} /> Home
        </Link>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-300">{meta.tagline}</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-serif font-bold mb-4 leading-[0.9]">
              <span className="text-gradient-gold">{meta.title}</span>{' '}
              <span className="text-white">Gallery</span>
            </h1>

            <p className="text-zinc-400 text-lg font-light max-w-xl mx-auto mb-3">
              {meta.description}
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                {loading ? '...' : `${filtered.length} ${filtered.length === 1 ? 'photo' : 'photos'}`}
              </span>
              <span>·</span>
              <span>Professional Quality</span>
              <span>·</span>
              <span>4K Resolution</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-surface-950/90 backdrop-blur-xl border-b border-white/5 py-0">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Category filter pills — scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pb-0.5">
              {categories.map((key) => {
                const cm = categoryMeta[key];
                const count = key === 'all' ? allLivePhotos.length : allLivePhotos.filter(p => p.category === key).length;
                const isActive = activeFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleFilterClick(key)}
                    className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/30 scale-105'
                        : 'bg-white/[0.04] text-zinc-500 border border-white/8 hover:text-white hover:border-white/15 hover:bg-white/[0.07]'
                    }`}
                  >
                    <span>{cm.emoji}</span>
                    <span>{cm.title}</span>
                    {count > 0 && (
                      <span className={`text-[9px] font-mono ${isActive ? 'text-black/60' : 'text-zinc-600'}`}>
                        {count}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-brand-400/40 ring-offset-1 ring-offset-surface-950 animate-pulse pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 flex-shrink-0">
              <button
                onClick={() => setViewMode('masonry')}
                title="Masonry view"
                className={`p-2 rounded-lg transition-all ${viewMode === 'masonry' ? 'bg-brand-500/15 text-brand-400' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Uniform grid"
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-500/15 text-brand-400' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <Grid3X3 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── GALLERY ───────────────────────────────────────────────── */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Fallback notice */}
          {isFallback && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
              <span className="font-bold uppercase tracking-widest">Preview Mode</span>
              <span className="text-amber-500/70">·</span>
              <span>Showing sample images. Run the Supabase migration to go live.</span>
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl bg-white/5 animate-pulse break-inside-avoid ${i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[3/5]'}`}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            // Empty state
            <div className="py-32 text-center glass-card rounded-2xl">
              <Camera size={44} className="text-zinc-700 mx-auto mb-5" />
              <h3 className="text-xl font-serif text-white mb-2">No photos in this category</h3>
              <p className="text-zinc-500 text-sm mb-8">Check back soon — we're always creating.</p>
              <button
                onClick={() => handleFilterClick('all')}
                className="btn-premium inline-flex gap-2"
              >
                View All Works <ArrowUpRight size={14} />
              </button>
            </div>
          ) : viewMode === 'masonry' ? (
            // ── MASONRY ──────────────────────────────────────────────
            <div className="flex gap-4">
              {masonryColumns.map((col, ci) => (
                <div key={ci} className="flex-1 flex flex-col gap-4">
                  {col.map((photo, pi) => {
                    const globalIndex = filtered.indexOf(photo);
                    return (
                      <PhotoCard
                        key={photo.id}
                        photo={photo}
                        index={ci * 10 + pi}
                        onClick={() => setSelectedIndex(globalIndex)}
                        visible={cardsVisible}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            // ── UNIFORM GRID ─────────────────────────────────────────
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer aspect-square transition-all duration-700 ease-out watermark-overlay ${
                    cardsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                  }`}
                  style={{ transitionDelay: `${(index % 12) * 40}ms` }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-500 hover:text-black">
                    <ZoomIn size={13} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 opacity-0 group-hover:opacity-100">
                    <h4 className="text-sm font-serif text-white">{photo.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-surface-900 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Camera size={11} /> Book a Session
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
            Love what you see?
          </h2>
          <p className="text-zinc-400 text-sm mb-7">Book your own photography session with Skycam.</p>
          <a
            href="https://wa.me/918667518859?text=Hi%20Skycam!%20I%20love%20your%20portfolio.%20I%20want%20to%20book%20a%20session."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex gap-2"
          >
            Book via WhatsApp <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* ── LIGHTBOX ───────────────────────────────────────────────── */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
          >
            <X size={18} />
          </button>

          {/* Prev */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(s => s! - 1); }}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-500 hover:text-black transition-all z-50"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Next */}
          {selectedIndex < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(s => s! + 1); }}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-500 hover:text-black transition-all z-50"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-5xl max-h-[85vh] mx-auto px-16 relative watermark-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[selectedIndex].url}
              alt={filtered[selectedIndex].title}
              className="max-w-full max-h-[75vh] object-contain mx-auto rounded-xl shadow-2xl"
              draggable={false}
            />
            <div className="text-center mt-4">
              <h3 className="text-lg font-serif text-white">{filtered[selectedIndex].title}</h3>
              <p className="text-zinc-500 text-xs mt-1 capitalize">
                {filtered[selectedIndex].category} · {selectedIndex + 1} of {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
