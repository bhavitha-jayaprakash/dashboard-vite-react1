import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (userData) =>
                set({
                    user: userData,
                    token: userData.token,
                    isAuthenticated: true,
                }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
