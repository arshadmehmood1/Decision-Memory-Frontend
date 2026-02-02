import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiRequest, setActiveWorkspaceId } from './api-client';

// ==========================================
// Types
// ==========================================

export interface Comment {
    id: string;
    author: string;
    role: string;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface Workspace {
    id: string;
    name: string;
    role: 'Owner' | 'Editor' | 'Viewer';
    planTier: 'FREE' | 'PRO' | 'TEAM';
    members?: { name: string; role: 'Owner' | 'Editor' | 'Viewer'; email: string }[];
}

export interface Notification {
    id: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BILLING';
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export interface Decision {
    id: string;
    title: string;
    category: string;
    status: 'ACTIVE' | 'SUCCEEDED' | 'FAILED' | 'REVERSED' | 'DRAFT';
    privacy: 'This Workspace' | 'Public Community' | 'Anonymous Public';
    reviewDeadline?: string;
    workspaceId: string;
    madeOn: string;
    madeBy: string;
    decision: string;
    context: string;
    alternatives: { name: string; whyRejected: string }[];
    assumptions: { id?: string; value: string }[];
    successCriteria: { value: string }[];
    tags?: string[];
    comments: Comment[];
    // Backend specific fields we might want to preserve
    aiRiskScore?: number;
    links?: { id: string; type: 'RELIES_ON' | 'SUPERSEDES' | 'RELATES_TO' | 'BLOCKED_BY'; targetId: string; targetTitle: string; }[];
}

export interface Insight {
    id: string;
    title: string;
    description: string;
    insightType: string;
    impact?: 'HIGH' | 'MEDIUM' | 'LOW';
    action?: string;
    confidence?: number;
}

// API Response Types
interface ApiUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'ADMIN' | 'MEMBER' | 'VIEWER';
    hasOnboarded?: boolean;
    preferences?: {
        emailDigest: boolean;
        reviewReminders: boolean;
        marketingEmails: boolean;
    };
}

interface ApiWorkspaceUser {
    name: string;
    email: string;
    role: 'Owner' | 'Editor' | 'Viewer';
}

interface ApiWorkspace {
    id: string;
    name: string;
    planTier?: 'FREE' | 'PRO' | 'TEAM';
    users?: ApiWorkspaceUser[];
}

interface ApiAssumption {
    id: string;
    text: string;
}

interface ApiDecision {
    id: string;
    title: string;
    category: string;
    status: Decision['status'];
    privacy: string;
    workspaceId: string;
    madeOn: string;
    madeBy?: { name: string };
    theDecision: string;
    context: string;
    alternativesConsidered: { name: string; whyRejected: string }[];
    assumptions: ApiAssumption[];
    successCriteria: string[];
    tags: string[];
    aiRiskScore?: number;
    links?: { id: string; type: 'RELIES_ON' | 'SUPERSEDES' | 'RELATES_TO' | 'BLOCKED_BY'; targetId: string; targetTitle: string; }[];
}

interface ApiComment {
    id: string;
    content: string;
    isAnonymous: boolean;
    author: { name: string };
    createdAt: string;
}

interface ApiInsight {
    id: string;
    title: string;
    description: string;
    insightType: string;
    impact?: 'HIGH' | 'MEDIUM' | 'LOW';
    action?: string;
    confidence?: number;
}

export interface DecisionDraft {
    title: string;
    category: string;
    decision: string;
    context: string;
    alternatives: { name: string; whyRejected: string }[];
    assumptions: { value: string }[];
    successCriteria: { value: string }[];
    privacy?: 'This Workspace' | 'Public Community' | 'Anonymous Public';
}

interface UserStore {
    // Session
    currentUser: (ApiUser & { preferences?: ApiUser['preferences'] }) | null;
    isLoading: boolean;
    error: string | null;

    // Notifications
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;
    markAllNotificationsRead: () => Promise<void>;

    // Workspaces
    workspaces: Workspace[];
    currentWorkspaceId: string;
    fetchWorkspaces: () => Promise<void>;
    createWorkspace: (name: string) => Promise<void>;
    switchWorkspace: (id: string) => void;

    // Decisions
    decisions: Decision[];
    fetchDecisions: (workspaceId: string) => Promise<void>;

    // Insights
    insights: Insight[];
    fetchInsights: () => Promise<void>;

    // AI Actions (Ephemeral)
    analyzeBlindspots: (decision: Decision) => Promise<string[]>;
    checkAssumption: (text: string) => Promise<{ score: number; issues: string[] }>;

    // Drafts
    draft: DecisionDraft | null;
    setDraft: (draft: DecisionDraft) => void;
    clearDraft: () => void;

