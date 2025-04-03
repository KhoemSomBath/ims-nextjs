// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {refreshAuthSession, isTokenExpired, createAuthSession} from './lib/auth'
import {CookieStore} from "./lib/cookie-store";
import {getSetting} from "./lib/setting-loader";
import {SettingLabel} from "./types/settings";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip maintenance check for the maintenance page itself
    if (pathname.startsWith('/maintenance') || pathname.startsWith('/settings')) {
        return NextResponse.next()
    }

    // Check maintenance mode setting
    const isMaintenance = await getSetting<boolean>(SettingLabel.IMS_MAINTENANCE_MODE)
    if (isMaintenance) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
    }

    // 1. First check if this is the login page and user is already authenticated
    if (pathname === '/signin') {
        const sessionToken = await CookieStore.get('session_token')
        const refreshToken = await CookieStore.get('refresh_token')

        // If either token exists and is valid, redirect to home
        if (sessionToken && !await isTokenExpired(sessionToken)) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Try to refresh if session token is expired but refresh token exists
        if (refreshToken && (!sessionToken || await isTokenExpired(sessionToken))) {
            try {
                const newTokens = await refreshAuthSession()
                if (newTokens) {
                    await createAuthSession(newTokens, false)
                    return NextResponse.redirect(new URL('/', request.url))
                }
            } catch (error) {
                console.error('Token refresh failed:', error)
                // Continue to show login page if refresh fails
            }
        }

        // Otherwise allow access to login page
        return NextResponse.next()
    }

    // 2. Define public routes that don't require authentication
    const isPublicRoute = [
        '/_next',
        '/signin',
        '/favicon.ico',
        '/api/public'
    ].some(route =>
        pathname === route ||
        pathname.startsWith(`${route}/`) ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/public/')
    )

    if (isPublicRoute) {
        return NextResponse.next()
    }

    // 3. Auth check for ALL other routes
    const sessionToken = await CookieStore.get('session_token')
    const refreshToken = await CookieStore.get('refresh_token')

    // Try to refresh expired session
    if (refreshToken && (!sessionToken || await isTokenExpired(sessionToken))) {
        try {
            const newTokens = await refreshAuthSession()
            if (newTokens) {
                const response = NextResponse.next()
                await createAuthSession(newTokens, false)
                return response
            }
        } catch (error) {
            console.error('Token refresh failed:', error)
        }
    }

    // No tokens at all - redirect to login
    if (!refreshToken) {
        return redirectToLogin(request, pathname)
    }

    // Final check for valid session
    if (sessionToken && !await isTokenExpired(sessionToken)) {
        return NextResponse.next()
    }

    // Final fallback - redirect to login
    return redirectToLogin(request, pathname)
}

function redirectToLogin(request: NextRequest, originalPath: string) {
    const url = new URL('/signin', request.url)
    if(originalPath !== 'signin')
        url.searchParams.set('callbackUrl', originalPath)
    else
        url.searchParams.delete('callbackUrl');

    return NextResponse.redirect(url)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}