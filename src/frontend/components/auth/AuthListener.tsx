'use client';

import { useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/frontend/lib/supabase/client';
import { useAuthStore } from '@/frontend/store/useAuthStore';
import { useWishlistStore } from '@/frontend/store/useWishlistStore';
import { fetchMyProfile, ensureProfile } from '@/frontend/lib/api/auth';

export function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const syncUserProfile = useCallback(
    async (session: Session) => {
      const token = session.access_token;
      if (!token) {
        setProfile(null);
        return;
      }

      try {
        const profile = await fetchMyProfile(token);
        setProfile(profile);
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

            await ensureProfile(token, {
              email: session.user.email || '',
              name,
              phone,
            });

            const retryProfile = await fetchMyProfile(token);
            setProfile(retryProfile);
            return;
          } catch (ensureErr) {
            console.error('Failed to ensure and refetch user profile:', ensureErr);
            setProfile(null);
            return;
          }
        }

        console.error('Error fetching user profile from Express backend:', err);
        setProfile(null);
      }
    },
    [setProfile]
  );

  useEffect(() => {
    const supabase = createClient();

    // 1. Check current session immediately
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchWishlist(session.user.id);
        await syncUserProfile(session);
      } else {
        setUser(null);
        setProfile(null);
        clearWishlist();
      }
      setLoading(false);
    });

    // 2. Subscribe to auth changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchWishlist(session.user.id);
        await syncUserProfile(session);
      } else {
        setUser(null);
        setProfile(null);
        clearWishlist();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, syncUserProfile, fetchWishlist, clearWishlist]);

  return null;
}

