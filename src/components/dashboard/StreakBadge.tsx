'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
    streak: number;
    className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
    if (streak === 0) return null;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 font-black text-xs uppercase tracking-widest shadow-glow shadow-orange-500/5",
                className
            )}
        >
            <Flame size={16} className="fill-orange-400/20" />
            <span>{streak} Week Streak</span>

            {/* Tooltip hint */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/5">
                Log 1 decision / week to keep your streak!
            </div>
        </motion.div>
    );
}
