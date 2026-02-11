import { AUTH_STORAGE_KEY } from "@/features/auth/constants";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type RequestOptions = RequestInit & {
    headers?: any;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    // Get token
    let token = "";
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            const session = JSON.parse(stored);
            // My backend returns accessToken
            token = session?.accessToken || session?.token || "";
        }
    } catch (e) {
        console.warn("Failed to retrieve token", e);
    }

    const headers: any = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || "Network request failed");
    }

    if (response.status === 204) return {} as T;

    return response.json();
}

export const api = {
    request,

    get<T>(endpoint: string, headers?: any) {
        return request<T>(endpoint, { method: "GET", headers });
    },

    post<T>(endpoint: string, body: any, headers?: any) {
        return request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers,
        });
    },

    put<T>(endpoint: string, body: any, headers?: any) {
        return request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
            headers,
        });
    },

    patch<T>(endpoint: string, body: any, headers?: any) {
        return request<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers,
        });
    },

    delete<T>(endpoint: string, headers?: any) {
        return request<T>(endpoint, { method: "DELETE", headers });
    },
};
