import z from "zod"

export const UserValidator = {
    create: z.object({
        displayName: z.string().min(3).max(30),
        userName: z.string().min(5).max(12),
        email: z.email(),
        password: z.string()
    }),
    login: z.object({
        userName: z.string().min(5).max(12).optional(),
        email: z.email().optional(),
        password: z.string()
    })
}