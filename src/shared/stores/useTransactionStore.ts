import { SelectTransaction } from '@/src/features/transaction/types/types'
import { create } from 'zustand'

interface TransactionStore {
    transaction: SelectTransaction;
    setTransaction: (transaction: SelectTransaction) => void
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
    transaction: {} as SelectTransaction,
    setTransaction: (transaction: SelectTransaction) => set(() => ({ transaction })),
}))