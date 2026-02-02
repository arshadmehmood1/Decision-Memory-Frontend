import React, { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useStore } from '@/lib/store';
import { GitBranch, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils'; // Assuming this utility exists

interface SimilarDecisionsProps {
    currentDecisionId: string;
    category: string;
    tags?: string[];
}

export function SimilarDecisions({ currentDecisionId, category, tags = [] }: SimilarDecisionsProps) {
    const { decisions } = useStore();

    const similar = useMemo(() => {
        return decisions
            .filter(d => d.id !== currentDecisionId)
            .map(d => {
                let score = 0;
                if (d.category === category) score += 3;
                if (d.tags && tags) {
                    const shared = d.tags.filter(t => tags.includes(t));
                    score += shared.length * 2;
                }
                return { ...d, matchScore: score };
            })
            .filter(d => d.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3);
    }, [decisions, currentDecisionId, category, tags]);

    if (similar.length === 0) return null;

    return (
        <Card className="rounded-[2.5rem] border border-white/10 shadow-premium bg-white/5 p-2 overflow-hidden">
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                        <GitBranch size={18} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Related Traces</h3>
                        <p className="text-xs font-bold text-gray-500">Based on category & tags</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {similar.map(decision => (
                        <Link key={decision.id} href={`/decision/${decision.id}`} className="block group">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="font-bold text-sm text-gray-200 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                        {decision.title}
                                    </h4>
                                    <ArrowRight size={14} className="text-gray-600 group-hover:text-primary transition-colors shrink-0 mt-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                                </div>
                                <div className="mt-3 flex items-center gap-3">
                                    <Badge variant="outline" className="text-[9px] h-5 px-2 font-black uppercase tracking-wider border-white/10 text-gray-500">
                                        {decision.status}
                                    </Badge>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-1">
                                        <Calendar size={10} /> {formatDate(decision.madeOn)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
