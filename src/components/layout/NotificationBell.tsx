
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, ExternalLink, Info, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function NotificationBell() {
    const { notifications, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="text-emerald-400" size={16} />;
            case 'WARNING': return <AlertCircle className="text-amber-400" size={16} />;
            case 'BILLING': return <Zap className="text-blue-400" size={16} />;
            default: return <Info className="text-blue-400" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-[#8b949e] hover:text-white transition-colors group"
            >
                <Bell size={20} className={cn(isOpen ? "text-white" : "")} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1f6feb] text-[10px] font-bold text-white ring-2 ring-[#0d1117] animate-in fade-in zoom-in duration-300">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-[#30363d] flex items-center justify-between bg-black/20">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#8b949e]">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllNotificationsRead()}
                                    className="text-[10px] font-bold text-[#1f6feb] hover:text-[#58a6ff] transition-colors flex items-center gap-1"
                                >
                                    <Check size={12} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-[#30363d]">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                                            className={cn(
                                                "p-4 transition-all cursor-pointer hover:bg-[#21262d]",
                                                !notif.isRead ? "bg-[#1f6feb]/5" : ""
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1 shrink-0">{getTypeIcon(notif.type)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className={cn("text-xs font-bold truncate", notif.isRead ? "text-[#c9d1d9]" : "text-white")}>
                                                            {notif.title}
                                                        </span>
                                                        <span className="text-[10px] text-[#8b949e] whitespace-nowrap mt-0.5">
                                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-[#8b949e] mt-1 leading-relaxed line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                    {notif.link && (
                                                        <Link
                                                            href={notif.link}
                                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1f6feb] mt-2 hover:underline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            View Details <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#30363d]/50 flex items-center justify-center mx-auto mb-4 border border-[#30363d]">
                                        <Bell size={20} className="text-[#8b949e]" />
                                    </div>
                                    <p className="text-xs font-bold text-[#c9d1d9]">No Notifications</p>
                                    <p className="text-[10px] text-[#8b949e] mt-1">We'll alert you here when stuff happens.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-black/20 border-t border-[#30363d] text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#8b949e] hover:text-white transition-colors">
                                View History
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
