import { db, eq, and, desc, inArray, gte } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { formSubmissionsTable } from "@repo/database/models/form-submission"
import { formViewsTable } from "@repo/database/models/form-view"
import { usersTable } from "@repo/database/models/user"
import {
  submitFormInput,
  type SubmitFormInputType,
  getSubmissionsInput,
  type GetSubmissionsInputType,
  recordViewInput,
  type RecordViewInputType
} from "./model"

class FormSubmissionService {
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

    const userResult = await db.select({ plan: usersTable.plan }).from(usersTable).where(eq(usersTable.id, form.ownerId))
    const userPlan = userResult[0]?.plan || "Free"

    let submissionLimit = 100
    if (userPlan === "Pro") submissionLimit = 1000
    else if (userPlan === "Pro+") submissionLimit = 5000
    else if (userPlan === "Business") submissionLimit = 25000

    const ownerForms = await db.select({ id: formsTable.id }).from(formsTable).where(eq(formsTable.ownerId, form.ownerId))
    const formIds = ownerForms.map(f => f.id)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    if (formIds.length > 0) {
      const monthSubmissions = await db
        .select()
        .from(formSubmissionsTable)
        .where(
          and(
            inArray(formSubmissionsTable.formId, formIds),
            gte(formSubmissionsTable.createdAt, startOfMonth)
          )
        )
      if (monthSubmissions.length >= submissionLimit) {
        throw new Error(`This workspace has reached the limit of ${submissionLimit} submissions per month for the ${userPlan} tier.`)
      }
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

    const viewsResult = await db.select()
      .from(formViewsTable)
      .where(eq(formViewsTable.formId, formId))

    const viewsCount = viewsResult.length

    const deviceMap = { desktop: 0, mobile: 0, tablet: 0 }
    viewsResult.forEach(v => {
      const dev = v.deviceType.toLowerCase()
      if (dev.includes('mobile')) deviceMap.mobile++
      else if (dev.includes('tablet')) deviceMap.tablet++
      else deviceMap.desktop++
    })

    const deviceViews = Object.entries(deviceMap).map(([device, count]) => ({
      device,
      count
    }))

    return {
      submissions,
      viewsCount,
      deviceViews
    }
  }

  public async recordView(payload: RecordViewInputType) {
    const { formId, deviceType } = await recordViewInput.parseAsync(payload)

    await db.insert(formViewsTable).values({
      formId,
      deviceType
    })

    return { success: true }
  }
}

export default FormSubmissionService
