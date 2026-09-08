export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}
