export type UserRole = 'customer' | 'admin';
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
}
export interface EnsureProfileInput {
    email: string;
    name: string;
    phone?: string;
}
export interface UpdateProfileInput {
    name?: string;
    phone?: string;
}
//# sourceMappingURL=user.d.ts.map