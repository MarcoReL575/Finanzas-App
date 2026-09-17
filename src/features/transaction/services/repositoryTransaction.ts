import { db } from "@/src/db"
import { transactionSchema } from "@/src/db/schema"
import { InsertTransaction, PaginatedResult, PaginationParams, SelectTransaction } from "../types/types"
import { asc, count, desc, eq } from "drizzle-orm";

export interface IransactionRepository {
    insertTransaction(transaction: InsertTransaction, userId: string): Promise<void>;
    selectTransactionsUser(userId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<SelectTransaction>>;
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

    async selectTransactionsUser(userId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<SelectTransaction>> {
        console.log({page, limit})
        const offset = (page - 1) * limit;
        const [items, totalResult] = await Promise.all([
            db
                .select()
                .from(transactionSchema)
                .where(eq(transactionSchema.userId, userId))
                .orderBy(desc(transactionSchema.createdAt))
                .limit(limit)
                .offset(offset),
            db
                .select({ value: count() })
                .from(transactionSchema)
                .where(eq(transactionSchema.userId, userId))
        ])
        const total = totalResult[0]?.value ?? 0
        const hasMore = offset + items.length < total;

        return {
            items,
            hasMore,
            total,
            page,
            limit,
        }
    }
}

export const transactionRepository = new TransactionRepository()