import z from "zod"

export const UrlValidator = {
    create: z.object({
        originalURL: z.url(),
        alias: z.string().min(3).max(15).optional(),
        expTime: z.string().optional()
    })
}

