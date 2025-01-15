import {z} from 'zod'

export const nameValidation=z
    .string()
    .min(2,"name must be at least 2 characters long")
    .max(20,"name must be at most 20 characters long")
    .regex(/^[a-zA-Z\s]+$/,"name must contain only letters and spaces")

export const signUpSchema=z.object({
    name:nameValidation,
    email:z.string().email("invalid email"),
    password:z.string().min(8,"password must be at least 8 characters long")
})    