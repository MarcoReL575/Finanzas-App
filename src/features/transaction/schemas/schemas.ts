import { transactionSchema } from "@/src/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const insertTransactionSchema = createInsertSchema(transactionSchema);
export const selectTransactionSchema = createSelectSchema(transactionSchema);

export const InsertFormTransactionSchema = z.object({
    tipo: z.enum(['gasto', 'ingreso']),
    monto: z.coerce.number({message: 'Ingresa un monto válido' }).min(0.01, 'El monto debe ser mayor a 0'),
    categoria: z.string().min(1, 'Selecciona una categoría'),
    descripcion: z.string().min(1, 'La descripción es requerida'),
    createdAt: z.string().min(1, 'La fecha es requerida'),
    id: z.string().optional()
});

export type InsertFormTransaction = z.output<typeof InsertFormTransactionSchema>;
export type InsertFormTransactionInput = z.input<typeof InsertFormTransactionSchema>;