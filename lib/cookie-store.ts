// lib/cookie-store.ts
import { cookies } from 'next/headers'

type CookieOptions = {
    httpOnly?: boolean
    secure?: boolean
    maxAge?: number
    path?: string
    sameSite?: 'lax' | 'strict' | 'none'
}

export class CookieStore {

    /**
     * Get specific cookie by name
     */
    static async get<T extends string = string>(
        name: string,
        delayMs = 0
    ): Promise<T | undefined> {
        const cookieStore = await cookies() // Await the cookies()
        const cookie = cookieStore.get(name)
        return this.delayedResponse(cookie?.value as T | undefined, delayMs)
    }

    /**
     * Set cookie with options
     */
    static async set(
        name: string,
        value: string,
        options: CookieOptions = {}
    ): Promise<void> {
        const cookieStore = await cookies() // Await the cookies()
        cookieStore.set(name, value, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            ...options
        })
    }

    /**
     * Delete cookie
     */
    static async delete(name: string): Promise<void> {
        const cookieStore = await cookies() // Await the cookies()
        cookieStore.delete(name)
    }

    private static async delayedResponse<T>(
        data: T,
        delayMs: number
    ): Promise<T> {
        return new Promise((resolve) =>
            delayMs > 0
                ? setTimeout(() => resolve(data), delayMs)
                : resolve(data)
        )
    }
}