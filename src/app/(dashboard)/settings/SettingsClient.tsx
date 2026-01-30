'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Settings as SettingsIcon, Bell, Lock, Users, CreditCard, Globe, Mail, Shield, Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { Switch } from '@/components/ui/Switch';

const TABS = [
    { id: 'profile', title: 'Profile', icon: Users },
    { id: 'workspace', title: 'Workspace', icon: Globe },
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'billing', title: 'Billing', icon: CreditCard },
];

export default function SettingsClient() {
    const { currentUser, updateUser, updateWorkspace, createCheckoutSession, workspaces, currentWorkspaceId, isLoading: isStoreLoading } = useStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
    const [name, setName] = useState(currentUser?.name || '');
    const [wsName, setWsName] = useState(currentWorkspace?.name || '');

    React.useEffect(() => {
        setMounted(true);
        if (currentUser) setName(currentUser.name);
        if (currentWorkspace) setWsName(currentWorkspace.name);
    }, [currentUser, currentWorkspace]);

    if (!mounted) return null;

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            await updateUser({ name });
            toast.success('Profile Updated');
        } catch (err) {
            toast.error('Update Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveWorkspace = async () => {
        if (!currentWorkspaceId) return;
        setIsLoading(true);
        try {
            await updateWorkspace(currentWorkspaceId, wsName);
            toast.success('Workspace Updated');
        } catch (err) {
            toast.error('Update Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            await createCheckoutSession('PRO');
        } catch (err) {
            toast.error('Upgrade Failed');
            setIsUpgrading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-black tracking-tight text-white">Settings</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Manage your personal account and shared workspace.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                        {TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-sm font-black transition-all whitespace-nowrap uppercase tracking-widest", activeTab === tab.id ? "bg-primary text-white shadow-glow scale-105" : "text-gray-500 hover:bg-white/5 hover:text-white")}>
                                <tab.icon size={18} />{tab.title}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'profile' && (
                                <Card className="rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden bg-white/5">
                                    <CardHeader className="border-b border-white/5 p-10">
                                        <CardTitle className="text-2xl font-black text-white">Public Profile</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary font-black text-3xl border-4 border-white/5 shadow-glow">
                                                {currentUser?.name?.substring(0, 2).toUpperCase() || 'ME'}
                                            </div>
                                            <div className="space-y-3">
                                                <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">Change Avatar</Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                                            <Input label="Email Address" value={currentUser?.email || ''} disabled />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-white/5 p-10 flex justify-end border-t border-white/5">
                                        <Button onClick={handleSaveProfile} isLoading={isLoading} className="rounded-full px-10 h-14 shadow-glow gap-3 font-black uppercase tracking-widest text-xs">
                                            <Save size={20} />Update Profile
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {activeTab === 'workspace' && (
                                <Card className="rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden bg-white/5">
                                    <CardHeader className="border-b border-white/5 p-10">
                                        <CardTitle className="text-2xl font-black text-white">Workspace Configuration</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="space-y-6">
                                            <Input
                                                label="Workspace Name"
                                                value={wsName}
                                                onChange={(e) => setWsName(e.target.value)}
                                                placeholder="Enter workspace name"
                                            />
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                <h4 className="text-sm font-bold text-white mb-2">Workspace Identification</h4>
                                                <p className="text-xs text-gray-400 font-medium">Unique ID: <span className="font-mono text-primary">{currentWorkspaceId}</span></p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-white/5 p-10 flex justify-end border-t border-white/5">
                                        <Button onClick={handleSaveWorkspace} isLoading={isLoading} className="rounded-full px-10 h-14 shadow-glow gap-3 font-black uppercase tracking-widest text-xs">
                                            <Save size={20} />Save Changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {activeTab === 'notifications' && (
                                <Card className="rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden bg-white/5">
                                    <CardHeader className="border-b border-white/5 p-10">
                                        <CardTitle className="text-2xl font-black text-white">Neural Notifications</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        {[
                                            { title: 'Decision Alerts', desc: 'Get notified when a decision reaches its review deadline.' },
                                            { title: 'AI Insights', desc: 'Receive neural analysis alerts for your workspaces.' },
                                            { title: 'Collaborator Activity', desc: 'Updates when team members add comments or traces.' },
                                            { title: 'Billing & Quota', desc: 'Stay informed about your plan usage and neural credits.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'security' && (
                                <Card className="rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden bg-white/5">
                                    <CardHeader className="border-b border-white/5 p-10">
                                        <CardTitle className="text-2xl font-black text-white">Account Security</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                                <Shield size={32} />
                                            </div>
                                            <h3 className="text-xl font-black text-white">Identity Managed by Clerk</h3>
                                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                                Password management, 2FA, and session control are securely handled via our neural identity provider.
                                            </p>
                                            <Button variant="outline" className="rounded-xl mt-4 border-white/10 bg-white/5 text-white hover:bg-white/10">
                                                Manage Identity Settings
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'billing' && (
                                <Card className="rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden bg-white/5">
                                    <CardHeader className="border-b border-white/5 p-10">
                                        <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Subscription & usage</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="p-10 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/10">
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                                <div className="space-y-4">
                                                    <Badge className="bg-blue-500 text-white border-none text-[10px] font-black tracking-[0.2em] uppercase px-4 h-8 flex items-center w-fit shadow-glow">CURRENT PLAN</Badge>
                                                    <h3 className="text-5xl font-black tracking-tighter italic">{currentWorkspace?.planTier || 'Free'} Tier</h3>
                                                </div>
                                                <Button onClick={handleUpgrade} isLoading={isUpgrading} disabled={isUpgrading} className="bg-white text-black hover:bg-gray-200 px-10 h-16 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-white/5 transition-transform hover:scale-105 active:scale-95">Upgrade to Pro</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
