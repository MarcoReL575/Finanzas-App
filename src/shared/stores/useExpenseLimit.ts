import { SelectLimiteGasto } from '@/src/features/gastos/types/types';
import { DateRange } from '@daypicker/react';
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

    expenseLimitToEdit: {} as SelectLimiteGasto,
    setExpenseLimitToEdit: (expenseLimitToEdit)=> set({ expenseLimitToEdit }),

}))