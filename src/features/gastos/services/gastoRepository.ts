import { db } from "@/src/db";
import { InsertLimiteGasto, SelectLimiteGasto } from "../types/types";
import { budgets } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface IGastoRepository {
    insertExpenseLimit(expense: InsertLimiteGasto): Promise<void>;
    selectUserExpenseLimits(userId: string): Promise<SelectLimiteGasto[]>
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
}

export const gastoRepository = new GastoRepository();