    // Actions
    addDecision: (decision: Omit<Decision, 'id' | 'madeOn' | 'madeBy' | 'status' | 'comments' | 'workspaceId'>) => Promise<void>;
    updateDecision: (id: string, decision: Partial<Decision>) => Promise<void>;
    updateDecisionStatus: (id: string, status: Decision['status']) => Promise<void>;
    addComment: (decisionId: string, content: string, isAnonymous: boolean) => Promise<void>;
    fetchComments: (decisionId: string) => Promise<void>;
    linkDecision: (sourceId: string, targetId: string, type: 'RELIES_ON' | 'SUPERSEDES' | 'RELATES_TO' | 'BLOCKED_BY') => Promise<void>;

    // Prefs
    userPrefs: {
        sidebarCollapsed: boolean;
        darkMode: boolean;
    };
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Auth
    isAuthReady: boolean; // Added
    setIsAuthReady: (ready: boolean) => void; // Added
    login: (email: string, name: string) => void;
    logout: () => void;
    updateUser: (data: { name?: string; timezone?: string; hasOnboarded?: boolean }) => Promise<void>;
    updatePreferences: (prefs: Partial<ApiUser['preferences']>) => void;
    updateWorkspace: (id: string, name: string) => Promise<void>; // Added
    fetchMe: () => Promise<void>;

    // Billing
    createCheckoutSession: (plan: 'PRO' | 'TEAM') => Promise<void>;

    // Feature Flags
    featureFlags: Record<string, boolean>;
    fetchFeatureFlag: (key: string) => Promise<boolean>;
    fetchFeatureFlags: () => Promise<void>; // New: Fetch all roadmap flags
    toggleFeatureFlag: (key: string, enabled: boolean) => Promise<void>;
}

// ==========================================
// Mappers
// ==========================================

const mapPrivacyToApi = (p: string): string => {
    switch (p) {
        case 'Public Community': return 'PUBLIC';
        case 'Anonymous Public': return 'ANONYMOUS_PUBLIC';
        default: return 'WORKSPACE';
    }
};

const mapPrivacyFromApi = (p: string): Decision['privacy'] => {
    switch (p) {
        case 'PUBLIC': return 'Public Community';
        case 'ANONYMOUS_PUBLIC': return 'Anonymous Public';
        default: return 'This Workspace';
    }
};

// ==========================================
// Store Implementation
// ==========================================

export const useStore = create<UserStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            isLoading: false,
            error: null,

            workspaces: [],
            currentWorkspaceId: '',
            decisions: [],
            notifications: [],
            draft: null,

            userPrefs: {
                sidebarCollapsed: false,
                darkMode: false,
            },

            // WORKSPACES
            fetchWorkspaces: async () => {
                set({ isLoading: true });
                try {
                    const res = await apiRequest<{ data: ApiWorkspace[] }>('/workspaces');
                    const workspaces = res.data.map(ws => ({
                        id: ws.id,
                        name: ws.name,
                        role: 'Owner' as const,
                        planTier: ws.planTier || 'FREE',
                        members: ws.users?.map((u) => ({
                            name: u.name || 'Unknown',
                            email: u.email,
                            role: u.role || 'Member'
                        })) || []
                    }));

                    const firstWsId = get().currentWorkspaceId || workspaces[0]?.id || '';
                    setActiveWorkspaceId(firstWsId);
                    set({
                        workspaces,
                        currentWorkspaceId: firstWsId,
                        isLoading: false
                    });
                } catch (err) {
                    set({ error: (err as Error).message, isLoading: false });
                }
            },

            createWorkspace: async (name: string) => {
                try {
                    const res = await apiRequest<{ data: ApiWorkspace }>('/workspaces', {
                        method: 'POST',
                        body: JSON.stringify({ name })
                    });
                    const newWs = {
                        id: res.data.id,
                        name: res.data.name,
                        role: 'Owner' as const,
                        planTier: 'FREE' as const,
                        members: []
                    };
                    setActiveWorkspaceId(newWs.id);
                    set(state => ({
                        workspaces: [...state.workspaces, newWs],
                        currentWorkspaceId: newWs.id
                    }));
                } catch (err) {
                    console.error("Failed to create workspace", err);
                }
            },

            switchWorkspace: (id) => {
                setActiveWorkspaceId(id);
                set({ currentWorkspaceId: id });
                get().fetchDecisions(id);
            },

