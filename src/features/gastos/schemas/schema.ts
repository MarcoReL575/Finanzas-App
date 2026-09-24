import { budgets } from "@/src/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertLimitExpenseSchema = createInsertSchema(budgets);
export const selectLimitExpenseSchema = createSelectSchema(budgets);

import { z } from "zod";

export const budgetSchema = z.object({
    category: z.string({ message: "Por favor selecciona una categoría."}).min(1, "La categoría es requerida."),
    monto: z.coerce.number({message: 'Ingresa un monto válido' }).min(0.01, 'El monto debe ser mayor a 0'),
    month: z.number().min(1, "Mes inválido").max(12, "Mes inválido"),
    year: z.number().min(2024, "Año inválido"),
});


export const InsertBudgetSchema = budgetSchema.extend({
    userId: z.string().min(1, "El usuario no existe"),
});