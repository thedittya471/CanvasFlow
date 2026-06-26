import { index, jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
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

    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    // Hottest path: submissions are always filtered by form_id and ordered by
    // created_at (lists, counts, monthly limits, trends). Composite covers both.
    formCreatedIdx: index("form_submissions_form_created_idx").on(table.formId, table.createdAt),
}))
