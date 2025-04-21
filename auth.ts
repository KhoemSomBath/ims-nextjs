// src/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import type { CredentialsConfig } from "next-auth/providers/credentials";
import { ApiResponse } from "@/types/BaseRespond";
import { type DecodedToken, LoginResponse } from "@/types/Auth";
import { jwtDecode } from "jwt-decode";

// Helper function to check if token is expired with 5-minute buffer
const isTokenExpired = (expiresAt: number) => Date.now() >= expiresAt - 5 * 60 * 1000;

const authConfig: NextAuthConfig = {
    providers: [
        {
            id: "credentials",
            name: "SpringBoot",
            type: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
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

                    // Decode both tokens to get expiration times
                    const accessTokenDecoded = jwtDecode<DecodedToken>(res.data.token);
                    const refreshTokenDecoded = jwtDecode<DecodedToken>(res.data.refreshToken);

                    return {
                        id: accessTokenDecoded.id.toString(),
                        name: accessTokenDecoded.name,
                        email: accessTokenDecoded.username,
                        role: accessTokenDecoded.roleName,
                        emailVerified: null,
                        accessToken: res.data.token,
                        refreshToken: res.data.refreshToken,
                        accessTokenExpires: accessTokenDecoded.exp * 1000, // Convert to milliseconds
                        refreshTokenExpires: refreshTokenDecoded.exp * 1000 // Convert to milliseconds
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        } satisfies CredentialsConfig,
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            // Initial sign in
            if (user) {
                return {
                    ...token,
                    user: {
                        id: user.id || '',
                        name: user.name || '',
                        email: user.email || '',
                        role: user.role,
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        accessTokenExpires: user.accessTokenExpires,
                        refreshTokenExpires: user.refreshTokenExpires
                    }
                };
            }

            // Return previous token if it's not expired yet
            if (!isTokenExpired(token.user.accessTokenExpires)) {
                return token;
            }

            // If refresh token is expired, force logout
            if (isTokenExpired(token.user.refreshTokenExpires)) {
                return { ...token, error: "RefreshTokenExpired" };
            }

            // Attempt to refresh the token
            try {
                const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh-token`, {
                    method: 'POST',
                    body: JSON.stringify({
                        refreshToken: token.user.refreshToken
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.user.refreshToken}`
                    }
                });

                if (!response.ok) throw new Error("Token refresh failed");

                const res = await response.json() as ApiResponse<LoginResponse>;
                if (!res?.data.token) throw new Error("Invalid refresh response");

                // Decode both tokens from refresh response
                const newAccessTokenDecoded = jwtDecode<DecodedToken>(res.data.token);
                const newRefreshTokenDecoded = res.data.refreshToken
                    ? jwtDecode<DecodedToken>(res.data.refreshToken)
                    : null;

                return {
                    ...token,
                    user: {
                        ...token.user,
                        accessToken: res.data.token,
                        refreshToken: res.data.refreshToken || token.user.refreshToken,
                        accessTokenExpires: newAccessTokenDecoded.exp * 1000,
                        refreshTokenExpires: newRefreshTokenDecoded
                            ? newRefreshTokenDecoded.exp * 1000
                            : token.user.refreshTokenExpires
                    }
                };
            } catch (error) {
                console.error("Refresh token error:", error);
                return { ...token, error: "RefreshAccessTokenError" };
            }
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
                accessTokenExpires: token.user.accessTokenExpires,
                refreshTokenExpires: token.user.refreshTokenExpires,
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