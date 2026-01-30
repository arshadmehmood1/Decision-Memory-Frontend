'use client';

import { DecisionForm } from '@/components/decisions/DecisionForm';

export default function NewDecisionClient() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-black tracking-tight text-white uppercase tracking-tighter">Log Decision</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Document your choice to build your long-term decision memory.</p>
            </div>
            <DecisionForm />
        </div>
    );
}
