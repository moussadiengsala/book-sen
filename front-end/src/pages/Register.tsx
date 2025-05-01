"use client"

import { useState, useEffect} from "react"
import { Link } from "react-router"
import {z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../lib/auth-provider"
import {environment} from "../lib/environment";
import {AxiosError} from "axios";


const registerSchema = z.object({
  name: z.string()
      .min(2, "Name must be between 2 and 20 characters")
      .max(20, "Name must be between 2 and 20 characters")
      .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
          "Password must contain at least one uppercase, one lowercase, one number, and one special character"),
  confirmPassword: z.string(),
  avatar: z
      .any()
      .optional()
      .refine((files) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return true;
        return files.length === 1;
      }, "Please upload only one file")
      .refine((files) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return true;
        const file = files.item(0);
        return !!file && file.size <= environment.MAX_FILE_SIZE;
      }, `Max file size is 2MB`)
      .refine((files) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return true;
        const file = files.item(0);
        return !!file && environment.ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, "Only .jpg, .jpeg, .png and .webp formats are supported")
      .transform((files) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return undefined;
        return files.item(0) ?? undefined;
      })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>

type RegisterToast = {
  type: "success" | "error"
  title: string
  message: string
} | null

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registerToast, setRegisterToast] = useState<RegisterToast>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined
    },
  });

  // Handle avatar preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Check file type
      if (!environment.ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError("avatar", {
          type: "manual",
          message: "Only .jpg, .jpeg, .png and .webp formats are supported"
        });
        setAvatarPreview(null);
        return;
      }

      // Check file size
      if (file.size > environment.MAX_FILE_SIZE) {
        form.setError("avatar", {
          type: "manual",
          message: "Max file size is 2MB"
        });
        setAvatarPreview(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setAvatarPreview(result);
        }
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      form.clearErrors("avatar");
    } else {
      setAvatarPreview(null);
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: data.avatar
      };

      await registerUser(userData);
      setRegisterToast({
        type: "success",
        title: "Registration successful",
        message: "You have been registered and logged in"
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setRegisterToast({
        type: "error",
        title: "Registration failed",
        message: err.response?.data?.message || "Something went wrong"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full bg-white px-1 py-6 sm:p-2  rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>Create a new account to get started</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" {...form.register("name")} />
                {form.formState.errors.name && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.name.message}</p>
                )}
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                <Input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    {...form.register("avatar", {
                      onChange: handleAvatarChange
                    })}
                />
                {form.formState.errors.avatar && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.avatar.message?.toString()}</p>
                )}

                {/* Avatar Preview */}
                {avatarPreview && (
                    <div className="mt-2 flex justify-center">
                      <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-gray-200">
                        <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-primary underline">
                  Login
                </Link>
              </p>
              {/* Display toast message if it exists */}
              {registerToast && (
                  <div className={`w-full p-4 rounded-md ${
                      registerToast.type === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  }`}>
                    <h4 className="font-medium">{registerToast.title}</h4>
                    <p className="text-sm">{registerToast.message}</p>
                  </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
  );
}

