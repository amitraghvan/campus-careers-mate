import { AUTH_STORAGE_KEY } from "@/features/auth/constants";

declare global {
    interface Window {
        Clerk?: {
            session?: {
                getToken: () => Promise<string>;
            };
        };
    }
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_PREFIX = "/api/v1";

type RequestOptions = RequestInit & {
    headers?: Record<string, string>;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE}${API_PREFIX}${endpoint}`;

    // Get Clerk JWT token — backend validates it via JWKS
    let token = "";
    try {
        if (typeof window !== "undefined" && window.Clerk?.session) {
            token = await window.Clerk.session.getToken() ?? "";
        }
    } catch (e) {
        console.warn("[api] Failed to retrieve Clerk token", e);
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    // Merge in any extra headers from options
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Cannot ${options.method || "GET"} ${endpoint}`);
    }

    if (response.status === 204) return {} as T;

    const json = await response.json();

    // Unwrap standard API envelope { success: true, data: T }
    if (json && json.success === true && json.data !== undefined) {
        return json.data as T;
    }

    return json as T;
}

export const api = {
    request,

    get<T>(endpoint: string, headers?: Record<string, string>) {
        return request<T>(endpoint, { method: "GET", headers });
    },

    post<T>(endpoint: string, body: unknown, headers?: Record<string, string>) {
        return request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers,
        });
    },

    put<T>(endpoint: string, body: unknown, headers?: Record<string, string>) {
        return request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
            headers,
        });
    },

    patch<T>(endpoint: string, body: unknown, headers?: Record<string, string>) {
        return request<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers,
        });
    },

    delete<T>(endpoint: string, headers?: Record<string, string>) {
        return request<T>(endpoint, { method: "DELETE", headers });
    },
};
