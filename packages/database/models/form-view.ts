import { index, pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { formsTable } from './form'

export const formViewsTable = pgTable("form_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid('form_id').references(() => formsTable.id, { onDelete: "cascade" }).notNull(),
    deviceType: varchar("device_type", { length: 50 }).notNull(), // 'desktop', 'mobile', 'tablet'
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    // Views are aggregated per form (counts + device breakdown).
    formIdx: index("form_views_form_id_idx").on(table.formId),
}))
