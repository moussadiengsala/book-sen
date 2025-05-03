"use client"

import {useEffect, useState} from "react"
import {X} from "lucide-react"

interface AlertProps {
  message: string
  duration?: number
  type: "success" | "error" | "warning" | "info"
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>> | React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>>
}

export default function Alert({ message, duration = 5000, type, icon: Icon }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  const dismissAlert = () => setIsVisible(false)

  useEffect(() => {
    if (!duration) return

    const timer = setTimeout(() => setIsVisible(false), duration)
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - 100 / (duration / 100)))
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration])

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-500/30",
          text: "text-green-800 dark:text-green-400",
          progressBg: "bg-green-500/50",
          iconBg: "bg-green-100 dark:bg-green-500/20",
        }
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-500/30",
          text: "text-red-800 dark:text-red-400",
          progressBg: "bg-red-500/50",
          iconBg: "bg-red-100 dark:bg-red-500/20",
        }
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-500/30",
          text: "text-yellow-800 dark:text-yellow-400",
          progressBg: "bg-yellow-500/50",
          iconBg: "bg-yellow-100 dark:bg-yellow-500/20",
        }
      default: // info
        return {
          bg: "bg-sky-50 dark:bg-sky-900/20",
          border: "border-sky-200 dark:border-sky-500/30",
          text: "text-sky-800 dark:text-sky-400",
          progressBg: "bg-sky-500/50",
          iconBg: "bg-sky-100 dark:bg-sky-500/20",
        }
    }
  }

  const styles = getTypeStyles()

  if (!isVisible) return null

  return (
      <div className={`relative overflow-hidden rounded-lg ${styles.bg} ${styles.border} border backdrop-blur-lg shadow-lg max-w-md`}>
        <div className="p-4 flex items-start gap-3">
          <div className={`p-2 rounded-full ${styles.iconBg} ${styles.text}`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          </div>

          <button
              type="button"
              onClick={dismissAlert}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
          <div
              className={`h-full ${styles.progressBg}`}
              style={{ width: `${progress}%` }}
          />
        </div>
      </div>
  )
}