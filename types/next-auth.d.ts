import "next-auth";
import "next-auth/jwt";
import "next-auth/adapters";

declare module "next-auth" {
    interface User {
        id: string;
        name: string | null;
        email: string | null;
        role: string;
        accessToken: string;
        refreshToken: string;
        emailVerified: Date | null;
        image: string | null;
    }

    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string | null;
            role: string;
            accessToken: string;
            image: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            name: string | null;
            email: string | null;
            role: string;
            accessToken: string;
            refreshToken: string;
        };
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends User {
        emailVerified: Date | null;
    }
}