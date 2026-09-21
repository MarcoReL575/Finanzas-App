import z from "zod";
import { budgetSchema, insertLimitExpenseSchema, selectLimitExpenseSchema } from "../schemas/schema";

export type InsertLimiteGasto = z.infer<typeof insertLimitExpenseSchema>;
export type SelectLimiteGasto = z.infer<typeof selectLimitExpenseSchema>;

export type BudgetFormValues = z.infer<typeof budgetSchema>;