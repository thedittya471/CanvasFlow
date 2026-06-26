import { db, eq, and, inArray, gte, count, usersTable } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { formFieldsTable } from "@repo/database/models/form-field"
import { formSubmissionsTable } from "@repo/database/models/form-submission"
import { createFormInput, type CreateFormInputType, listFormsByUserIdInput, type ListFormsByUserIdInputType, getFormInput, type GetFormInputType, getDashboardStatsInput, type GetDashboardStatsInputType } from "./model"

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

    const userResult = await db.select({ plan: usersTable.plan }).from(usersTable).where(eq(usersTable.id, ownerId))
    const userPlan = userResult[0]?.plan || "Free"

    let formLimit = 5
    if (userPlan === "Pro") formLimit = 15
    else if (userPlan === "Pro+") formLimit = 30
    else if (userPlan === "Business") formLimit = Infinity

    if (formLimit !== Infinity) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const existingForms = await db
        .select()
        .from(formsTable)
        .where(
          and(
            eq(formsTable.ownerId, ownerId),
            gte(formsTable.createdAt, startOfMonth)
          )
        )

      if (existingForms.length >= formLimit) {
        throw new Error(`You have reached the limit of ${formLimit} forms per month for the ${userPlan} tier.`)
      }
    }

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

  public async getDashboardStats(payload: GetDashboardStatsInputType) {
    const { userId } = await getDashboardStatsInput.parseAsync(payload)

    const forms = await db.select({
      id: formsTable.id,
      title: formsTable.title,
      isPublished: formsTable.isPublished,
      createdAt: formsTable.createdAt,
    }).from(formsTable).where(eq(formsTable.ownerId, userId))

    const totalSketches = forms.length
    const publishedSketches = forms.filter(f => f.isPublished).length
    const formIds = forms.map(f => f.id)

    if (formIds.length === 0) {
      return {
        totalSketches: 0,
        publishedSketches: 0,
        totalResponses: 0,
        responsesThisMonth: 0,
        recentForms: [],
        trends: []
      }
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentFormsRaw = [...forms]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
    const recentIds = recentFormsRaw.map(f => f.id)

    // Run all aggregations in parallel as SQL counts/group-bys instead of
    // loading every submission row (incl. the `values` jsonb) into memory.
    const [totalRow, monthRow, recentCounts, trendRows] = await Promise.all([
      db.select({ value: count() })
        .from(formSubmissionsTable)
        .where(inArray(formSubmissionsTable.formId, formIds)),
      db.select({ value: count() })
        .from(formSubmissionsTable)
        .where(and(
          inArray(formSubmissionsTable.formId, formIds),
          gte(formSubmissionsTable.createdAt, startOfMonth)
        )),
      recentIds.length > 0
        ? db.select({ formId: formSubmissionsTable.formId, value: count() })
            .from(formSubmissionsTable)
            .where(inArray(formSubmissionsTable.formId, recentIds))
            .groupBy(formSubmissionsTable.formId)
        : Promise.resolve([] as { formId: string; value: number }[]),
      // Only the last 7 days of timestamps (small) — for the trend chart.
      db.select({ createdAt: formSubmissionsTable.createdAt })
        .from(formSubmissionsTable)
        .where(and(
          inArray(formSubmissionsTable.formId, formIds),
          gte(formSubmissionsTable.createdAt, sevenDaysAgo)
        )),
    ])

    const totalResponses = Number(totalRow[0]?.value ?? 0)
    const responsesThisMonth = Number(monthRow[0]?.value ?? 0)

    const countByForm = new Map(recentCounts.map(r => [r.formId, Number(r.value)]))
    const recentForms = recentFormsRaw.map(f => ({
      id: f.id,
      title: f.title,
      createdAt: f.createdAt,
      isPublished: f.isPublished,
      submissionsCount: countByForm.get(f.id) ?? 0
    }))

    const trendsMap: Record<string, number> = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      trendsMap[dateStr] = 0
    }

    trendRows.forEach(s => {
      const dateStr = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (trendsMap[dateStr] !== undefined) {
        trendsMap[dateStr]++
      }
    })

    const trends = Object.entries(trendsMap).map(([date, count]) => ({
      date,
      count
    }))

    return {
      totalSketches,
      publishedSketches,
      totalResponses,
      responsesThisMonth,
      recentForms,
      trends
    }
  }
}

export default FormService
