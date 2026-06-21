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

export const listFormsByUserIdInputModel = z.undefined()

export const listFormsByUserIdOutputModel = z.array(
    z.object({
        id: z.string().uuid().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        slug: z.string().describe("Unique slug for the form"),
        isPublished: z.boolean().describe("Whether form is published"),
        isArchived: z.boolean().describe("Whether form is archived"),
        isOpen: z.boolean().describe("Whether form is open for submissions"),
        createdAt: z.any().describe("Creation timestamp"),
        updatedAt: z.any().describe("Last updated timestamp"),
        publishedAt: z.any().nullable().optional().describe("Published timestamp"),
    })
)

export type ListFormsByUserIdInputModelType = z.infer<typeof listFormsByUserIdInputModel>
export type ListFormsByUserIdOutputModelType = z.infer<typeof listFormsByUserIdOutputModel>

export {
    createFormFieldInput as createFormFieldInputModel,
    createFormFieldOutput as createFormFieldOutputModel,
    updateFormFieldInput as updateFormFieldInputModel,
    updateFormFieldOutput as updateFormFieldOutputModel,
    deleteFormFieldInput as deleteFormFieldInputModel,
    deleteFormFieldOutput as deleteFormFieldOutputModel,
    getFormFieldInput as getFormFieldInputModel,
    getFormFieldOutput as getFormFieldOutputModel
} from "@repo/services/form-field/model"
