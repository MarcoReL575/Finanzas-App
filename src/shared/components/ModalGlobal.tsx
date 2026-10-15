'use client'

import { ModalDeleteTransaction } from "@/src/features/transaction/components/ModalDeleteTransaction";
import { useModalStore } from "../stores/modalStore";
import ModalTransaction from "@/src/features/transaction/components/ModalTransaction";
import ModalExpenseLimits from "@/src/features/gastos/components/ModalExpenseLimits";
import ModalDeleteExpenseLimit from "@/src/features/gastos/components/ModalDeleteExpenseLimit";


// Diccionario de modales
const modalObject: any = {
    formTransaction: ModalTransaction,
    deleteTransaction: ModalDeleteTransaction,
    expenseLimit: ModalExpenseLimits,
    deleteExpenseLimit: ModalDeleteExpenseLimit,
};

export const ModalProvider = () => {
    const { type, isOpen } = useModalStore();

    if (!isOpen || !type) return null;

    const ModalToRender = modalObject[type];

    return <ModalToRender />;
};