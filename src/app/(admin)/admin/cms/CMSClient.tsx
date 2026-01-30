'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    FileText,
    Layers,
    Layout,
    Clock,
    CheckCircle,
    Eye,
    Zap,
    History,
    Search,
    ChevronRight,
    ArrowUpRight,
    Plus,
    X,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';

export default function CMSClient() {
    const [activeTab, setActiveTab] = useState('LANDING');
    const [showEditor, setShowEditor] = useState(false);
    const [showPreview, setShowPreview] = useState<any>(null);
    const [showRollbackLog, setShowRollbackLog] = useState(false);
    const [editContent, setEditContent] = useState<any>({
        sections: [
            { type: 'HERO', title: 'Level Up Your Brain', description: 'Log decisions to unlock insights.' }
        ]
    });

    const [versions, setVersions] = useState<any[]>([]);
    const { toggleFeatureFlag, fetchFeatureFlag, featureFlags } = useStore();
    const FEATURE_KEYS = ['new_pricing_page', 'ai_analytics', 'beta_dashboard'];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (activeTab === 'FEATURES') {
            FEATURE_KEYS.forEach(key => fetchFeatureFlag(key));
        } else {
            loadVersions();
        }
    }, [activeTab, mounted]);

    const loadVersions = async () => {
        try {
            const res = await apiRequest<{ data: any[] }>('/admin/cms/versions');
            setVersions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await apiRequest('/admin/cms/approve', {
                method: 'POST',
                body: JSON.stringify({ id })
            });
            toast.success("Content matrix stabilized. Update is now live.");
            loadVersions();
        } catch (err) {
            console.error("Approve failed", err);
            toast.error("Handshake failed. Update rejected.");
        }
    };

    const handleTerminate = async (id: string) => {
        try {
            await apiRequest(`/admin/cms/version/${id}`, { method: 'DELETE' });
            toast.success("Version terminated. Neural link severed.");
            loadVersions();
        } catch (err) {
            console.error("Terminate failed", err);
            toast.error("Termination failed. Version persists.");
        }
    };

    const handlePreview = async (id: string) => {
        try {
            const res = await apiRequest<{ data: any }>(`/admin/cms/version/${id}`);
            setShowPreview(res.data);
        } catch (err) {
            console.error("Preview failed", err);
            toast.error("Failed to load version preview.");
        }
    };

    const handleRollback = async (id: string) => {
        try {
            await apiRequest(`/admin/cms/rollback/${id}`, { method: 'POST' });
            toast.success("Rolled back to selected version.");
            loadVersions();
            setShowRollbackLog(false);
        } catch (err) {
            console.error("Rollback failed", err);
            toast.error("Rollback failed. Timeline unchanged.");
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20">
                            <Layers className="text-blue-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">CMS Matrix</h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">Interface for landing page content scheduling and neural updates</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowRollbackLog(true)}
                        className="border-white/5 text-[10px] font-black uppercase tracking-widest text-primary"
                    >
                        <History size={14} className="mr-2" />
                        Rollback Log
                    </Button>
                    <Button
                        onClick={() => setShowEditor(true)}
                        className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-glow"
                    >
                        <Plus size={14} className="mr-2" />
                        New Version
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Pages Sidebar */}
                <div className="space-y-2">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 px-4">Neural Segments</h3>
                    {['LANDING', 'DASHBOARD', 'FEATURES', 'PRICING_PAGE', 'LEGAL_MATRICES'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${activeTab === tab
                                ? 'bg-white/10 border-white/10 text-white'
                                : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Layout size={16} className={activeTab === tab ? 'text-primary' : ''} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{tab.replace('_', ' ')}</span>
                            </div>
                            <ChevronRight size={14} className={activeTab === tab ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                </div>

                {/* Content Stream */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'FEATURES' ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Feature Flags</h3>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                    Live Control
                                </Badge>
                            </div>

                            {FEATURE_KEYS.map((key) => (
                                <Card key={key} className="p-6 bg-[#0d1117] border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${featureFlags[key] ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-wide">{key.replace(/_/g, ' ')}</h4>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">feature:{key}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${featureFlags[key] ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {featureFlags[key] ? 'Active' : 'Disabled'}
                                        </div>
                                        <Button
                                            onClick={() => toggleFeatureFlag(key, !featureFlags[key])}
                                            className={`rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 transition-all ${featureFlags[key]
                                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
                                        >
                                            {featureFlags[key] ? 'Disable' : 'Enable'}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Version Stream (Alpha)</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                    <input
                                        placeholder="Locate Vector..."
                                        className="bg-[#0d1117] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-white/10 transition-all w-48"
                                    />
                                </div>
                            </div>

                            {versions.length === 0 && (
                                <div className="text-center py-10 text-gray-500 text-sm">
                                    No versions found in the matrix. Create one to begin.
                                </div>
                            )}

                            {versions.map((v, i) => (
                                <motion.div
                                    key={v.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="p-6 bg-[#0d1117] border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                                        {v.status === 'LIVE' && (
                                            <div className="absolute top-0 right-0 p-1 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest px-3">
                                                Current Reality
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex gap-6">
                                                <div className={`w-14 h-14 rounded-2xl ${v.status === 'LIVE' ? 'bg-emerald-400/5' : 'bg-blue-400/5'} border border-white/5 flex flex-col items-center justify-center`}>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">VER</span>
                                                    <span className={`text-xs font-black ${v.status === 'LIVE' ? 'text-emerald-400' : 'text-blue-400'}`}>{v.id.substring(0, 4)}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-sm font-black text-white hover:text-primary transition-colors cursor-pointer">{v.changes || v.pageName}</h4>
                                                        <Badge className={`text-[8px] font-black uppercase tracking-widest border-transparent ${v.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            v.status === 'SCHEDULED' ? 'bg-amber-500/10 text-amber-500' :
                                                                'bg-blue-500/10 text-blue-500'
                                                            }`}>
                                                            {v.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                                        By {v.approvedBy || 'Unknown'} • {new Date(v.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handlePreview(v.id)}
                                                    className="h-10 w-10 p-0 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                {(v.status === 'DRAFT' || v.status === 'SCHEDULED') && (
                                                    <Button
                                                        onClick={() => handleApprove(v.id)}
                                                        className="h-10 text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                    >
                                                        <CheckCircle size={14} className="mr-2" />
                                                        Approve
                                                    </Button>
                                                )}
                                                {v.status === 'LIVE' && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleTerminate(v.id)}
                                                        className="h-10 text-[10px] font-black uppercase tracking-widest border-red-500/20 text-red-400 hover:bg-red-500/10"
                                                    >
                                                        Terminate
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}

                            <div className="mt-8 text-center py-10 border-2 border-dashed border-white/5 rounded-3xl group hover:border-primary/20 transition-all cursor-pointer">
                                <Zap className="mx-auto text-gray-700 group-hover:text-primary transition-colors mb-4" size={32} />
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Request Content Splinter</h4>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Content Editor Overlay */}
            <AnimatePresence>
                {showEditor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0d1117] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Content Architect</h2>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Editing Segment: {activeTab}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowEditor(false)} className="rounded-2xl hover:bg-white/5">
                                    <X size={24} className="text-gray-500" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                                {editContent.sections.map((section: any, idx: number) => (
                                    <Card key={idx} className="p-6 bg-black/40 border-white/5 space-y-6 relative group">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                                Section {idx + 1}: {section.type}
                                            </Badge>
                                            <button className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Vector Type</label>
                                                <select className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:border-primary outline-none appearance-none">
                                                    <option>HERO</option>
                                                    <option>ANNOUNCEMENT</option>
                                                    <option>FEATURE</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Neural Header</label>
                                                <input
                                                    value={section.title}
                                                    onChange={(e) => {
                                                        const newSections = [...editContent.sections];
                                                        newSections[idx].title = e.target.value;
                                                        setEditContent({ ...editContent, sections: newSections });
                                                    }}
                                                    className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:border-primary outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Information Payload</label>
                                            <textarea
                                                value={section.description}
                                                onChange={(e) => {
                                                    const newSections = [...editContent.sections];
                                                    newSections[idx].description = e.target.value;
                                                    setEditContent({ ...editContent, sections: newSections });
                                                }}
                                                className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-primary outline-none resize-none"
                                            />
                                        </div>
                                    </Card>
                                ))}

                                <button
                                    onClick={() => setEditContent({ ...editContent, sections: [...editContent.sections, { type: 'ANNOUNCEMENT', title: '', description: '' }] })}
                                    className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2rem] text-gray-700 hover:border-primary/20 hover:text-primary transition-all flex flex-col items-center justify-center gap-2"
                                >
                                    <Plus size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Fuse New Neural Section</span>
                                </button>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
                                <Button variant="ghost" onClick={() => setShowEditor(false)} className="flex-1 h-14 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/5">
                                    Discard Splinter
                                </Button>
                                <Button
                                    onClick={async () => {
                                        try {
                                            await apiRequest('/admin/cms/version', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    pageName: activeTab,
                                                    content: JSON.stringify(editContent),
                                                    changes: `Update to ${activeTab} matrix`
                                                })
                                            });
                                            toast.success("New version drafted in the matrix.");
                                            setShowEditor(false);
                                            loadVersions();
                                        } catch (err) {
                                            toast.error("Version fusion failed.");
                                        }
                                    }}
                                    className="flex-2 h-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow"
                                >
                                    Commit to Draft Queue
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPreview(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Version Preview</h2>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{showPreview.pageName} • {showPreview.id.substring(0, 8)}</p>
                                </div>
                                <button onClick={() => setShowPreview(null)} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto max-h-[60vh]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Status</label>
                                        <Badge className={`text-[10px] font-black uppercase tracking-widest ${showPreview.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-500' : showPreview.status === 'DRAFT' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                            {showPreview.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Created</label>
                                        <p className="text-sm font-bold text-white">{new Date(showPreview.createdAt).toLocaleString()}</p>
                                    </div>
                                    {showPreview.approvedAt && (
                                        <div>
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Approved</label>
                                            <p className="text-sm font-bold text-white">{new Date(showPreview.approvedAt).toLocaleString()}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Content</label>
                                        <pre className="bg-black/50 border border-white/5 rounded-xl p-4 text-xs text-gray-400 overflow-x-auto max-h-64">
                                            {typeof showPreview.content === 'string' ? showPreview.content : JSON.stringify(showPreview.content, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rollback Log Modal */}
            <AnimatePresence>
                {showRollbackLog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRollbackLog(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Rollback Log</h2>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Select a version to restore</p>
                                </div>
                                <button onClick={() => setShowRollbackLog(false)} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto max-h-[60vh] space-y-3">
                                {versions.filter(v => v.status !== 'LIVE').map((v, i) => (
                                    <div key={v.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                        <div>
                                            <p className="text-sm font-bold text-white">{v.pageName} • {v.id.substring(0, 8)}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(v.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleRollback(v.id)}
                                            className="h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white hover:bg-amber-600"
                                        >
                                            <History size={12} className="mr-1" />
                                            Rollback
                                        </Button>
                                    </div>
                                ))}
                                {versions.filter(v => v.status !== 'LIVE').length === 0 && (
                                    <div className="text-center py-10 text-gray-500">
                                        <History className="mx-auto mb-4 opacity-50" size={32} />
                                        <p className="text-xs">No previous versions available for rollback</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
