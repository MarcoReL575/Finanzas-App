'use client'

import { useModalStore } from '@/src/shared/stores/modalStore';
import { Button } from '@/src/shared/ui/button'
import { IconCirclePlus } from '@tabler/icons-react'

export default function ButtonExpenseLimit() {

    const openModal = useModalStore((state)=> state.openModal);

  return (
    <Button 
      className='flex items-center text-blue-500'
      variant='link'
      onClick={()=> openModal('expenseLimit')}
    >
        <IconCirclePlus />
        Agregar Límite de Gastos
    </Button>
  )
}