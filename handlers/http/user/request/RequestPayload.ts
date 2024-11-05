import {z} from "zod"

export const LoginRequestValidation = z.object({
    username: z.string().trim().regex(/^[a-zA-Z0-9]+$/),
    password: z.string().trim()
})

export type LoginRequest = z.infer<typeof LoginRequestValidation>