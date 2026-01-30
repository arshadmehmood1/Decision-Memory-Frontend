import * as React from 'react';
import { NeuronBackground } from '@/components/ui/NeuronBackground';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-500/30 selection:text-white">
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <NeuronBackground />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-glow">D</div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase tracking-[0.2em]">Decision Memory</h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Stop repeating expensive mistakes</p>
                </div>
                {children}
            </div>
        </div>
    );
}
