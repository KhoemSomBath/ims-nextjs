// components/AuthProvider.tsx
"use client";

import type {UserAuth} from "@/types/Auth";
import {createContext, type ReactNode, useCallback, useContext} from "react";
import {useRouter} from "next/navigation";
import {clearAuthSession} from "@/lib/auth";

type AuthContextType = {
    user: UserAuth | null;
    clearSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    clearSession: async () => {
    },
});

export function AuthProvider({
                                 user,
                                 children,
                             }: {
    user: UserAuth | null;
    children: ReactNode;
}) {

    const router = useRouter();

    const handleClearSession = useCallback(async () => {
        try {
            await clearAuthSession();
            router.replace('/signin');
        } catch (error) {
            console.error('Failed to clear session:', error);
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{user, clearSession: handleClearSession}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);