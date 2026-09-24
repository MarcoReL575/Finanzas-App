import z from "zod";
import { budgetSchema, insertLimitExpenseSchema, selectLimitExpenseSchema } from "../schemas/schema";
import React from "react";

export type InsertLimiteGasto = z.infer<typeof insertLimitExpenseSchema>;
export type SelectLimiteGasto = z.infer<typeof selectLimitExpenseSchema>;

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export interface BudgetDisplayItem {
    id: string;
    category: string;
    categoryLabel: string;
    categoryIcon: React.ReactNode;
    limitAmount: number;
    spentAmount: number;
    remainingAmount: number;
    percentage: number;
    isExceeded: boolean;
}