"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../lib/auth-provider"
import {AxiosError} from "axios";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
          "Password must contain at least one uppercase, one lowercase, one number, and one special character"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type LoginToast = {
  type: "success" | "error"
  title: string
  message: string
} | null

export default function LoginPage() {
  const { login } = useAuth()
  const [loginToast, setLoginToast] = useState<LoginToast>(null);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await login(data)
      setLoginToast({
        type: "success",
        title: "Login successful",
        message: "You have been logged in"
      });

      // Redirect to the page they were trying to access or dashboard
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from)
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setLoginToast({
        type: "error",
        title: "Login failed",
        message: err.response?.data?.message || "Something went wrong"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full bg-white px-1 py-6 sm:p-2  rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 text-left">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 text-left">{form.formState.errors.password.message}</p>
              )}
            </div>

          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary underline">
                Register
              </Link>
            </p>
            {loginToast && (
                <div className={`w-full p-4 rounded-md ${
                    loginToast.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}>
                  <h4 className="font-medium">{loginToast.title}</h4>
                  <p className="text-sm">{loginToast.message}</p>
                </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
