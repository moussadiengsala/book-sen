export interface Book {
    id: string
    title: string
    description: string
    author: string
    categoryId: string
    coverUrl: string
    createdAt: string
    updatedAt: string
}
  
export interface Category {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface User {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
    avatar?: string
}

export interface CreateUser {
    name: string
    email: string
    password: string
    avatar?: File | null | undefined
}

export interface LoginUser {
    email: string
    password: string
}

export interface UpdateUser {
    name: string
    current_password?: string
    new_password?: string
    role?: "ADMIN" | "USER"
    avatar?: File
}

export interface AuthenticationResponse {
    accessToken: string
}

export interface ApiResponse<T> {
    status: number
    data: T
    message: string
}