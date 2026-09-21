import { db } from "@/src/db";
import { InsertLimiteGasto } from "../types/types";
import { budgets } from "@/src/db/schema";

export interface IGastoRepository {
    insertExpenseLimit(expense: InsertLimiteGasto): Promise<void>;
}

class GastoRepository implements IGastoRepository {
    async insertExpenseLimit(expense: InsertLimiteGasto): Promise<void> {
        await db
            .insert(budgets)
            .values(expense)
    }
}

export const gastoRepository = new GastoRepository();