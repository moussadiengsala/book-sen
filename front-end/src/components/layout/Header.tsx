"use client"

import { Link } from "react-router"
import { Button } from "../../components/ui/button"
import { useAuth } from "../../lib/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { BookOpen, User, LogOut, Settings } from "lucide-react"
import {environment} from "../../lib/environment";

export function Header() {
  const { user, logout } = useAuth()
  console.log(user)

  return (
    <header className="sticky p-2 top-0 z-10 w-full">
      <div className="flex w-full h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <Link to="/books" className="text-xl font-bold">
            Book Management
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="space-x-1">
                <span>Hi</span>
                <span className="font-bold">{user.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-8 w-8 rounded-full">
                    {user.avatar ?
                        <div className="h-full w-full rounded-full overflow-hidden">
                          <img src={`${environment.API_URL}user/avatar/${user.avatar}`} alt={user.avatar} />
                        </div> :
                      <User className="h-5 w-5" />
                    }
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">Role: {user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
