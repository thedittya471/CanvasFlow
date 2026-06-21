import { db, eq, and, desc } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { formFieldsTable } from "@repo/database/models/form-field"
import { formSubmissionsTable } from "@repo/database/models/form-submission"
import { createFormInput, type CreateFormInputType, listFormsByUserIdInput, type ListFormsByUserIdInputType, getFormInput, type GetFormInputType, submitFormInput, type SubmitFormInputType, getSubmissionsInput, type GetSubmissionsInputType } from "./model"

class FormService {
  private async getFormBySlug(slug: string) {
    const result = await db.select().from(formsTable).where(eq(formsTable.slug, slug))
    if (!result || result.length === 0) return null
    return result[0]
  }

  public async getForm(payload: GetFormInputType) {
    const { id } = await getFormInput.parseAsync(payload)

    const result = await db.select().from(formsTable).where(eq(formsTable.id, id))
    const form = result[0]
    if (!form) {
      throw new Error("Form not found")
    }
    return form
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

  public async getFormById(payload: GetFormInputType) {
    const { id } = await getFormInput.parseAsync(payload)

    const rows = await db
      .select({
        form: formsTable,
        field: formFieldsTable,
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
      .where(eq(formsTable.id, id))
      .orderBy(formFieldsTable.index)

    const firstRow = rows[0]
    if (!firstRow) {
      throw new Error("Form not found")
    }

    const form = firstRow.form
    const fields = rows
      .map((r) => r.field)
      .filter((f): f is NonNullable<typeof f> => !!(f && f.id))

    return {
      ...form,
      fields,
    }
  }

  public async publishForm(payload: GetFormInputType & { ownerId: string }) {
    const { id } = await getFormInput.parseAsync(payload)

    const result = await db.update(formsTable)
      .set({
        isPublished: true,
        publishedAt: new Date()
      })
      .where(and(eq(formsTable.id, id), eq(formsTable.ownerId, payload.ownerId)))
      .returning({
        id: formsTable.id
      })

    const firstResult = result[0]
    if (!firstResult) {
      throw new Error("Form not found or unauthorized")
    }

    return {
      id: firstResult.id
    }
  }

  public async submitForm(payload: SubmitFormInputType) {
    const { formId, values } = await submitFormInput.parseAsync(payload)

    const formResult = await db.select().from(formsTable).where(eq(formsTable.id, formId))
    const form = formResult[0]
    if (!form) {
      throw new Error("Form not found")
    }
    if (!form.isPublished) {
      throw new Error("Form is not published yet")
    }
    if (!form.isOpen) {
      throw new Error("Form is closed for submissions")
    }

    const insertResult = await db.insert(formSubmissionsTable).values({
      formId,
      values
    }).returning({
      id: formSubmissionsTable.id
    })

    const firstResult = insertResult[0]
    if (!firstResult) {
      throw new Error("Failed to submit form")
    }

    return {
      id: firstResult.id
    }
  }

  public async getSubmissions(payload: GetSubmissionsInputType) {
    const { formId, ownerId } = await getSubmissionsInput.parseAsync(payload)

    const formResult = await db.select().from(formsTable).where(and(eq(formsTable.id, formId), eq(formsTable.ownerId, ownerId)))
    if (!formResult[0]) {
      throw new Error("Form not found or unauthorized")
    }

    const submissions = await db.select()
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .orderBy(desc(formSubmissionsTable.createdAt))

    return submissions
  }
}

export default FormService
