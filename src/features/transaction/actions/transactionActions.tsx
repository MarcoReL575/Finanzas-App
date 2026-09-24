'use server'

import { UserSession } from "@/src/lib/authServer"
import { InsertFormTransaction, PaginationParams, SelectTransaction } from "../types/types";
import { transactionService } from "../services/serviceTransaction";

export async function createTransactionAction(transaction: InsertFormTransaction) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no se ha registrado' }

    return await transactionService.addTransaction(transaction, session.user.id);
}

export async function getTransactionByUserAction(userId: string, { page, limit }: PaginationParams) {
    return await transactionService.getTransactionsByUser(userId, { page: page, limit });
}

export async function selectTransactionAction(transactionId: number) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no se ha registrado', transaction: {} as SelectTransaction }

    return await transactionService.getSingleTransactionById(session.user.id, transactionId)
}

export async function deleteTransactionAction(transactionId: number) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no se ha registrado'}

    return await transactionService.deleteTansaction(session.user.id, transactionId);
}

export async function editTransactionAction(transaction: InsertFormTransaction) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no se ha registrado'}

    return await transactionService.updateTransaction(session.user.id, transaction);
}