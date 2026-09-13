'use server'

import { UserSession } from "@/src/lib/authServer"
import { InsertTransaction } from "../types/types";
import { transactionService } from "../services/serviceTransaction";

export async function createTransactionAction(transaction: InsertTransaction) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no se ha registrado' }

    return await transactionService.addTransaction(transaction, session.user.id);
}