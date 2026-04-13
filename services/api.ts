// Enhanced API service with booking support
import { supabase } from './supabase';

interface BookingInquiry {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  message: string;
  package: string;
}

export const api = {
  // Simple visit counter
  incrementVisits: () => {
    const current = parseInt(localStorage.getItem('skycam_visits') || '0');
    localStorage.setItem('skycam_visits', (current + 1).toString());
  },

  getVisits: async (): Promise<number> => {
    return parseInt(localStorage.getItem('skycam_visits') || '0');
  },

  storeUserDetails: async (name: string, whatsapp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (supabase) {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('user_details')
          .select('id')
          .eq('whatsapp_number', whatsapp)
          .maybeSingle();

        if (existingUser) {
          return { success: true };
        }

        const { error } = await supabase
          .from('user_details')
          .insert([
            {
              name: name,
              whatsapp_number: whatsapp,
              created_at: new Date().toISOString()
            }
          ]);

        if (error) {
          throw error;
        }
      } else {
        throw new Error('Supabase client not initialized');
      }

      return { success: true };
    } catch (error: any) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('skycam_users_backup') || '[]');
        const exists = storedUsers.some((u: any) => u.whatsapp === whatsapp);
        if (!exists) {
          storedUsers.push({
            name,
            whatsapp,
            timestamp: new Date().toISOString(),
            synced: false
          });
          localStorage.setItem('skycam_users_backup', JSON.stringify(storedUsers));
        }
        return { success: true };
      } catch (localError: any) {
        return { success: false, error: 'Could not save data locally' };
      }
    }
  },

  // NEW: Store booking inquiry
  storeBookingInquiry: async (data: BookingInquiry): Promise<{ success: boolean; error?: string }> => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('booking_inquiries')
          .insert([
            {
              client_name: data.name,
              client_email: data.email,
              client_phone: data.phone,
              event_type: data.eventType,
              event_date: data.date || null,
              preferred_package: data.package || null,
              message: data.message || null,
              status: 'new',
              created_at: new Date().toISOString()
            }
          ]);

        if (error) {
          throw error;
        }

        return { success: true };
      } else {
        throw new Error('Supabase client not initialized');
      }
    } catch (error: any) {
      // Fallback: save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('skycam_bookings_backup') || '[]');
        stored.push({
          ...data,
          timestamp: new Date().toISOString(),
          synced: false,
          status: 'new'
        });
        localStorage.setItem('skycam_bookings_backup', JSON.stringify(stored));
        console.log('Booking saved to local backup');
        return { success: true };
      } catch (localError) {
        return { success: false, error: 'Could not save booking' };
      }
    }
  },

  // NEW: Get booking inquiries (for admin)
  getBookingInquiries: async (): Promise<any[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('booking_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      // Quiet fail
    }
    
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('skycam_bookings_backup') || '[]');
  },

  // NEW: Update booking status  
  updateBookingStatus: async (id: string, status: string): Promise<{ success: boolean }> => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('booking_inquiries')
          .update({ status })
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },

  // ============================================
  // USER REVIEWS SYSTEM
  // ============================================

  // Submit a new review (pending admin approval)
  submitReview: async (review: { name: string; event_type: string; rating: number; message: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const reviewData = {
        ...review,
        status: 'pending', // requires admin approval
        created_at: new Date().toISOString()
      };

      if (supabase) {
        const { error } = await supabase
          .from('user_reviews')
          .insert([reviewData]);

        if (error) {
          throw error;
        }
        return { success: true };
      } else {
        throw new Error('Supabase not initialized');
      }
    } catch (error) {
      // Fallback to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('skycam_reviews_backup') || '[]');
        stored.push({ ...review, status: 'pending', created_at: new Date().toISOString(), synced: false });
        localStorage.setItem('skycam_reviews_backup', JSON.stringify(stored));
        return { success: true };
      } catch (localErr) {
        return { success: false, error: 'Could not save review' };
      }
    }
  },

  // Get only approved reviews (for public display)
  getApprovedReviews: async (): Promise<any[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('user_reviews')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      // Quiet fail
    }

    // Fallback: return approved reviews from localStorage
    const stored = JSON.parse(localStorage.getItem('skycam_reviews_backup') || '[]');
    return stored.filter((r: any) => r.status === 'approved');
  },

  // Get ALL reviews (for admin panel)
  getAllReviews: async (): Promise<any[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('user_reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      // Quiet fail
    }
    return JSON.parse(localStorage.getItem('skycam_reviews_backup') || '[]');
  },

  // Update review status (admin: approve / reject / delete)
  updateReviewStatus: async (id: string, status: 'approved' | 'rejected'): Promise<{ success: boolean }> => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('user_reviews')
          .update({ status })
          .eq('id', id);

        if (error) throw error;
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }
};
