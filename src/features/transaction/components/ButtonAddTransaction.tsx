'use client'

import { IconCirclePlus, IconX } from '@tabler/icons-react'
import { useTransactionStore } from '@/src/shared/stores/useTransactionStore';
import { SelectTransaction } from '../types/types';
import { useModalStore } from '@/src/shared/stores/modalStore';


export default function ButtonAddTransaction() {

    const setTransaction = useTransactionStore((state)=> state.setTransaction)
    const openModal = useModalStore((state)=> state.openModal)

    const handleCreateNewTransaction = ()=> {
        setTransaction({} as SelectTransaction);
        openModal('formTransaction');
    }

  return (
    <>
        <button 
            className='bg-green-500 w-fit flex items-center gap-x-2 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer'
            onClick={handleCreateNewTransaction}
        >
            <IconCirclePlus />
            Agregar Transacción
        </button>
        
    </>

  )
}
