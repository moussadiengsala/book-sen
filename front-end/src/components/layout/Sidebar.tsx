"use client"

import { Link, useLocation } from "react-router"
import { cn } from "../../lib/utils"
import { BookOpen, User } from "lucide-react"

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  const routes = [
    {
      label: "Books",
      icon: BookOpen,
      href: "/books",
      active: pathname.includes("/books"),
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile",
    },
  ]
  return (
    <div className="hidden border-r bg-gray-50/40 md:block dark:bg-gray-800/40 w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1 px-2 py-4">
          {routes.map((route, i) => (
            <Link
              key={i}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                route.active
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
