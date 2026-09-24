import { integer, pgEnum, pgTable, varchar, numeric, timestamp, text } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const tipoTransaccionEnum = pgEnum('tipo_transaccion', ['gasto', 'ingreso']);

export const transactionSchema = pgTable("transaction", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tipo: tipoTransaccionEnum('tipo').notNull(),
    monto: integer('monto').notNull(),
    categoria: varchar({ length: 255 }).notNull(),
    descripcion: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});
