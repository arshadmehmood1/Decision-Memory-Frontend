'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerRightUp } from 'lucide-react';
import { useStore } from '@/lib/store';

export function AnnotationLayer() {
    const { currentUser, decisions } = useStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show only if:
        // 1. User is loaded
        // 2. No decisions created yet
        // 3. Not previously dismissed
        // 4. Onboarding is complete (so it doesn't overlap with the guide)
        const dismissed = localStorage.getItem('annotation_dismissed');
        if (currentUser && decisions.length === 0 && !dismissed && currentUser.hasOnboarded) {
            // Small delay to let UI settle
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [currentUser, decisions.length]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('annotation_dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed bottom-24 right-8 z-50 pointer-events-auto max-w-xs"
            >
                <div className="relative">
                    {/* Pulsing Anchor */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping opacity-75" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />

                    {/* Tooltip Card */}
                    <div className="bg-white text-black p-4 rounded-xl shadow-2xl border border-gray-200 relative">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                                <CornerRightUp size={18} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="font-black uppercase tracking-wider text-xs mb-1 text-primary">Start Here</h4>
                                <p className="text-sm font-bold text-gray-800 leading-snug">
                                    Ready to log your first strategic move? Click the <span className="text-primary">+</span> button to begin.
                                </p>
                            </div>
                        </div>

                        {/* Triangle pointing down/right towards the FAB */}
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-200" />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
