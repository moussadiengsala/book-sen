"use client"

import { useEffect, useState } from "react"
import {Link, useSearchParams} from "react-router"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useAuth } from "../../lib/auth-provider"
import type { Book } from "../../types"
import {BookOpen, Plus, Search, X} from "lucide-react"
import {useBooks} from "../../hooks/use-book";
import Alert from "../../components/Alert";
import {AxiosError} from "axios";
import {environment} from "../../lib/environment";

export default function BooksPage() {
  const { user } = useAuth();
  const { data: books, error: fetchError } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(searchParams.get("error"));

  useEffect(() => {
    if (fetchError) {
      const err = fetchError as AxiosError<{ message?: string }>;
      setError(err.response?.data?.message || "Failed to fetch books");
    }
  }, [fetchError]);

  useEffect(() => {
    if (!books) return;

    const filtered = books.filter((book: Book) => {
      const lowerTerm = searchTerm.trim().toLowerCase();
      return (
          book.name.toLowerCase().includes(lowerTerm) ||
          book.author.toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  return (
    <div className="space-y-6">
      {error &&
          <div className="fixed bottom-4 right-4 z-50">
            <Alert message={error} type="error" icon={X} />
          </div>
      }
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Browse and manage your book collection</p>
        </div>
        {user && user.role == "ADMIN" && (
          <Button asChild>
            <Link to="/books/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[3/4] w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={`${environment.API_URL}books/cover/${book.cover}`}
                    alt={book.name}
                    className="h-full w-full object-cover"
                  />

                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1">{book.name}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No books found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
