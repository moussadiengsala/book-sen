import { z } from "zod"
import { environment } from "../lib/environment"

const nameField = (fieldName: string) =>
    z.string()
        .min(2, `${fieldName} must be between 2 and 20 characters`)
        .max(20, `${fieldName} must be between 2 and 20 characters`)
        .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)

const passwordField = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, and one special character"
    )

const emailField = z.string().email("Please enter a valid email")

const fileUploadFieldOptional = z
    .any()
    .optional()
    .refine(
        (files) => !files || (files instanceof FileList && files.length <= 1),
        "Please upload only one file"
    )
    .refine(
        (files) => {
            if (!files || !(files instanceof FileList) || files.length === 0) return true
            const file = files.item(0)
            return !!file && file.size <= environment.MAX_FILE_SIZE
        },
        `Max file size is 2MB`
    )
    .refine(
        (files) => {
            if (!files || !(files instanceof FileList) || files.length === 0) return true
            const file = files.item(0)
            return !!file && environment.ACCEPTED_IMAGE_TYPES.includes(file.type)
        },
        "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .transform((files) => (files && files.length > 0 ? files.item(0) ?? undefined : undefined))

const fileUploadFieldRequired = z
    .any()
    .refine(
        (files) => !files || (files instanceof FileList && files.length <= 1),
        "Please upload only one file"
    )
    .refine(
        (files) => {
            if (!files || !(files instanceof FileList) || files.length === 0) return true
            const file = files.item(0)
            return !!file && file.size <= environment.MAX_FILE_SIZE
        },
        `Max file size is 2MB`
    )
    .refine(
        (files) => {
            if (!files || !(files instanceof FileList) || files.length === 0) return true
            const file = files.item(0)
            return !!file && environment.ACCEPTED_IMAGE_TYPES.includes(file.type)
        },
        "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .transform((files) => (files && files.length > 0 ? files.item(0) ?? undefined : undefined))

export const registerSchema = z
    .object({
        name: nameField("Name"),
        email: emailField,
        password: passwordField,
        confirmPassword: z.string(),
        avatar: fileUploadFieldOptional,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    })

export const updateUserSchema = z
    .object({
        name: z
            .string()
            .optional()
            .refine(
                (val) => !val || (val.length >= 2 && val.length <= 20 && /^[A-Za-zÀ-ÿ\s'-]+$/.test(val)),
                { message: "Name must be 2–20 characters and contain only letters, spaces, hyphens, and apostrophes" }
            ),

        currentPassword: z
            .string()
            .optional()
            .refine(
                (val) =>
                    !val ||
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(val),
                { message: "Current password must meet complexity requirements" }
            ),

        newPassword: z
            .string()
            .optional()
            .refine(
                (val) =>
                    !val ||
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(val),
                { message: "New password must meet complexity requirements" }
            ),

        confirmPassword: z.string().optional(),

        avatar: fileUploadFieldOptional, // This assumes it already handles optional logic.
    })
    .refine(
        (data) =>
            !data.newPassword || data.newPassword === data.confirmPassword,
        {
            message: "Passwords must match",
            path: ["confirmPassword"],
        }
    );


export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
})

export const bookFormSchema = z.object({
    name: nameField("Name"),
    author: nameField("Author"),
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(255, "Description cannot exceed 255 characters"),
    cover: fileUploadFieldRequired,
})

export const bookUpdateFormSchema = z.object({
    name: nameField("Name"),
    author: nameField("Author"),
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(255, "Description cannot exceed 255 characters"),
    cover: fileUploadFieldOptional,
})
