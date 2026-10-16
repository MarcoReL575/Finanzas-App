import { SelectLimiteGasto } from '@/src/features/gastos/types/types';
import { create } from 'zustand'

interface ExpenseLimit {   
    expenseLimitId: string;
    setExpenseLimitId: (expenseLimitId: string)=> void;

    expenseLimitToEdit: SelectLimiteGasto | undefined,
    setExpenseLimitToEdit: (expenseLimitToEdit: SelectLimiteGasto | undefined)=> void;
}

export const useExpenseLimit = create<ExpenseLimit>()((set) => ({
    expenseLimitId: '',
    setExpenseLimitId: (expenseLimitId)=> set({ expenseLimitId }),

    // undefined = modo crear; con un límite = modo editar
    expenseLimitToEdit: undefined,
    setExpenseLimitToEdit: (expenseLimitToEdit)=> set({ expenseLimitToEdit }),

}))