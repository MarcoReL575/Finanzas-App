'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useModalStore } from '@/src/shared/stores/modalStore'
import { Button } from '@/src/shared/ui/button';
import { deleteGastoLimitAction } from '../actions/gastosActions';
import { useExpenseLimit } from '@/src/shared/stores/useExpenseLimit';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ModalDeleteExpenseLimit() {

    const isOpen = useModalStore((state)=> state.isOpen);
    const closeModal = useModalStore((state)=> state.closeModal);
    const expenseLimitId = useExpenseLimit((state)=> state.expenseLimitId);
    const router = useRouter();

    const handleDeleteExpenseLimit = async()=> {
        const { success, message } = await deleteGastoLimitAction(expenseLimitId);
        if(!success) {
            toast.error(message);
        }
        if(success) {
            router.refresh();
            toast.success(message);
            closeModal();
        }
    }

    return (
        <>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg">
                        <DialogTitle className="font-bold">¿Deseas Eliminar el Límite de gasto?</DialogTitle>
                        <p>Esta acción eliminará permanentemente el gasto y no se podrá reestablecer esta acción</p>
                        <div className="flex gap-4">
                            <Button 
                                className='bg-red-500 hover:bg-red-400 text-white duration-300 transition-all'
                                onClick={handleDeleteExpenseLimit}
                            >
                                Si, Eliminar
                            </Button>
                            <Button variant='outline' onClick={closeModal}>Cancelar</Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
