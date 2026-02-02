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
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-black text-gray-200 selection:bg-blue-500/30 selection:text-white relative">
            <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                <NeuronBackground />
            </div>

            <MarketingNavbarWrapper />

            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, scale: 0.99, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.01, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 pt-20 relative z-10"
                >
                    {children}
                    <Footer />
                </motion.main>
            </AnimatePresence>
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
