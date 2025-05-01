"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { useAuth } from "../lib/auth-provider"
import { getBooks, getCategories } from "../lib/mock-data"
import type { Book, Category } from "../types"
import { BookOpen, Layers, Clock, User } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recentBooks, setRecentBooks] = useState<Book[]>([])

  useEffect(() => {
    setBooks(getBooks())
    setCategories(getCategories())

    // Get 5 most recent books
    const sortedBooks = [...getBooks()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setRecentBooks(sortedBooks.slice(0, 5))
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground">Books in your collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Available book categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Role</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.role}</div>
            <p className="text-xs text-muted-foreground">Your access level</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Books</CardTitle>
            <CardDescription>The 5 most recently added books</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBooks.map((book) => (
                <div key={book.id} className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(book.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link to="/dashboard/books" className="rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <div className="font-semibold">View All Books</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Browse through all books in your collection</div>
            </Link>

            <Link to="/dashboard/books/new" className="rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <div className="font-semibold">Add New Book</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Add a new book to your collection</div>
            </Link>

            {user.role === "admin" && (
              <Link
                to="/dashboard/categories"
                className="rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <div className="font-semibold">Manage Categories</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Create, edit, or delete book categories</div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
