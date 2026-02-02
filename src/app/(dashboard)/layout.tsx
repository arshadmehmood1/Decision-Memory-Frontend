'use client';

import * as React from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { MarketingNavbar } from '@/components/layout/MarketingNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useKeyboardShortcuts();
    const { currentUser, fetchWorkspaces, fetchDecisions, currentWorkspaceId, workspaces, isLoading, isAuthReady } = useStore();
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        // The dashboard layout uses a scrollable div (h-screen overflow-y-auto), 
        // not the window object.
        const scrollContainer = document.querySelector('.dashboard-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    React.useEffect(() => {
        setMounted(true);
        if (currentUser && isAuthReady) {
            fetchWorkspaces().then(() => {
                if (currentWorkspaceId) {
                    fetchDecisions(currentWorkspaceId);
                }
            });
        }
    }, [currentUser, fetchWorkspaces, fetchDecisions, currentWorkspaceId, isAuthReady]);

    return (
        <div className="h-screen overflow-y-auto bg-[#0d1117] font-sans text-white selection:bg-blue-500/30 dashboard-scroll-container">
            {mounted && isAuthReady && (currentUser ? <Navbar /> : <MarketingNavbar />)}
            <OnboardingGuide />

            {/* Main Content Area - Full Width */}
            <div className="relative z-10">
                {mounted && isAuthReady ? (
                    <motion.main
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="pt-8 pb-8 px-4 md:px-8"
                    >
                        <div className="max-w-[1600px] mx-auto">
                            <ErrorBoundary>
                                {children}
                            </ErrorBoundary>
                        </div>
                    </motion.main>
                ) : (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
