'use client';

import { motion } from 'framer-motion';

interface InfoPageProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function InfoPage({ title, subtitle, children }: InfoPageProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-12"
            >
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl md:text-2xl text-blue-100 font-bold leading-relaxed max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="prose prose-invert prose-lg max-w-none text-gray-200 font-medium leading-relaxed prose-headings:text-white prose-headings:font-black prose-a:text-primary hover:prose-a:text-primary-hover transition-colors">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
