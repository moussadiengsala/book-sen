import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from '../lib/book-service';
import type { Book, CreateBook } from '../types';

// Hook for fetching all books
export function useBooks() {
    return useQuery({
        queryKey: ['books'],
        queryFn: getBooks,
    });
}

// Hook for fetching a single book
export function useBook(id: string) {
    return useQuery({
        queryKey: ['books', id],
        queryFn: () => getBookById(id),
        // enabled: !!id,
    });
}

// Hook for creating a book
export function useCreateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (book: CreateBook) => createBook(book),
        onSuccess: () => {
            // Invalidate and refetch books list
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
}

// Hook for updating a book
export function useUpdateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, book }: { id: string; book: Partial<CreateBook> }) =>
            updateBook(id, book),
        onSuccess: (updatedBook) => {
            // Invalidate and refetch the specific book and books list
            queryClient.invalidateQueries({ queryKey: ['books', updatedBook.id] });
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
}

// Hook for deleting a book
export function useDeleteBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteBook(id),
        // Optimistic update
        onMutate: async (id) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['books'] });
            const previousBooks = queryClient.getQueryData<Book[]>(['books']);
            if (previousBooks) {
                queryClient.setQueryData(['books'], previousBooks.filter(book => book.id !== id));
            }
            return { previousBooks };
        },
        onError: (_err, _id, context) => {
            if (context?.previousBooks) {
                queryClient.setQueryData(['books'], context.previousBooks);
            }
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
}