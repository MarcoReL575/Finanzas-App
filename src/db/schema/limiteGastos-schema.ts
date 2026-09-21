import { pgTable, text, numeric, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const budgets = pgTable('budgets', {
    id: text('id').primaryKey().$defaultFn(()=> crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    cantidad: numeric('cantidad', { precision: 12, scale: 2 }).notNull(), // El límite fijado (ej: 3000.00)
    month: integer('month').notNull(), // 1 - 12
    year: integer('year').notNull(),   // ej: 2026
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    // Restricción única: Un usuario solo puede tener 1 presupuesto por categoría para un mes/año dado
    unqBudget: unique().on(table.userId, table.category, table.month, table.year),
}));