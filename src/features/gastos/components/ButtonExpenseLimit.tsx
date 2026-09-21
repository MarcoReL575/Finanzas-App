'use client'

import { useModalStore } from '@/src/shared/stores/modalStore';
import { Button } from '@/src/shared/ui/button'
import { IconCirclePlus } from '@tabler/icons-react'

export default function ButtonExpenseLimit() {

    const openModal = useModalStore((state)=> state.openModal);

  return (
    <Button 
        className='bg-green-500 text-white hover:bg-green-400'
        onClick={()=> openModal('expenseLimit')}
    >
        <IconCirclePlus />
        Agregar Límite de Gastos
    </Button>
  )
}
