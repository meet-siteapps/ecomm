import { UserProfile, EnsureProfileInput, UpdateProfileInput } from '../types/user.js';
export declare function getProfile(userId: string): Promise<UserProfile>;
export declare function ensureProfile(userId: string, input: EnsureProfileInput): Promise<UserProfile>;
export declare function updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile>;
//# sourceMappingURL=profileService.d.ts.map