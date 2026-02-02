'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    Megaphone,
    Sparkles,
    Bug,
    TrendingUp,
    X,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

interface AppUpdate {
    id: string;
    title: string;
    description: string;
    version?: string;
    type: 'FEATURE' | 'BUGFIX' | 'IMPROVEMENT' | 'ANNOUNCEMENT';
    publishedAt?: string;
}

const TYPE_CONFIG = {
    FEATURE: { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'New Feature' },
    BUGFIX: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Bug Fix' },
    IMPROVEMENT: { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Improvement' },
    ANNOUNCEMENT: { icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Announcement' }
};

interface WhatsNewPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WhatsNewPanel({ isOpen, onClose }: WhatsNewPanelProps) {
    const [updates, setUpdates] = useState<AppUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadUpdates();
        }
    }, [isOpen]);

    const loadUpdates = async () => {
        try {
            setLoading(true);
            const res = await apiRequest<{ data: AppUpdate[] }>('/updates');
            setUpdates(res.data);
        } catch (err) {
            console.error('Failed to load updates', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0d1117] border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Bell className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">What&apos;s New</h2>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Latest updates</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500">Loading...</div>
                            ) : updates.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <Megaphone className="mx-auto mb-4 opacity-50" size={40} />
                                    <p className="text-sm">No updates yet</p>
                                    <p className="text-xs mt-1">Check back soon for what&apos;s new!</p>
                                </div>
                            ) : (
                                updates.map((update, i) => {
                                    const TypeIcon = TYPE_CONFIG[update.type].icon;
                                    return (
                                        <motion.div
                                            key={update.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_CONFIG[update.type].bg}`}>
                                                    <TypeIcon size={18} className={TYPE_CONFIG[update.type].color} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <Badge className={`text-[8px] font-black uppercase tracking-widest border-transparent ${TYPE_CONFIG[update.type].bg} ${TYPE_CONFIG[update.type].color}`}>
                                                            {TYPE_CONFIG[update.type].label}
                                                        </Badge>
                                                        {update.version && (
                                                            <Badge className="bg-white/5 text-white/60 border-white/10 text-[8px] font-bold">
                                                                v{update.version}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white mb-1">{update.title}</h3>
                                                    <p className="text-xs text-gray-500 line-clamp-2">{update.description}</p>
                                                    {update.publishedAt && (
                                                        <p className="text-[10px] font-bold text-gray-600 mt-2">
                                                            {new Date(update.publishedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Separate trigger button component for use in navbars
export function WhatsNewButton({ onClick, hasNew }: { onClick: () => void; hasNew?: boolean }) {
    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="What's New"
        >
            <Bell size={18} />
            {hasNew && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
        </button>
    );
}
