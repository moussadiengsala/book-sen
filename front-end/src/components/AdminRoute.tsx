"use client"

import type React from "react"

import { Navigate } from "react-router"
import { useAuth } from "../lib/auth-provider"
import { useToast } from "../hooks/use-toast"

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth()
  const { showToast } = useToast()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    showToast({
      title: "Access denied",
      description: "You don't have permission to access this page",
      variant: "destructive",
    })
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
