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
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
      }

      if (data) {
        set({ profile: data as UserProfile });
        return data as UserProfile;
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
      set({ user: null, profile: null, isLoading: false });
    } catch (err) {
      console.error('Error during signOut:', err);
    }
  },
}));
