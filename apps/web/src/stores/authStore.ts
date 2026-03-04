import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    tier: 'free' | 'pro' | 'enterprise';
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
