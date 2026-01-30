'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import {
    Users,
    Search,
    Shield,
    User,
    Mail,
    Calendar,
    Building2,
    ChevronLeft,
    ChevronRight,
    Crown,
    Eye,
    UserCog
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: 'ADMIN' | 'MEMBER' | 'VIEWER';
    createdAt: string;
    workspace: {
        name: string;
        planTier: string;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function UsersClient() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const fetchUsers = async (page = 1, searchQuery = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (searchQuery) params.set('search', searchQuery);

            const res = await apiRequest<{ data: UserData[]; pagination: Pagination }>(`/admin/users?${params}`);
            setUsers(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Failed to load user registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchUsers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(1, search);
    };

    const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'MEMBER' | 'VIEWER') => {
        try {
            await apiRequest(`/admin/users/${userId}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role: newRole })
            });
            toast.success("User role updated successfully");
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setEditingRole(null);
        } catch (err) {
            console.error("Failed to update role", err);
            toast.error("Failed to update user role");
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20"><Crown size={10} className="mr-1" />Admin</Badge>;
            case 'MEMBER':
                return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20"><User size={10} className="mr-1" />Member</Badge>;
            case 'VIEWER':
                return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20"><Eye size={10} className="mr-1" />Viewer</Badge>;
            default:
                return <Badge>{role}</Badge>;
        }
    };

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case 'PRO':
                return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Pro</Badge>;
            case 'TEAM':
                return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Team</Badge>;
            case 'ENTERPRISE':
                return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Enterprise</Badge>;
            default:
                return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Free</Badge>;
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                            <Users className="text-indigo-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">User Registry</h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">Manage neural operatives across all sectors</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Operatives</p>
                    <p className="text-2xl font-black text-white">{pagination.total}</p>
                </div>
            </header>

            {/* Search */}
            <Card className="p-6 bg-[#0d1117] border-white/5">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                            placeholder="Search by name or email..."
                            className="bg-black/50 border-white/10 text-white pl-12 h-12"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="h-12 px-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                        Search
                    </Button>
                </form>
            </Card>

            {/* Users Table */}
            <Card className="p-6 bg-[#0d1117] border-white/5 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Users className="mx-auto mb-4 opacity-50" size={48} />
                        <p className="text-sm">No operatives found in the registry</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-white/5">
                                <tr>
                                    <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Operative</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Workspace</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Plan</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Joined</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group transition-colors hover:bg-white/5"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-gray-400 uppercase">
                                                    {(user.name?.[0] || user.email[0]).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{user.name || 'Unnamed'}</p>
                                                    <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                                                        <Mail size={10} /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {editingRole === user.id ? (
                                                <div className="flex gap-2">
                                                    {(['ADMIN', 'MEMBER', 'VIEWER'] as const).map(role => (
                                                        <button
                                                            key={role}
                                                            onClick={() => handleRoleChange(user.id, role)}
                                                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${user.role === role
                                                                ? 'bg-primary text-white'
                                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => setEditingRole(null)}
                                                        className="px-2 text-gray-500 hover:text-white"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                getRoleBadge(user.role)
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-gray-500" />
                                                <span className="text-xs font-bold text-white">{user.workspace?.name || 'None'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {getPlanBadge(user.workspace?.planTier || 'FREE')}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingRole(editingRole === user.id ? null : user.id)}
                                                className="h-8 px-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"
                                            >
                                                <UserCog size={14} className="mr-1" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Edit Role</span>
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Page {pagination.page} of {pagination.pages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page <= 1}
                                onClick={() => fetchUsers(pagination.page - 1, search)}
                                className="h-8 px-3 border-white/5 text-gray-500 hover:text-white"
                            >
                                <ChevronLeft size={14} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => fetchUsers(pagination.page + 1, search)}
                                className="h-8 px-3 border-white/5 text-gray-500 hover:text-white"
                            >
                                <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
