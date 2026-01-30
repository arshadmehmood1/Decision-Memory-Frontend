'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black pt-20 md:pt-32 pb-10 md:pb-20 text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-32">
                    <div className="col-span-2 md:col-span-1 space-y-8">
                        <div className="flex items-center gap-3 text-primary group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-glow group-hover:scale-110 transition-transform">
                                <BrainCircuit size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                Decision<span className="text-primary">Memory</span>
                            </span>
                        </div>
                        <p className="text-gray-300 font-medium leading-relaxed max-w-xs">
                            Building the world's first institutional memory for founders and teams.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Product</h4>
                        <ul className="space-y-4">
                            {['Features', 'Pricing', 'API', 'Docs'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'API' ? '/docs/api' : item === 'Docs' ? '/docs' : `/#${item.toLowerCase()}`}
                                        className="text-blue-400 hover:text-white transition-colors font-bold"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About', 'Careers', 'Contact'].map((item) => (
                                <li key={item}>
                                    {item === 'Contact' ? (
                                        <a href="mailto:support@decisionmemory.com" className="text-blue-400 hover:text-white transition-colors font-bold">{item}</a>
                                    ) : (
                                        <Link href={`/${item.toLowerCase()}`} className="text-blue-400 hover:text-white transition-colors font-bold">{item}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacy', 'Terms', 'Refunds', 'License'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`} className="text-blue-400 hover:text-white transition-colors font-bold">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-500 font-bold text-sm">© 2026 Decision Memory Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="https://x.com/decisionmemory" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs">Twitter</Link>
                        <Link href="https://linkedin.com/company/decision-memory" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs">LinkedIn</Link>
                        <Link href="https://github.com/decision-memory" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs">GitHub</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
