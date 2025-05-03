import { Link } from "react-router"
import { Button } from "../components/ui/button"
import { BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Book Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage your book collection with ease. Add, edit, and organize your books by categories.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white shadow-lg rounded-full dark:bg-gray-900">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Extensive Book Collection</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse through a vast collection of books from various categories.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white shadow-lg rounded-full dark:bg-gray-900">
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
                    className="h-6 w-6"
                  >
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M12 2v2" />
                    <path d="M12 22v-2" />
                    <path d="m17 20.66-1-1.73" />
                    <path d="M11 10.27 7 3.34" />
                    <path d="m20.66 17-1.73-1" />
                    <path d="m3.34 7 1.73 1" />
                    <path d="M22 12h-2" />
                    <path d="M2 12h2" />
                    <path d="m20.66 7-1.73 1" />
                    <path d="m3.34 17 1.73-1" />
                    <path d="m17 3.34-1 1.73" />
                    <path d="m7 20.66 1-1.73" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">User-Friendly Interface</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Intuitive design for easy navigation and management of your books.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white shadow-lg rounded-full dark:bg-gray-900">
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
                    className="h-6 w-6"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Different access levels for admins and regular users for secure management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="text-gray-500 dark:text-gray-400">© 2024 Book Management System. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
