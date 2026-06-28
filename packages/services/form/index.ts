import { db, eq, and, gte, count, sql, usersTable } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { formFieldsTable } from "@repo/database/models/form-field"
import { formSubmissionsTable } from "@repo/database/models/form-submission"
import { createFormInput, type CreateFormInputType, listFormsByUserIdInput, type ListFormsByUserIdInputType, getFormInput, type GetFormInputType, getDashboardStatsInput, type GetDashboardStatsInputType, deleteFormInput, type DeleteFormInputType } from "./model"

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

    let formLimit = 10
    if (userPlan === "Pro") formLimit = 50
    else if (userPlan === "Pro+") formLimit = 200
    else if (userPlan === "Business") formLimit = Infinity

    if (formLimit !== Infinity) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const existingForms = await db
        .select({ value: count() })
        .from(formsTable)
        .where(
          and(
            eq(formsTable.ownerId, ownerId),
            gte(formsTable.createdAt, startOfMonth)
          )
        )

      if (Number(existingForms[0]?.value ?? 0) >= formLimit) {
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

    const forms = await db
      .select({
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
        submissionsCount: count(formSubmissionsTable.id),
      })
      .from(formsTable)
      .leftJoin(formSubmissionsTable, eq(formsTable.id, formSubmissionsTable.formId))
      .where(eq(formsTable.ownerId, userId))
      .groupBy(formsTable.id)

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

  public async deleteForm(payload: DeleteFormInputType & { ownerId: string }) {
    const { id } = await deleteFormInput.parseAsync(payload)

    const result = await db.delete(formsTable)
      .where(and(eq(formsTable.id, id), eq(formsTable.ownerId, payload.ownerId)))
      .returning({ id: formsTable.id })

    if (!result[0]) throw new Error("Form not found or unauthorized")

    return { success: true }
  }

  public async getDashboardStats(payload: GetDashboardStatsInputType) {
    const { userId } = await getDashboardStatsInput.parseAsync(payload)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Trend chart covers up to 90 days so the dashboard can render
    // 7d / 30d / 90d windows from a single fetch.
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89)
    ninetyDaysAgo.setHours(0, 0, 0, 0)

    // ─── One round-trip, one connection ──────────────────────────────────
    //
    // The dashboard used to fan out four queries through Promise.all. On
    // a cold pool each one had to wait its turn for a fresh TLS handshake
    // to Neon's pooler (~300ms each), which serialized into ~1.7s wall
    // time despite "running in parallel".
    //
    // Collapsing into a single statement with subqueries:
    //   • one pg connection acquired (no handshake contention)
    //   • one Neon round-trip
    //   • Postgres planner can share the `forms WHERE owner_id` scan
    //     across the four sub-aggregates instead of repeating it.
    //
    // Output shape mirrors the four old result sets so the JS below
    // didn't need to change.
    type DashboardRow = {
      forms: Array<{ id: string; title: string; is_published: boolean; created_at: string }> | null
      agg: { total: number; month: number } | null
      per_form: Array<{ form_id: string; cnt: number }> | null
      trends: Array<{ created_at: string }> | null
    }
    const rows = await db.execute<DashboardRow>(sql`
      with owned as (
        select id, title, is_published, created_at
        from ${formsTable}
        where ${formsTable.ownerId} = ${userId}
      )
      select
        (select coalesce(json_agg(owned), '[]'::json) from owned) as forms,
        (
          select json_build_object(
            'total', count(*),
            'month', count(*) filter (where s.created_at >= ${startOfMonth})
          )
          from ${formSubmissionsTable} s
          join owned o on s.form_id = o.id
        ) as agg,
        (
          select coalesce(json_agg(t), '[]'::json) from (
            select s.form_id, count(*)::int as cnt
            from ${formSubmissionsTable} s
            join owned o on s.form_id = o.id
            group by s.form_id
          ) t
        ) as per_form,
        (
          select coalesce(json_agg(t), '[]'::json) from (
            select s.created_at
            from ${formSubmissionsTable} s
            join owned o on s.form_id = o.id
            where s.created_at >= ${ninetyDaysAgo}
          ) t
        ) as trends
    `)

    const row = (rows as any).rows?.[0] as DashboardRow | undefined
    const forms = (row?.forms ?? []).map((f) => ({
      id: f.id,
      title: f.title,
      isPublished: f.is_published,
      createdAt: new Date(f.created_at),
    }))
    const aggRow = [{
      total: row?.agg?.total ?? 0,
      month: row?.agg?.month ?? 0,
    }]
    const perFormCounts = (row?.per_form ?? []).map((r) => ({
      formId: r.form_id,
      value: r.cnt,
    }))
    const trendRows = (row?.trends ?? []).map((r) => ({
      createdAt: new Date(r.created_at),
    }))

    const totalSketches = forms.length
    const publishedSketches = forms.filter(f => f.isPublished).length

    if (totalSketches === 0) {
      return {
        totalSketches: 0,
        publishedSketches: 0,
        totalResponses: 0,
        responsesThisMonth: 0,
        recentForms: [],
        trends: []
      }
    }

    // Sort in memory and grab the four most recent — avoids the second
    // SELECT on formsTable that the old implementation made.
    const recentFormsRaw = [...forms]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4)

    const totalResponses = Number(aggRow[0]?.total ?? 0)
    const responsesThisMonth = Number(aggRow[0]?.month ?? 0)

    const countByForm = new Map(perFormCounts.map(r => [r.formId, Number(r.value)]))
    const recentForms = recentFormsRaw.map(f => ({
      id: f.id,
      title: f.title,
      createdAt: f.createdAt,
      isPublished: f.isPublished,
      submissionsCount: countByForm.get(f.id) ?? 0
    }))

    const trendsMap: Record<string, number> = {}
    const today = new Date()
    for (let i = 89; i >= 0; i--) {
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
