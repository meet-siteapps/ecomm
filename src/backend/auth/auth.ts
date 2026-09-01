import { getServerSupabaseClient, getAdminSupabaseClient } from '@/backend/services/supabase';
import { UserProfile } from '@/frontend/types/user';

/**
 * Get current authenticated user profile from Supabase
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await getServerSupabaseClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return null;
    }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!profileErr && profile) {
      return profile as UserProfile;
    }

    // Fallback to user metadata
    const meta = user.user_metadata || {};
    return {
      id: user.id,
      name: meta.name || meta.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      phone: meta.phone || '',
      role: (meta.role as any) || 'customer',
    };
  } catch (err) {
    console.error('Error fetching current user profile:', err);
    return null;
  }
}

/**
 * Verify whether the authenticated user has an 'admin' role
 */
export async function verifyAdminRole(): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    return profile?.role === 'admin';
  } catch (err) {
    console.error('Error verifying admin role:', err);
    return false;
  }
}

/**
 * Ensures user profile exists in database (auto-provision if missing)
 */
export async function ensureUserProfile(
  userId: string,
  email: string,
  metadata?: Record<string, any>
): Promise<UserProfile | null> {
  try {
    const supabase = await getServerSupabaseClient();
    const name = metadata?.name || metadata?.full_name || email.split('@')[0];
    const phone = metadata?.phone || '';
    const role = metadata?.role || 'customer';

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          name,
          email,
          phone,
          role,
        },
        { onConflict: 'id' }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Could not auto-create profile row:', error.message);
      return { id: userId, name, email, phone, role };
    }

    return (data as UserProfile) || { id: userId, name, email, phone, role };
  } catch (err) {
    console.error('Error in ensureUserProfile:', err);
    return null;
  }
}
