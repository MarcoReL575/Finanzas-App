import { integer, pgEnum, pgTable, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const tipoTransaccionEnum = pgEnum('tipo_transaccion', ['gasto', 'ingreso']);

export const transactionSchema = pgTable("transaction", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tipo: tipoTransaccionEnum('tipo').notNull(),
    monto: numeric({ precision: 10, scale: 2 }).notNull(),
    categoria: varchar({ length: 255 }).notNull(),
    descripcion: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
