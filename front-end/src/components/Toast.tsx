"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useToast } from "../hooks/use-toast"

export function Toast() {
  const { toast, hideToast } = useToast()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`rounded-lg shadow-lg p-4 ${
          toast.variant === "destructive" ? "bg-red-600 text-white" : "bg-white dark:bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
          </div>
          <button
            onClick={hideToast}
            className="ml-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
