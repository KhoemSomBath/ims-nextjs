import type {Role} from "./Role";

export interface User {
  id: number
  createdAt: string | Date
  updatedAt: string | Date
  username: string
  password: string // Note: In practice, you might want to exclude this from frontend types
  version: number
  name: string
  avatar: string
  status: boolean
  role: Role
}