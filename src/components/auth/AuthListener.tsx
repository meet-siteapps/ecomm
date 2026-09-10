'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { fetchMyProfile, ensureProfile } from '@/lib/api/auth';

export function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  // Guards to prevent duplicate concurrent profile fetches and spamming the backend
  const inFlightSyncRef = useRef(false);
  const lastSyncedTokenRef = useRef<string | null>(null);

  const syncUserProfile = useCallback(
    async (session: Session) => {
      const token = session?.access_token;
      if (!token || !session?.user) {
        lastSyncedTokenRef.current = null;
        setProfile(null);
        return;
      }

      // Skip if this exact token was already successfully synced
      if (lastSyncedTokenRef.current === token) {
        return;
      }

      // Prevent concurrent duplicate executions
      if (inFlightSyncRef.current) {
        return;
      }

      inFlightSyncRef.current = true;

      try {
        const profile = await fetchMyProfile(token);
        lastSyncedTokenRef.current = token;
        setProfile(profile);
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const code = err?.code || '';
        const status = err?.status;
        const isNetworkError = Boolean(err?.isNetworkError || msg.includes('failed to fetch'));

        // If it's a pure network failure (backend offline/starting), do not flood with ensureProfile retries
        if (isNetworkError) {
          console.warn('[AuthListener] Express backend is currently unreachable. Profile sync will retry when connection is restored.');
          setProfile(null);
          return;
        }

        // If token was rejected as invalid or expired (401), attempt a single token refresh and retry
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
              lastSyncedTokenRef.current = refreshData.session.access_token;
              setProfile(retryProfile);
              return;
            }
          } catch (retryErr) {
            console.error('[AuthListener] Session refresh retry failed after 401:', retryErr);
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
            lastSyncedTokenRef.current = token;
            setProfile(retryProfile);
            return;
          } catch (ensureErr) {
            console.error('[AuthListener] Failed to ensure and refetch user profile:', ensureErr);
            setProfile(null);
            return;
          }
        }

        console.error('[AuthListener] Error fetching user profile from Express backend:', err);
        setProfile(null);
      } finally {
        inFlightSyncRef.current = false;
      }
    },
    [setProfile, setUser]
  );

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // 1. Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchWishlist(session.user.id);
        await syncUserProfile(session);
      } else {
        setUser(null);
        setProfile(null);
        clearWishlist();
        lastSyncedTokenRef.current = null;
      }
      setLoading(false);
    });

    // 2. Subscribe to auth changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Skip redundant initial session event since getSession() handles it above
      if (event === 'INITIAL_SESSION') return;

      if (session?.user) {
        setUser(session.user);
        fetchWishlist(session.user.id);
        await syncUserProfile(session);
      } else {
        setUser(null);
        setProfile(null);
        clearWishlist();
        lastSyncedTokenRef.current = null;
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, syncUserProfile, fetchWishlist, clearWishlist]);

  return null;
}

