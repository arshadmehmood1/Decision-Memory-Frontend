export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

let authToken: string | null = null;
let activeWorkspaceId: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

export const setActiveWorkspaceId = (id: string | null) => {
    activeWorkspaceId = id;
};

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Authorization header logic:
    // 1. If we have a Clerk token, use it (Bearer)
    // 2. If no token, we might be in dev mode without auth, or anonymous
    // 3. We keep the mock headers logic ONLY if no token is present, for transition safety
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        ...(activeWorkspaceId ? { 'x-workspace-id': activeWorkspaceId } : {}),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = 'Neural link failure';
        try {
            const error = await response.json();
            errorMessage = error.message || error.error?.message || errorMessage;
        } catch (e) {
            // Fallback to status text
            errorMessage = `System Error: ${response.statusText || response.status}`;
        }

        console.error(`[API ERROR] ${endpoint}:`, errorMessage);
        throw new Error(errorMessage);
    }

    return response.json();
}
