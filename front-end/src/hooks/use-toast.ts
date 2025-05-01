"use client"

import { useState } from "react"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastState = {
  toast: ToastProps | null
  showToast: (toast: ToastProps) => void
  hideToast: () => void
}

export const useToast = (): ToastState => {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (toastProps: ToastProps) => {
    setToast(toastProps)

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      hideToast()
    }, 3000)
  }

  const hideToast = () => {
    setToast(null)
  }

  return { toast, showToast, hideToast }
}
