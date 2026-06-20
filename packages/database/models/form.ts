import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    text
} from 'drizzle-orm/pg-core'
import { usersTable } from './user'

export const formsTable = pgTable("forms", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    title: varchar("title", { length: 150 }).notNull(),
    description: text("description"),

    slug: varchar("slug", { length: 150 }).notNull().unique(),
    
    ownerId: uuid("owner_id").references(() => usersTable.id, {
        onDelete: "cascade"
    }).notNull(),

    isPublished: boolean("is_published").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    isOpen: boolean("is_open").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
    publishedAt: timestamp("published_at"),

})