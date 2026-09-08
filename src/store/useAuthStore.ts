'use client';

import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/user';
import { createClient, getValidAccessToken } from '@/lib/supabase/client';
import { fetchMyProfile, ensureProfile } from '@/lib/api/auth';

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

  fetchProfile: async (_userId: string) => {
    try {
      let token = await getValidAccessToken();
      if (!token) {
        return null;
      }

      try {
        const profile = await fetchMyProfile(token);
        set({ profile });
        return profile;
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const code = err?.code || '';
        const status = err?.status;

        // If 401, force refresh once
        if (
          status === 401 ||
          code === 'INVALID_TOKEN' ||
          msg.includes('expired') ||
          msg.includes('invalid')
        ) {
          try {
            const supabase = createClient();
            const { data: refreshData, error: refreshErr } = await supabase.auth.refreshSession();
            if (refreshData?.session?.access_token && !refreshErr) {
              token = refreshData.session.access_token;
              if (refreshData.session.user) {
                set({ user: refreshData.session.user });
              }
              const retryProfile = await fetchMyProfile(token);
              set({ profile: retryProfile });
              return retryProfile;
            }
          } catch (refreshCatch) {
            console.error('Session refresh failed in fetchProfile:', refreshCatch);
          }
        }

        const isNotFound =
          status === 404 ||
          code === 'PROFILE_NOT_FOUND' ||
          msg.includes('not found') ||
          msg.includes('404');

        if (isNotFound && token) {
          try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const meta = session?.user?.user_metadata || {};
            const name =
              meta.name ||
              meta.full_name ||
              session?.user?.email?.split('@')[0] ||
              'User';
            const phone = meta.phone || undefined;

            await ensureProfile(token, {
              email: session?.user?.email || '',
              name,
              phone,
            });

            const retryProfile = await fetchMyProfile(token);
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

