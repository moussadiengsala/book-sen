"use client"

import { useEffect, useState } from "react"
import {Link, useParams, useNavigate} from "react-router"
import { Button } from "../../components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { useAuth } from "../../lib/auth-provider"
import type { Book } from "../../types"
import {ArrowLeft, BookIcon, Calendar, Edit, Trash, X} from "lucide-react"
import {useBook, useDeleteBook} from "../../hooks/use-book";
import {AxiosError} from "axios";
import {environment} from "../../lib/environment";
import Alert from "../../components/Alert";

export default function BookDetailsPage() {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: fetchedBook, error: fetchError } = useBook(id);
  const { mutate: deleteBookMutation, error: errorDelete, isPending: isDeleting } = useDeleteBook();
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(fetchedBook)
    if (id) {
      if (fetchedBook) {
        setBook(fetchedBook)
      }
      setIsLoading(false)
    }
  }, [id, fetchedBook])


  useEffect(() => {
    if (fetchError || errorDelete) {
      const axiosError = (fetchError || errorDelete) as AxiosError<{ message?: string }>;
      const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Something went wrong while processing your request.";
      setError(message);
    }
  }, [fetchError, errorDelete]);

  const handleDelete = () => {
    if (id) {
      deleteBookMutation(id, {
        onSuccess: () => {
          navigate("/books");
        },
        onError: () => {
          setError("Failed to delete the book.");
        },
      });
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold">Book not found</h3>
        <p className="text-muted-foreground">The book you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error &&
          <div className="fixed bottom-4 right-4 z-50">
            <Alert message={error} type="error" icon={X} />
          </div>
      }
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg">
          <img src={`${environment.API_URL}books/cover/${book.cover}`} alt={book.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-4 text-left">
          <div>
            <h1 className="mt-2 text-3xl font-bold capitalize">{book.name}</h1>
            <p className="text-xl text-muted-foreground capitalize">by {book.author}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Added: {new Date(book.createdAt).toLocaleDateString()}</span>
            </div>
            {book.updatedAt !== book.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {new Date(book.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="mt-2 text-muted-foreground">{book.description}</p>
          </div>
          <div>
            <Button asChild>
              <Link to={`#`}>
                <BookIcon className="mr-2 h-4 w-4" />
                Lend This Book
              </Link>
            </Button>
          </div>

          {user && user.role == "ADMIN" && (
            <div className="flex gap-4 pt-6">
              <Button asChild>
                <Link to={`/books/${book.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the book from your collection.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <button className="px-4 py-2 rounded text-white">Cancel</button>
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} asChild>
                          <button className="px-4 py-2 rounded text-red-500">
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
