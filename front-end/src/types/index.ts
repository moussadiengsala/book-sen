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
    role: "admin" | "user"
  }
    