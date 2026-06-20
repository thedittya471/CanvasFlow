import { z } from 'zod'

export const createFormInputModel = z.object({
    title: z.string().min(1, "Title must be at least 1 character").max(150, "Title must be at most 150 characters").describe("Title of the form"),
    description: z.string().optional().describe("Description of the form"),
    slug: z.string().min(1, "Slug must be at least 1 character").max(150, "Slug must be at most 150 characters").describe("Unique slug for the form")
})

export const createFormOutputModel = z.object({
    id: z.string().uuid().describe("ID of the created form")
})

export type CreateFormInputModelType = z.infer<typeof createFormInputModel>
export type CreateFormOutputModelType = z.infer<typeof createFormOutputModel>