            // DECISIONS
            fetchDecisions: async (workspaceId) => {
                if (!workspaceId) return;
                set({ isLoading: true });
                try {
                    const res = await apiRequest<{ data: ApiDecision[] }>(`/decisions?workspaceId=${workspaceId}`);

                    const decisions: Decision[] = res.data.map((d) => ({
                        id: d.id,
                        title: d.title,
                        category: d.category,
                        status: d.status,
                        privacy: mapPrivacyFromApi(d.privacy),
                        workspaceId: d.workspaceId,
                        madeOn: new Date(d.madeOn).toISOString().split('T')[0],
                        madeBy: d.madeBy?.name || 'Unknown',
                        decision: d.theDecision, // Map API 'theDecision' to Store 'decision'
                        context: d.context,
                        alternatives: d.alternativesConsidered || [],
                        assumptions: d.assumptions?.map((a) => ({
                            id: a.id,
                            value: a.text
                        })) || [],
                        successCriteria: d.successCriteria?.map((s) => ({ value: s })) || [],
                        tags: d.tags || [],
                        comments: [], // Comments are fetched separately usually, or included? API list doesn't include comments. Detail view does.
                        aiRiskScore: d.aiRiskScore
                    }));

                    set({ decisions, isLoading: false });
                } catch (err) {
                    set({ error: (err as Error).message, isLoading: false });
                }
            },

            // INSIGHTS
            insights: [],
            fetchInsights: async () => {
                try {
                    const res = await apiRequest<{ data: ApiInsight[] }>('/insights');
                    const insights = res.data.map((i) => ({
                        id: i.id,
                        title: i.title,
                        description: i.description,
                        insightType: i.insightType,
                        impact: i.impact || 'MEDIUM',
                        action: i.action || 'Review related decisions',
                        confidence: i.confidence || 85
                    }));
                    set({ insights });
                } catch (err) {
                    console.error("Failed to fetch insights", err);
                }
            },

            analyzeBlindspots: async (decision) => {
                try {
                    const res = await apiRequest<{ data: { blindspots: string[] } }>('/ai/blindspot', {
                        method: 'POST',
                        body: JSON.stringify({
                            title: decision.title,
                            context: decision.context,
                            theDecision: decision.decision,
                            alternatives: decision.alternatives.map(a => a.name)
                        })
                    });
                    return res.data.blindspots;
                } catch (err) {
                    console.error("Blindspot analysis failed", err);
                    return [];
                }
            },

            checkAssumption: async (text) => {
                try {
                    const res = await apiRequest<{ data: { score: number; issues: string[] } }>('/ai/check-assumption', {
                        method: 'POST',
                        body: JSON.stringify({ text })
                    });
                    return res.data;
                } catch (err) {
                    console.error("Assumption check failed", err);
                    return { score: 0, issues: [] };
                }
            },

            setDraft: (draft) => set({ draft }),
            clearDraft: () => set({ draft: null }),

