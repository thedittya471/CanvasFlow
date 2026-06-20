import { z } from 'zod'

export const createFormInput = z.object({
  title: z.string().min(1).max(150).describe("Title of the form"),
  description: z.string().optional().describe("Description of the form"),
  slug: z.string().min(1).max(150).describe("Unique slug for the form URL"),
  ownerId: z.string().uuid().describe("Owner user ID")
})

export type CreateFormInputType = z.infer<typeof createFormInput>

export const listFormsByUserIdInput = z.object({
  userId: z.string().uuid().describe("Owner user ID")
})

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>