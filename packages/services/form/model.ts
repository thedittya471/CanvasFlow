import { z } from 'zod'
import { getFormFieldOutput } from '../form-field/model'

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

export const submitFormValueInput = z.object({
  formFieldId: z.string().uuid(),
  value: z.any()
})

export const submitFormInput = z.object({
  formId: z.string().uuid().describe("ID of the form to submit"),
  values: z.array(submitFormValueInput).describe("Field values submitted")
})
export type SubmitFormInputType = z.infer<typeof submitFormInput>

export const submitFormOutput = z.object({
  id: z.string().uuid().describe("ID of the created submission")
})
export type SubmitFormOutputType = z.infer<typeof submitFormOutput>

export const formSubmissionValueOutput = z.object({
  formFieldId: z.string().uuid(),
  value: z.any()
})

export const formSubmissionOutput = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  values: z.array(formSubmissionValueOutput),
  createdAt: z.any()
})
export type FormSubmissionOutputType = z.infer<typeof formSubmissionOutput>

export const getSubmissionsInput = z.object({
  formId: z.string().uuid().describe("Form ID"),
  ownerId: z.string().uuid().describe("Owner user ID")
})
export type GetSubmissionsInputType = z.infer<typeof getSubmissionsInput>

export const getSubmissionsOutput = z.array(formSubmissionOutput)
export type GetSubmissionsOutputType = z.infer<typeof getSubmissionsOutput>