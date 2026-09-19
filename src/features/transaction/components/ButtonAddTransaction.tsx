'use client'

import { IconCirclePlus, IconX } from '@tabler/icons-react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import FormTransaction from './FormTransaction';
import { modalStore } from '@/src/shared/stores/modalStore';


export default function ButtonAddTransaction({ }: Props) {

    const stateModal = modalStore((state)=> state.stateModal);
    const toggleModal = modalStore((state)=> state.toggleModal);

  return (
    <>
        <button 
            className='bg-green-500 w-fit flex items-center gap-x-2 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer'
            onClick={() =>toggleModal(true)}
        >
            <IconCirclePlus />
            Agregar Transacción
        </button>
        <Dialog open={stateModal} onClose={() => toggleModal(false)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 flex w-screen items-center justify-center">
                <DialogPanel className="max-w-2xl space-y-2 border bg-white  px-4 py-2 rounded-lg">
                    <div className='flex justify-end w-full'>
                        <button 
                            className='rounded-lg bg-red-500 text-white hover:bg-red-400 cursor-pointer flex items-center justify-center p-2'
                            onClick={() => toggleModal(false)}
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
    </>

  )
}
