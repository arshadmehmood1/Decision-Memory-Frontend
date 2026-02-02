import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Check, Link as LinkIcon, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type LinkType = 'RELIES_ON' | 'SUPERSEDES' | 'RELATES_TO' | 'BLOCKED_BY';

const LINK_TYPES: { id: LinkType; label: string; color: string }[] = [
    { id: 'RELIES_ON', label: 'Relies On', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'SUPERSEDES', label: 'Supersedes', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    { id: 'BLOCKED_BY', label: 'Blocked By', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    { id: 'RELATES_TO', label: 'Relates To', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
];

interface DecisionLinkerProps {
    currentDecisionId?: string; // If editing existing
    onLinkAdd?: (link: { type: LinkType; targetId: string; targetTitle: string }) => void;
    existingLinks?: { type: LinkType; targetId: string; targetTitle: string }[];
}

export function DecisionLinker({ currentDecisionId, onLinkAdd, existingLinks = [] }: DecisionLinkerProps) {
    const { decisions, linkDecision } = useStore();
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<LinkType>('RELATES_TO');
    const [isSearching, setIsSearching] = useState(false);

    // Filter available decisions to link
    // Exclude current decision and already linked decisions
    const availableDecisions = decisions.filter(d =>
        d.id !== currentDecisionId &&
        d.title.toLowerCase().includes(search.toLowerCase()) &&
        !existingLinks.some(l => l.targetId === d.id)
    ).slice(0, 5);

    const handleAddLink = async (targetId: string, targetTitle: string) => {
        if (onLinkAdd) {
            onLinkAdd({ type: selectedType, targetId, targetTitle });
        } else if (currentDecisionId) {
            // If editing live decision, update store directly
            await linkDecision(currentDecisionId, targetId, selectedType);
            toast.success('Decision Linked');
        }
        setSearch('');
        setIsSearching(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Linked Decisions</label>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearching(!isSearching)}
                    className={cn("text-xs font-bold gap-2", isSearching ? "text-primary bg-primary/10" : "text-gray-500 hover:text-white")}
                >
                    <LinkIcon size={14} />
                    {isSearching ? 'Cancel Linking' : 'Add Link'}
                </Button>
            </div>

            {/* Existing Links List */}
            <div className="space-y-2">
                {existingLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <Badge className={cn("text-[10px] font-black uppercase tracking-wider border", LINK_TYPES.find(t => t.id === link.type)?.color)}>
                                {LINK_TYPES.find(t => t.id === link.type)?.label}
                            </Badge>
                            <span className="text-sm font-medium text-gray-300 truncate max-w-[200px]">{link.targetTitle}</span>
                        </div>
                        {/* Remove button could go here */}
                    </div>
                ))}
            </div>

            {/* Search Interface */}
            <AnimatePresence>
                {isSearching && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                    >
                        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                            {LINK_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border",
                                        selectedType === type.id
                                            ? type.color + " shadow-glow"
                                            : "bg-white/5 text-gray-500 border-white/5 hover:bg-white/10"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <Input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search past decisions..."
                                className="pl-10 bg-black/20 border-white/10"
                            />
                        </div>

                        <div className="space-y-1">
                            {availableDecisions.map(decision => (
                                <button
                                    key={decision.id}
                                    onClick={() => handleAddLink(decision.id, decision.title)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-left group transition-all"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{decision.title}</span>
                                        <span className="text-[10px] text-gray-600 font-medium uppercase">{decision.category}</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Check size={12} className="text-primary" />
                                    </div>
                                </button>
                            ))}
                            {search && availableDecisions.length === 0 && (
                                <div className="text-center py-4 text-xs text-gray-500">No decisions match "{search}"</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
