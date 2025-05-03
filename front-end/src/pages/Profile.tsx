"use client"

import {useEffect, useState} from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Form } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { useAuth } from "../lib/auth-provider"
import {Label} from "../components/ui/label";
import {updateUserSchema} from "../lib/schema";
import {environment} from "../lib/environment";
import {AxiosError} from "axios";
import Alert from "../components/Alert";
import {X} from "lucide-react";
import {UpdateUser} from "../types";


type ProfileFormValues = z.infer<typeof updateUserSchema>

type ProcessInformation = {
  isError: boolean;
  message: string
}

export default function ProfilePage() {
  const {updateProfile} = useAuth()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [log, setLog] = useState<ProcessInformation | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateUserSchema),
  })

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

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      const userData: UpdateUser = {
        name: data.name,
        current_password: data.currentPassword,
        new_password: data.newPassword,
        avatar: data.avatar
      };

      await updateProfile(userData);
      setLog({message: "Information has been updated successfully", isError: false})
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Something went wrong while processing your request.";
      setLog({message, isError: true})
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {log &&
          <div className="fixed bottom-4 right-4 z-50">
            <Alert message={log.message} type={log.isError ? "error" : "success"} icon={X} />
          </div>
      }
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-8">

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" {...form.register("name")} />
                {form.formState.errors.name && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter your password" {...form.register("currentPassword")} />
                {form.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter your password" {...form.register("newPassword")} />
                {form.formState.errors.newPassword && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.newPassword.message}</p>
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Informations"}
              </Button>
            </form>
          </Form>
        </Card>


      </div>
    </div>
  )
}
