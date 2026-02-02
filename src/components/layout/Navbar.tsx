'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    PlusCircle,
    BarChart3,
    Settings,
    BrainCircuit,
    Bell,
    Globe,
    ChevronDown,
    Clock,
    History,
    Check,
    Plus,
    LogOut,
    Menu,
    Shield
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useStore } from '@/lib/store';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PricingModal } from '@/components/pricing-modal';
import { Zap } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

const navItems = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Decision', href: '/decision/new', icon: PlusCircle },
    { label: 'Insights', href: '/insights', icon: BarChart3 },
    { label: 'Community', href: '/community', icon: Globe },
];

const adminNavItem = { label: 'Admin', href: '/admin', icon: Shield };

export function Navbar() {
    const pathname = usePathname();
    const { signOut: clerkSignOut } = useClerk();
    const { logout, decisions, workspaces, currentWorkspaceId, switchWorkspace, createWorkspace, currentUser } = useStore();
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [showPricing, setShowPricing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentWorkspace = useMemo(() =>
        workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0] || { name: 'Workspace', planTier: 'FREE' },
        [workspaces, currentWorkspaceId]
    );

    // Filter decisions by current workspace - memoized to prevent lag
    const workspaceDecisions = useMemo(() =>
        decisions
            .filter(d => d.workspaceId === currentWorkspaceId)
            .slice(0, 4),
        [decisions, currentWorkspaceId]
    );

    const handleCreateWorkspace = (e: React.FormEvent) => {
        e.preventDefault();
        if (newWorkspaceName.trim()) {
            createWorkspace(newWorkspaceName);
            setNewWorkspaceName('');
            setIsCreatingWorkspace(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsContextOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 z-50 sticky top-0 w-full text-[#c9d1d9]">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsContextOpen(true)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[#c9d1d9] shadow-sm group"
                        title={currentWorkspace?.name || 'Workspace'}
                    >
                        <Menu size={18} className="text-[#8b949e] group-hover:text-white transition-colors" />
                    </button>

                    <AnimatePresence>
                        {isContextOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsContextOpen(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                                />

                                {/* Drawer Container */}
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed top-0 left-0 h-screen w-80 bg-[#0d1117] border-r border-white/5 shadow-2xl z-[101] flex flex-col"
                                >
                                    {/* Drawer Header */}
                                    <div className="p-6 border-b border-white/5 bg-black/20">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                                    <BrainCircuit className="text-white" size={18} />
                                                </div>
                                                <span className="text-sm font-black text-white uppercase tracking-tighter">Workspace Trace</span>
                                            </div>
                                            <button
                                                onClick={() => setIsContextOpen(false)}
                                                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
                                            >
                                                <Menu size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Your Workspaces</span>
                                            {!isCreatingWorkspace && (
                                                <button
                                                    onClick={() => setIsCreatingWorkspace(true)}
                                                    className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/80 transition-all uppercase tracking-widest"
                                                >
                                                    <Plus size={14} />
                                                    Set New
                                                </button>
                                            )}
                                        </div>

                                        {isCreatingWorkspace ? (
                                            <form onSubmit={handleCreateWorkspace} className="space-y-3 mb-2">
                                                <Input
                                                    autoFocus
                                                    placeholder="Workspace Name..."
                                                    className="h-10 text-xs bg-white/5 border-white/10 text-white"
                                                    value={newWorkspaceName}
                                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <Button type="submit" size="sm" className="h-8 text-[10px] font-black bg-primary hover:bg-primary/90 text-white uppercase tracking-widest flex-1">Create</Button>
                                                    <Button type="button" size="sm" variant="ghost" className="h-8 text-[10px] font-black text-[#8b949e] uppercase tracking-widest" onClick={() => setIsCreatingWorkspace(false)}>Cancel</Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                                {/* Plan Status */}
                                                <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Current Plan</span>
                                                        <Badge variant="outline" className="border-amber-400/20 text-amber-400 text-[10px] font-bold h-5">
                                                            {currentWorkspace?.planTier || 'FREE'}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setIsContextOpen(false);
                                                            setShowPricing(true);
                                                        }}
                                                        size="sm"
                                                        className="w-full h-8 text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:shadow-glow uppercase tracking-widest"
                                                    >
                                                        <Zap size={12} className="mr-2" />
                                                        Upgrade Workspace
                                                    </Button>
                                                </div>

                                                {workspaces.map(ws => (
                                                    <button
                                                        key={ws.id}
                                                        onClick={() => {
                                                            switchWorkspace(ws.id);
                                                            setIsContextOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group border border-transparent",
                                                            ws.id === currentWorkspaceId ? "bg-primary/10 border-primary/20" : "hover:bg-white/5 hover:border-white/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black",
                                                                ws.id === currentWorkspaceId ? "bg-primary text-white shadow-glow" : "bg-white/5 text-[#8b949e]"
                                                            )}>
                                                                {ws.name.charAt(0)}
                                                            </div>
                                                            <span className={cn("text-xs font-bold", ws.id === currentWorkspaceId ? "text-white" : "text-[#c9d1d9]")}>{ws.name || 'Unnamed Workspace'}</span>
                                                        </div>
                                                        {ws.id === currentWorkspaceId && <Check size={14} className="text-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Activity Section */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                        {/* Mobile Main Nav (Visible only on small screens) */}
                                        <div className="md:hidden space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Navigation</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {navItems.map((item) => {
                                                    const isActive = pathname === item.href;
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setIsContextOpen(false)}
                                                            className={cn(
                                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-transparent",
                                                                isActive ? "bg-primary/10 text-white border-primary/20" : "text-[#c9d1d9] hover:bg-white/5"
                                                            )}
                                                        >
                                                            <item.icon size={18} className={isActive ? "text-primary" : "text-[#8b949e]"} />
                                                            <span className="text-sm font-bold">{item.label}</span>
                                                        </Link>
                                                    );
                                                })}
                                                {currentUser?.role === 'ADMIN' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsContextOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-transparent",
                                                            pathname.startsWith('/admin') ? "bg-amber-400/10 text-amber-300 border-amber-400/20" : "text-amber-400 hover:bg-amber-400/5"
                                                        )}
                                                    >
                                                        <Shield size={18} />
                                                        <span className="text-sm font-bold">Admin Panel</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Recent Activity</span>
                                                <History size={14} className="text-[#8b949e]" />
                                            </div>
                                            <div className="space-y-2">
                                                {workspaceDecisions.length > 0 ? (
                                                    workspaceDecisions.map((decision) => (
                                                        <Link
                                                            key={decision.id}
                                                            href={`/decision/${decision.id}`}
                                                            onClick={() => setIsContextOpen(false)}
                                                            className="flex items-center gap-4 p-3 rounded-xl group hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                                                                <Clock size={16} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="truncate text-xs font-bold text-[#c9d1d9] group-hover:text-white transition-colors">
                                                                    {decision.title}
                                                                </div>
                                                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mt-0.5">{decision.category}</div>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 px-4">
                                                        <p className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest leading-relaxed">No traces recorded in this sector</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Drawer Footer */}
                                    <div className="p-4 border-t border-white/5 bg-black/20">
                                        <button
                                            onClick={async () => {
                                                await clerkSignOut();
                                                logout();
                                                setIsContextOpen(false);
                                            }}
                                            className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black text-[#8b949e] hover:text-red-400 hover:bg-red-400/5 border border-transparent hover:border-red-400/10 transition-all uppercase tracking-[0.2em]"
                                        >
                                            <LogOut size={14} />
                                            Terminate Session
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-[#c9d1d9] transition-colors">
                    <BrainCircuit size={32} className="text-white" />
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all',
                                    isActive
                                        ? 'text-white bg-[#21262d]' // GitHub Active State
                                        : 'text-[#c9d1d9] hover:text-white hover:bg-[#8b949e]/10' // Hover State
                                )}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                    {currentUser?.role === 'ADMIN' && (
                        <Link
                            href={adminNavItem.href}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all text-amber-400 hover:text-amber-300 hover:bg-amber-400/10',
                                pathname.startsWith('/admin') && 'bg-amber-400/10 text-amber-300'
                            )}
                        >
                            <adminNavItem.icon size={16} />
                            {adminNavItem.label}
                        </Link>
                    )}
                </nav>
            </div>

            {/* Right: Search & Profile */}
            <div className="flex items-center gap-2 md:gap-4">



                {/* Notifications */}
                <NotificationBell />

                {/* Settings Button (Small) */}
                <Link href="/settings">
                    <div className="flex items-center justify-center p-1 text-[#c9d1d9] hover:text-white transition-colors">
                        <Settings size={16} />
                    </div>
                </Link>

                {/* Profile Avatar */}
                <div className="ml-2">
                    <div className="w-8 h-8 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:border-[#8b949e] transition-colors">
                        {currentUser?.name?.substring(0, 2).toUpperCase() || "ME"}
                    </div>
                </div>
            </div>

            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </header>
    );
}
