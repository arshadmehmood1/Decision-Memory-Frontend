'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, History } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RegretNudge() {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Show after 3 seconds on first load, check localStorage
        const hasDismissed = localStorage.getItem('regret-nudge-dismissed');
        if (!hasDismissed) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        localStorage.setItem('regret-nudge-dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <Card className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 relative group">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20 shadow-glow shadow-purple-500/5">
                                    <History size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-white">Hindsight is 20/20</h4>
                                    <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                                        Thinking about a past decision that went wrong (or right)?
                                        Logging retroactively helps you spot patterns in your intuition.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Button
                                    onClick={() => router.push('/decision/new')}
                                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-glow shadow-purple-500/20"
                                >
                                    Log Past Choice
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={dismiss}
                                    className="text-gray-500 hover:text-white"
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
