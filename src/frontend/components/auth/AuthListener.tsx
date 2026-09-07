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
      let token = session.access_token;
      if (!token) {
        setProfile(null);
        return;
      }

      // Proactively refresh if session token is expired or close to expiry
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at <= now + 60) {
        try {
          const supabase = createClient();
          const { data: refreshData, error: refreshErr } = await supabase.auth.refreshSession();
          if (refreshData?.session?.access_token && !refreshErr) {
            token = refreshData.session.access_token;
            if (refreshData.session.user) {
              setUser(refreshData.session.user);
            }
          }
        } catch (e) {
          console.warn('Proactive token refresh failed:', e);
        }
      }

      try {
        const profile = await fetchMyProfile(token);
        setProfile(profile);
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const code = err?.code || '';
        const status = err?.status;

        // If token was rejected as invalid or expired (401), attempt a token refresh and retry
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
              if (refreshData.session.user) {
                setUser(refreshData.session.user);
              }
              const retryProfile = await fetchMyProfile(refreshData.session.access_token);
              setProfile(retryProfile);
              return;
            }
          } catch (retryErr) {
            console.error('Session refresh retry failed after 401:', retryErr);
          }
        }

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
    [setProfile, setUser]
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

