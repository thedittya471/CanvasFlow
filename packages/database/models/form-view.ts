import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { formsTable } from './form'

export const formViewsTable = pgTable("form_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid('form_id').references(() => formsTable.id, { onDelete: "cascade" }).notNull(),
    deviceType: varchar("device_type", { length: 50 }).notNull(), // 'desktop', 'mobile', 'tablet'
    createdAt: timestamp('created_at').defaultNow().notNull()
})
