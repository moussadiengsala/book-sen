"use client"

import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router"
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
import { deleteBook, getBook, getCategoryName } from "../../lib/mock-data"
import type { Book } from "../../types"
import { ArrowLeft, Calendar, Edit, Trash } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const fetchedBook = getBook(id)
      if (fetchedBook) {
        setBook(fetchedBook)
      }
      setIsLoading(false)
    }
  }, [id])

  const handleDelete = () => {
    if (id) {
      const success = deleteBook(id)
      if (success) {
        showToast({
          title: "Book deleted",
          description: "The book has been successfully deleted",
        })
        navigate("/dashboard/books")
      } else {
        showToast({
          title: "Error",
          description: "Failed to delete the book",
          variant: "destructive",
        })
      }
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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg">
          <img src={book.coverUrl || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="inline-block rounded-md bg-primary/10 px-3 py-1 text-sm text-primary">
              {getCategoryName(book.categoryId)}
            </div>
            <h1 className="mt-2 text-3xl font-bold">{book.title}</h1>
            <p className="text-xl text-muted-foreground">by {book.author}</p>
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

          {user && (
            <div className="flex gap-4 pt-6">
              <Button asChild>
                <Link to={`/dashboard/books/${book.id}/edit`}>
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
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
