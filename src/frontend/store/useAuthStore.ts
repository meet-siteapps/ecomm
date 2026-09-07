'use client';

import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/frontend/types/user';
import { createClient } from '@/frontend/lib/supabase/client';
import { fetchMyProfile, ensureProfile } from '@/frontend/lib/api/auth';

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchProfile: async (userId: string) => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return null;
      }

      try {
        const profile = await fetchMyProfile(session.access_token);
        set({ profile });
        return profile;
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const code = err?.code || '';
        const status = err?.status;
        const isNotFound =
          status === 404 ||
          code === 'PROFILE_NOT_FOUND' ||
          msg.includes('not found') ||
          msg.includes('404');

        if (isNotFound && session.user) {
          try {
            const meta = session.user.user_metadata || {};
            const name =
              meta.name ||
              meta.full_name ||
              session.user.email?.split('@')[0] ||
              'User';
            const phone = meta.phone || undefined;

            await ensureProfile(session.access_token, {
              email: session.user.email || '',
              name,
              phone,
            });

            const retryProfile = await fetchMyProfile(session.access_token);
            set({ profile: retryProfile });
            return retryProfile;
          } catch (ensureErr) {
            console.error('Failed to auto-provision and refetch user profile:', ensureErr);
            return null;
          }
        }

        console.error('Error fetching profile from Express backend:', err);
        return null;
      }
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

