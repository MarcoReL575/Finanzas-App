import { db } from "@/src/db"
import { transactionSchema } from "@/src/db/schema"
import { InsertTransaction, SelectTransaction } from "../types/types"
import { asc, desc, eq } from "drizzle-orm";

export interface IransactionRepository {
    insertTransaction(transaction: InsertTransaction, userId: string): Promise<void>;
    selectTransactionsUser(userId: string): Promise<SelectTransaction[]>;
}

class TransactionRepository implements IransactionRepository {
    async insertTransaction(transaction: InsertTransaction, userId: string): Promise<void> {
        await db
            .insert(transactionSchema)
            .values({
                ...transaction,
                userId
            })
    }

    async selectTransactionsUser(userId: string): Promise<SelectTransaction[]> {
        const result = await db
            .select()
            .from(transactionSchema)
            .where(eq(transactionSchema.userId, userId))
            .orderBy(desc(transactionSchema.createdAt))
        return result;
    }
}

export const transactionRepository = new TransactionRepository()