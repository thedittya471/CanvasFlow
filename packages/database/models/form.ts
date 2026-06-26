import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    text,
    index
} from 'drizzle-orm/pg-core'
import { usersTable } from './auth'

export const formsTable = pgTable("forms", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    title: varchar("title", { length: 150 }).notNull(),
    description: text("description"),

    slug: varchar("slug", { length: 150 }).notNull().unique(),
    
    ownerId: text("owner_id").references(() => usersTable.id, {
        onDelete: "cascade"
    }).notNull(),

    isPublished: boolean("is_published").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    isOpen: boolean("is_open").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    publishedAt: timestamp("published_at"),
}, (table) => ({
    // Hot path: list/stats/limit queries filter by owner, often ordered by createdAt.
    ownerCreatedIdx: index("forms_owner_created_idx").on(table.ownerId, table.createdAt),
}))
