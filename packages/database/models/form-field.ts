import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    text,
    jsonb,
    integer,
    serial,
    numeric,
    pgEnum,
    unique
} from "drizzle-orm/pg-core"
import { usersTable } from "./auth"
import { formsTable } from "./form"


export const fieldTypeEnum = pgEnum('field_type_num', [
    'TEXT',
    'TEXTAREA',
    'NUMBER',
    'EMAIL',
    'PHONE',
    'URL',
    'SELECT',
    'RADIO',
    'CHECKBOX',
    'DATE',
    'RATING',
    'FILE_UPLOAD',
    'TIME',
    'DATETIME',
    'SLIDER',
    'TOGGLE'
])


export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").defaultRandom().primaryKey(),
    formId: uuid("form_id").references(() => formsTable.id, {
        onDelete: "cascade"
    }).notNull(),

    label: varchar("label", { length: 255 }).notNull(),
    labelKey: varchar("label_key", { length: 255 }).notNull(),

    placeholder: varchar("placeholder", { length: 255 }),

    isRequired: boolean("is_required").default(false).notNull(),

    index: numeric("index", { scale: 2 }).notNull(),

    type: fieldTypeEnum('type').notNull(),

    options: jsonb("options"),

    description: text("description"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),

}, (table) => {
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
})