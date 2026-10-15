import { DateRange } from '@daypicker/react';
import { create } from 'zustand'

interface ExpenseLimit {   
    expenseLimitId: string;
    setExpenseLimitId: (expenseLimitId: string)=> void;
}

export const useExpenseLimit = create<ExpenseLimit>()((set) => ({
    expenseLimitId: '',
    setExpenseLimitId: (expenseLimitId)=> set({ expenseLimitId }),
}))