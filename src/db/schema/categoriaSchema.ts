import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum('transaction_type', [
    'income', 'expense', 'transfer'
])

export const categoriaSchema = pgTable("categoria", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    type: integer().notNull(),
    createdAt: varchar({ length: 255 }).notNull().unique(),
});
