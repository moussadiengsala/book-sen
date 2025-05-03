"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import {undefined, z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../../components/ui/button"
import { Form, } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import {ArrowLeft, X} from "lucide-react"
import {bookFormSchema} from "../../lib/schema";
import {useCreateBook} from "../../hooks/use-book";
import { environment } from "../../lib/environment"
import { Label } from "../../components/ui/label"
import Alert from "../../components/Alert";
import {AxiosError} from "axios";

type BookFormValues = z.infer<typeof bookFormSchema>

export default function NewBookPage() {
    const { mutate: createBook, isSuccess, error: createError, isPending } = useCreateBook();
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null)

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookFormSchema),
        defaultValues: {
          name: "",
          author: "",
          description: "",
          cover: undefined,
        },
    })

    // Handle avatar preview
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Check file type
            if (!environment.ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                form.setError("cover", {
                    type: "manual",
                    message: "Only .jpg, .jpeg, .png and .webp formats are supported"
                });
                setCoverPreview(null);
                return;
            }

            // Check file size
            if (file.size > environment.MAX_FILE_SIZE) {
                form.setError("cover", {
                    type: "manual",
                    message: "Max file size is 2MB"
                });
                setCoverPreview(null);
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    setCoverPreview(result);
                }
            };
            reader.readAsDataURL(file);

            // Clear any previous errors
            form.clearErrors("cover");
        } else {
            setCoverPreview(null);
        }
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (coverPreview && coverPreview.startsWith('blob:')) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, []);

    useEffect(() => {
        if (createError) {
            const err = createError as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Failed to fetch books");
        }
    }, [createError]);

    const onSubmit = (data: BookFormValues) => {
        createBook(
            {
                ...data,
                cover: data.cover ?? null,
            }
        );
    };


    return (
      <div className="space-y-6">
          {error &&
              <div className="fixed bottom-4 right-4 z-50">
                  <Alert message={error} type="error" icon={X} />
              </div>
          }
          {isSuccess &&
              <div className="fixed bottom-4 right-4 z-50">
                  <Alert message="Book is created successfuly" type="success" icon={X} />
              </div>
          }
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/books">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Books
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
            <p className="text-muted-foreground">Create a new book in your collection</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" {...form.register("name")} />
                {form.formState.errors.name && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">author</Label>
                <Input id="author" placeholder="Enter your author" {...form.register("author")} />
                {form.formState.errors.author && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.author.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">description</Label>
                <Textarea id="description" placeholder="Enter your description" {...form.register("description")} />
                {form.formState.errors.description && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                <Input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    {...form.register("cover", {
                      onChange: handleCoverChange
                    })}
                />
                {form.formState.errors.cover && (
                    <p className="text-sm text-red-500 text-left">{form.formState.errors.cover.message?.toString()}</p>
                )}

                {/* Preview */}
                {coverPreview && (
                    <div className="mt-2 flex justify-center">
                      <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-gray-200">
                        <img
                            src={coverPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                )}
              </div>

              <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Book"}
              </Button>
            </form>
          </Form>
        </div>
    )
}
