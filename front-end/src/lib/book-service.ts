import apiClient from '../lib/api-client';
import type { ApiResponse, Book, CreateBook } from '../types';


// Get all books
export const getBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books');
    return response.data.data;
};

// Get a single book by ID
export const getBookById = async (id: string): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
};

// Create a new book
export const createBook = async (book: CreateBook): Promise<ApiResponse<Book>> => {
    const formData = new FormData();
    formData.append('name', book.name);
    formData.append('author', book.author);
    formData.append('description', book.description);
    if (book.cover) formData.append('cover', book.cover, book.cover.name);

    const response = await apiClient.post<ApiResponse<Book>>('/books', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log("dhhhhd", response.data)

    return response.data;
};

// Update a book
export const updateBook = async (id: string, book: Partial<CreateBook>): Promise<Book> => {
    const formData = new FormData();

    if (book.name) formData.append('name', book.name);
    if (book.author) formData.append('author', book.author);
    if (book.description) formData.append('description', book.description);
    if (book.cover) formData.append('cover', book.cover);


    const response = await apiClient.put<ApiResponse<Book>>(`/books/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

// Delete a book
export const deleteBook = async (id: string): Promise<Book> => {
    const response = await apiClient.delete<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
};
