'use client';

import { use } from 'react';
import { DecisionForm } from '@/components/decisions/DecisionForm';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditDecisionClient() {
    const params = useParams();
    const id = params.id as string;
    const { decisions, isLoading } = useStore();
    const decision = decisions.find(d => d.id === id);

    if (isLoading && !decision) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!decision) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-white">Decision Not Found</h2>
                <p className="text-gray-400">The trace you are looking for does not exist or has been archived.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-black tracking-tight text-white uppercase tracking-tighter">Refine Trace</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Update your strategic data to improve neural analysis accuracy.</p>
            </div>
            <DecisionForm
                isEditing
                decisionId={id}
                initialData={{
                    title: decision.title,
                    category: decision.category as any,
                    decision: decision.decision,
                    context: decision.context,
                    alternatives: decision.alternatives,
                    assumptions: decision.assumptions,
                    successCriteria: decision.successCriteria,
                    privacy: decision.privacy
                }}
            />
        </div>
    );
}
