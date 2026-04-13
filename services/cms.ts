import { supabase } from './supabase';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CmsPhoto {
  id: number;
  url: string;
  category: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CmsPackage {
  id: number;
  tier_id: string;         // 'tier-silver' | 'tier-gold' | 'tier-platinum'
  name: string;
  subtitle: string;
  price: string;
  description: string;
  detailed_description: string;
  ideal_for: string;
  features: string[];      // stored as JSON array
  is_popular: boolean;
  icon_name: string;       // lucide icon name string
  sort_order: number;
  is_active: boolean;
}

export interface CmsStandaloneService {
  id: number;
  service_id: string;
  title: string;
  description: string;
  features: string[];
  starting_price: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

// ─────────────────────────────────────────────
// Portfolio Photos
// ─────────────────────────────────────────────

export const cmsPhotos = {
  async getAll(): Promise<CmsPhoto[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('portfolio_photos')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) { console.error('CMS photos fetch error:', error); return []; }
    return data || [];
  },

  async getAllAdmin(): Promise<CmsPhoto[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('portfolio_photos')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) { console.error('CMS photos admin fetch error:', error); return []; }
    return data || [];
  },

  async insert(photo: Omit<CmsPhoto, 'id' | 'created_at'>): Promise<CmsPhoto | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('portfolio_photos')
      .insert([photo])
      .select()
      .single();
    if (error) { console.error('CMS photo insert error:', error); return null; }
    return data;
  },

  async update(id: number, patch: Partial<CmsPhoto>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('portfolio_photos')
      .update(patch)
      .eq('id', id);
    if (error) { console.error('CMS photo update error:', error); return false; }
    return true;
  },

  async remove(id: number): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('portfolio_photos')
      .delete()
      .eq('id', id);
    if (error) { console.error('CMS photo delete error:', error); return false; }
    return true;
  },

  /** Upload image to Supabase Storage and return the public URL */
  async uploadImage(file: File): Promise<string | null> {
    if (!supabase) return null;
    const ext = file.name.split('.').pop();
    const filename = `portfolio/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('cms-assets')
      .upload(filename, file, { upsert: false, contentType: file.type });
    if (uploadError) { console.error('Storage upload error:', uploadError); return null; }
    const { data } = supabase.storage.from('cms-assets').getPublicUrl(filename);
    return data?.publicUrl || null;
  },
};

// ─────────────────────────────────────────────
// Packages
// ─────────────────────────────────────────────

export const cmsPackages = {
  async getAll(): Promise<CmsPackage[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('cms_packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) { console.error('CMS packages fetch error:', error); return []; }
    return data || [];
  },

  async getAllAdmin(): Promise<CmsPackage[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('cms_packages')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) { console.error('CMS packages admin fetch error:', error); return []; }
    return data || [];
  },

  async upsert(pkg: Omit<CmsPackage, 'id'>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('cms_packages').upsert([pkg], { onConflict: 'tier_id' });
    if (error) { console.error('CMS package upsert error:', error); return false; }
    return true;
  },

  async update(id: number, patch: Partial<CmsPackage>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('cms_packages').update(patch).eq('id', id);
    if (error) { console.error('CMS package update error:', error); return false; }
    return true;
  },

  async remove(id: number): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('cms_packages').delete().eq('id', id);
    if (error) { console.error('CMS package delete error:', error); return false; }
    return true;
  },
};

// ─────────────────────────────────────────────
// Standalone Services
// ─────────────────────────────────────────────

export const cmsServices = {
  async getAll(): Promise<CmsStandaloneService[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('cms_standalone_services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) { console.error('CMS services fetch error:', error); return []; }
    return data || [];
  },

  async getAllAdmin(): Promise<CmsStandaloneService[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('cms_standalone_services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) { console.error('CMS services admin fetch error:', error); return []; }
    return data || [];
  },

  async upsert(svc: Omit<CmsStandaloneService, 'id'>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('cms_standalone_services').upsert([svc], { onConflict: 'service_id' });
    if (error) { console.error('CMS service upsert error:', error); return false; }
    return true;
  },

  async update(id: number, patch: Partial<CmsStandaloneService>): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('cms_standalone_services').update(patch).eq('id', id);
    if (error) { console.error('CMS service update error:', error); return false; }
    return true;
  },

  async remove(id: number): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('cms_standalone_services').delete().eq('id', id);
    if (error) { console.error('CMS service delete error:', error); return false; }
    return true;
  },
};