            addDecision: async (data) => {
                const state = get();
                // Map Frontend data to Backend API payload
                const payload = {
                    title: data.title,
                    category: data.category,
                    theDecision: data.decision,
                    context: data.context,
                    alternativesConsidered: data.alternatives,
                    successCriteria: data.successCriteria.map(s => s.value), // Flatten
                    tags: data.tags,
                    privacy: mapPrivacyToApi(data.privacy || 'This Workspace'),
                    assumptions: data.assumptions.map(a => ({ text: a.value, confidence: 'CONFIDENT' }))
                };

                try {
                    await apiRequest('/decisions', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                    // Refresh list
                    get().fetchDecisions(state.currentWorkspaceId);
                } catch (err) {
                    console.error("Failed to add decision", err);
                    throw err; // Re-throw for UI to handle
                }
            },

            updateDecision: async (id, data) => {
                const previousDecisions = get().decisions;

                // 1. Optimistic Update (Instant Feedback)
                set((state) => ({
                    decisions: state.decisions.map((d) =>
                        d.id === id ? { ...d, ...data } : d
                    ),
                }));

                try {
                    const payload = {
                        title: data.title,
                        category: data.category,
                        theDecision: data.decision,
                        context: data.context,
                        alternativesConsidered: data.alternatives,
                        successCriteria: data.successCriteria?.map(s => s.value),
                        tags: data.tags,
                        privacy: data.privacy ? mapPrivacyToApi(data.privacy) : undefined,
                        assumptions: data.assumptions?.map(a => ({ text: a.value, confidence: 'CONFIDENT' }))
                    };

                    await apiRequest(`/decisions/${id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(payload)
                    });
                } catch (err) {
                    console.error("Failed to update decision - Rolling back Protocol", err);
                    // 2. Rollback on Failure
                    set({ decisions: previousDecisions });
                    throw err;
                }
            },

            updateDecisionStatus: async (id, status) => {
                const previousDecisions = get().decisions;

                // 1. Optimistic Update
                set((state) => ({
                    decisions: state.decisions.map((d) =>
                        d.id === id ? { ...d, status } : d
                    ),
                }));

                try {
                    await apiRequest(`/decisions/${id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ status })
                    });
                } catch (err) {
                    console.error("Failed to update status - Rolling back Protocol", err);
                    // 2. Rollback
                    set({ decisions: previousDecisions });
                }
            },

            addComment: async (decisionId, content, isAnonymous) => {
                try {
                    const res = await apiRequest<{ data: ApiComment }>(`/decisions/${decisionId}/comments`, {
                        method: 'POST',
                        body: JSON.stringify({ content, isAnonymous })
                    });

                    // The main decision list doesn't have comments, so we might not need to update global store immediately
                    // unless we are in the detail view. 
                    // Ideally, detail view should fetch its own comments or subscribe.
                    // For now, let's update local optimistic state if we can find the decision
                    const newComment: Comment = {
                        id: res.data.id,
                        content: res.data.content,
                        isAnonymous: res.data.isAnonymous,
                        author: res.data.author.name,
                        role: 'Member', // TODO
                        createdAt: res.data.createdAt
                    };

                    set(state => ({
                        decisions: state.decisions.map(d =>
                            d.id === decisionId ? { ...d, comments: [...d.comments, newComment] } : d
                        )
                    }));

                } catch (err) {
                    console.error("Failed to add comment", err);
                }
            },

            fetchComments: async (decisionId) => {
                try {
                    // Update this to include query params if needed, or stick to /decisions/:id/comments
                    const res = await apiRequest<{ data: ApiComment[] }>(`/decisions/${decisionId}/comments`);
                    const comments: Comment[] = res.data.map((c) => ({
                        id: c.id,
                        content: c.content,
                        isAnonymous: c.isAnonymous,
                        author: c.author.name,
                        role: 'Member',
                        createdAt: c.createdAt
                    }));

                    set(state => ({
                        decisions: state.decisions.map(d =>
                            d.id === decisionId ? { ...d, comments } : d
                        )
                    }));
                } catch (err) {
                    console.error("Failed to fetch comments", err);
                }
            },

            setSidebarCollapsed: (collapsed) =>
                set((state) => ({
                    userPrefs: { ...state.userPrefs, sidebarCollapsed: collapsed }
                })),

            // AUTH
            isAuthReady: false,
            setIsAuthReady: (ready) => set({ isAuthReady: ready }),

            login: (email, name) => {
                set({
                    currentUser: {
                        id: '', // Will be populated by fetchMe
                        name,
                        email,
                        avatar: name.substring(0, 2).toUpperCase(),
                        role: 'MEMBER'
                    }
                });
                get().fetchMe();
                get().fetchWorkspaces();
                get().fetchFeatureFlags();
            },

            logout: () => {
                set({ currentUser: null, decisions: [], draft: null, currentWorkspaceId: '' });
                window.location.href = '/';
            },

            linkDecision: async (sourceId, targetId, type) => {
                const { decisions } = get();
                const source = decisions.find(d => d.id === sourceId);
                const target = decisions.find(d => d.id === targetId);

                if (!source || !target) return;

                // Optimistic update
                const newLink = {
                    id: Math.random().toString(),
                    type,
                    targetId,
                    targetTitle: target.title
                };

                const updatedDecisions = decisions.map(d => {
                    if (d.id === sourceId) {
                        return { ...d, links: [...(d.links || []), newLink] };
                    }
                    return d;
                });

                set({ decisions: updatedDecisions });
                // In real app: POST /api/decisions/:id/links
            },

            updateUser: async (data) => {
                set({ isLoading: true });
                try {
                    const res = await apiRequest<{ data: ApiUser }>('/users/me', {
                        method: 'PATCH',
                        body: JSON.stringify(data)
                    });

                    // Update local user state
                    const updatedUser = res.data;
                    set(state => ({
                        isLoading: false,
                        currentUser: state.currentUser ? {
                            ...state.currentUser,
                            name: updatedUser.name,
                            hasOnboarded: updatedUser.hasOnboarded
                            // Add other fields if we track them in currentUser
                        } : null
                    }));
                } catch (err) {
                    set({ error: (err as Error).message, isLoading: false });
                    throw err;
                }
            },

            updateWorkspace: async (id, name) => {
                set({ isLoading: true });
                try {
                    await apiRequest(`/workspaces/${id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ name })
                    });
                    set(state => ({
                        isLoading: false,
                        workspaces: state.workspaces.map(ws =>
                            ws.id === id ? { ...ws, name } : ws
                        )
                    }));
                } catch (err) {
                    set({ error: (err as Error).message, isLoading: false });
                    throw err;
                }
            },

            updatePreferences: (prefs) => {
                const { currentUser } = get();
                if (currentUser) {
                    const updatedUser: ApiUser = {
                        ...currentUser,
                        preferences: {
                            emailDigest: false,
                            reviewReminders: false,
                            marketingEmails: false,
                            ...currentUser.preferences,
                            ...prefs
                        }
                    };
                    set({ currentUser: updatedUser });
                }
            },

            createCheckoutSession: async (plan) => {
                set({ isLoading: true });
                try {
                    const res = await apiRequest<{ url: string }>('/billing/checkout', {
                        method: 'POST',
                        body: JSON.stringify({ plan })
                    });
                    if (res.url) {
                        window.location.href = res.url;
                    }
                } catch (err) {
                    set({ error: (err as Error).message, isLoading: false });
                    throw err;
                }
            },

            fetchMe: async () => {
                try {
                    const res = await apiRequest<{ data: ApiUser }>('/users/me');
                    const user = res.data;
                    set(state => ({
                        currentUser: state.currentUser ? {
                            ...state.currentUser,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            hasOnboarded: user.hasOnboarded,
                            avatar: (user.name || user.email).substring(0, 2).toUpperCase()
                        } : {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            hasOnboarded: user.hasOnboarded,
                            avatar: (user.name || user.email).substring(0, 2).toUpperCase()
                        }
                    }));
                    get().fetchFeatureFlags();
                } catch (err) {
                    console.error("Failed to fetch current user", err);
                }
            },

            // NOTIFICATIONS
            fetchNotifications: async () => {
                try {
                    const res = await apiRequest<{ data: Notification[] }>('/notifications');
                    set({ notifications: res.data });
                } catch (err) {
                    console.error("Failed to fetch notifications", err);
                }
            },

            markNotificationRead: async (id) => {
                try {
                    await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
                    set(state => ({
                        notifications: state.notifications.map(n =>
                            n.id === id ? { ...n, isRead: true } : n
                        )
                    }));
                } catch (err) {
                    console.error("Failed to mark notification as read", err);
                }
            },

            markAllNotificationsRead: async () => {
                try {
                    await apiRequest('/notifications/mark-all-read', { method: 'POST' });
                    set(state => ({
                        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
                    }));
                } catch (err) {
                    console.error("Failed to mark all notifications as read", err);
                }
            },

            // FEATURES
            featureFlags: {},
            fetchFeatureFlag: async (key) => {
                try {
                    const res = await apiRequest<{ enabled: boolean }>(`/feature/${key}`);
                    set(state => ({
                        featureFlags: { ...state.featureFlags, [key]: res.enabled }
                    }));
                    return res.enabled;
                } catch (err) {
                    console.error("Failed to fetch feature flag", key, err);
                    return false;
                }
            },

            fetchFeatureFlags: async () => {
                try {
                    const { currentUser } = get();
                    let flags: Record<string, boolean> = {};

                    if (currentUser?.role === 'ADMIN') {
                        // Admin: fetch all flags from the database
                        const res = await apiRequest<{ data: { featureKey: string, isEnabled: boolean }[] }>('/admin/feature');
                        res.data.forEach(f => {
                            flags[f.featureKey] = f.isEnabled;
                        });
                    } else {
                        // Regular user: fetch only live roadmap features
                        const res = await apiRequest<{ data: { featureKey: string | null }[] }>('/updates');
                        res.data.forEach(update => {
                            if (update.featureKey) {
                                flags[update.featureKey] = true;
                            }
                        });
                    }
                    set({ featureFlags: flags });
                } catch (err) {
                    console.error("Failed to fetch feature flags", err);
                }
            },

            toggleFeatureFlag: async (key, enabled) => {
                const state = get();
                // Optimistic
                set(state => ({
                    featureFlags: { ...state.featureFlags, [key]: enabled }
                }));

                try {
                    await apiRequest(`/admin/feature/${key}`, {
                        method: 'PUT',
                        body: JSON.stringify({ enabled })
                    });
                } catch (err) {
                    console.error("Failed to toggle feature flag", key, err);
                    // Revert
                    set((state) => ({
                        featureFlags: { ...state.featureFlags, [key]: !enabled }
                    }));
                }
            }

        }),
        {
            name: 'decision-memory-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { isAuthReady, ...rest } = state;
                return rest;
            },
        }
    )
);
