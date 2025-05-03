"use client"

import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../../components/ui/button"
import { Form } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import type { Book } from "../../types"
import {ArrowLeft, X} from "lucide-react"
import {useBook, useUpdateBook} from "../../hooks/use-book";
import {bookFormSchema, bookUpdateFormSchema} from "../../lib/schema";
import {environment} from "../../lib/environment";
import {Label} from "../../components/ui/label";
import {AxiosError} from "axios";
import Alert from "../../components/Alert";


type BookFormValues = z.infer<typeof bookFormSchema>

export default function EditBookPage() {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate()
  const { data: fetchedBook, error: fetchError } = useBook(id);
  const [book, setBook] = useState<Book | null>(null)
  const { mutate: updateBook, isPending, error: errorUpdating } = useUpdateBook();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookUpdateFormSchema),
    defaultValues: {
      name: "",
      author: "",
      description: "",
    },
  })

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

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, []);

  useEffect(() => {
    if (fetchError || errorUpdating) {
      const axiosError = (fetchError || errorUpdating) as AxiosError<{ message?: string }>;
      const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Something went wrong while processing your request.";
      setError(message);
    }
  }, [fetchError, errorUpdating]);


  useEffect(() => {
    if (id) {
      if (fetchedBook) {
        setBook(fetchedBook)
        form.reset({
          name: fetchedBook.name,
          author: fetchedBook.author,
          description: fetchedBook.description,
        })
        if (id) {
          setCoverPreview(`${environment.API_URL}books/cover/${fetchedBook.cover}`)
        }
      }
    }
  }, [id, form])


  const onSubmit = (id: string, data: BookFormValues) => {
    updateBook(
        { id, book: data },
        {
          onSuccess: () => {
            navigate(`/books/${id}`)
          }
        }
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold">Book not found</h3>
        <p className="text-muted-foreground">The book you're trying to edit doesn't exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error &&
          <div className="fixed bottom-4 right-4 z-50">
            <Alert message={error} type="error" icon={X} />
          </div>
      }
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/books/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Book
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
        <p className="text-muted-foreground">Update book information</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(id, data))} className="space-y-8">

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
            {isPending ? "Upating..." : "Update Book"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
