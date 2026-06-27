import { index, pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { formsTable } from './form'

export const formViewsTable = pgTable("form_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid('form_id').references(() => formsTable.id, { onDelete: "cascade" }).notNull(),
    deviceType: varchar("device_type", { length: 50 }).notNull(),
    // Attribution (collected when public form page opens)
    referrer: varchar("referrer", { length: 2048 }),
    utmSource: varchar("utm_source", { length: 255 }),
    utmMedium: varchar("utm_medium", { length: 255 }),
    utmCampaign: varchar("utm_campaign", { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
    formIdx: index("form_views_form_id_idx").on(table.formId),
}))
