export interface Book {
    id: string
    name: string
    description: string
    author: string
    cover: string
    createdAt: string
    updatedAt: string
}

export type CreateBook = {
    name: string;
    description: string;
    author: string;
    cover: File | null | undefined;
};
  
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
    name?: string
    current_password?: string
    new_password?: string
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