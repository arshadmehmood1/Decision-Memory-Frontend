'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { DecisionCard } from '@/components/decisions/DecisionCard';

export default function CommunityClient() {
    const { decisions, currentUser } = useStore();
    const [publicDecisions, setPublicDecisions] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchPublic = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/public/community`);
                const data = await res.json();
                if (data.success) {
                    setPublicDecisions(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch public community data", err);
            }
        };
        fetchPublic();
    }, []);

    // Merge workspace public decisions with global ones
    const displayedDecisions = React.useMemo(() => {
        const workspacePublic = currentUser
            ? decisions.filter(d => d.privacy === 'Public Community' || d.privacy === 'Anonymous Public')
            : [];

        // Use a Set to avoid duplicates if any
        const seenIds = new Set(workspacePublic.map(d => d.id));
        const combined = [...workspacePublic];

        publicDecisions.forEach(d => {
            if (!seenIds.has(d.id)) {
                combined.push(d);
                seenIds.add(d.id);
            }
        });

        return combined.sort((a, b) => new Date(b.madeOn).getTime() - new Date(a.madeOn).getTime());
    }, [currentUser, decisions, publicDecisions]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div className="py-2">
                    <h2 className="text-5xl font-black tracking-tighter text-white">Community</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Global decision intelligence</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input id="community-search" placeholder="Search global traces..." className="h-14 bg-white/5 border-white/10 pl-12 text-lg rounded-2xl focus:border-primary transition-all font-bold placeholder:text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Latest Public Traces</h3>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 py-1 bg-white/5 rounded-full border border-white/5">
                        {displayedDecisions.length} Active Traces
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {displayedDecisions.length > 0 ? (
                        displayedDecisions.map((decision, idx) => (
                            <motion.div key={decision.id} initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                <DecisionCard decision={decision} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/5">
                            <div className="w-20 h-20 bg-black rounded-[2rem] shadow-premium flex items-center justify-center text-gray-700 mx-auto mb-6 border border-white/10">
                                <Search size={40} />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2">No neural traces detected</h3>
                            <p className="text-gray-500 font-bold max-w-xs mx-auto">Be the first to share a strategic decision with the community.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
