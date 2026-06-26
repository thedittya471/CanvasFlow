import { z } from 'zod'
import { getFormFieldOutput } from '../form-field/model'

export const createFormInput = z.object({
  title: z.string().min(1).max(150).describe("Title of the form"),
  description: z.string().optional().describe("Description of the form"),
  slug: z.string().min(1).max(150).describe("Unique slug for the form URL"),
  ownerId: z.string().describe("Owner user ID")
})

export type CreateFormInputType = z.infer<typeof createFormInput>

export const listFormsByUserIdInput = z.object({
  userId: z.string().describe("Owner user ID")
})

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>

export const getFormInput = z.object({
  id: z.string().uuid().describe("Form ID")
})
export type GetFormInputType = z.infer<typeof getFormInput>

export const getFormOutput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  slug: z.string(),
  isPublished: z.boolean(),
  isArchived: z.boolean(),
  isOpen: z.boolean(),
  createdAt: z.any(),
  updatedAt: z.any(),
  publishedAt: z.any().nullable().optional(),
})
export type GetFormOutputType = z.infer<typeof getFormOutput>

export const getFormByIdOutput = getFormOutput.extend({
  fields: z.array(getFormFieldOutput)
})
export type GetFormByIdOutputType = z.infer<typeof getFormByIdOutput>

export const publishFormOutput = z.object({
  id: z.string().uuid().describe("ID of the published form")
})
export type PublishFormOutputType = z.infer<typeof publishFormOutput>

export const deleteFormInput = z.object({
  id: z.string().uuid().describe("Form ID to delete"),
})
export type DeleteFormInputType = z.infer<typeof deleteFormInput>

export const deleteFormOutput = z.object({
  success: z.boolean().describe("Whether deletion was successful")
})
export type DeleteFormOutputType = z.infer<typeof deleteFormOutput>

export const getDashboardStatsInput = z.object({
  userId: z.string().describe("Owner user ID")
})
export type GetDashboardStatsInputType = z.infer<typeof getDashboardStatsInput>

export const getDashboardStatsOutput = z.object({
  totalSketches: z.number(),
  publishedSketches: z.number(),
  totalResponses: z.number(),
  responsesThisMonth: z.number(),
  recentForms: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    createdAt: z.any(),
    isPublished: z.boolean(),
    submissionsCount: z.number()
  })),
  trends: z.array(z.object({
    date: z.string(),
    count: z.number()
  }))
})
export type GetDashboardStatsOutputType = z.infer<typeof getDashboardStatsOutput>