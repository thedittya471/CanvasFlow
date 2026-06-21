import { jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
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
})