import { useModalStore } from '@/src/shared/stores/modalStore'
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import FormAddExpenseLimit from './FormAddExpenseLimit';
import { Button } from '@/src/shared/ui/button';
import { IconX } from '@tabler/icons-react';

export default function ModalExpenseLimits() {
    const isOpen = useModalStore((state)=> state.isOpen);
    const closeModal = useModalStore((state)=> state.closeModal);

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/40" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className=" relative max-w-lg border bg-white p-12 rounded-lg">
                    <div className="absolute right-4 top-4">
                        <Button 
                            className='bg-red-500 rounded-full p-2 hover:bg-red-400 text-white transition-all duration-300' 
                            onClick={closeModal}
                        >
                           <IconX />
                        </Button>
                    </div>
                    <DialogTitle className="font-bold">Establecer Límite de Gasto</DialogTitle>
                    <Description className='text-sm text-gray-500'>Define el presupuesto máximo para una categoría en el periodo seleccionado.</Description>
                    <FormAddExpenseLimit />
                </DialogPanel>
            </div>
        </Dialog>
    )
}
