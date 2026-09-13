import { db } from "@/src/db"
import { transactionSchema } from "@/src/db/schema"
import { InsertTransaction } from "../types/types"

export interface IransactionRepository {
    insertTransaction(transaction: InsertTransaction, userId: string): Promise<void>
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
}

export const transactionRepository = new TransactionRepository()