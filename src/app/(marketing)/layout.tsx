'use client';

import * as React from 'react';
import { MarketingNavbar } from '@/components/layout/MarketingNavbar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuronBackground } from '@/components/ui/NeuronBackground';
import { useStore } from '@/lib/store';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-black text-gray-200 selection:bg-blue-500/30 selection:text-white">
            <MarketingNavbarWrapper />
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <NeuronBackground />
            </div>
            <main className="flex-1 pt-20 relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}

function MarketingNavbarWrapper() {
    const { currentUser } = useStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-16 bg-black" />; // Static height during SSR/Hydration
    return currentUser ? <Navbar /> : <MarketingNavbar />;
}
