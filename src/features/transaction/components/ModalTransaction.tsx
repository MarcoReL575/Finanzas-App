import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import FormTransaction from './FormTransaction';
import { useModalStore } from '@/src/shared/stores/modalStore';
import { IconX } from '@tabler/icons-react';

export default function ModalTransaction() {

    const isOpen = useModalStore((state) => state.isOpen);
    const closeModal = useModalStore((state) => state.closeModal);

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel className="max-w-2xl space-y-2 border bg-white  px-4 py-2 rounded-lg">
                <div className='flex justify-end w-full'>
                    <button 
                        className='rounded-lg bg-red-500 text-white hover:bg-red-400 cursor-pointer flex items-center justify-center p-2'
                        onClick={closeModal}
                    >
                        <IconX size={20} />
                    </button>
                </div>
                <DialogTitle className="font-bold text-center text-xl">Agregando una nueva transacción</DialogTitle>
                <FormTransaction />
                <section className='w-full flex justify-end'>
                </section>
            </DialogPanel>
        </div>
    </Dialog>
  )
}
