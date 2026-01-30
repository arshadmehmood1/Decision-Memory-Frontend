'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { setAuthToken } from '@/lib/api-client';
import { useStore } from '@/lib/store';

export function AuthSync() {
    const { login, logout, setIsAuthReady } = useStore();
    const { isLoaded: userLoaded, user } = useUser();
    const { isLoaded: authLoaded, getToken, userId, isSignedIn } = useAuth();

    useEffect(() => {
        const sync = async () => {
            if (!userLoaded || !authLoaded) return;

            if (isSignedIn && userId && user) {
                const token = await getToken();
                setAuthToken(token);

                const primaryEmail = user.primaryEmailAddress?.emailAddress || '';
                const fullName = user.fullName || 'User';
                login(primaryEmail, fullName);

                setIsAuthReady(true);
            } else if (authLoaded && !isSignedIn) {
                setAuthToken(null);
                // Only logout (which triggers redirect) if we think we are logged in
                if (useStore.getState().currentUser) {
                    logout();
                }
                setIsAuthReady(true);
            }
        };

        sync();
    }, [userLoaded, authLoaded, getToken, isSignedIn, userId, user, login, setIsAuthReady]);

    return null;
}
