// lib/api-client.ts

'use server'

import {createAuthSession, isTokenExpired, refreshAuthSession} from "./auth"
import {CookieStore} from "./cookie-store";
import {SettingLabel} from "@/types/settings";
import {getSetting} from "./setting-loader";

async function fetchWithAuth<T>(
    endpoint: string,
    {
        options = {},
        params = {},
        tags = []
    }: {
        options?: RequestInit
        params?: Record<string, string | number | boolean>
        tags?: string[]
    } = {}
): Promise<T> {
    const token = await CookieStore.get('session_token');
    const language = await getSetting<string>(SettingLabel.IMS_DEFAULT_LANGUAGE);

    // Build URL with query params
    const url = new URL(`${process.env.API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
    });

    // Configure headers
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': `${language}`,
        ...options.headers,
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };

    let response = await fetch(url.toString(), {
        ...options,
        credentials: 'include',
        headers,
        next: {tags}
    });

    // Token refresh logic
    if (response.status === 401) {
        const isTokenExpire = await isTokenExpired(token || '');
        if (isTokenExpire) {
            const refreshResponse = await refreshAuthSession();
            if (refreshResponse) {
                await createAuthSession(refreshResponse, false);
                response = await fetch(url.toString(), {
                    ...options,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${refreshResponse.token}`,
                    },
                    next: {tags}
                });
            }
        }
    }

    return await response.json() as Promise<T>;
}

// Simplified method signatures with object parameters
export async function getWithAuth<T>(
    endpoint: string,
    config?: {
        params?: Record<string, string | number | boolean>
        options?: RequestInit
        tags?: string[]
    }
): Promise<T> {

    const pageSize = await getSetting<number>(SettingLabel.IMS_DEFAULT_PAGE_SIZE);

    if (config && config.params) {
        const params = config.params;
        params.size = Number(pageSize);
    }

    return fetchWithAuth<T>(endpoint, {
        options: {method: 'GET', ...config?.options},
        params: config?.params,
        tags: config?.tags
    })
}

export async function postWithAuth<T, U>(
    endpoint: string,
    body: U,
    config?: {
        params?: Record<string, string | number | boolean>
        options?: RequestInit
        tags?: string[]
    }
): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
        options: {
            method: 'POST',
            body: JSON.stringify(body),
            ...config?.options
        },
        params: config?.params,
        tags: config?.tags
    })
}

export async function putWithAuth<T, U>(
    endpoint: string,
    body: U,
    config?: {
        params?: Record<string, string | number | boolean>
        options?: RequestInit
        tags?: string[]
    }
): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
        options: {
            method: 'PUT',
            body: JSON.stringify(body),
            ...config?.options
        },
        params: config?.params,
        tags: config?.tags
    })
}

export async function deleteWithAuth<T>(
    endpoint: string,
    config?: {
        params?: Record<string, string | number | boolean>
        options?: RequestInit
        tags?: string[]
    }
): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
        options: {method: 'DELETE', ...config?.options},
        params: config?.params,
        tags: config?.tags
    })
}