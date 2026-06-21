import { z } from 'zod'

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

export const getSubmissionsOutput = z.object({
  submissions: z.array(formSubmissionOutput),
  viewsCount: z.number(),
  deviceViews: z.array(z.object({
    device: z.string(),
    count: z.number()
  }))
})
export type GetSubmissionsOutputType = z.infer<typeof getSubmissionsOutput>

export const recordViewInput = z.object({
  formId: z.string().uuid().describe("Form ID"),
  deviceType: z.string().describe("Device type (mobile, tablet, desktop)")
})
export type RecordViewInputType = z.infer<typeof recordViewInput>

export const recordViewOutput = z.object({
  success: z.boolean()
})
export type RecordViewOutputType = z.infer<typeof recordViewOutput>
