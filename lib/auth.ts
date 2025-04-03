// app/lib/auth.ts
'use server'

import type {DecodedToken, LoginRequest, LoginResponse, UserAuth} from "@/types/Auth";
import {jwtDecode} from "jwt-decode";
import type {ApiResponse} from "@/types/BaseRespond";
import {CookieStore} from "./cookie-store";

const API_BASE_URL = process.env.API_BASE_URL

export async function createAuthSession(tokens: LoginResponse, rememberMe: boolean): Promise<void> {
    // Set HTTP-only cookie for refresh token (long-lived if rememberMe is true)
    await CookieStore.set('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days or 1 week
        path: '/',
    })

    // Set HTTP-only cookie for access token
    await CookieStore.set('session_token', tokens.token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 30 * 2.5, // 1.5 hours (matches token expiry)
        path: '/',
    })

    // Set non-sensitive UI indicator
    await CookieStore.set('is_authenticated', 'true', {
        maxAge: 60 * 30,
        path: '/',
    })
}

export async function clearAuthSession(): Promise<void> {
    await CookieStore.delete('refresh_token')
    await CookieStore.delete('session_token')
    await CookieStore.delete('is_authenticated')
}

export async function getCurrentUser(): Promise<UserAuth | null> {
    const token = await CookieStore.get('session_token')

    try {

        if (!token) {
            // Attempt token refresh if we have a refresh token
            const refreshToken = await CookieStore.get('refresh_token')
            if (refreshToken) {
                const respond = await refreshAuthSession()
                if (respond) {
                    const decoded = jwtDecode<DecodedToken>(respond?.token)
                    const permissions = decoded.scope.split(' ').map(permission =>
                        permission.trim().toUpperCase()
                    )
                    return {
                        id: decoded.id,
                        name: decoded.name,
                        username: decoded.username,
                        avatar: decoded.avatar,
                        roleName: decoded.roleName,
                        permissions
                    }
                }
            }
            return null
        }

        // Decode token to get user info (actual verification happens on API)
        const decoded = jwtDecode<DecodedToken>(token)

        if (!decoded || !decoded.id) {
            await clearAuthSession()
            return null
        }

        // Convert scope string to permissions array
        const permissions = decoded.scope.split(' ').map(permission =>
            permission.trim().toUpperCase()
        )

        return {
            id: decoded.id,
            name: decoded.name,
            avatar: decoded.avatar,
            username: decoded.username,
            roleName: decoded.roleName,
            permissions
        }
    } catch (error) {
        console.error('Failed to get current user:', error)
        await clearAuthSession()
        return null
    }
}

export async function authenticate(
    credentials: LoginRequest
): Promise<{ error?: string; tokens?: LoginResponse }> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': `kh`, // Default language
            },
        })

        if (!response.ok) {
            const error = await response.json()
            return { error: error.message || 'Authentication failed' }
        }

        const apiResponse: ApiResponse<LoginResponse> = await response.json()

        // Set remember me cookie if requested
        if (credentials.rememberMe) {
            await CookieStore.set('remember_me', 'true', {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            })
        }

        return { tokens: apiResponse.data }
    } catch (error) {
        console.error('LoginForm error:', error)
        return { error: 'Network error. Please try again.' }
    }
}

// Add to your existing auth.ts

export async function refreshAuthSession(): Promise<LoginResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) return null

        return (await response.json() as ApiResponse<LoginResponse>).data
    } catch (error) {
        console.error('Token refresh failed:', error)
        return null
    }
}

// Helper function to check token expiration
export async function isTokenExpired(token: string): Promise<boolean> {
    try {
        const leeway = 120; // seconds
        const decoded = jwtDecode<DecodedToken>(token)
        return decoded?.exp ? decoded.exp + leeway < Date.now() / 1000 : true
    } catch {
        return true
    }
}