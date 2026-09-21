import { db } from "@/src/db"
import { transactionSchema } from "@/src/db/schema"
import { InsertTransaction, PaginatedResult, PaginationParams, SelectTransaction, UserBalance } from "../types/types"
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

export interface IransactionRepository {
    insertTransaction(transaction: InsertTransaction): Promise<void>;
    selectTransactionsUser(userId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<SelectTransaction>>;
    selectSingleTransaction(userId: string, transactionId: number): Promise<SelectTransaction>;
    deleteSingleTransaction(userId:string, transactionId: number): Promise<void>;
    updateSingleTransaction(userId: string, transaction: InsertTransaction, transId: number): Promise<void>;
    getUserBalance(userId: string): Promise<UserBalance>
}

class TransactionRepository implements IransactionRepository {
    async insertTransaction(transaction: InsertTransaction): Promise<void> {
        await db
            .insert(transactionSchema)
            .values(transaction)
    };

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
    };

    async selectSingleTransaction(userId: string, transactionId: number): Promise<SelectTransaction> {
        const [result] = await db
            .select()
            .from(transactionSchema)
            .where(and(
                eq(transactionSchema.userId, userId),
                eq(transactionSchema.id, transactionId)
            ))
        return result;
    };

    async deleteSingleTransaction(userId: string, transactionId: number): Promise<void> {
        await db
            .delete(transactionSchema)
            .where( and(
                eq(transactionSchema.userId, userId),
                eq(transactionSchema.id, transactionId),
            ))
    };

    async updateSingleTransaction(userId: string, transaction: InsertTransaction, transId: number): Promise<void> {
        console.log({newTransacction: transaction});
        await db
            .update(transactionSchema)
            .set({
                categoria: transaction.categoria,
                createdAt: transaction.createdAt,
                monto: transaction.monto,
                descripcion: transaction.descripcion,
                tipo: transaction.tipo,
            })
            .where(and(
                eq(transactionSchema.id, transId),
                eq(transactionSchema.userId, userId)
            ))
    }

    async getUserBalance(userId: string): Promise<UserBalance> {
        const [result] = await db
            .select({
                // Suma montos cuando tipo es 'ingreso', si es null retorna 0
                totalIngresos: sql<number>`
                    COALESCE(SUM(CASE WHEN ${transactionSchema.tipo} = 'ingreso' THEN ${transactionSchema.monto} ELSE 0 END), 0)::int
                `,
                // Suma montos cuando tipo es 'gasto', si es null retorna 0
                totalGastos: sql<number>`COALESCE(SUM(CASE WHEN ${transactionSchema.tipo} = 'gasto' THEN ${transactionSchema.monto} ELSE 0 END), 0)::int`,
            })
            .from(transactionSchema)
            .where(eq(transactionSchema.userId, userId));
        
        const totalIngresos = Number(result?.totalIngresos ?? 0);
        const totalGastos = Number(result?.totalGastos ?? 0);
        const balanceTotal = totalIngresos - totalGastos;

        return {
            totalIngresos,
            totalGastos,
            balanceTotal,
        };
    }
}

export const transactionRepository = new TransactionRepository()