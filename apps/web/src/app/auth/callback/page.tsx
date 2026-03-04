'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AuthCallback() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [status, setStatus] = useState('Authenticating...');

    useEffect(() => {
        // Mock the OAuth callback process
        const timer = setTimeout(() => {
            setStatus('Successfully authenticated! Redirecting...');
            login({
                id: 'user-1',
                name: 'Developer',
                email: 'dev@orvyn.dev',
                tier: 'free',
            });
            setTimeout(() => router.push('/dashboard'), 1000);
        }, 1500);

        return () => clearTimeout(timer);
    }, [login, router]);

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-medium text-neutral-300">{status}</h2>
        </div>
    );
}
