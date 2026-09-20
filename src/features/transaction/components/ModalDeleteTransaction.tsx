import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useModalStore } from '@/src/shared/stores/modalStore';
import { Button } from '@/src/shared/ui/button';
import { useTransactionStore } from '@/src/shared/stores/useTransactionStore';
import { deleteTransactionAction } from '../actions/transactionActions';
import toast from 'react-hot-toast';

export function ModalDeleteTransaction() {
   
    const transaction = useTransactionStore((state)=> state.transaction);
    const isOpen = useModalStore((state) => state.isOpen);
    const closeModal = useModalStore((state) => state.closeModal);

    console.log(transaction);
    const handleConfirmDeleteTransaction = async()=> {
        const { success, message } = await deleteTransactionAction(transaction.id);
        if(!success) {
            toast.error(message);
        }

        if(success) {
            toast.success(message);
            closeModal();
        }
    }

    return (
        <>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 ">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg">
                        <DialogTitle className="font-bold">¿Seguro que deseas eliminar la transacción?</DialogTitle>
                        <Description></Description>
                        <p>Esto eliminará el gasto permanentemente y no podrás recuperar esta información</p>
                        <div className="flex gap-4">
                            <Button 
                                variant='destructive' 
                                className='bg-red-500 hover:bg-red-400 text-white transition-all duration-300'
                                onClick={handleConfirmDeleteTransaction}
                            >
                                Eliminar
                            </Button>
                            <Button variant='outline' onClick={closeModal}>Cancelar</Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
