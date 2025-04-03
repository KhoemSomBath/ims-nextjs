export interface Role {
    id: number
    createdAt: Date
    updatedAt: Date
    name: string
    version: number
    permissions: Permission[]
}

export interface Permission {
    id: number,
    name: string,
    module: string,
}