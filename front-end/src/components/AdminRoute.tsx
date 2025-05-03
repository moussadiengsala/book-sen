import {JSX, useEffect, useState} from "react"
import { Navigate } from "react-router"
import { useAuth } from "../lib/auth-provider"

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth()
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      setDenied(true)
    }
  }, [isLoading, user])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (denied) {
    return <Navigate
        to={{
          pathname: "/books",
          search: `?error=admin_access_denied&message=${encodeURIComponent("You don't have admin privileges")}`
        }}
        replace
    />
  }

  return <>{children}</>
}
