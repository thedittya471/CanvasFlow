import { db, eq } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { createFormInput, type CreateFormInputType, listFormsByUserIdInput, type ListFormsByUserIdInputType } from "./model"

class FormService {
  private async getFormBySlug(slug: string) {
    const result = await db.select().from(formsTable).where(eq(formsTable.slug, slug))
    if (!result || result.length === 0) return null
    return result[0]
  }

  public async createForm(payload: CreateFormInputType) {
    const { title, description, slug, ownerId } = await createFormInput.parseAsync(payload)

    const existingForm = await this.getFormBySlug(slug)
    if (existingForm) {
      throw new Error(`Form with slug ${slug} already exists`)
    }

    const insertResult = await db.insert(formsTable).values({
      title,
      description,
      slug,
      ownerId
    }).returning({
      id: formsTable.id
    })

    if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
      throw new Error(`Failed to create form`)
    }

    return {
      id: insertResult[0].id
    }
  }

  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload)

    const forms = await db.select({
      id: formsTable.id,
      title: formsTable.title,
      description: formsTable.description,
      slug: formsTable.slug,
      isPublished: formsTable.isPublished,
      isArchived: formsTable.isArchived,
      isOpen: formsTable.isOpen,
      createdAt: formsTable.createdAt,
      updatedAt: formsTable.updatedAt,
      publishedAt: formsTable.publishedAt,
    }).from(formsTable).where(eq(formsTable.ownerId, userId))

    return forms
  }
}

export default FormService
