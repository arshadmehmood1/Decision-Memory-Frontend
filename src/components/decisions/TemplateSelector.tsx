'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECISION_TEMPLATES, type DecisionTemplate } from '@/lib/decision-templates';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
    onSelect: (template: DecisionTemplate) => void;
    onSkip: () => void;
}

const COLOR_MAP: Record<string, string> = {
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20',
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20',
    slate: 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20',
    red: 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20',
    yellow: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20',
    gray: 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10',
};

export function TemplateSelector({ onSelect, onSkip }: TemplateSelectorProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Sparkles size={12} className="mr-2" />
                    Decision Templates
                </Badge>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                    Choose a Starting Point
                </h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] max-w-md mx-auto">
                    Templates provide pre-filled structures for common decisions. Select one to get started faster.
                </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DECISION_TEMPLATES.map((template) => {
                    const Icon = template.icon;
                    const isBlank = template.id === 'blank';

                    return (
                        <motion.button
                            key={template.id}
                            onClick={() => onSelect(template)}
                            onMouseEnter={() => setHoveredId(template.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "p-6 rounded-3xl border-2 text-left transition-all duration-300 group relative overflow-hidden",
                                COLOR_MAP[template.color] || COLOR_MAP.gray,
                                isBlank && "border-dashed"
                            )}
                        >
                            {/* Background glow on hover */}
                            <AnimatePresence>
                                {hoveredId === template.id && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
                                    />
                                )}
                            </AnimatePresence>

                            <div className="relative z-10 space-y-4">
                                {/* Icon */}
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                    hoveredId === template.id ? "scale-110" : ""
                                )}>
                                    <Icon size={24} />
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="font-black text-white text-sm mb-1 group-hover:text-white transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest line-clamp-2">
                                        {template.description}
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                    <span>Use Template</span>
                                    <ChevronRight size={12} />
                                </div>
                            </div>

                            {/* Category badge */}
                            {!isBlank && (
                                <Badge className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest bg-black/50 border-white/10 text-white/60">
                                    {template.category}
                                </Badge>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Skip button */}
            <div className="text-center">
                <button
                    onClick={onSkip}
                    className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-2"
                >
                    <X size={12} />
                    Skip Template Selection
                </button>
            </div>
        </div>
    );
}
