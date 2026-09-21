'use server'

import { UserSession } from "@/src/lib/authServer";
import { gastoService } from "../services/gastoService";
import { BudgetFormValues } from "../types/types";

export async function newExpenseLimitAction(expense: BudgetFormValues) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no cuenta con una sesión' }

    return gastoService.createExpenseLimit(expense, session.user.id);
}