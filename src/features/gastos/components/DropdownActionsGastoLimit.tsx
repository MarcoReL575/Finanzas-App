'use client'

import { useModalStore } from '@/src/shared/stores/modalStore'
import { useExpenseLimit } from '@/src/shared/stores/useExpenseLimit';
import { Button } from '@/src/shared/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup  } from '@/src/shared/ui/dropdown-menu'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { selectExpenseLimitAction } from '../actions/gastosActions';

interface Props {
    gastoLimitId: string;
}

export default function DropdownActionsGastoLimit({ gastoLimitId }: Props) {

    const openModal = useModalStore((state)=> state.openModal);
    const setExpenseLimitId = useExpenseLimit((state)=> state.setExpenseLimitId);
    const setExpenseLimitToEdit = useExpenseLimit((state)=> state.setExpenseLimitToEdit);

    const handleDeleteGastoLimit = async()=> {
        setExpenseLimitId(gastoLimitId);
        openModal('deleteExpenseLimit');
    };

    const handleEditExpenseLimit = async()=> {
        const { success, message, expenseLimit } = await selectExpenseLimitAction(gastoLimitId);
        if(success) {
            setExpenseLimitToEdit(expenseLimit);
        }
    };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger 
            render={<Button variant="link" className='text-blue-500/75 text-xs underline hover:text-blue-500' />} 
        >
            Ver ocpiones
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-white p-2'>
            <DropdownMenuGroup>
                <DropdownMenuItem 
                    className='flex cursor-pointer items-center gap-x-2 hover:font-semibold hover:translate-x-4 hover:text-blue-500 hover:scale-110 transition-all duration-300'
                    onClick={handleEditExpenseLimit}
                >
                    <IconEdit size={20} />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className='flex cursor-pointer items-center gap-x-2 hover:font-semibold hover:translate-x-4 hover:text-red-500 hover:scale-110 transition-all duration-300'
                    onClick={handleDeleteGastoLimit}
                >
                    <IconTrash size={20} />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
