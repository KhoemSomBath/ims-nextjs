// components/AuthProvider.tsx
"use client";

import {createContext, type ReactNode, useContext} from "react";
import {useRouter} from "next/navigation";
import {Session} from "next-auth";
import {signOut} from "next-auth/react";

type AuthContextType = {
    session: Session | null;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    logout: async () => {
    },
});

export function AuthProvider({
                                 session,
                                 children,
                             }: {
    session: Session | null;
    children: ReactNode;
}) {

    const router = useRouter();

    const logOut = async () => {
        await signOut({
            redirect: false
        });
        router.push("signin");
    }

    return (
        <AuthContext.Provider value={{session, logout: logOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);