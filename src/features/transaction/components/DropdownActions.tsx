import { useModalStore } from '@/src/shared/stores/modalStore'
import { Button } from '@/src/shared/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup  } from '@/src/shared/ui/dropdown-menu'
import { IconDotsCircleHorizontal, IconEdit, IconTrash } from '@tabler/icons-react'
import { useTransactionStore } from '@/src/shared/stores/useTransactionStore';
import { SelectTransaction } from '../types/types';

interface Props {
    transaction: SelectTransaction;
}

export default function DropdownActions({ transaction }: Props) {

    const setTransaction = useTransactionStore((state)=> state.setTransaction);
    const openModal = useModalStore((state) => state.openModal);
    
    const handleEditTransaction = ()=> {
        setTransaction(transaction);
        openModal('formTransaction');
    }

    const handleDeleteTransaction = ()=> {
        setTransaction(transaction);
        openModal('deleteTransaction');
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger 
            render={<Button variant="ghost" />} 
        >
            <IconDotsCircleHorizontal className='hover:text-gray-600 text-gray-800 size-8' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-white p-2'>
            <DropdownMenuGroup>
                <DropdownMenuItem 
                    className='flex cursor-pointer items-center gap-x-2 hover:font-semibold hover:translate-x-4 hover:text-blue-500 hover:scale-110 transition-all duration-300'
                    onClick={handleEditTransaction}
                >
                    <IconEdit size={20} />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className='flex cursor-pointer items-center gap-x-2 hover:font-semibold hover:translate-x-4 hover:text-red-500 hover:scale-110 transition-all duration-300'
                    onClick={handleDeleteTransaction}
                >
                    <IconTrash size={20} />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
