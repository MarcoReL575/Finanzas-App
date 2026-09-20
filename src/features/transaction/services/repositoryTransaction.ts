import { db } from "@/src/db"
import { transactionSchema } from "@/src/db/schema"
import { InsertTransaction, PaginatedResult, PaginationParams, SelectTransaction } from "../types/types"
import { and, asc, count, desc, eq } from "drizzle-orm";

export interface IransactionRepository {
    insertTransaction(transaction: InsertTransaction): Promise<void>;
    selectTransactionsUser(userId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<SelectTransaction>>;
    selectSingleTransaction(userId: string, transactionId: number): Promise<SelectTransaction>;
    deleteSingleTransaction(userId:string, transactionId: number): Promise<void>;
}

class TransactionRepository implements IransactionRepository {
    async insertTransaction(transaction: InsertTransaction): Promise<void> {
        await db
            .insert(transactionSchema)
            .values(transaction)
    }

    async selectTransactionsUser(userId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<SelectTransaction>> {
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

    async selectSingleTransaction(userId: string, transactionId: number): Promise<SelectTransaction> {
        const [result] = await db
            .select()
            .from(transactionSchema)
            .where(and(
                eq(transactionSchema.userId, userId),
                eq(transactionSchema.id, transactionId)
            ))
        return result;
    }

    async deleteSingleTransaction(userId: string, transactionId: number): Promise<void> {
        await db
            .delete(transactionSchema)
            .where( and(
                eq(transactionSchema.userId, userId),
                eq(transactionSchema.id, transactionId),
            ))
    }
}

export const transactionRepository = new TransactionRepository()