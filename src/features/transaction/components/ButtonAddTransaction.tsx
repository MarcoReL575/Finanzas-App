'use client'

import { IconCirclePlus, IconX } from '@tabler/icons-react'
import { useTransactionStore } from '@/src/shared/stores/useTransactionStore';
import { SelectTransaction } from '../types/types';
import { useModalStore } from '@/src/shared/stores/modalStore';
import { Button } from '@/src/shared/ui/button';


export default function ButtonAddTransaction() {

    const setTransaction = useTransactionStore((state)=> state.setTransaction)
    const openModal = useModalStore((state)=> state.openModal)

    const handleCreateNewTransaction = ()=> {
        setTransaction({} as SelectTransaction);
        openModal('formTransaction');
    }

  return (
    <>
        <Button 
            className='bg-green-500 w-fit gap-x-2 text-white hover:bg-green-400'
            onClick={handleCreateNewTransaction}
        >
            <IconCirclePlus />
            Agregar Transacción
        </Button>
        
    </>

  )
}
