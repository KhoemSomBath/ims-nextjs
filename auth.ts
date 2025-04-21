// src/auth.ts
import NextAuth, {NextAuthConfig} from "next-auth";
import type {CredentialsConfig} from "next-auth/providers/credentials";
import {ApiResponse} from "@/types/BaseRespond";
import {type DecodedToken, LoginResponse} from "@/types/Auth";
import {jwtDecode} from "jwt-decode";

// Create the auth configuration object separately
const authConfig: NextAuthConfig = {
    providers: [
        {
            id: "credentials",
            name: "SpringBoot",
            type: "credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                try {
                    const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept-Language': `kh`,
                        },
                    });

                    if (!response.ok) throw new Error("Authentication failed");

                    const res = await response.json() as ApiResponse<LoginResponse>;
                    if (!res?.data.token) throw new Error("Invalid response");

                    const decoded = jwtDecode<DecodedToken>(res.data.token);

                    return {
                        id: decoded.id.toString(),
                        name: decoded.name,
                        email: decoded.username,
                        role: decoded.roleName,
                        emailVerified: null,
                        accessToken: res.data.token, // Store the access token
                        refreshToken: res.data.refreshToken // Store refresh token if available
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        } satisfies CredentialsConfig,
    ],
    callbacks: {
        async jwt({token, user, account}) {
            // Initial sign in
            if (user) {
                token.user = {
                    id: user.id || '',
                    name: user.name || '',
                    email: user.email || '',
                    role: user.role,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                };
            }
            return token;
        },
        async session({session, token}) {
            // Send minimal required properties to the client
            session.user = {
                id: token.user?.id || '',
                name: token.user?.name,
                email: token.user?.email || '',
                role: token.user?.role,
                image: null,
                emailVerified: null,
                accessToken: token.user.accessToken,
                refreshToken: token.user.refreshToken,
            };
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // Disable for localhost
                // domain: 'localhost', // Explicit domain
                maxAge: 30 * 24 * 60 * 60,
            },
        },
    },
    pages: {
        signIn: "/signin",
        error: '/signin'
    },
    debug: process.env.NODE_ENV === 'development',
};

// Initialize NextAuth
export const {handlers, auth, signIn, signOut} = NextAuth({
        trustHost: true,
        secret: process.env.NEXTAUTH_SECRET,
        ...authConfig
    }
);

// Export the config separately if needed
export default authConfig;