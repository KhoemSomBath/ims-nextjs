export interface LoginResponse {
    token: string;
    refreshToken: string;
}

export interface LoginRequest {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface UserAuth {
    id: number;
    name: string;
    username: string;
    avatar: string;
    roleName: string;
    permissions: string[];
}

export interface DecodedToken {
    sub: string; // Subject (e.g., "Admin User.ts")
    roleId: number; // Role ID
    scope: string; // Permissions (comma-separated string)
    iss: string; // Issuer (e.g., "EXPERT")
    name: string; // User.ts's name
    avatar: string;
    roleName: string; // Role name (e.g., "ROLE_ADMIN")
    id: number; // User.ts ID
    exp: number; // Expiration time (Unix timestamp)
    iat: number; // Issued at (Unix timestamp)
    jti: string; // JWT ID
    username: string; // Username
}