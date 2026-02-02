'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
    const router = useRouter();
    const { setSidebarCollapsed, userPrefs, featureFlags } = useStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!featureFlags.keyboard_shortcuts) return;

            // Ignore if in input/textarea
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            // Command/Ctrl + K = Search (Search Input Focus - assuming ID 'global-search')
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search');
                if (searchInput) {
                    searchInput.focus();
                } else {
                    toast.info('Search shortcut pressed (Search implemented in next phase)');
                }
            }

            // N = New Decision
            if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                router.push('/decision/new');
            }

            // B = Toggle Sidebar
            if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                setSidebarCollapsed(!userPrefs.sidebarCollapsed);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router, setSidebarCollapsed, userPrefs.sidebarCollapsed]);
}
