'use server'

import { UserSession } from "@/src/lib/authServer";
import { gastoService } from "../services/gastoService";
import { BudgetDisplayItem, BudgetFormValues, SelectLimiteGasto } from "../types/types";

export async function newExpenseLimitAction(expense: BudgetFormValues) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no cuenta con una sesión' }

    return gastoService.createExpenseLimit(expense, session.user.id);
}

export async function deleteGastoLimitAction(limitId: string) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no cuenta con una sesión' }

    return gastoService.deleteUserExpenseLimit(session.user.id, limitId);
};

export async function editGastoLimitAction(limitId: string) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no cuenta con una sesión', editExpense: [] }

    return gastoService.updateExpenseLimit(session.user.id, limitId);
}

export async function selectExpenseLimitAction(limitId: string) {
    const session = await UserSession();
    if(!session?.user.id) return { success: false, message: 'El usuario no cuenta con una sesión', expenseLimit: {} as SelectLimiteGasto  }

    return gastoService.expenseLimit(session.user.id, limitId);
}