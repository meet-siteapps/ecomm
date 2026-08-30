'use client';

import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/user';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<UserProfile | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchProfile: async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Note: Profile table lookup returned:', error.message);
      }

      if (data) {
        set({ profile: data as UserProfile });
        return data as UserProfile;
      }

      // Fallback to user metadata if database profile row is not created yet
      const currentUser = get().user;
      let targetUser = currentUser && currentUser.id === userId ? currentUser : null;
      if (!targetUser) {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user && authData.user.id === userId) {
          targetUser = authData.user;
        }
      }

      if (targetUser && targetUser.id === userId) {
        const meta = targetUser.user_metadata || {};
        const fallbackProfile: UserProfile = {
          id: userId,
          name: meta.name || meta.full_name || targetUser.email?.split('@')[0] || 'User',
          email: targetUser.email || '',
          phone: meta.phone || '',
          role: (meta.role as any) || 'customer',
        };

        // Try to auto-create missing profile in database
        try {
          const { data: insertedData } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              name: fallbackProfile.name,
              email: fallbackProfile.email,
              phone: fallbackProfile.phone,
              role: fallbackProfile.role,
            })
            .select()
            .maybeSingle();

          if (insertedData) {
            set({ profile: insertedData as UserProfile });
            return insertedData as UserProfile;
          }
        } catch {
          // In-memory fallback if upsert is restricted
        }

        set({ profile: fallbackProfile });
        return fallbackProfile;
      }

      return null;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  },

  signOut: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    } finally {
      set({ user: null, profile: null, isLoading: false });
    }
  },
}));
