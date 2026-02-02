'use client';

import * as React from 'react';
import { MarketingNavbar } from '@/components/layout/MarketingNavbar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuronBackground } from '@/components/ui/NeuronBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    React.useEffect(() => {
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-black text-gray-200 selection:bg-blue-500/30 selection:text-white relative">
            <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                <NeuronBackground />
            </div>

            <MarketingNavbarWrapper />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex-1 pt-20 relative z-10"
            >
                {children}
                <Footer />
            </motion.main>
        </div>
    );
}

function MarketingNavbarWrapper() {
    const { currentUser } = useStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-20 w-full" />; // Slightly taller placeholder
    return currentUser ? <Navbar /> : <MarketingNavbar />;
}
