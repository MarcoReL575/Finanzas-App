'use server'

import { UserSession } from "@/src/lib/authServer"
import { InsertTransaction, SelectTransaction } from "../types/types";
import { transactionService } from "../services/serviceTransaction";

export async function createTransactionAction(transaction: InsertTransaction) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no se ha registrado' }

    return await transactionService.addTransaction(transaction, session.user.id);
}

export async function getTransactionByUserAction(userId: string) {
    const session = await UserSession();
    if(!session?.user.id) return [] as SelectTransaction[]

    return await transactionService.getTransactionsByUser(userId);
}