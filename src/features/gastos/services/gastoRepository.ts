import { db } from "@/src/db";
import { InsertLimiteGasto, SelectLimiteGasto } from "../types/types";
import { budgets } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export interface IGastoRepository {
    insertExpenseLimit(expense: InsertLimiteGasto): Promise<void>;
    selectUserExpenseLimits(userId: string): Promise<SelectLimiteGasto[]>;
    deleteExpenseLimitUser(userId: string, limitId: string): Promise<void>;
}

class GastoRepository implements IGastoRepository {
    async insertExpenseLimit(expense: InsertLimiteGasto): Promise<void> {
        await db
            .insert(budgets)
            .values(expense)
    }

    async selectUserExpenseLimits(userId: string): Promise<SelectLimiteGasto[]> {
        const budgetsList = await db
           .select() 
           .from(budgets)
           .where(eq(budgets.userId, userId))
        return budgetsList;
    }

    async deleteExpenseLimitUser(userId: string, limitId: string): Promise<void> {
        await db
            .delete(budgets)
            .where(
                and(
                    eq(budgets.id, limitId),
                    eq(budgets.userId, userId)
                )
            )
    }
}

export const gastoRepository = new GastoRepository();