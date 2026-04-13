import { useState, useEffect } from 'react';
import { cmsPhotos, CmsPhoto } from '../services/cms';

// Hardcoded fallback in case Supabase is not seeded yet
const FALLBACK_PHOTOS: CmsPhoto[] = [
  { id: 1, url: '/Instapage/wedding_ceremony.png', category: 'wedding', title: 'Sacred Vows', description: 'A beautiful moment of togetherness under golden light', sort_order: 1, is_active: true, created_at: '' },
  { id: 2, url: '/Instapage/bride_portrait.png', category: 'wedding', title: 'Bridal Radiance', description: 'Capturing the beauty and grace of the bride', sort_order: 2, is_active: true, created_at: '' },
  { id: 3, url: '/Instapage/wedding_together.png', category: 'wedding', title: 'Together Forever', description: 'Two souls becoming one in eternal love', sort_order: 3, is_active: true, created_at: '' },
  { id: 4, url: '/Instapage/wedding_golden_hour.png', category: 'wedding', title: 'Golden Hour', description: 'Magic hour light painting the perfect scene', sort_order: 4, is_active: true, created_at: '' },
  { id: 5, url: '/Instapage/wedding_candid_joy.png', category: 'wedding', title: 'Candid Joy', description: 'Unscripted laughter and pure happiness', sort_order: 5, is_active: true, created_at: '' },
  { id: 6, url: '/Instapage/groom_portrait.png', category: 'wedding', title: 'The Groom', description: 'Confidence and elegance in every frame', sort_order: 6, is_active: true, created_at: '' },
  { id: 7, url: '/Instapage/couple_hero.png', category: 'couple', title: 'Couple Moments', description: 'Love stories told through candid frames', sort_order: 7, is_active: true, created_at: '' },
  { id: 8, url: '/Instapage/child_wonder.png', category: 'portrait', title: 'Little Wonder', description: 'Childhood wonder captured forever', sort_order: 8, is_active: true, created_at: '' },
  { id: 9, url: '/Instapage/maternity_hero.png', category: 'maternity', title: 'Awaiting Miracle', description: 'Celebrating the journey of new life', sort_order: 9, is_active: true, created_at: '' },
  { id: 10, url: '/Instapage/portrait_hero.png', category: 'portrait', title: 'Generations', description: 'Family bonds preserved for eternity', sort_order: 10, is_active: true, created_at: '' },
  { id: 11, url: '/Instapage/baby_hero.png', category: 'baby', title: 'First Steps', description: 'Every milestone deserves a perfect frame', sort_order: 11, is_active: true, created_at: '' },
  { id: 12, url: '/Instapage/baby_innocence.png', category: 'baby', title: 'Innocence', description: 'The purest emotions, beautifully preserved', sort_order: 12, is_active: true, created_at: '' },
];

export function useCmsPhotos(category?: string) {
  const [photos, setPhotos] = useState<CmsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    cmsPhotos.getAll().then((data) => {
      if (cancelled) return;
      if (data.length === 0) {
        // Use hardcoded fallback — Supabase table not seeded yet
        setPhotos(FALLBACK_PHOTOS);
        setIsFallback(true);
      } else {
        setPhotos(data);
        setIsFallback(false);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const filtered = category && category !== 'all'
    ? photos.filter(p => p.category === category)
    : photos;

  return { photos: filtered, allPhotos: photos, loading, isFallback };
}
