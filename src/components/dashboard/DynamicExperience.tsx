'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Megaphone, Zap, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CMSContent {
    sections: {
        type: 'HERO' | 'ANNOUNCEMENT' | 'FEATURE';
        title: string;
        description: string;
        actionText?: string;
        actionUrl?: string;
        accent?: string;
    }[];
}

export function DynamicExperience() {
    const [content, setContent] = useState<CMSContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCMS = async () => {
            try {
                const res = await apiRequest<{ data: { content: CMSContent } }>('/public/cms/dashboard');
                if (res.data) {
                    setContent(res.data.content);
                }
            } catch (err) {
                console.error("Failed to load dynamic experience", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCMS();
    }, []);

    if (loading || !content || content.sections.length === 0) return null;

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {content.sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        {section.type === 'HERO' && (
                            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none p-8 relative overflow-hidden group shadow-glow">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                                                <Sparkles size={24} />
                                            </div>
                                            <h3 className="text-xl font-black text-white tracking-tight">{section.title}</h3>
                                        </div>
                                        <p className="text-indigo-50 font-bold text-lg leading-relaxed">{section.description}</p>
                                    </div>
                                    {section.actionText && (
                                        <button
                                            onClick={() => {
                                                if (section.actionUrl === '/decision/new') {
                                                    // This is where we'd check the limit if we had access to 'decisions' here
                                                    // Since we don't, we'll rely on the Dashboard button or add store access here
                                                    // For now, let's keep it simple and just let them click through
                                                    // The actual enforcement happens on the backend or main dashboard
                                                    window.location.href = section.actionUrl!;
                                                }
                                            }}
                                            className="bg-white text-indigo-600 hover:bg-blue-50 rounded-2xl h-14 px-8 text-sm font-black shadow-xl shadow-black/20 flex items-center gap-2 transition-all hover:scale-105"
                                        >
                                            {section.actionText}
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            </Card>
                        )}

                        {section.type === 'ANNOUNCEMENT' && (
                            <div className="flex items-center gap-4 bg-[#0d1117] border border-white/5 p-4 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                                    <Megaphone size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{section.title}</h4>
                                    <p className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">{section.description}</p>
                                </div>
                                <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase">Official</Badge>
                            </div>
                        )}

                        {section.type === 'FEATURE' && (
                            <Card className="p-6 bg-[#0d1117] border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{section.title}</h3>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{section.description}</p>
                                    </div>
                                    <ChevronRight className="text-gray-700 group-hover:text-primary transition-colors" size={20} />
                                </div>
                            </Card>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
