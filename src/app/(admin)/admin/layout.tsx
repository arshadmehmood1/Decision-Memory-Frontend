'use client';

export const dynamic = 'force-dynamic';

import * as React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
    LayoutDashboard,
    CreditCard,
    Megaphone,
    FileText,
    Users,
    Settings,
    ArrowLeft,
    BrainCircuit,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const adminNav = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Licensed Pricing', href: '/admin/pricing', icon: CreditCard },
    { label: 'Global Broadcast', href: '/admin/broadcast', icon: Megaphone },
    { label: 'CMS Matrix', href: '/admin/cms', icon: FileText },
    { label: 'User Registry', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { currentUser, isAuthReady } = useStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (currentUser?.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white p-6">
                <div className="text-center space-y-4">
                    <Shield className="mx-auto text-red-500" size={48} />
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Access Denied</h1>
                    <p className="text-gray-500 text-sm">You do not have the required neural clearance for this zone.</p>
                    <Link href="/dashboard" className="inline-block mt-4 px-6 py-2 bg-primary text-white font-bold rounded-lg uppercase tracking-widest text-xs">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#050505] text-[#c9d1d9] font-sans selection:bg-primary/30">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0d1117] flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <ArrowLeft className="text-primary" size={16} />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exit Command</span>
                    </Link>
                    <div className="mt-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                            <BrainCircuit className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-tighter">Matrix Admin</h2>
                            <p className="text-[10px] font-medium text-primary tracking-widest uppercase">Level 4 Clearance</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {adminNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <item.icon size={18} className={isActive ? 'text-primary' : 'group-hover:text-white transition-colors'} />
                                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">System Status</h4>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Neural Link Stable</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 max-w-6xl mx-auto custom-scrollbar overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
