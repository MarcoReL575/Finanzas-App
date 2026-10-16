'use client'

import { useModalStore } from '@/src/shared/stores/modalStore';
import { Button } from '@/src/shared/ui/button'
import { IconCirclePlus } from '@tabler/icons-react'
import { useExpenseLimit } from '@/src/shared/stores/useExpenseLimit';

export default function ButtonExpenseLimit() {

    const openModal = useModalStore((state)=> state.openModal);
    const setExpenseLimitToEdit = useExpenseLimit((state)=> state.setExpenseLimitToEdit);

    // Abre el formulario en modo crear (sin límite en edición)
    const handleOpenModal = ()=> {
        setExpenseLimitToEdit(undefined);
        openModal('expenseLimit');
    }

  return (
    <Button 
      className='flex items-center text-blue-500'
      variant='link'
      onClick={handleOpenModal}
    >
        <IconCirclePlus />
        Agregar Límite de Gastos
    </Button>
  )
}