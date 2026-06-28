import { db, eq, and, desc, gte, count, usersTable } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { formSubmissionsTable } from "@repo/database/models/form-submission"
import { formViewsTable } from "@repo/database/models/form-view"
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

    let submissionLimit = 1000
    if (userPlan === "Pro") submissionLimit = 10000
    else if (userPlan === "Pro+") submissionLimit = 50000
    else if (userPlan === "Business") submissionLimit = 500000

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Count this month's submissions across all of the owner's forms in a
    // single COUNT query (no row materialization).
    const monthCountRows = await db
      .select({ value: count() })
      .from(formSubmissionsTable)
      .innerJoin(formsTable, eq(formSubmissionsTable.formId, formsTable.id))
      .where(
        and(
          eq(formsTable.ownerId, form.ownerId),
          gte(formSubmissionsTable.createdAt, startOfMonth)
        )
      )

    const monthlyCount = Number(monthCountRows[0]?.value ?? 0)
    if (monthlyCount >= submissionLimit) {
      throw new Error(`This workspace has reached the limit of ${submissionLimit} submissions per month for the ${userPlan} tier.`)
    }

    const insertResult = await db.insert(formSubmissionsTable).values({
      formId,
      values,
      referrer: (payload as any).referrer ?? null,
      utmSource: (payload as any).utmSource ?? null,
      utmMedium: (payload as any).utmMedium ?? null,
      utmCampaign: (payload as any).utmCampaign ?? null,
      timeSpentMs: (payload as any).timeSpentMs ?? null,
    }).returning({ id: formSubmissionsTable.id })

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

    // Submissions (full rows) and device view aggregation run in parallel
    const [submissions, deviceRows] = await Promise.all([
      db.select()
        .from(formSubmissionsTable)
        .where(eq(formSubmissionsTable.formId, formId))
        .orderBy(desc(formSubmissionsTable.createdAt)),
      db.select({ deviceType: formViewsTable.deviceType, value: count() })
        .from(formViewsTable)
        .where(eq(formViewsTable.formId, formId))
        .groupBy(formViewsTable.deviceType),
    ])

    const deviceMap = { desktop: 0, mobile: 0, tablet: 0 }
    let viewsCount = 0
    deviceRows.forEach(r => {
      const n = Number(r.value)
      viewsCount += n
      const dev = r.deviceType.toLowerCase()
      if (dev.includes('mobile')) deviceMap.mobile += n
      else if (dev.includes('tablet')) deviceMap.tablet += n
      else deviceMap.desktop += n
    })

    const deviceViews = Object.entries(deviceMap).map(([device, cnt]) => ({
      device,
      count: cnt
    }))

    return { submissions, viewsCount, deviceViews }
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
