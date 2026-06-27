import { index, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { formsTable } from './form'

export interface FormSubmissionValue {
    formFieldId: string
    value: any
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissionsTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid('form_id').references(() => formsTable.id, { onDelete: "cascade" }).notNull(),

    values: jsonb('values').$type<FormSubmissionValueRow>().notNull(),

    // Attribution & timing (collected by the public form page)
    referrer: varchar("referrer", { length: 2048 }),
    utmSource: varchar("utm_source", { length: 255 }),
    utmMedium: varchar("utm_medium", { length: 255 }),
    utmCampaign: varchar("utm_campaign", { length: 255 }),
    timeSpentMs: integer("time_spent_ms"), // ms from page load to submit

    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    formCreatedIdx: index("form_submissions_form_created_idx").on(table.formId, table.createdAt),
}))
