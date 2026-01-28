// Minimal API service
import { supabase } from './supabase';

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
          console.warn('Supabase error, falling back to local storage:', error);
          throw error;
        }

        console.log('System: Successfully saved to Supabase!');
      } else {
        throw new Error('Supabase client not initialized');
      }

      return { success: true };
    } catch (error: any) {
      console.log('Falling back to local storage for user details');
      // Fallback to local storage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('skycam_users_backup') || '[]');
        storedUsers.push({
          name,
          whatsapp,
          timestamp: new Date().toISOString(),
          synced: false
        });
        localStorage.setItem('skycam_users_backup', JSON.stringify(storedUsers));
        return { success: true };
      } catch (localError: any) {
        return { success: false, error: 'Could not save data locally' };
      }
    }
  }
};
